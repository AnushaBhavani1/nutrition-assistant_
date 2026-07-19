// routes/dietPlanRoutes.js
// Routes for creating and managing user diet plans.

const express = require('express');
const { body } = require('express-validator');
const {
  getDietPlans,
  getDietPlanById,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan,
} = require('../controllers/dietPlanController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

const dietPlanValidation = [
  body('title').trim().notEmpty().withMessage('Diet plan title is required'),
  body('goal')
    .isIn(['weight_loss', 'weight_gain', 'maintenance'])
    .withMessage('goal must be one of weight_loss, weight_gain, maintenance'),
  body('startDate').isISO8601().withMessage('A valid start date is required'),
  body('endDate')
    .isISO8601()
    .withMessage('A valid end date is required')
    .custom((value, { req }) => {
      if (req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date must be the same as or after the start date');
      }
      return true;
    }),
];

router.route('/').get(protect, getDietPlans).post(protect, dietPlanValidation, createDietPlan);

router
  .route('/:id')
  .get(protect, getDietPlanById)
  .put(protect, updateDietPlan)
  .delete(protect, deleteDietPlan);

module.exports = router;
