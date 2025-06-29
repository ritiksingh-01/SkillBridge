const express = require('express');
const { body, validationResult } = require('express-validator');
const Session = require('../models/Session');
const Mentor = require('../models/Mentor');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Submit review for a session
// @access  Private
router.post('/', auth, [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().trim().isLength({ max: 1000 }).withMessage('Review cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sessionId, rating, review } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed sessions' });
    }

    const isMentee = session.mentee.toString() === req.user.id;
    const mentor = await Mentor.findById(session.mentor);
    const isMentor = mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update session with feedback
    if (isMentee) {
      session.feedback.menteeRating = rating;
      session.feedback.menteeReview = review;
    } else {
      session.feedback.mentorRating = rating;
      session.feedback.mentorReview = review;
    }

    session.feedback.feedbackDate = new Date();
    await session.save();

    // Update mentor's overall rating if mentee is reviewing
    if (isMentee) {
      const mentorProfile = await Mentor.findById(session.mentor);
      const totalRating = (mentorProfile.rating.average * mentorProfile.rating.count) + rating;
      mentorProfile.rating.count += 1;
      mentorProfile.rating.average = totalRating / mentorProfile.rating.count;
      await mentorProfile.save();
    }

    res.json({
      message: 'Review submitted successfully',
      feedback: session.feedback
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/mentor/:mentorId
// @desc    Get reviews for a mentor
// @access  Public
router.get('/mentor/:mentorId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const sessions = await Session.find({
      mentor: req.params.mentorId,
      'feedback.menteeRating': { $exists: true }
    })
    .populate('mentee', 'firstName lastName profileImage')
    .select('feedback createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ 'feedback.feedbackDate': -1 });

    const total = await Session.countDocuments({
      mentor: req.params.mentorId,
      'feedback.menteeRating': { $exists: true }
    });

    const reviews = sessions.map(session => ({
      id: session._id,
      rating: session.feedback.menteeRating,
      review: session.feedback.menteeReview,
      date: session.feedback.feedbackDate,
      mentee: session.mentee
    }));

    res.json({
      reviews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get mentor reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;