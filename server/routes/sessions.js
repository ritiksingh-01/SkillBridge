const express = require('express');
const { body, validationResult } = require('express-validator');
const Session = require('../models/Session');
const Mentor = require('../models/Mentor');
const { auth } = require('../middleware/auth');
const { createNotification } = require('./notifications');

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mentorId, type, title, description, scheduledAt, duration = 60, meetingType = 'video' } = req.body;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Rule: Mentor cannot book session with themselves (H6)
    if (mentor.user.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot book a session with yourself' });
    }

    // Rule: scheduledAt cannot be in the past (H6)
    if (scheduledAt && type !== 'query') {
      const scheduledDate = new Date(scheduledAt);
      if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
        return res.status(400).json({ message: 'Session must be scheduled for a future date and time' });
      }
    }

    // Rule: validate duration (H6)
    const validDuration = Math.min(Math.max(15, parseInt(duration) || 60), 240);

    // Rule: group session vs one-on-one vs query pricing (H6)
    let price = 500;
    if (type === 'query') {
      price = mentor.pricing?.querySession ?? 150;
    } else if (type === 'group') {
      price = mentor.pricing?.groupSession ?? 300;
    } else {
      price = mentor.pricing?.oneOnOneSession ?? 500;
    }

    const session = new Session({
      mentee: req.user.id,
      mentor: mentorId,
      type,
      title,
      description: description || '',
      scheduledAt: type !== 'query' ? scheduledAt : undefined,
      duration: validDuration,
      meetingType: meetingType || 'video',
      price
    });

    await session.save();

    // Recipient of notification must be mentor.user (User ObjectId), NOT mentorId! (H1, H2)
    const mentorUserId = mentor.user.toString();

    await createNotification(
      mentorUserId,
      req.user.id,
      'session_request',
      'New Session Request',
      `You have a new session request from ${req.user.firstName} ${req.user.lastName}`,
      { sessionId: session._id, title, scheduledAt }
    );

    // Emit real-time notification to mentor's user room
    const io = req.app.get('io');
    if (io) {
      io.to(mentorUserId).emit('new-notification', {
        type: 'session_request',
        title: 'New Session Request',
        message: `You have a new session request from ${req.user.firstName} ${req.user.lastName}`,
        data: { sessionId: session._id, title, scheduledAt }
      });
    }

    const populatedSession = await Session.findById(session._id)
      .populate('mentee', 'firstName lastName profileImage email')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'firstName lastName profileImage email'
        }
      });

    res.status(201).json({
      message: 'Session created successfully',
      session: populatedSession
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating session' });
  }
});

// @route   GET /api/sessions
// @desc    Get user sessions (for mentee or mentor)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const safeLimit = Math.min(Math.max(1, parseInt(limit) || 20), 100);
    const safePage = Math.max(1, parseInt(page) || 1);

    // Find mentor profile for current user if applicable (H1)
    const mentorProfile = await Mentor.findOne({ user: req.user.id }).select('_id').lean();

    const orConditions = [{ mentee: req.user.id }];
    if (mentorProfile) {
      orConditions.push({ mentor: mentorProfile._id });
    }

    const query = { $or: orConditions };

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    const [sessions, total] = await Promise.all([
      Session.find(query)
        .populate('mentee', 'firstName lastName profileImage email')
        .populate({
          path: 'mentor',
          populate: {
            path: 'user',
            select: 'firstName lastName profileImage email headline'
          }
        })
        .limit(safeLimit)
        .skip((safePage - 1) * safeLimit)
        .sort({ createdAt: -1 })
        .lean(),
      Session.countDocuments(query)
    ]);

    res.json({
      sessions,
      pagination: {
        current: safePage,
        pages: Math.ceil(total / safeLimit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving sessions' });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get session by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('mentee', 'firstName lastName profileImage email')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'firstName lastName profileImage email headline'
        }
      });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const mentor = await Mentor.findById(session.mentor._id);
    const isMentee = session.mentee._id.toString() === req.user.id;
    const isMentor = mentor && mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({ message: 'Access denied to this session' });
    }

    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving session' });
  }
});

