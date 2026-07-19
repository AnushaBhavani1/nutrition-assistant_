// routes/mealRoutes.js
// Routes for logging and managing a user's meals.

const express = require('express');
const { body } = require('express-validator');
const { getMeals, createMeal, updateMeal, deleteMeal } = require('../controllers/mealController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

const mealValidation = [
  body('mealType')
    .isIn(['breakfast', 'lunch', 'dinner', 'snacks'])
    .withMessage('mealType must be one of breakfast, lunch, dinner, snacks'),
  body('foods').isArray({ min: 1 }).withMessage('At least one food item is required'),
  body('foods.*.food').notEmpty().withMessage('Each food item must reference a food id'),
];

router.route('/').get(protect, getMeals).post(protect, mealValidation, createMeal);

router.route('/:id').put(protect, updateMeal).delete(protect, deleteMeal);

module.exports = router;
