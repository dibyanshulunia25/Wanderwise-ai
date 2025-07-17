// routes/guides.js
const express = require('express');
const router = express.Router();
const { generateGuide, getGuides } = require('../controllers/guideController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected and require a valid token
router.route('/').get(protect, getGuides);
router.route('/generate').post(protect, generateGuide);

module.exports = router;