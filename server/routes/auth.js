const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Simple token generation (for development - no JWT for now)
const generateSimpleToken = (userId) => {
  return `simple_token_${userId}_${Date.now()}`;
};

// Register route
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body);
    
    const { firstName, lastName, email, password, role, phone, gender } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password, // In production, this should be hashed
      role: role || 'mentee',
      phone: phone || '',
      gender: gender || ''
    });

    const savedUser = await user.save();

    // Generate simple token
    const token = generateSimpleToken(savedUser._id);

    // Return user without password
    const userResponse = {
      id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      role: savedUser.role,
      phone: savedUser.phone,
      gender: savedUser.gender
    };

    console.log('✅ User registered successfully:', userResponse.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password (in production, use bcrypt.compare)
    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate simple token
    const token = generateSimpleToken(user._id);

    // Return user without password
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      gender: user.gender
    };

    console.log('✅ User logged in successfully:', userResponse.email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get current user (for token validation)
router.get('/me', async (req, res) => {
  try {
    // For now, return a simple response
    res.json({
      success: true,
      message: 'Auth endpoint working',
      user: {
        id: 'temp_user',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'mentee'
      }
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  try {
    console.log('👋 User logged out');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

module.exports = router;