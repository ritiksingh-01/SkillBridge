const express = require('express');
const { body, validationResult } = require('express-validator');
const Session = require('../models/Session');
const Mentor = require('../models/Mentor');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/sessions
// @desc    Create a new session
// @access  Private
router.post('/', [
  auth,
  body('mentorId').notEmpty().withMessage('Mentor ID is required'),
  body('type').isIn(['query', 'one-on-one', 'group']).withMessage('Invalid session type'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('scheduledAt').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    console.log('📅 Creating session for user:', req.user.id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { mentorId, type, title, description, scheduledAt, duration, meetingType } = req.body;

    // Find mentor and get pricing
    const mentor = await Mentor.findById(mentorId).populate('user');
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    if (!mentor.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Mentor is not currently available'
      });
    }

    // Validate scheduled time for non-query sessions
    if (type !== 'query' && !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time is required for this session type'
      });
    }

    // Check if scheduled time is in the future
    if (scheduledAt && new Date(scheduledAt) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in the future'
      });
    }

    const price = type === 'query' ? mentor.pricing.querySession : mentor.pricing.oneOnOneSession;

    const session = new Session({
      mentee: req.user.id,
      mentor: mentorId,
      type,
      title: title.trim(),
      description: description ? description.trim() : '',
      scheduledAt: type !== 'query' ? scheduledAt : undefined,
      duration: duration || (type === 'query' ? 30 : 60),
      meetingType: meetingType || 'video',
      price
    });

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('mentee', 'firstName lastName profileImage email')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'firstName lastName profileImage email'
        }
      });

    // Create notification for mentor
    await Notification.create({
      recipient: mentor.user._id,
      sender: req.user.id,
      type: 'mentorship_request',
      title: 'New Session Request',
      message: `${req.user.firstName} ${req.user.lastName} has requested a ${type} session: "${title}"`,
      data: {
        sessionId: session._id,
        sessionType: type,
        scheduledAt: scheduledAt
      },
      priority: 'high',
      actionRequired: true
    });

    console.log('✅ Session created successfully');

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: populatedSession
    });
  } catch (error) {
    console.error('❌ Create session error:', error);
    res.status(500).json({ 
      success: false,
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
    
    const { status, type, page = 1, limit = 10, upcoming, past } = req.query;
    
    // Build query based on user role
    let query = {};
    
    // Check if user is a mentor
    const mentor = await Mentor.findOne({ user: req.user.id });
    
    if (mentor) {
      // User is a mentor - show sessions where they are the mentor
      query.mentor = mentor._id;
    } else {
      // User is a mentee - show sessions where they are the mentee
      query.mentee = req.user.id;
    }

    // Apply filters
    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    // Filter by time
    if (upcoming === 'true') {
      query.scheduledAt = { $gte: new Date() };
      query.status = { $in: ['pending', 'confirmed'] };
    }

    if (past === 'true') {
      query.$or = [
        { scheduledAt: { $lt: new Date() } },
        { status: { $in: ['completed', 'cancelled'] } }
      ];
    }

    const sessions = await Session.find(query)
      .populate('mentee', 'firstName lastName profileImage email')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'firstName lastName profileImage email'
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Session.countDocuments(query);

    console.log(`✅ Found ${sessions.length} sessions`);

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('❌ Get sessions error:', error);
    res.status(500).json({ 
      success: false,
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
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is part of this session
    const mentor = await Mentor.findById(session.mentor._id);
    const isMentee = session.mentee._id.toString() === req.user.id;
    const isMentor = mentor && mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this session'
      });
    }

    console.log('✅ Session found and authorized');

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('❌ Get session error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/sessions/:id/status
// @desc    Update session status
// @access  Private
router.put('/:id/status', [
  auth,
  body('status').isIn(['confirmed', 'cancelled', 'completed', 'in-progress']).withMessage('Invalid status')
], async (req, res) => {
  try {
    console.log('🔄 Updating session status:', req.params.id, 'to', req.body.status);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, cancellationReason } = req.body;

    const session = await Session.findById(req.params.id)
      .populate('mentee', 'firstName lastName email')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check permissions
    const mentor = await Mentor.findById(session.mentor._id);
    const isMentee = session.mentee._id.toString() === req.user.id;
    const isMentor = mentor && mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this session'
      });
    }

    // Validate status transitions
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['in-progress', 'cancelled', 'completed'],
      'in-progress': ['completed', 'cancelled'],
      'completed': [], // Cannot change from completed
      'cancelled': [] // Cannot change from cancelled
    };

    if (!validTransitions[session.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${session.status} to ${status}`
      });
    }

    // Only mentors can confirm sessions
    if (status === 'confirmed' && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'Only mentors can confirm sessions'
      });
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
      if (!session.actualStartTime) {
        updates.actualStartTime = new Date(Date.now() - (session.duration * 60 * 1000));
      }
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('mentee', 'firstName lastName email')
     .populate({
       path: 'mentor',
       populate: {
         path: 'user',
         select: 'firstName lastName email'
       }
     });

    // Create notifications based on status change
    let notificationData = {};
    let notificationTitle = '';
    let notificationMessage = '';
    let recipientId = null;

    switch (status) {
      case 'confirmed':
        recipientId = session.mentee._id;
        notificationTitle = 'Session Confirmed';
        notificationMessage = `Your session "${session.title}" has been confirmed by ${session.mentor.user.firstName}`;
        break;
      case 'cancelled':
        recipientId = isMentor ? session.mentee._id : session.mentor.user._id;
        notificationTitle = 'Session Cancelled';
        notificationMessage = `Session "${session.title}" has been cancelled`;
        if (cancellationReason) {
          notificationMessage += `: ${cancellationReason}`;
        }
        break;
      case 'completed':
        // Notify both parties
        const notifications = [
          {
            recipient: session.mentee._id,
            title: 'Session Completed',
            message: `Your session "${session.title}" has been completed. Please rate your experience.`
          },
          {
            recipient: session.mentor.user._id,
            title: 'Session Completed',
            message: `Session "${session.title}" with ${session.mentee.firstName} has been completed.`
          }
        ];

        for (const notif of notifications) {
          await Notification.create({
            recipient: notif.recipient,
            sender: req.user.id,
            type: 'session_completed',
            title: notif.title,
            message: notif.message,
            data: { sessionId: session._id },
            actionRequired: notif.recipient.toString() === session.mentee._id.toString()
          });
        }
        break;
    }

    if (recipientId && notificationTitle) {
      await Notification.create({
        recipient: recipientId,
        sender: req.user.id,
        type: status === 'confirmed' ? 'session_confirmed' : 'session_cancelled',
        title: notificationTitle,
        message: notificationMessage,
        data: { sessionId: session._id }
      });
    }

    console.log('✅ Session status updated successfully');

    res.json({
      success: true,
      message: 'Session status updated successfully',
      data: updatedSession
    });
  } catch (error) {
    console.error('❌ Update session status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/sessions/:id
// @desc    Update session details
// @access  Private
router.put('/:id', [
  auth,
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('scheduledAt').optional().isISO8601().withMessage('Invalid date format')
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

    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is the mentee (only mentees can update session details)
    if (session.mentee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the mentee can update session details'
      });
    }

    // Cannot update completed or cancelled sessions
    if (['completed', 'cancelled'].includes(session.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update completed or cancelled sessions'
      });
    }

    const { title, description, scheduledAt, duration, meetingType } = req.body;
    
    const updateFields = {};
    if (title) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (scheduledAt) {
      if (new Date(scheduledAt) <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Scheduled time must be in the future'
        });
      }
      updateFields.scheduledAt = scheduledAt;
    }
    if (duration) updateFields.duration = duration;
    if (meetingType) updateFields.meetingType = meetingType;

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('mentee', 'firstName lastName email')
     .populate({
       path: 'mentor',
       populate: {
         path: 'user',
         select: 'firstName lastName email'
       }
     });

    console.log('✅ Session updated successfully');

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: updatedSession
    });
  } catch (error) {
    console.error('❌ Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/sessions/:id
// @desc    Delete session
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is the mentee
    if (session.mentee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the mentee can delete sessions'
      });
    }

    // Cannot delete sessions that are in-progress or completed
    if (['in-progress', 'completed'].includes(session.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete in-progress or completed sessions'
      });
    }

    await Session.findByIdAndDelete(req.params.id);

    console.log('✅ Session deleted successfully');

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;