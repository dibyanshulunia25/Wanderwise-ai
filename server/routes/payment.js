// server/routes/payment.js

const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleStripeWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected; only a logged-in user can create a session.
router.post('/create-checkout-session', protect, createCheckoutSession);

// The webhook route is public and uses raw body parser, not standard JSON parser.
// It's secured by signature verification inside the controller.
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;