// server/controllers/paymentController.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// @desc    Create a stripe checkout session for upgrading to Pro
// @route   POST /api/payments/create-checkout-session
exports.createCheckoutSession = async (req, res) => {
    const userId = req.user._id;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription', // Use 'subscription' for recurring, or 'payment' for one-time
            line_items: [
                {
                    // This Price ID is created in your Stripe Dashboard.
                    // Go to Products -> Add Product -> Add a price.
                    price: 'price_1PQUaYEXa3pxYLz4FExA8aah', // Replace with your actual Price ID from Stripe
                    quantity: 1,
                },
            ],
            // Pass the user's ID in the metadata so we know who to upgrade on success
            client_reference_id: userId.toString(),
            // URL to redirect to on success/cancellation
            success_url: 'http://localhost:3000/payment/success', // Your frontend success URL
            cancel_url: 'http://localhost:3000/dashboard', // Back to the dashboard on cancel
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe session creation error:', error);
        res.status(500).json({ message: 'Server error creating payment session.' });
    }
};

// @desc    Stripe webhook handler to update user tier
// @route   POST /api/payments/webhook
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify the event came from Stripe using the webhook secret
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;

        try {
            // Find the user and update their tier to 'pro'
            await User.findByIdAndUpdate(userId, { 
                userTier: 'pro',
                guideCount: 0, // Reset guide count upon upgrade
            });
            console.log(`Successfully upgraded user ${userId} to Pro.`);
        } catch (err) {
            console.error(`Database Error: Failed to upgrade user ${userId}`, err);
        }
    }

    // Acknowledge receipt of the event
    res.status(200).json({ received: true });
};