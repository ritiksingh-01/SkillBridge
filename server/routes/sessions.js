const express = require('express');
const { body, validationResult } = require('express-validator');
const Session = require('../models/Session');
const Mentor = require('../models/Mentor');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/sessions
// @desc    Create a new session
// @access  Private
router.post('/', auth, [
  body('mentorId').notEmpty().withMessage('Mentor ID is required'),
  body('type').isIn(['query', 'one-on-one', 'group']).withMessage('Invalid session type'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('scheduledAt').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    console.log('📅 Creating session for user:', req.user.id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mentorId, type, title, description, scheduledAt, duration, meetingType } = req.body;

    // Find mentor and get pricing
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const price = type === 'query' ? mentor.pricing.querySession : mentor.pricing.oneOnOneSession;

    const session = new Session({
      mentee: req.user.id,
      mentor: mentorId,
      type,
      title,
      description,
      scheduledAt: type !== 'query' ? scheduledAt : undefined,
      duration: duration || 60,
      meetingType: meetingType || 'video',
      price
    });

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('mentee', 'firstName lastName profileImage')
      .populate('mentor', 'user headline pricing')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'firstName lastName profileImage'
        }
      });

    console.log('✅ Session created successfully');

    res.status(201).json({
      message: 'Session created successfully',
      session: populatedSession
    });
  } catch (error) {
    console.error('❌ Create session error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/sessions
// @desc    Get user sessions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('📋 Getting sessions for user:', req.user.id);
    
    const { status, type, page = 1, limit = 10 } = req.query;
    
    const query = {
      $or: [
        { mentee: req.user.id },
        { 'mentor.user': req.user.id }
      ]
    };

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    const sessions = await Session.find(query)
      .populate('mentee', 'firstName lastName profileImage')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'firstName lastName profileImage'
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Session.countDocuments(query);

    console.log(`✅ Found ${sessions.length} sessions`);

    res.json({
      sessions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('❌ Get sessions error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get session by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('📄 Getting session by ID:', req.params.id);
    
    const session = await Session.findById(req.params.id)
      .populate('mentee', 'firstName lastName profileImage email')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'firstName lastName profileImage email'
        }
      });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is part of this session
    const isMentee = session.mentee._id.toString() === req.user.id;
    const isMentor = session.mentor.user._id.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('✅ Session found and authorized');

    res.json({ session });
  } catch (error) {
    console.error('❌ Get session error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/sessions/:id/status
// @desc    Update session status
// @access  Private
router.put('/:id/status', auth, [
  body('status').isIn(['confirmed', 'cancelled', 'completed', 'in-progress']).withMessage('Invalid status')
], async (req, res) => {
  try {
    console.log('🔄 Updating session status:', req.params.id, 'to', req.body.status);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, cancellationReason } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check permissions
    const mentor = await Mentor.findById(session.mentor);
    const isMentee = session.mentee.toString() === req.user.id;
    const isMentor = mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = { status };
    
    if (status === 'cancelled' && cancellationReason) {
      updates.cancellationReason = cancellationReason;
    }

    if (status === 'in-progress') {
      updates.actualStartTime = new Date();
    }

    if (status === 'completed') {
      updates.actualEndTime = new Date();
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('mentee', 'firstName lastName')
     .populate({
       path: 'mentor',
       populate: {
         path: 'user',
         select: 'firstName lastName'
       }
     });

    console.log('✅ Session status updated successfully');

    res.json({
      message: 'Session status updated successfully',
      session: updatedSession
    });
  } catch (error) {
    console.error('❌ Update session status error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;