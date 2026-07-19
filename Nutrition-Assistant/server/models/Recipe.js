// models/Recipe.js
// Mongoose schema for healthy recipes shown in the Recipes page.

const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Recipe description is required'],
    },
    ingredients: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'A recipe must have at least one ingredient',
      },
    },
    steps: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'A recipe must have at least one step',
      },
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    prepTime: {
      // minutes
      type: Number,
      required: true,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    image: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
