const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Session = require('../models/Session');
const Mentor = require('../models/Mentor');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', [
  auth,
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('content').trim().notEmpty().withMessage('Message content is required'),
  body('receiverId').notEmpty().withMessage('Receiver ID is required')
], async (req, res) => {
  try {
    console.log('💬 Sending message from user:', req.user.id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { sessionId, content, receiverId, messageType = 'text', attachments = [] } = req.body;

    // Verify session exists and user is part of it
    const session = await Session.findById(sessionId)
      .populate('mentor', 'user')
      .populate('mentee');
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is part of this session
    const isMentee = session.mentee._id.toString() === req.user.id;
    const isMentor = session.mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this session'
      });
    }

    const message = new Message({
      session: sessionId,
      sender: req.user.id,
      receiver: receiverId,
      content: content.trim(),
      messageType,
      attachments
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName profileImage')
      .populate('receiver', 'firstName lastName profileImage');

    console.log('✅ Message sent successfully');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/messages/:sessionId
// @desc    Get messages for a session
// @access  Private
router.get('/:sessionId', auth, async (req, res) => {
  try {
    console.log('📨 Getting messages for session:', req.params.sessionId);
    
    const { page = 1, limit = 50 } = req.query;

    // Verify user is part of the session
    const session = await Session.findById(req.params.sessionId)
      .populate('mentor', 'user');
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is part of this session
    const isMentee = session.mentee.toString() === req.user.id;
    const isMentor = session.mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view messages in this session'
      });
    }

    const messages = await Message.find({ session: req.params.sessionId })
      .populate('sender', 'firstName lastName profileImage')
      .populate('receiver', 'firstName lastName profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: 1 });

    const total = await Message.countDocuments({ session: req.params.sessionId });

    console.log(`✅ Found ${messages.length} messages`);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('❌ Get messages error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    console.log('👁️ Marking message as read:', req.params.id);
    
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this message as read'
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    console.log('✅ Message marked as read');

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('❌ Mark message read error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/messages/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    console.log('💬 Getting conversations for user:', req.user.id);

    // Get all sessions where user is involved
    const sessions = await Session.find({
      $or: [
        { mentee: req.user.id },
        { 'mentor.user': req.user.id }
      ]
    })
    .populate('mentee', 'firstName lastName profileImage')
    .populate({
      path: 'mentor',
      populate: {
        path: 'user',
        select: 'firstName lastName profileImage'
      }
    })
    .sort({ updatedAt: -1 });

    // Get latest message for each session
    const conversations = await Promise.all(
      sessions.map(async (session) => {
        const latestMessage = await Message.findOne({ session: session._id })
          .sort({ createdAt: -1 })
          .populate('sender', 'firstName lastName');

        const unreadCount = await Message.countDocuments({
          session: session._id,
          receiver: req.user.id,
          isRead: false
        });

        return {
          session,
          latestMessage,
          unreadCount
        };
      })
    );

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('❌ Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/messages/session/:sessionId/mark-read
// @desc    Mark all messages in a session as read
// @access  Private
router.put('/session/:sessionId/mark-read', auth, async (req, res) => {
  try {
    console.log('👁️ Marking all messages as read for session:', req.params.sessionId);

    const result = await Message.updateMany(
      {
        session: req.params.sessionId,
        receiver: req.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    console.log(`✅ Marked ${result.modifiedCount} messages as read`);

    res.json({
      success: true,
      message: `Marked ${result.modifiedCount} messages as read`
    });
  } catch (error) {
    console.error('❌ Mark session messages read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;