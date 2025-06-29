const express = require('express');
const Mentor = require('../models/Mentor');
const User = require('../models/User');
const router = express.Router();

// Get all mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await Mentor.find({ isActive: true })
      .populate('user', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: mentors.length,
      data: mentors
    });
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create a new mentor
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      organization,
      industry,
      currentRole,
      workExperience,
      headline,
      bio,
      expertise,
      pricing
    } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if mentor profile already exists for this user
    const existingMentor = await Mentor.findOne({ user: userId });
    if (existingMentor) {
      return res.status(400).json({
        success: false,
        message: 'Mentor profile already exists for this user'
      });
    }

    // Create new mentor
    const mentor = new Mentor({
      user: userId,
      organization,
      industry,
      currentRole,
      workExperience,
      headline,
      bio,
      expertise: expertise || [],
      pricing: pricing || {}
    });

    const savedMentor = await mentor.save();
    
    // Update user role to mentor
    await User.findByIdAndUpdate(userId, { role: 'mentor' });

    // Populate user data
    const populatedMentor = await Mentor.findById(savedMentor._id)
      .populate('user', 'firstName lastName email profileImage');

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

// Get mentor by ID
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

// Update mentor
router.put('/:id', async (req, res) => {
  try {
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
    
    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      {
        organization,
        industry,
        currentRole,
        workExperience,
        headline,
        bio,
        expertise,
        pricing
      },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email profileImage');

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    res.json({
      success: true,
      message: 'Mentor updated successfully',
      data: mentor
    });
  } catch (error) {
    console.error('Update mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;