// controllers/recipeController.js
// Business logic for managing healthy recipes.

const { validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');

/**
 * @desc    Get all recipes (supports optional difficulty filter)
 * @route   GET /api/recipes
 * @access  Private
 */
const getRecipes = async (req, res, next) => {
  try {
    const { difficulty, maxCalories } = req.query;

    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (maxCalories) filter.calories = { $lte: Number(maxCalories) };

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      recipes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single recipe by id
 * @route   GET /api/recipes/:id
 * @access  Private
 */
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      res.status(404);
      throw new Error('Recipe not found');
    }
    res.status(200).json({ success: true, recipe });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new recipe
 * @route   POST /api/recipes
 * @access  Private
 */
const createRecipe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const recipe = await Recipe.create({ ...req.body, createdBy: req.user._id });

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      recipe,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a recipe
 * @route   PUT /api/recipes/:id
 * @access  Private
 */
const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      res.status(404);
      throw new Error('Recipe not found');
    }

    Object.assign(recipe, req.body);
    const updatedRecipe = await recipe.save();

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      recipe: updatedRecipe,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a recipe
 * @route   DELETE /api/recipes/:id
 * @access  Private
 */
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      res.status(404);
      throw new Error('Recipe not found');
    }

    await recipe.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe };
