// controllers/userController.js
// Business logic for retrieving and updating the authenticated user's profile.

const { validationResult } = require('express-validator');
const User = require('../models/User');
const calculateBMI = require('../utils/calculateBMI');
const { calculateDailyCalories } = require('../utils/calculateCalories');

/**
 * @desc    Get the logged-in user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { bmi, category } = calculateBMI(user.weight, user.height);
    const { bmr, tdee, recommendedCalories } = calculateDailyCalories(user);

    res.status(200).json({
      success: true,
      user,
      metrics: {
        bmi,
        bmiCategory: category,
        bmr,
        tdee,
        recommendedCalories,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update the logged-in user's profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const updatableFields = [
      'name',
      'age',
      'gender',
      'height',
      'weight',
      'goal',
      'activityLevel',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // If a file was uploaded via multer, store its path
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    // Allow password change if explicitly provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
