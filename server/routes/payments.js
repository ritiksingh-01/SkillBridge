const express = require('express');
const { body, validationResult } = require('express-validator');
const Session = require('../models/Session');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Mock Stripe for development
const mockStripe = {
  paymentIntents: {
    create: async (options) => {
      return {
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: options.amount,
        currency: options.currency,
        status: 'requires_payment_method',
        metadata: options.metadata
      };
    }
  },
  webhooks: {
    constructEvent: (payload, sig, secret) => {
      // Mock webhook event
      return {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_mock_123',
            status: 'succeeded'
          }
        }
      };
    }
  }
};

// Use real Stripe in production, mock in development
const stripe = process.env.NODE_ENV === 'production' && process.env.STRIPE_SECRET_KEY 
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : mockStripe;

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
      .populate('mentor', 'user pricing')
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: session.price * 100, // Convert to cents
      currency: 'inr',
      metadata: {
        sessionId: session._id.toString(),
        menteeId: req.user.id,
        mentorId: session.mentor._id.toString()
      }
    });

    session.paymentId = paymentIntent.id;
    await session.save();

    console.log('✅ Payment intent created for session:', sessionId);

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: session.price
      }
    });
  } catch (error) {
    console.error('❌ Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (process.env.NODE_ENV === 'production' && process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // Mock event for development
      event = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_mock_123',
            status: 'succeeded',
            metadata: {
              sessionId: 'mock_session_id'
            }
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
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('💰 Payment succeeded:', paymentIntent.id);
        
        await Session.findOneAndUpdate(
          { paymentId: paymentIntent.id },
          { 
            paymentStatus: 'paid',
            status: 'confirmed' // Auto-confirm session when payment succeeds
          }
        );
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('❌ Payment failed:', failedPayment.id);
        
        await Session.findOneAndUpdate(
          { paymentId: failedPayment.id },
          { paymentStatus: 'failed' }
        );
        break;

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object;
        console.log('🚫 Payment canceled:', canceledPayment.id);
        
        await Session.findOneAndUpdate(
          { paymentId: canceledPayment.id },
          { paymentStatus: 'failed' }
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ 
      success: true,
      received: true 
    });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Webhook handler failed' 
    });
  }
});

// @route   GET /api/payments/session/:sessionId
// @desc    Get payment status for session
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

    // Check if user is authorized to view this payment
    const isAuthorized = session.mentee.toString() === req.user.id || 
                        session.mentor.toString() === req.user.id;

    if (!isAuthorized) {
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
    console.error('❌ Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;