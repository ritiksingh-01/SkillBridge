const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Session = require('../models/Session');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent for session
// @access  Private
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.mentee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: session.price * 100, // Convert to cents
      currency: 'inr',
      metadata: {
        sessionId: session._id.toString(),
        menteeId: req.user.id
      }
    });

    session.paymentId = paymentIntent.id;
    await session.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await Session.findOneAndUpdate(
          { paymentId: paymentIntent.id },
          { paymentStatus: 'paid' }
        );
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await Session.findOneAndUpdate(
          { paymentId: failedPayment.id },
          { paymentStatus: 'failed' }
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ message: 'Webhook handler failed' });
  }
});

module.exports = router;