// @route   PUT /api/sessions/:id/status
// @desc    Update session status with transition rules & stats update (H6, H7, C6)
// @access  Private
router.put('/:id/status', auth, [
  body('status').isIn(['confirmed', 'cancelled', 'completed', 'in-progress']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, cancellationReason } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const mentor = await Mentor.findById(session.mentor);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor associated with session not found' });
    }

    const isMentee = session.mentee.toString() === req.user.id;
    const isMentor = mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // State transition rules (H6)
    if (session.status === 'cancelled' && status !== 'cancelled') {
      return res.status(400).json({ message: 'Cancelled sessions cannot be transitioned to another status' });
    }

    // Confirming session requires paid status if not a free session or mentor manual approval
    if (status === 'confirmed' && isMentee && session.paymentStatus !== 'paid' && session.price > 0) {
      return res.status(400).json({ message: 'Session payment must be completed before confirming' });
    }

    const updates = { status };

    if (status === 'cancelled') {
      updates.cancellationReason = cancellationReason || 'Cancelled by user';
    }

    if (status === 'in-progress') {
      updates.actualStartTime = new Date();
    }

    if (status === 'completed') {
      updates.actualEndTime = new Date();
      // Increment mentor statistics when session completes (H7)
      const totalSessionsCompleted = await Session.countDocuments({
        mentor: mentor._id,
        status: 'completed'
      }) + 1;

      const distinctMentees = await Session.distinct('mentee', {
        mentor: mentor._id
      });

      const allSessionsCount = await Session.countDocuments({
        mentor: mentor._id
      });

      const completionRate = allSessionsCount > 0
        ? Math.round((totalSessionsCompleted / allSessionsCount) * 100)
        : 100;

      await Mentor.findByIdAndUpdate(mentor._id, {
        $inc: { 'stats.totalSessions': 1 },
        $set: {
          'stats.totalMentees': distinctMentees.length,
          'stats.completionRate': completionRate
        }
      });
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('mentee', 'firstName lastName profileImage')
     .populate({
       path: 'mentor',
       populate: {
         path: 'user',
         select: 'firstName lastName profileImage'
       }
     });

    // Notify the OTHER participant with valid User ID (H1, H2)
    const recipientUserId = isMentor ? session.mentee.toString() : mentor.user.toString();
    const updaterName = isMentor ? 'Mentor' : 'Mentee';

    await createNotification(
      recipientUserId,
      req.user.id,
      'session_status_update',
      'Session Status Updated',
      `${updaterName} has updated the session status to ${status}`,
      { sessionId: session._id, status, cancellationReason }
    );

    const io = req.app.get('io');
    if (io) {
      io.to(recipientUserId).emit('new-notification', {
        type: 'session_status_update',
        title: 'Session Status Updated',
        message: `${updaterName} has updated the session status to ${status}`,
        data: { sessionId: session._id, status, cancellationReason }
      });
    }

    res.json({
      message: 'Session status updated successfully',
      session: updatedSession
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating session status' });
  }
});

// @route   PUT /api/sessions/:id
// @desc    Update session details (F6)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const mentor = await Mentor.findById(session.mentor);
    const isMentee = session.mentee.toString() === req.user.id;
    const isMentor = mentor && mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const allowed = ['title', 'description', 'scheduledAt', 'meetingType', 'meetingLink', 'notes'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json({ message: 'Session updated successfully', session: updatedSession });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating session' });
  }
});

// @route   DELETE /api/sessions/:id
// @desc    Cancel/delete session (F6)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const mentor = await Mentor.findById(session.mentor);
    const isMentee = session.mentee.toString() === req.user.id;
    const isMentor = mentor && mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mark as cancelled rather than deleting hard record
    session.status = 'cancelled';
    session.cancellationReason = req.body.reason || 'Cancelled by participant';
    await session.save();

    res.json({ message: 'Session cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error cancelling session' });
  }
});

module.exports = router;
