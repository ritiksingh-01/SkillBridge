const express = require('express');
const { body, validationResult } = require('express-validator');
const Mentor = require('../models/Mentor');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/mentors/apply
// @desc    Apply to become a mentor
// @access  Private
router.post('/apply', auth, [
  body('organization').trim().notEmpty().withMessage('Organization is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('currentRole').trim().notEmpty().withMessage('Current role is required'),
  body('workExperience').trim().notEmpty().withMessage('Work experience is required'),
  body('headline').trim().notEmpty().withMessage('Headline is required'),
  body('bio').trim().notEmpty().withMessage('Bio is required')
], async (req, res) => {
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
      expertise: req.body.expertise || [],
      categories: req.body.categories || [],
      pricing: req.body.pricing || {},
      availability: req.body.availability || {}
    };

    const mentor = new Mentor(mentorData);
    await mentor.save();

    // Update user role to mentor
    await User.findByIdAndUpdate(req.user.id, { role: 'mentor' });

    res.status(201).json({
      message: 'Mentor application submitted successfully',
      mentor
    });
  } catch (error) {
    console.error('Mentor application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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
      availability,
      search,
      sortBy = 'rating'
    } = req.query;

    const query = { isActive: true, isVerified: true };

    // Apply filters
    if (category) {
      query.categories = { $in: [category] };
    }

    if (skills) {
      const skillsArray = skills.split(',');
      query.expertise = { $in: skillsArray };
    }

    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    if (maxPrice) {
      query['pricing.oneOnOneSession'] = { $lte: parseInt(maxPrice) };
    }

    if (search) {
      query.$or = [
        { headline: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { expertise: { $in: [new RegExp(search, 'i')] } }
      ];
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

    const mentors = await Mentor.find(query)
      .populate('user', 'firstName lastName profileImage location')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const total = await Mentor.countDocuments(query);

    res.json({
      mentors,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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
    console.error('Get mentor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/mentors/profile
// @desc    Update mentor profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    const allowedUpdates = [
      'organization', 'industry', 'currentRole', 'workExperience',
      'headline', 'bio', 'expertise', 'categories', 'pricing', 'availability'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
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
    console.error('Update mentor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/mentors/dashboard/stats
// @desc    Get mentor dashboard stats
// @access  Private
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    // Get additional stats from sessions, messages, etc.
    // This would require importing Session and Message models
    const stats = {
      totalSessions: mentor.stats.totalSessions,
      totalMentees: mentor.stats.totalMentees,
      rating: mentor.rating,
      responseTime: mentor.stats.responseTime,
      completionRate: mentor.stats.completionRate,
      // Add more calculated stats here
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get mentor stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;