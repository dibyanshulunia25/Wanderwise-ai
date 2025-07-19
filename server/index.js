// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from .env file

// Import routes
const authRoutes = require('./routes/auth');
const guideRoutes = require('./routes/guides');
const paymentRoutes = require('./routes/payment');

// Initialize the express app
const app = express();
const PORT = process.env.PORT || 5001; // Use port 5001 to avoid conflict with React's 3000

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for all routes
app.use(cors());

// IMPORTANT: The Stripe webhook needs the raw request body.
// We must use express.json() AFTER the webhook route or conditionally.
// The easiest way is to define the webhook route before the global json parser.
app.use('/api/payments/webhook', paymentRoutes);




// Parse incoming JSON requests and put the parsed data in req.body
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Successfully connected to MongoDB Atlas.'))
.catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
// Use the auth routes for any request to /api/auth
app.use('/api/auth', authRoutes);
// Use the guide routes for any request to /api/guides
app.use('/api/guides', guideRoutes);
// All other /api/payments routes will be handled here
app.use('/api/payments', paymentRoutes);

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});