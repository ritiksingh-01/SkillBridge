const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Session = require('../models/Session');
const Mentor = require('../models/Mentor');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Helper to verify user belongs to session (C5, H1)
const verifySessionParticipant = async (sessionId, userId) => {
  const session = await Session.findById(sessionId);
  if (!session) return { session: null, isParticipant: false };

  const mentor = await Mentor.findById(session.mentor);
  const isMentee = session.mentee.toString() === userId.toString();
  const isMentor = mentor && mentor.user.toString() === userId.toString();

  return {
    session,
    mentor,
    isMentee,
    isMentor,
    isParticipant: isMentee || isMentor,
    otherUserId: isMentee ? mentor?.user?.toString() : session.mentee.toString()
  };
};

// @route   GET /api/messages/conversations
// @desc    Get all conversations for authenticated user (F6)
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    const mentorProfile = await Mentor.findOne({ user: req.user.id });
    const orConditions = [{ mentee: req.user.id }];
    if (mentorProfile) {
      orConditions.push({ mentor: mentorProfile._id });
    }

    const sessions = await Session.find({ $or: orConditions })
      .populate('mentee', 'firstName lastName profileImage')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'firstName lastName profileImage headline'
        }
      })
      .sort({ updatedAt: -1 });

    const conversations = await Promise.all(
      sessions.map(async (sess) => {
        const lastMessage = await Message.findOne({ session: sess._id })
          .sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          session: sess._id,
          receiver: req.user.id,
          isRead: false
        });

        const isUserMentee = sess.mentee._id.toString() === req.user.id;
        const otherParticipant = isUserMentee
          ? sess.mentor?.user
          : sess.mentee;

        return {
          sessionId: sess._id,
          sessionTitle: sess.title,
          sessionType: sess.type,
          sessionStatus: sess.status,
          participant: otherParticipant || { firstName: 'User', lastName: '' },
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            sender: lastMessage.sender,
            messageType: lastMessage.messageType
          } : null,
          unreadCount
        };
      })
    );

    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving conversations' });
  }
});

// @route   POST /api/messages
// @desc    Send a message (C5, H1, H11)
// @access  Private
router.post('/', auth, [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('content').trim().notEmpty().withMessage('Message content is required'),
  body('messageType').optional().isIn(['text', 'image', 'file', 'query', 'response']).withMessage('Invalid message type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sessionId, content, messageType = 'text', attachments = [] } = req.body;

    // Verify session exists and user is part of it (C5, H1)
    const { session, isParticipant, otherUserId } = await verifySessionParticipant(sessionId, req.user.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied: not a participant of this session' });
    }

    // Determine receiver safely from session participants (C5)
    const receiverId = otherUserId;

    // Validate attachments (H11)
    const safeAttachments = Array.isArray(attachments)
      ? attachments.filter(att => att && (typeof att === 'string' || att.url))
      : [];

    const message = new Message({
      session: sessionId,
      sender: req.user.id,
      receiver: receiverId,
      content,
      messageType,
      attachments: safeAttachments
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName profileImage')
      .populate('receiver', 'firstName lastName profileImage');

    // Emit socket event for real-time messaging (emit both events to avoid mismatch F4)
    const io = req.app.get('io');
    if (io) {
      io.to(sessionId.toString()).emit('new-message', populatedMessage);
      io.to(sessionId.toString()).emit('receive-message', populatedMessage);

      // Personal notification room
      io.to(receiverId).emit('new-message-notification', {
        message: populatedMessage,
        sessionId,
        sender: populatedMessage.sender
      });
    }

    res.status(201).json({
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error sending message' });
  }
});

// @route   GET /api/messages/:sessionId
// @desc    Get messages for a session with membership check (C5, H11)
// @access  Private
router.get('/:sessionId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const safeLimit = Math.min(Math.max(1, parseInt(limit) || 50), 100);
    const safePage = Math.max(1, parseInt(page) || 1);

    // Verify user is part of the session (C5)
    const { session, isParticipant } = await verifySessionParticipant(req.params.sessionId, req.user.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied: not a participant of this session' });
    }

    const messages = await Message.find({ session: req.params.sessionId })
      .populate('sender', 'firstName lastName profileImage')
      .populate('receiver', 'firstName lastName profileImage')
      .limit(safeLimit)
      .skip((safePage - 1) * safeLimit)
      .sort({ createdAt: 1 });

    const total = await Message.countDocuments({ session: req.params.sessionId });

    res.json({
      messages,
      pagination: {
        current: safePage,
        pages: Math.ceil(total / safeLimit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving messages' });
  }
});

// @route   PUT /api/messages/session/:sessionId/mark-read
// @desc    Mark all messages in a session as read (F6)
// @access  Private
router.put('/session/:sessionId/mark-read', auth, async (req, res) => {
  try {
    await Message.updateMany(
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

    res.json({ message: 'Session messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error marking session messages as read' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark single message as read
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
    res.status(500).json({ message: 'Server error marking message as read' });
  }
});

module.exports = router;
