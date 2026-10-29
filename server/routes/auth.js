const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const Mentor = require('../models/Mentor');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Stricter rate limiter for authentication endpoints (H12)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 attempts per 15 minutes
  message: { message: 'Too many authentication attempts, please try again after 15 minutes.' }
});

// Helper to sign JWTs
const signToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authLimiter, [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['mentee', 'mentor']).withMessage('Role must be mentee or mentor')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, role, phone, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      phone: phone || '',
      gender: gender || ''
    });

    await user.save();

    // Generate signed JWT token
    const token = signToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        profileCompletion: user.getProfileCompletion()
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors || {}).map(e => e.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    user.lastActive = new Date();
    await user.save();

    // Generate signed JWT token
    const token = signToken(user._id, user.role);

    let mentorProfile = null;
    if (user.role === 'mentor') {
      mentorProfile = await Mentor.findOne({ user: user._id });
    }

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        profileCompletion: user.getProfileCompletion(),
        mentorProfile: mentorProfile ? {
          id: mentorProfile._id,
          _id: mentorProfile._id,
          isVerified: mentorProfile.isVerified,
          applicationStatus: mentorProfile.applicationStatus
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current authenticated user profile
// @access  Private (H8)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let mentorProfile = null;
    if (user.role === 'mentor') {
      mentorProfile = await Mentor.findOne({ user: user._id });
    }

    res.json({
      user: {
        id: user._id,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        location: user.location,
        about: user.about,
        skills: user.skills,
        education: user.education,
        experience: user.experience,
        socialLinks: user.socialLinks,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
        profileCompletion: user.getProfileCompletion(),
        mentorProfile: mentorProfile ? {
          id: mentorProfile._id,
          _id: mentorProfile._id,
          isVerified: mentorProfile.isVerified,
          applicationStatus: mentorProfile.applicationStatus
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error fetching user profile'
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change password for authenticated user (H8, F6)
// @access  Private
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while changing password' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
