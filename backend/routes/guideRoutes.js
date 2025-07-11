const express = require('express');
const router = express.Router();
const { generateGuide } = require('../controllers/guideController');
const { protect } = require('../middleware/authMiddleware'); // Your JWT protection middleware

// POST /api/guides/generate
router.route('/generate').post(protect, generateGuide);

module.exports = router;