const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Mentor = require('../models/Mentor');

const router = express.Router();

// Simple token generation (for development)
const generateSimpleToken = (userId) => {
  return `simple_token_${userId}_${Date.now()}`;
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['mentee', 'mentor']).withMessage('Role must be mentee or mentor')
], async (req, res) => {
  try {
    console.log('📝 Registration attempt:', { 
      email: req.body.email, 
      role: req.body.role,
      timestamp: new Date().toISOString()
    });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { firstName, lastName, email, password, role, phone, gender } = req.body;

    // Check if user already exists
    console.log('🔍 Checking if user exists:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    console.log('👤 Creating new user...');
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      phone: phone || '',
      gender: gender || ''
    });

    console.log('💾 Saving user to database...');
    const savedUser = await user.save();
    console.log('✅ User saved successfully:', savedUser._id);

    // Generate simple token
    const token = generateSimpleToken(savedUser._id);

    // Return user data without password
    const userResponse = {
      id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      role: savedUser.role,
      profileCompletion: savedUser.getProfileCompletion()
    };

    console.log('🎉 Registration successful for:', email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    console.log('🔐 Login attempt:', { 
      email: req.body.email,
      timestamp: new Date().toISOString()
    });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user
    console.log('🔍 Looking for user in database...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found:', user._id);

    // Check password
    console.log('🔒 Verifying password...');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Password verified');

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate simple token
    const token = generateSimpleToken(user._id);

    // Get mentor profile if user is a mentor
    let mentorProfile = null;
    if (user.role === 'mentor') {
      console.log('👨‍🏫 Fetching mentor profile...');
      mentorProfile = await Mentor.findOne({ user: user._id });
    }

    // Return user data without password
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      profileCompletion: user.getProfileCompletion(),
      mentorProfile: mentorProfile ? {
        id: mentorProfile._id,
        isVerified: mentorProfile.isVerified,
        applicationStatus: mentorProfile.applicationStatus
      } : null
    };

    console.log('✅ Login successful for:', email);

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Public (simplified for now)
router.get('/me', async (req, res) => {
  try {
    // For now, return a simple response
    // Later we'll implement proper token verification
    res.json({
      message: 'Auth endpoint working',
      user: {
        id: 'temp_user',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'mentee',
        profileCompletion: 50
      }
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', async (req, res) => {
  try {
    console.log('👋 User logged out');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({ 
      message: 'Server error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;