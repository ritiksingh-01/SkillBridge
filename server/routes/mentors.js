const express = require('express');
const { body, validationResult } = require('express-validator');
const Mentor = require('../models/Mentor');
const User = require('../models/User');
const Session = require('../models/Session');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/mentors
// @desc    Get all mentors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      industry, 
      expertise, 
      minRating, 
      maxPrice, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = { isActive: true };
    
    // Build query filters
    if (industry) {
      query.industry = { $regex: industry, $options: 'i' };
    }
    
    if (expertise) {
      query.expertise = { $in: [expertise] };
    }
    
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }
    
    if (maxPrice) {
      query['pricing.oneOnOneSession'] = { $lte: parseInt(maxPrice) };
    }

    // Search functionality
    if (search) {
      const userIds = await User.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } }
        ]
      }).distinct('_id');

      query.$or = [
        { user: { $in: userIds } },
        { headline: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { expertise: { $in: [new RegExp(search, 'i')] } },
        { industry: { $regex: search, $options: 'i' } },
        { currentRole: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const mentors = await Mentor.find(query)
      .populate('user', 'firstName lastName email profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const total = await Mentor.countDocuments(query);

    console.log(`✅ Found ${mentors.length} mentors`);

    res.json({
      success: true,
      count: mentors.length,
      total,
      data: mentors,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/mentors
// @desc    Create mentor profile
// @access  Private
router.post('/', [
  auth,
  body('organization').trim().notEmpty().withMessage('Organization is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('currentRole').trim().notEmpty().withMessage('Current role is required'),
  body('workExperience').trim().notEmpty().withMessage('Work experience is required'),
  body('headline').trim().notEmpty().withMessage('Headline is required'),
  body('bio').trim().notEmpty().withMessage('Bio is required'),
  body('expertise').isArray({ min: 1 }).withMessage('At least one expertise is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      organization,
      industry,
      currentRole,
      workExperience,
      headline,
      bio,
      expertise,
      pricing
    } = req.body;

    // Check if mentor profile already exists for this user
    const existingMentor = await Mentor.findOne({ user: req.user.id });
    if (existingMentor) {
      return res.status(400).json({
        success: false,
        message: 'Mentor profile already exists for this user'
      });
    }

    // Create new mentor
    const mentor = new Mentor({
      user: req.user.id,
      organization: organization.trim(),
      industry: industry.trim(),
      currentRole: currentRole.trim(),
      workExperience: workExperience.trim(),
      headline: headline.trim(),
      bio: bio.trim(),
      expertise: expertise.map(skill => skill.trim()),
      pricing: pricing || {
        querySession: 150,
        oneOnOneSession: 500
      }
    });

    const savedMentor = await mentor.save();
    
    // Update user role to mentor
    await User.findByIdAndUpdate(req.user.id, { role: 'mentor' });

    // Populate user data
    const populatedMentor = await Mentor.findById(savedMentor._id)
      .populate('user', 'firstName lastName email profileImage');

    console.log('✅ Mentor profile created for user:', req.user.email);

    res.status(201).json({
      success: true,
      message: 'Mentor profile created successfully',
      data: populatedMentor
    });
  } catch (error) {
    console.error('Create mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/mentors/:id
// @desc    Get mentor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('user', 'firstName lastName email profileImage');
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    res.json({
      success: true,
      data: mentor
    });
  } catch (error) {
    console.error('Get mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/mentors/:id
// @desc    Update mentor profile
// @access  Private
router.put('/:id', [
  auth,
  body('organization').optional().trim().notEmpty().withMessage('Organization cannot be empty'),
  body('industry').optional().trim().notEmpty().withMessage('Industry cannot be empty'),
  body('currentRole').optional().trim().notEmpty().withMessage('Current role cannot be empty'),
  body('workExperience').optional().trim().notEmpty().withMessage('Work experience cannot be empty'),
  body('headline').optional().trim().notEmpty().withMessage('Headline cannot be empty'),
  body('bio').optional().trim().notEmpty().withMessage('Bio cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Check if user owns this mentor profile
    if (mentor.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    const {
      organization,
      industry,
      currentRole,
      workExperience,
      headline,
      bio,
      expertise,
      pricing
    } = req.body;
    
    const updateFields = {};
    if (organization) updateFields.organization = organization.trim();
    if (industry) updateFields.industry = industry.trim();
    if (currentRole) updateFields.currentRole = currentRole.trim();
    if (workExperience) updateFields.workExperience = workExperience.trim();
    if (headline) updateFields.headline = headline.trim();
    if (bio) updateFields.bio = bio.trim();
    if (expertise) updateFields.expertise = expertise.map(skill => skill.trim());
    if (pricing) updateFields.pricing = pricing;

    const updatedMentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email profileImage');

    console.log('✅ Mentor profile updated:', req.user.email);

    res.json({
      success: true,
      message: 'Mentor updated successfully',
      data: updatedMentor
    });
  } catch (error) {
    console.error('Update mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/mentors/dashboard/stats
// @desc    Get mentor dashboard statistics
// @access  Private (Mentor only)
router.get('/dashboard/stats', [auth, authorize('mentor')], async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id });
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found'
      });
    }

    // Get session statistics
    const totalSessions = await Session.countDocuments({ mentor: mentor._id });
    const completedSessions = await Session.countDocuments({ 
      mentor: mentor._id, 
      status: 'completed' 
    });
    const pendingSessions = await Session.countDocuments({ 
      mentor: mentor._id, 
      status: 'pending' 
    });

    // Get unique mentees count
    const uniqueMentees = await Session.distinct('mentee', { mentor: mentor._id });
    const totalMentees = uniqueMentees.length;

    // Calculate earnings (completed sessions only)
    const completedSessionsData = await Session.find({ 
      mentor: mentor._id, 
      status: 'completed',
      paymentStatus: 'paid'
    });
    const totalEarnings = completedSessionsData.reduce((sum, session) => sum + session.price, 0);

    const stats = {
      totalSessions,
      completedSessions,
      pendingSessions,
      totalMentees,
      totalEarnings,
      rating: mentor.rating,
      responseTime: '~2 hours', // This could be calculated from actual data
      completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 100
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get mentor stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/mentors/:id
// @desc    Delete mentor profile
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Check if user owns this mentor profile
    if (mentor.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this profile'
      });
    }

    // Soft delete - deactivate instead of removing
    mentor.isActive = false;
    await mentor.save();

    // Update user role back to mentee
    await User.findByIdAndUpdate(req.user.id, { role: 'mentee' });

    console.log('✅ Mentor profile deactivated:', req.user.email);

    res.json({
      success: true,
      message: 'Mentor profile deactivated successfully'
    });
  } catch (error) {
    console.error('Delete mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;