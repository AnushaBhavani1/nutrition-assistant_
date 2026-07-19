// controllers/suggestionController.js
// Business logic for generating (rule-based) and managing persisted
// nutrition suggestions.

const { validationResult } = require('express-validator');
const Suggestion = require('../models/Suggestion');
const User = require('../models/User');
const suggestNutrition = require('../utils/suggestNutrition');
const calculateBMI = require('../utils/calculateBMI');
const { calculateDailyCalories } = require('../utils/calculateCalories');

/**
 * @desc    Get all saved suggestions for the logged-in user
 * @route   GET /api/suggestions
 * @access  Private
 */
const getSuggestions = async (req, res, next) => {
  try {
    const { category } = req.query;

    const filter = { userId: req.user._id };
    if (category) filter.category = category;

    const suggestions = await Suggestion.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate a new personalized suggestion (rule-based) and save it
 * @route   POST /api/suggestions
 * @access  Private
 */
const createSuggestion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { category, prompt } = req.body;

    const user = await User.findById(req.user._id);
    const { bmi, category: bmiCategory } = calculateBMI(user.weight, user.height);
    const { recommendedCalories } = calculateDailyCalories(user);

    const suggestionText = suggestNutrition(category || user.goal, {
      recommendedCalories,
      bmiCategory,
    });

    const suggestion = await Suggestion.create({
      userId: req.user._id,
      category: category || user.goal,
      prompt: prompt || '',
      suggestionText,
      source: 'rule_based',
    });

    res.status(201).json({
      success: true,
      message: 'Suggestion generated successfully',
      suggestion,
      metrics: { bmi, bmiCategory, recommendedCalories },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a saved suggestion (e.g. edit notes/category manually)
 * @route   PUT /api/suggestions/:id
 * @access  Private
 */
const updateSuggestion = async (req, res, next) => {
  try {
    const suggestion = await Suggestion.findOne({ _id: req.params.id, userId: req.user._id });
    if (!suggestion) {
      res.status(404);
      throw new Error('Suggestion not found');
    }

    const updatableFields = ['category', 'prompt', 'suggestionText'];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        suggestion[field] = req.body[field];
      }
    });

    const updated = await suggestion.save();

    res.status(200).json({
      success: true,
      message: 'Suggestion updated successfully',
      suggestion: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a saved suggestion
 * @route   DELETE /api/suggestions/:id
 * @access  Private
 */
const deleteSuggestion = async (req, res, next) => {
  try {
    const suggestion = await Suggestion.findOne({ _id: req.params.id, userId: req.user._id });
    if (!suggestion) {
      res.status(404);
      throw new Error('Suggestion not found');
    }

    await suggestion.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Suggestion deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSuggestions, createSuggestion, updateSuggestion, deleteSuggestion };
