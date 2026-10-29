const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Session = require('../models/Session');
const Mentor = require('../models/Mentor');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Submit review for a session
// @access  Private
router.post('/', [
  auth,
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().trim().isLength({ max: 1000 }).withMessage('Review cannot exceed 1000 characters')
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

    const { sessionId, rating, review } = req.body;

    const session = await Session.findById(sessionId)
      .populate('mentor')
      .populate('mentee');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed sessions'
      });
    }

    const isMentee = session.mentee._id.toString() === req.user.id;
    const mentor = await Mentor.findById(session.mentor._id);
    const isMentor = mentor && mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this session'
      });
    }

    // Check if review already exists
    if (!session.feedback) {
      session.feedback = {};
    }

    if (isMentee && session.feedback.menteeRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this session'
      });
    }

    if (isMentor && session.feedback.mentorRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this session'
      });
    }

    // Update session with feedback
    if (isMentee) {
      session.feedback.menteeRating = rating;
      session.feedback.menteeReview = review || '';
    } else {
      session.feedback.mentorRating = rating;
      session.feedback.mentorReview = review || '';
    }

    session.feedback.feedbackDate = new Date();
    await session.save();

    // Update mentor's overall rating atomically if mentee is reviewing (H5)
    if (isMentee && mentor) {
      const currentCount = mentor.rating?.count || 0;
      const currentAvg = mentor.rating?.average || 0;
      const newCount = currentCount + 1;
      const newAverage = Math.round(((currentAvg * currentCount + rating) / newCount) * 10) / 10;

      await Mentor.findByIdAndUpdate(mentor._id, {
        $set: {
          'rating.average': newAverage,
          'rating.count': newCount
        }
      });
      mentor.rating.average = newAverage;
      mentor.rating.count = newCount;
    }

    res.json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        feedback: session.feedback,
        mentorRating: mentor ? mentor.rating : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while submitting review'
    });
  }
});

// @route   GET /api/reviews/mentor/:mentorId
// @desc    Get reviews for a mentor
// @access  Public
router.get('/mentor/:mentorId', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    const safeLimit = Math.min(Math.max(1, parseInt(limit) || 10), 50);
    const safePage = Math.max(1, parseInt(page) || 1);

    if (!mongoose.Types.ObjectId.isValid(req.params.mentorId)) {
      return res.status(400).json({ success: false, message: 'Invalid mentor ID' });
    }

    const mentorObjectId = new mongoose.Types.ObjectId(req.params.mentorId); // Fixed: add new keyword (H4)

    let query = {
      mentor: mentorObjectId,
      'feedback.menteeRating': { $exists: true }
    };

    if (rating && !isNaN(parseInt(rating))) {
      query['feedback.menteeRating'] = parseInt(rating);
    }

    const sessions = await Session.find(query)
      .populate('mentee', 'firstName lastName profileImage')
      .select('feedback createdAt type title')
      .limit(safeLimit)
      .skip((safePage - 1) * safeLimit)
      .sort({ 'feedback.feedbackDate': -1 });

    const total = await Session.countDocuments(query);

    const reviews = sessions.map(session => ({
      id: session._id,
      _id: session._id,
      rating: session.feedback.menteeRating,
      review: session.feedback.menteeReview,
      date: session.feedback.feedbackDate,
      sessionType: session.type,
      sessionTitle: session.title,
      mentee: session.mentee ? {
        id: session.mentee._id,
        _id: session.mentee._id,
        firstName: session.mentee.firstName,
        lastName: session.mentee.lastName,
        profileImage: session.mentee.profileImage
      } : {
        firstName: 'Anonymous',
        lastName: 'Mentee'
      }
    }));

    // Get rating distribution with new mongoose.Types.ObjectId (H4)
    const ratingDistribution = await Session.aggregate([
      {
        $match: {
          mentor: mentorObjectId,
          'feedback.menteeRating': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$feedback.menteeRating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        ratingDistribution,
        pagination: {
          current: safePage,
          pages: Math.ceil(total / safeLimit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving reviews'
    });
  }
});

// @route   GET /api/reviews/session/:sessionId
// @desc    Get reviews for a specific session
// @access  Private
router.get('/session/:sessionId', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId)
      .populate('mentee', 'firstName lastName profileImage')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'firstName lastName profileImage'
        }
      })
      .select('feedback type title scheduledAt mentor mentee status');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const mentor = await Mentor.findById(session.mentor._id);
    const isMentee = session.mentee._id.toString() === req.user.id;
    const isMentor = mentor && mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view reviews for this session'
      });
    }

    res.json({
      success: true,
      data: {
        sessionId: session._id,
        sessionType: session.type,
        sessionTitle: session.title,
        scheduledAt: session.scheduledAt,
        feedback: session.feedback,
        mentee: session.mentee,
        mentor: session.mentor
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving session review'
    });
  }
});

// @route   PUT /api/reviews/:sessionId
// @desc    Update review for a session
// @access  Private
router.put('/:sessionId', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().trim().isLength({ max: 1000 }).withMessage('Review cannot exceed 1000 characters')
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

    const { rating, review } = req.body;

    const session = await Session.findById(req.params.sessionId)
      .populate('mentor', 'user rating');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Require completed session before review can be edited (H5)
    if (session.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed sessions'
      });
    }

    const isMentee = session.mentee.toString() === req.user.id;
    const mentor = await Mentor.findById(session.mentor._id);
    const isMentor = mentor && mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update review for this session'
      });
    }

    if (!session.feedback) {
      session.feedback = {};
    }

    const oldRating = isMentee ? session.feedback.menteeRating : session.feedback.mentorRating;

    // Update session with new feedback
    if (isMentee) {
      session.feedback.menteeRating = rating;
      session.feedback.menteeReview = review || '';
    } else {
      session.feedback.mentorRating = rating;
      session.feedback.mentorReview = review || '';
    }

    session.feedback.feedbackDate = new Date();
    await session.save();

    // Update mentor's overall rating handling both existing and new ratings (H5)
    if (isMentee && mentor) {
      const count = mentor.rating?.count || 0;
      const currentAvg = mentor.rating?.average || 0;

      let newCount = count;
      let newAverage = rating;

      if (oldRating && count > 0) {
        const totalRating = (currentAvg * count) - oldRating + rating;
        newAverage = Math.round((totalRating / count) * 10) / 10;
      } else {
        newCount = count + 1;
        newAverage = Math.round(((currentAvg * count + rating) / newCount) * 10) / 10;
      }

      await Mentor.findByIdAndUpdate(mentor._id, {
        $set: {
          'rating.average': newAverage,
          'rating.count': newCount
        }
      });
      mentor.rating.average = newAverage;
      mentor.rating.count = newCount;
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: {
        feedback: session.feedback,
        mentorRating: mentor ? mentor.rating : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating review'
    });
  }
});

module.exports = router;
