// routes/recipeRoutes.js
// Routes for browsing and managing healthy recipes.

const express = require('express');
const { body } = require('express-validator');
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

const recipeValidation = [
  body('title').trim().notEmpty().withMessage('Recipe title is required'),
  body('description').trim().notEmpty().withMessage('Recipe description is required'),
  body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('steps').isArray({ min: 1 }).withMessage('At least one step is required'),
  body('calories').isFloat({ min: 0 }).withMessage('Calories must be a positive number'),
  body('prepTime').isFloat({ min: 0 }).withMessage('Prep time must be a positive number'),
];

router.route('/').get(protect, getRecipes).post(protect, recipeValidation, createRecipe);

router
  .route('/:id')
  .get(protect, getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

module.exports = router;
