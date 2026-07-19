// server.js
// Application entry point. Sets up Express, middleware, routes, and starts the server.

const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const foodRoutes = require('./routes/foodRoute');
const mealRoutes = require('./routes/mealRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const dashboardRoutes = require('./routes/dashboardRoute');
const aiRoutes = require('./routes/aiRoutes');
const dietPlanRoutes = require('./routes/dietPlanRoute');
const suggestionRoutes = require('./routes/suggestionRoute');

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Security & logging middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded profile images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Nutrition Assistant API is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/diet-plans', dietPlanRoutes);
// SmartBridge spec requires the endpoint at /api/plans; kept as an alias of
// the same router so existing /api/diet-plans consumers keep working.
app.use('/api/plans', dietPlanRoutes);
app.use('/api/suggestions', suggestionRoutes);

// 404 and error handling middleware (must be registered last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
