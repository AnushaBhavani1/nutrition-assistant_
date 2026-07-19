// routes/authRoutes.js
// Routes for user registration and login.

const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/logout', protect, logoutUser);

module.exports = router;
