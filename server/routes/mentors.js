const express = require('express');
const { body, validationResult } = require('express-validator');
const Mentor = require('../models/Mentor');
const User = require('../models/User');
const Session = require('../models/Session');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Escape regex special characters to prevent ReDoS / regex injection (H11)
const escapeRegex = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Handler for applying to become a mentor (C3, F6)
const applyMentorHandler = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already has a mentor profile
    const existingMentor = await Mentor.findOne({ user: req.user.id });
    if (existingMentor) {
      return res.status(400).json({ message: 'Mentor application already exists' });
    }

    const mentorData = {
      user: req.user.id,
      organization: req.body.organization,
      industry: req.body.industry,
      currentRole: req.body.currentRole,
      workExperience: req.body.workExperience,
      headline: req.body.headline,
      bio: req.body.bio,
      pricing: {
        querySession: req.body.pricing?.querySession || 150,
        oneOnOneSession: req.body.pricing?.oneOnOneSession || 500,
        groupSession: req.body.pricing?.groupSession || 300,
      },
      availability: req.body.availability || {},
      // Do NOT auto-verify; require admin review or keep pending (C3)
      isVerified: false,
      applicationStatus: 'pending'
    };

    if (Array.isArray(req.body.expertise) && req.body.expertise.length > 0) {
      mentorData.expertise = req.body.expertise;
    }
    if (Array.isArray(req.body.categories) && req.body.categories.length > 0) {
      mentorData.categories = req.body.categories;
    }
    if (req.body.resume) {
      mentorData.resume = typeof req.body.resume === 'string'
        ? { url: req.body.resume, filename: 'resume.pdf', uploadedAt: new Date() }
        : req.body.resume;
    }

    const mentor = new Mentor(mentorData);
    await mentor.save();

    // Update user role to mentor
    await User.findByIdAndUpdate(req.user.id, { role: 'mentor' });

    res.status(201).json({
      message: 'Mentor application submitted successfully and is pending review',
      mentor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during mentor application' });
  }
};

