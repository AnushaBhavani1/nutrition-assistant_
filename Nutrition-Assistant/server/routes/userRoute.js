// routes/userRoutes.js
// Routes for viewing and updating the authenticated user's profile.

const express = require('express');
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Multer configuration for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

const updateValidation = [
  body('email').not().exists().withMessage('Email cannot be changed'),
  body('age').optional().isInt({ min: 1, max: 120 }).withMessage('Age must be valid'),
  body('height').optional().isFloat({ min: 0 }).withMessage('Height must be a positive number'),
  body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
];

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateValidation, updateProfile);

module.exports = router;
