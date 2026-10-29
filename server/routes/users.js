const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

const escapeRegex = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// @route   GET /api/users/profile
// @desc    Get user profile (own profile)
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
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
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile (H8: email allowed in updates)
// @access  Private
router.put('/profile', auth, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('gender').optional().isIn(['male', 'female', 'other', 'Male', 'Female', 'Other']).withMessage('Invalid gender')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Email is now included in allowedUpdates (H8)
    const allowedUpdates = [
      'firstName', 'lastName', 'email', 'phone', 'gender', 'location',
      'about', 'skills', 'education', 'experience', 'socialLinks',
      'profileImage', 'coverImage', 'preferences'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Check if email is being updated and if it's already in use
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

    res.json({
      message: 'Profile updated successfully',
      user: {
        ...user.toObject(),
        profileCompletion: user.getProfileCompletion()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   GET /api/users/search
// @desc    Search users with restricted public fields (H9, H11)
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q, role, skills, page = 1, limit = 10 } = req.query;
    const safeLimit = Math.min(Math.max(1, parseInt(limit) || 10), 50);
    const safePage = Math.max(1, parseInt(page) || 1);

    const query = {};

    if (role && typeof role === 'string') {
      query.role = role;
    }

    if (q && typeof q === 'string') {
      const sanitized = escapeRegex(q.trim());
      if (sanitized) {
        const regex = new RegExp(sanitized, 'i');
        query.$or = [
          { firstName: regex },
          { lastName: regex },
          { skills: { $in: [regex] } }
        ];
      }
    }

    if (skills && typeof skills === 'string') {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillsArray.length > 0) {
        query.skills = { $in: skillsArray };
      }
    }

    // Select ONLY safe public fields - no email, phone, location, private data (H9)
    const users = await User.find(query)
      .select('firstName lastName profileImage role skills about')
      .limit(safeLimit)
      .skip((safePage - 1) * safeLimit)
      .sort({ lastActive: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: safePage,
        pages: Math.ceil(total / safeLimit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error searching users' });
  }
});

// @route   GET /api/users/:id
// @desc    Get public user by ID (F6)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('firstName lastName profileImage role skills education experience about socialLinks lastActive');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving user' });
  }
});

module.exports = router;
