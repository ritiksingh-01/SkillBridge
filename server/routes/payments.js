const express = require('express');
const { body, validationResult } = require('express-validator');
const Session = require('../models/Session');
const Mentor = require('../models/Mentor');
const { auth } = require('../middleware/auth');
const { createNotification } = require('./notifications');

const router = express.Router();

// Mock Stripe for local development when no API key is provided
const mockStripe = {
  paymentIntents: {
    create: async (options) => {
      const id = `pi_mock_${Date.now()}`;
      return {
        id,
        client_secret: `${id}_secret_${Math.random().toString(36).substring(2, 11)}`,
        amount: options.amount,
        currency: options.currency,
        status: 'requires_payment_method',
        metadata: options.metadata
      };
    }
  },
  webhooks: {
    constructEvent: (payload, sig, secret) => {
      if (secret && (!sig || sig === 'invalid_sig')) {
        throw new Error('Invalid Stripe signature');
      }
      return JSON.parse(payload.toString());
    }
  }
};

const getStripeInstance = () => {
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('your_stripe')) {
    return require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
  return mockStripe;
};

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent for session
// @access  Private
router.post('/create-payment-intent', [
  auth,
  body('sessionId').notEmpty().withMessage('Session ID is required')
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

    const { sessionId } = req.body;

    const session = await Session.findById(sessionId)
      .populate('mentor')
      .populate('mentee', 'firstName lastName email');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.mentee._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create payment for this session'
      });
    }

    if (session.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Session is already paid'
      });
    }

    const stripe = getStripeInstance();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(session.price * 100), // Convert INR to paise / cents
      currency: 'inr',
      metadata: {
        sessionId: session._id.toString(),
        menteeId: req.user.id,
        mentorId: session.mentor._id.toString()
      }
    });

    session.paymentId = paymentIntent.id;
    await session.save();

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: session.price
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating payment intent'
    });
  }
});

// Dedicated Webhook Handler - called with raw body before express.json() (C6)
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = getStripeInstance();
  let event;

  try {
    if (process.env.NODE_ENV === 'production' && !webhookSecret) {
      console.error('FATAL: STRIPE_WEBHOOK_SECRET is missing in production');
      return res.status(500).send('Webhook secret misconfigured');
    }

    if (webhookSecret && webhookSecret !== 'whsec_your_webhook_secret') {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // Development fallback
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      event = payload.type ? payload : {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: payload.id || 'pi_mock_123',
            status: 'succeeded'
          }
        }
      };
    }
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const updatedSession = await Session.findOneAndUpdate(
          { paymentId: paymentIntent.id },
          {
            paymentStatus: 'paid',
            status: 'confirmed'
          },
          { new: true }
        ).populate('mentor');

        if (updatedSession) {
          const mentor = await Mentor.findById(updatedSession.mentor._id || updatedSession.mentor);
          if (mentor) {
            await createNotification(
              mentor.user.toString(),
              updatedSession.mentee.toString(),
              'payment_received',
              'Payment Received',
              `Payment of ₹${updatedSession.price} received for session "${updatedSession.title}"`,
              { sessionId: updatedSession._id }
            );
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object;
        await Session.findOneAndUpdate(
          { paymentId: failedPayment.id },
          { paymentStatus: 'failed' }
        );
        break;
      }

      case 'payment_intent.canceled': {
        const canceledPayment = event.data.object;
        await Session.findOneAndUpdate(
          { paymentId: canceledPayment.id },
          { paymentStatus: 'failed' }
        );
        break;
      }

      default:
        break;
    }

    res.json({
      success: true,
      received: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Webhook handler execution failed'
    });
  }
};

// @route   GET /api/payments/session/:sessionId
// @desc    Get payment status for session (H1)
// @access  Private
router.get('/session/:sessionId', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const mentor = await Mentor.findById(session.mentor);

    // Mentor on session is Mentor ObjectId, compare user against mentor.user (H1)
    const isMentee = session.mentee.toString() === req.user.id;
    const isMentor = mentor && mentor.user.toString() === req.user.id;

    if (!isMentee && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.json({
      success: true,
      data: {
        paymentStatus: session.paymentStatus,
        paymentId: session.paymentId,
        amount: session.price
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving payment status'
    });
  }
});

module.exports = { router, handleWebhook };
