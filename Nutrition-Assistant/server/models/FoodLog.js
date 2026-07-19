// models/FoodLog.js
// Mongoose schema for a single daily food-log entry. This is the
// SmartBridge-required "FoodLog" model: one logged food item with a
// serving size/quantity and its computed nutrition values.
//
// Note: the project also has a `Meal` model which groups multiple foods
// into one meal (breakfast/lunch/dinner/snacks) via the /api/meals
// endpoints — that functionality is preserved as-is. `FoodLog` is a
// simpler, single-item log used by the /api/foods/log endpoints and the
// FoodLog page, matching the spec's "Add Food / Serving Size / Daily Log"
// requirement one-to-one.

const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: [true, 'A food reference is required'],
    },
    foodName: {
      // snapshot of the food name at the time of logging
      type: String,
      required: true,
    },
    servingSize: {
      type: String,
      default: '1 serving',
    },
    quantity: {
      // multiplier applied to the food's base serving nutrition values
      type: Number,
      default: 1,
      min: 0.1,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
      default: 'snacks',
    },
    calories: { type: Number, default: 0, min: 0 },
    protein: { type: Number, default: 0, min: 0 },
    carbs: { type: Number, default: 0, min: 0 },
    fat: { type: Number, default: 0, min: 0 },
    fiber: { type: Number, default: 0, min: 0 },
    logDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

foodLogSchema.index({ userId: 1, logDate: -1 });

module.exports = mongoose.model('FoodLog', foodLogSchema);
