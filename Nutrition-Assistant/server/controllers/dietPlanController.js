// controllers/dietPlanController.js
// Business logic for creating and managing user diet plans.

const { validationResult } = require('express-validator');
const DietPlan = require('../models/DietPlan');

/**
 * @desc    Get all diet plans for the logged-in user
 * @route   GET /api/diet-plans
 * @access  Private
 */
const getDietPlans = async (req, res, next) => {
  try {
    const { status, goal } = req.query;

    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (goal) filter.goal = goal;

    const dietPlans = await DietPlan.find(filter).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: dietPlans.length,
      dietPlans,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single diet plan by id
 * @route   GET /api/diet-plans/:id
 * @access  Private
 */
const getDietPlanById = async (req, res, next) => {
  try {
    const dietPlan = await DietPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!dietPlan) {
      res.status(404);
      throw new Error('Diet plan not found');
    }
    res.status(200).json({ success: true, dietPlan });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new diet plan
 * @route   POST /api/diet-plans
 * @access  Private
 */
const createDietPlan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { title, goal, targetCalories, description, startDate, endDate } = req.body;

    const dietPlan = await DietPlan.create({
      userId: req.user._id,
      title,
      goal,
      targetCalories,
      description,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: 'Diet plan created successfully',
      dietPlan,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a diet plan
 * @route   PUT /api/diet-plans/:id
 * @access  Private
 */
const updateDietPlan = async (req, res, next) => {
  try {
    const dietPlan = await DietPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!dietPlan) {
      res.status(404);
      throw new Error('Diet plan not found');
    }

    const updatableFields = [
      'title',
      'goal',
      'targetCalories',
      'description',
      'startDate',
      'endDate',
      'status',
    ];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        dietPlan[field] = req.body[field];
      }
    });

    const updatedPlan = await dietPlan.save();

    res.status(200).json({
      success: true,
      message: 'Diet plan updated successfully',
      dietPlan: updatedPlan,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a diet plan
 * @route   DELETE /api/diet-plans/:id
 * @access  Private
 */
const deleteDietPlan = async (req, res, next) => {
  try {
    const dietPlan = await DietPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!dietPlan) {
      res.status(404);
      throw new Error('Diet plan not found');
    }

    await dietPlan.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Diet plan deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDietPlans,
  getDietPlanById,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan,
};
