// models/Food.js
// Mongoose schema for food items in the food database (used for search and meal logging).

const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    servingSize: {
      // e.g. "100g", "1 cup"
      type: String,
      required: [true, 'Serving size is required'],
      default: '100g',
    },
    calories: {
      type: Number,
      required: [true, 'Calories value is required'],
      min: 0,
    },
    protein: {
      type: Number,
      default: 0,
      min: 0,
    },
    carbs: {
      type: Number,
      default: 0,
      min: 0,
    },
    fat: {
      type: Number,
      default: 0,
      min: 0,
    },
    fiber: {
      type: Number,
      default: 0,
      min: 0,
    },
    sugar: {
      type: Number,
      default: 0,
      min: 0,
    },
    sodium: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        'fruits',
        'vegetables',
        'grains',
        'protein',
        'dairy',
        'snacks',
        'beverages',
        'other',
      ],
      default: 'other',
    },
    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Text index to support fast name/category search
foodSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Food', foodSchema);
