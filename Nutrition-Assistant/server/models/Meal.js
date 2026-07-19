// models/Meal.js
// Mongoose schema for logged meals. Each meal references one or more foods
// with a quantity, and stores aggregated nutrition totals for fast reads.

const mongoose = require('mongoose');

const mealFoodSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
    name: {
      // snapshot of the food name at the time of logging
      type: String,
      required: true,
    },
    quantity: {
      // multiplier applied to the food's base serving nutrition values
      type: Number,
      default: 1,
      min: 0.1,
    },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
  { _id: false }
);

const mealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
      required: [true, 'Meal type is required'],
    },
    foods: {
      type: [mealFoodSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'A meal must contain at least one food item',
      },
    },
    totalCalories: {
      type: Number,
      default: 0,
    },
    totalProtein: {
      type: Number,
      default: 0,
    },
    totalCarbs: {
      type: Number,
      default: 0,
    },
    totalFat: {
      type: Number,
      default: 0,
    },
    mealDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Speeds up dashboard / weekly-report queries filtered by user and date
mealSchema.index({ userId: 1, mealDate: -1 });

module.exports = mongoose.model('Meal', mealSchema);
