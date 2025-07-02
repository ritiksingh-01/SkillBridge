const express = require('express');
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
      .populate('mentor', 'user rating')
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

    // Update mentor's overall rating if mentee is reviewing
    if (isMentee && mentor) {
      const totalRating = (mentor.rating.average * mentor.rating.count) + rating;
      mentor.rating.count += 1;
      mentor.rating.average = totalRating / mentor.rating.count;
      await mentor.save();

      console.log(`✅ Updated mentor rating: ${mentor.rating.average} (${mentor.rating.count} reviews)`);
    }

    console.log('✅ Review submitted successfully');

    res.json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        feedback: session.feedback,
        mentorRating: mentor ? mentor.rating : null
      }
    });
  } catch (error) {
    console.error('❌ Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reviews/mentor/:mentorId
// @desc    Get reviews for a mentor
// @access  Public
router.get('/mentor/:mentorId', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;

    let query = {
      mentor: req.params.mentorId,
      'feedback.menteeRating': { $exists: true }
    };

    if (rating) {
      query['feedback.menteeRating'] = parseInt(rating);
    }

    const sessions = await Session.find(query)
      .populate('mentee', 'firstName lastName profileImage')
      .select('feedback createdAt type title')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'feedback.feedbackDate': -1 });

    const total = await Session.countDocuments(query);

    const reviews = sessions.map(session => ({
      id: session._id,
      rating: session.feedback.menteeRating,
      review: session.feedback.menteeReview,
      date: session.feedback.feedbackDate,
      sessionType: session.type,
      sessionTitle: session.title,
      mentee: {
        id: session.mentee._id,
        firstName: session.mentee.firstName,
        lastName: session.mentee.lastName,
        profileImage: session.mentee.profileImage
      }
    }));

    // Get rating distribution
    const ratingDistribution = await Session.aggregate([
      {
        $match: {
          mentor: require('mongoose').Types.ObjectId(req.params.mentorId),
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

    console.log(`✅ Found ${reviews.length} reviews for mentor`);

    res.json({
      success: true,
      data: {
        reviews,
        ratingDistribution,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('❌ Get mentor reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
      .select('feedback type title scheduledAt');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is authorized to view reviews
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
    console.error('❌ Get session reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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

    const isMentee = session.mentee.toString() === req.user.id;
    const mentor = await Mentor.findById(session.mentor._id);
    const isMentor = mentor && mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update review for this session'
      });
    }

    // Store old rating for mentor rating recalculation
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

    // Update mentor's overall rating if mentee is updating review
    if (isMentee && mentor && oldRating) {
      const totalRating = (mentor.rating.average * mentor.rating.count) - oldRating + rating;
      mentor.rating.average = totalRating / mentor.rating.count;
      await mentor.save();

      console.log(`✅ Updated mentor rating: ${mentor.rating.average} (${mentor.rating.count} reviews)`);
    }

    console.log('✅ Review updated successfully');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: {
        feedback: session.feedback,
        mentorRating: mentor ? mentor.rating : null
      }
    });
  } catch (error) {
    console.error('❌ Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;