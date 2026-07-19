// controllers/foodController.js
// Business logic for managing the food database, searching foods, and the
// per-user daily FoodLog (individual logged food entries with serving size).

const { validationResult } = require('express-validator');
const Food = require('../models/Food');
const FoodLog = require('../models/FoodLog');

/**
 * @desc    Get all foods (supports optional category filter & pagination)
 * @route   GET /api/foods
 * @access  Private
 */
const getFoods = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [foods, total] = await Promise.all([
      Food.find(filter).sort({ name: 1 }).skip(skip).limit(Number(limit)),
      Food.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: foods.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      foods,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search foods by name or category
 * @route   GET /api/foods/search?q=
 * @access  Private
 */
const searchFoods = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      res.status(400);
      throw new Error('A search query "q" is required');
    }

    const regex = new RegExp(q.trim(), 'i');

    const foods = await Food.find({
      $or: [{ name: regex }, { category: regex }],
    }).limit(30);

    res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single food item by id
 * @route   GET /api/foods/:id
 * @access  Private
 */
const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      res.status(404);
      throw new Error('Food item not found');
    }
    res.status(200).json({ success: true, food });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new food item
 * @route   POST /api/foods
 * @access  Private
 */
const createFood = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const food = await Food.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      food,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a food item
 * @route   PUT /api/foods/:id
 * @access  Private
 */
const updateFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      res.status(404);
      throw new Error('Food item not found');
    }

    Object.assign(food, req.body);
    const updatedFood = await food.save();

    res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      food: updatedFood,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a food item
 * @route   DELETE /api/foods/:id
 * @access  Private
 */
const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      res.status(404);
      throw new Error('Food item not found');
    }

    await food.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------
 * FoodLog: the per-user daily food log (single logged item + serving size).
 * Distinct from the Food database CRUD above and from the multi-item Meal
 * model — this fulfils the SmartBridge "Food Logging" requirement directly.
 * ---------------------------------------------------------------------- */

/**
 * @desc    Get the logged-in user's food log entries (optionally filtered
 *          by date range or meal type)
 * @route   GET /api/foods/log
 * @access  Private
 */
const getFoodLogs = async (req, res, next) => {
  try {
    const { startDate, endDate, mealType } = req.query;

    const filter = { userId: req.user._id };
    if (mealType) filter.mealType = mealType;
    if (startDate || endDate) {
      filter.logDate = {};
      if (startDate) filter.logDate.$gte = new Date(startDate);
      if (endDate) filter.logDate.$lte = new Date(endDate);
    }

    const logs = await FoodLog.find(filter).sort({ logDate: -1 });

    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a food item to the logged-in user's daily log
 * @route   POST /api/foods/log
 * @access  Private
 */
const createFoodLog = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { food: foodId, quantity, servingSize, mealType, logDate } = req.body;

    const foodDoc = await Food.findById(foodId);
    if (!foodDoc) {
      res.status(404);
      throw new Error('Food item not found');
    }

    const qty = quantity && quantity > 0 ? quantity : 1;

    const log = await FoodLog.create({
      userId: req.user._id,
      food: foodDoc._id,
      foodName: foodDoc.name,
      servingSize: servingSize || foodDoc.servingSize,
      quantity: qty,
      mealType: mealType || 'snacks',
      calories: Math.round(foodDoc.calories * qty),
      protein: Math.round(foodDoc.protein * qty * 10) / 10,
      carbs: Math.round(foodDoc.carbs * qty * 10) / 10,
      fat: Math.round(foodDoc.fat * qty * 10) / 10,
      fiber: Math.round(foodDoc.fiber * qty * 10) / 10,
      logDate: logDate || Date.now(),
    });

    res.status(201).json({
      success: true,
      message: 'Food logged successfully',
      log,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a food log entry (e.g. change quantity or meal type)
 * @route   PUT /api/foods/log/:id
 * @access  Private
 */
const updateFoodLog = async (req, res, next) => {
  try {
    const log = await FoodLog.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) {
      res.status(404);
      throw new Error('Food log entry not found');
    }

    const { quantity, servingSize, mealType, logDate } = req.body;

    if (quantity && quantity > 0) {
      const foodDoc = await Food.findById(log.food);
      if (foodDoc) {
        log.quantity = quantity;
        log.calories = Math.round(foodDoc.calories * quantity);
        log.protein = Math.round(foodDoc.protein * quantity * 10) / 10;
        log.carbs = Math.round(foodDoc.carbs * quantity * 10) / 10;
        log.fat = Math.round(foodDoc.fat * quantity * 10) / 10;
        log.fiber = Math.round(foodDoc.fiber * quantity * 10) / 10;
      }
    }
    if (servingSize) log.servingSize = servingSize;
    if (mealType) log.mealType = mealType;
    if (logDate) log.logDate = logDate;

    const updatedLog = await log.save();

    res.status(200).json({
      success: true,
      message: 'Food log entry updated successfully',
      log: updatedLog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a food log entry
 * @route   DELETE /api/foods/log/:id
 * @access  Private
 */
const deleteFoodLog = async (req, res, next) => {
  try {
    const log = await FoodLog.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) {
      res.status(404);
      throw new Error('Food log entry not found');
    }

    await log.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Food log entry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
