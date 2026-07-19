// models/Suggestion.js
// Mongoose schema for storing personalized nutrition suggestions so users
// can revisit, update, or delete guidance they've received previously.

const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      // what kind of suggestion this is
      type: String,
      enum: ['general', 'weight_loss', 'weight_gain', 'maintenance', 'diabetic', 'high_protein'],
      default: 'general',
    },
    prompt: {
      // the question / context that produced this suggestion (optional)
      type: String,
      trim: true,
      default: '',
    },
    suggestionText: {
      type: String,
      required: [true, 'Suggestion text is required'],
    },
    source: {
      // whether this was rule-based (utils/suggestNutrition.js) or AI-generated (Gemini)
      type: String,
      enum: ['rule_based', 'ai'],
      default: 'rule_based',
    },
  },
  { timestamps: true }
);

suggestionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Suggestion', suggestionSchema);