const applyValidation = [
  body('organization').trim().notEmpty().withMessage('Organization is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('currentRole').trim().notEmpty().withMessage('Current role is required'),
  body('workExperience').trim().notEmpty().withMessage('Work experience is required'),
  body('headline').trim().notEmpty().withMessage('Headline is required'),
  body('bio').trim().notEmpty().withMessage('Bio is required')
];

// @route   POST /api/mentors/apply and POST /api/mentors (F6)
router.post('/apply', auth, applyValidation, applyMentorHandler);
router.post('/', auth, applyValidation, applyMentorHandler);

// @route   GET /api/mentors
// @desc    Get all mentors with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      skills,
      minRating,
      maxPrice,
      search,
      sortBy = 'rating'
    } = req.query;

    const safeLimit = Math.min(Math.max(1, parseInt(limit) || 12), 100);
    const safePage = Math.max(1, parseInt(page) || 1);

    // Filter only active mentors
    const query = { isActive: true };

    // Apply filters with safe type handling (H11)
    if (category && typeof category === 'string') {
      query.categories = { $in: [category] };
    }

    if (skills && typeof skills === 'string') {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillsArray.length > 0) {
        query.expertise = { $in: skillsArray };
      }
    }

    if (minRating && !isNaN(parseFloat(minRating))) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    if (maxPrice && !isNaN(parseInt(maxPrice))) {
      query['pricing.oneOnOneSession'] = { $lte: parseInt(maxPrice) };
    }

    if (search && typeof search === 'string') {
      const sanitized = escapeRegex(search.trim());
      if (sanitized) {
        const regex = new RegExp(sanitized, 'i');
        query.$or = [
          { headline: regex },
          { bio: regex },
          { expertise: { $in: [regex] } }
        ];
      }
    }

    // Sort options
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'price_asc':
        sort = { 'pricing.oneOnOneSession': 1 };
        break;
      case 'price_desc':
        sort = { 'pricing.oneOnOneSession': -1 };
        break;
      case 'experience':
        sort = { 'stats.totalSessions': -1 };
        break;
      default:
        sort = { 'rating.average': -1 };
    }

    const [mentors, total] = await Promise.all([
      Mentor.find(query)
        .populate('user', 'firstName lastName profileImage location')
        .limit(safeLimit)
        .skip((safePage - 1) * safeLimit)
        .sort(sort)
        .lean(),
      Mentor.countDocuments(query)
    ]);

    res.json({
      mentors,
      pagination: {
        current: safePage,
        pages: Math.ceil(total / safeLimit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving mentors' });
  }
});

// @route   GET /api/mentors/dashboard/stats
// @desc    Get mentor dashboard stats - declared BEFORE /:id (H3)
// @access  Private
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id }).lean();
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    // High-performance single aggregation pipeline for all session metrics
    const sessionStats = await Session.aggregate([
      { $match: { mentor: mentor._id } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          completedSessions: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalEarnings: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$paymentStatus', 'paid'] }, { $gt: ['$price', 0] }] },
                '$price',
                0
              ]
            }
          },
          uniqueMentees: { $addToSet: '$mentee' }
        }
      }
    ]);

    const s = sessionStats[0] || {
      totalSessions: 0,
      completedSessions: 0,
      totalEarnings: 0,
      uniqueMentees: []
    };

    const totalSessions = s.totalSessions;
    const completedSessions = s.completedSessions;
    const totalEarnings = s.totalEarnings;
    const totalMentees = s.uniqueMentees.length;

    const stats = {
      totalSessions: mentor.stats?.totalSessions || totalSessions,
      completedSessions,
      totalMentees: totalMentees || mentor.stats?.totalMentees || 0,
      totalEarnings,
      earnings: totalEarnings,
      rating: mentor.rating || { average: 5.0, count: 0 },
      responseTime: mentor.stats?.responseTime || '~2 hours',
      completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : (mentor.stats?.completionRate || 100),
    };

    res.json({ stats, data: stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching mentor statistics' });
  }
});

// @route   GET /api/mentors/profile/me
// @desc    Get logged in mentor's own profile (F10)
// @access  Private
router.get('/profile/me', auth, async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id })
      .populate('user', 'firstName lastName profileImage email location socialLinks');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    res.json({ mentor });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching mentor profile' });
  }
});

// Update mentor profile handler (supports both /profile and /:id) (F6)
const updateMentorProfileHandler = async (req, res) => {
  try {
    let mentor;
    // If an ID is passed in params, mentor can be updated if the caller owns it
    if (req.params.id) {
      mentor = await Mentor.findOne({ _id: req.params.id, user: req.user.id });
    } else {
      mentor = await Mentor.findOne({ user: req.user.id });
    }

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found or access denied' });
    }

    const allowedUpdates = [
      'organization', 'industry', 'currentRole', 'workExperience',
      'headline', 'bio', 'expertise', 'categories', 'pricing', 'availability', 'resume'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        if ((key === 'categories' || key === 'expertise') && Array.isArray(req.body[key]) && req.body[key].length === 0) {
          return;
        }
        updates[key] = req.body[key];
      }
    });

    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentor._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName profileImage');

    res.json({
      message: 'Mentor profile updated successfully',
      mentor: updatedMentor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating mentor profile' });
  }
};

// @route   PUT /api/mentors/profile and PUT /api/mentors/:id (F6)
router.put('/profile', auth, updateMentorProfileHandler);
router.put('/:id', auth, updateMentorProfileHandler);

// @route   GET /api/mentors/:id
// @desc    Get mentor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('user', 'firstName lastName profileImage location socialLinks');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json({ mentor });
  } catch (error) {
    res.status(500).json({ message: 'Server error finding mentor' });
  }
});

module.exports = router;
