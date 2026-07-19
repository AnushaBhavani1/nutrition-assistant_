// controllers/authController.js
// Business logic for user registration and login.

const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { name, email, password, age, gender, height, weight, goal, activityLevel } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('A user with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      goal,
      activityLevel,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        activityLevel: user.activityLevel,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate a user and return a JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        activityLevel: user.activityLevel,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user (client discards the token; endpoint kept for
 *          REST completeness and to support future token blacklisting)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logoutUser = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

module.exports = { registerUser, loginUser, logoutUser };
