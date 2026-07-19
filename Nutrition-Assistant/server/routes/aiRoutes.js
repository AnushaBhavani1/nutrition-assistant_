// routes/aiRoutes.js
// Route for the AI-powered nutrition recommendation chatbot.

const express = require('express');
const { body } = require('express-validator');
const { getRecommendation } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

const aiValidation = [
  body('message').trim().notEmpty().withMessage('A message is required'),
];

router.post('/recommend', protect, aiValidation, getRecommendation);

module.exports = router;
