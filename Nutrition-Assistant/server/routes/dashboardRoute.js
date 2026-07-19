// routes/dashboardRoutes.js
// Route for the aggregated dashboard summary.

const express = require('express');
const { getDashboard, getReport } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getDashboard);
router.get('/report', protect, getReport);

module.exports = router;
