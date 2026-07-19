// controllers/mealController.js
// Business logic for logging and managing meals, including automatic
// nutrition total calculation.

const { validationResult } = require('express-validator');
const Meal = require('../models/Meal');
const Food = require('../models/Food');

/**
 * Builds the foods sub-array with computed nutrition values and returns
 * the aggregated totals for the meal.
 */
const buildMealFoods = async (foodsInput) => {
  const foods = [];
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  for (const item of foodsInput) {
    const foodDoc = await Food.findById(item.food);
    if (!foodDoc) {
      const error = new Error(`Food with id ${item.food} not found`);
      error.statusCode = 404;
      throw error;
    }

    const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;

    const calories = Math.round(foodDoc.calories * quantity);
    const protein = Math.round(foodDoc.protein * quantity * 10) / 10;
    const carbs = Math.round(foodDoc.carbs * quantity * 10) / 10;
    const fat = Math.round(foodDoc.fat * quantity * 10) / 10;

    foods.push({
      food: foodDoc._id,
      name: foodDoc.name,
      quantity,
      calories,
      protein,
      carbs,
      fat,
    });

    totalCalories += calories;
    totalProtein += protein;
    totalCarbs += carbs;
    totalFat += fat;
  }

  return {
    foods,
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
  };
};

/**
 * @desc    Get all meals for the logged-in user (optionally filtered by date range)
 * @route   GET /api/meals
 * @access  Private
 */
const getMeals = async (req, res, next) => {
  try {
    const { startDate, endDate, mealType } = req.query;

    const filter = { userId: req.user._id };

    if (mealType) {
      filter.mealType = mealType;
    }

    if (startDate || endDate) {
      filter.mealDate = {};
      if (startDate) filter.mealDate.$gte = new Date(startDate);
      if (endDate) filter.mealDate.$lte = new Date(endDate);
    }

    const meals = await Meal.find(filter).sort({ mealDate: -1 });

    res.status(200).json({
      success: true,
      count: meals.length,
      meals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log a new meal
 * @route   POST /api/meals
 * @access  Private
 */
const createMeal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { mealType, foods, mealDate } = req.body;

    const { foods: builtFoods, totalCalories, totalProtein, totalCarbs, totalFat } =
      await buildMealFoods(foods);

    const meal = await Meal.create({
      userId: req.user._id,
      mealType,
      foods: builtFoods,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      mealDate: mealDate || Date.now(),
    });

    res.status(201).json({
      success: true,
      message: 'Meal logged successfully',
      meal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing meal
 * @route   PUT /api/meals/:id
 * @access  Private
 */
const updateMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!meal) {
      res.status(404);
      throw new Error('Meal not found');
    }

    const { mealType, foods, mealDate } = req.body;

    if (mealType) meal.mealType = mealType;
    if (mealDate) meal.mealDate = mealDate;

    if (foods && foods.length > 0) {
      const {
        foods: builtFoods,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
      } = await buildMealFoods(foods);
      meal.foods = builtFoods;
      meal.totalCalories = totalCalories;
      meal.totalProtein = totalProtein;
      meal.totalCarbs = totalCarbs;
      meal.totalFat = totalFat;
    }

    const updatedMeal = await meal.save();

    res.status(200).json({
      success: true,
      message: 'Meal updated successfully',
      meal: updatedMeal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a meal
 * @route   DELETE /api/meals/:id
 * @access  Private
 */
const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!meal) {
      res.status(404);
      throw new Error('Meal not found');
    }

    await meal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMeals, createMeal, updateMeal, deleteMeal };
