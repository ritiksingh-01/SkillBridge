const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Session = require('../models/Session');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('content').trim().notEmpty().withMessage('Message content is required'),
  body('receiverId').notEmpty().withMessage('Receiver ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sessionId, content, receiverId, messageType = 'text', attachments = [] } = req.body;

    // Verify session exists and user is part of it
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const message = new Message({
      session: sessionId,
      sender: req.user.id,
      receiver: receiverId,
      content,
      messageType,
      attachments
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName profileImage')
      .populate('receiver', 'firstName lastName profileImage');

    // Emit socket event for real-time messaging
    const io = req.app.get('io');
    if (io) {
      io.to(sessionId).emit('new-message', populatedMessage);
    }

    res.status(201).json({
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/:sessionId
// @desc    Get messages for a session
// @access  Private
router.get('/:sessionId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    // Verify user is part of the session
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const messages = await Message.find({ session: req.params.sessionId })
      .populate('sender', 'firstName lastName profileImage')
      .populate('receiver', 'firstName lastName profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: 1 });

    const total = await Message.countDocuments({ session: req.params.sessionId });

    res.json({
      messages,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;