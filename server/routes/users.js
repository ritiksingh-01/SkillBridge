const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('👤 Getting profile for user:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        ...user.toObject(),
        profileCompletion: user.getProfileCompletion()
      }
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('location').optional().trim(),
  body('about').optional().isLength({ max: 1000 }).withMessage('About section cannot exceed 1000 characters')
], async (req, res) => {
  try {
    console.log('✏️ Updating profile for user:', req.user.id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'phone', 'gender', 'location', 
      'about', 'skills', 'education', 'experience', 'socialLinks',
      'profileImage', 'coverImage', 'preferences'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Check if email is being updated and if it's unique
    if (updates.email) {
      const existingUser = await User.findOne({ 
        email: updates.email, 
        _id: { $ne: req.user.id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    console.log('✅ Profile updated successfully for:', user.email);

    res.json({
      message: 'Profile updated successfully',
      user: {
        ...user.toObject(),
        profileCompletion: user.getProfileCompletion()
      }
    });
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/users/search
// @desc    Search users
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    console.log('🔍 Searching users with params:', req.query);
    
    const { q, role, skills, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (q) {
      query.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    
    if (skills) {
      const skillsArray = skills.split(',');
      query.skills = { $in: skillsArray };
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ lastActive: -1 });

    const total = await User.countDocuments(query);

    console.log(`✅ Found ${users.length} users`);

    res.json({
      users: users.map(user => ({
        ...user.toObject(),
        profileCompletion: user.getProfileCompletion()
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('❌ Search users error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;