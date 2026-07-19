// routes/foodRoute.js
// Routes for the food database (listing, searching, CRUD) and the
// per-user daily FoodLog (add/update/delete logged food entries).

const express = require('express');
const { body } = require('express-validator');
const {
  getFoods,
  searchFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getFoodLogs,
  createFoodLog,
  updateFoodLog,
  deleteFoodLog,
} = require('../controllers/foodController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

const foodValidation = [
  body('name').trim().notEmpty().withMessage('Food name is required'),
  body('calories').isFloat({ min: 0 }).withMessage('Calories must be a positive number'),
];

const foodLogValidation = [
  body('food').notEmpty().withMessage('A food id is required'),
  body('quantity').optional().isFloat({ min: 0.1 }).withMessage('Quantity must be a positive number'),
  body('mealType')
    .optional()
    .isIn(['breakfast', 'lunch', 'dinner', 'snacks'])
    .withMessage('mealType must be one of breakfast, lunch, dinner, snacks'),
];

// NOTE: /search and /log must be declared before the /:id route to avoid
// Express treating "search"/"log" as an :id parameter.
router.get('/search', protect, searchFoods);

router
  .route('/log')
  .get(protect, getFoodLogs)
  .post(protect, foodLogValidation, createFoodLog);

router.route('/log/:id').put(protect, updateFoodLog).delete(protect, deleteFoodLog);

router.route('/').get(protect, getFoods).post(protect, foodValidation, createFood);

router
  .route('/:id')
  .get(protect, getFoodById)
  .put(protect, updateFood)
  .delete(protect, deleteFood);

module.exports = router;
