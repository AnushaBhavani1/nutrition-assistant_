// routes/suggestionRoutes.js
// Routes for generating and managing persisted nutrition suggestions.

const express = require('express');
const { body } = require('express-validator');
const {
  getSuggestions,
  createSuggestion,
  updateSuggestion,
  deleteSuggestion,
} = require('../controllers/suggestionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

const suggestionValidation = [
  body('category')
    .optional()
    .isIn(['general', 'weight_loss', 'weight_gain', 'maintenance', 'diabetic', 'high_protein'])
    .withMessage('Invalid suggestion category'),
];

router.route('/').get(protect, getSuggestions).post(protect, suggestionValidation, createSuggestion);

router.route('/:id').put(protect, updateSuggestion).delete(protect, deleteSuggestion);

module.exports = router;
