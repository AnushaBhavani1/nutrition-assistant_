// models/DietPlan.js
// Mongoose schema for user-created diet plans (weight loss / gain / maintenance).

const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Diet plan title is required'],
      trim: true,
    },
    goal: {
      type: String,
      enum: ['weight_loss', 'weight_gain', 'maintenance'],
      required: [true, 'Goal is required'],
    },
    targetCalories: {
      type: Number,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function validateEndDate(value) {
          // `this` refers to the document being validated on save
          return !this.startDate || value >= this.startDate;
        },
        message: 'End date must be the same as or after the start date',
      },
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

dietPlanSchema.index({ userId: 1, startDate: -1 });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
