// controllers/dashboardController.js
// Business logic for building the dashboard summary: today's nutrition,
// BMI, goal, recent meals, and a 7-day weekly progress report.

const Meal = require('../models/Meal');
const User = require('../models/User');
const calculateBMI = require('../utils/calculateBMI');
const { calculateDailyCalories } = require('../utils/calculateCalories');

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * @desc    Get the dashboard summary for the logged-in user
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    // Today's meals
    const todaysMeals = await Meal.find({
      userId: user._id,
      mealDate: { $gte: todayStart, $lte: todayEnd },
    }).sort({ mealDate: -1 });

    const todaysTotals = todaysMeals.reduce(
      (acc, meal) => {
        acc.calories += meal.totalCalories;
        acc.protein += meal.totalProtein;
        acc.carbs += meal.totalCarbs;
        acc.fat += meal.totalFat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Meal type breakdown for today
    const mealSummary = { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 };
    todaysMeals.forEach((meal) => {
      mealSummary[meal.mealType] += meal.totalCalories;
    });

    // Recent 5 meals (any date)
    const recentMeals = await Meal.find({ userId: user._id })
      .sort({ mealDate: -1 })
      .limit(5);

    // Weekly progress: last 7 days including today
    const sevenDaysAgo = startOfDay(new Date());
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const weeklyMeals = await Meal.find({
      userId: user._id,
      mealDate: { $gte: sevenDaysAgo, $lte: todayEnd },
    });

    const weeklyMap = {};
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      weeklyMap[key] = { date: key, calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    weeklyMeals.forEach((meal) => {
      const key = new Date(meal.mealDate).toISOString().split('T')[0];
      if (weeklyMap[key]) {
        weeklyMap[key].calories += meal.totalCalories;
        weeklyMap[key].protein += meal.totalProtein;
        weeklyMap[key].carbs += meal.totalCarbs;
        weeklyMap[key].fat += meal.totalFat;
      }
    });

    const weeklyProgress = Object.values(weeklyMap);

    // BMI + calorie targets
    const { bmi, category } = calculateBMI(user.weight, user.height);
    const { bmr, tdee, recommendedCalories } = calculateDailyCalories(user);

    res.status(200).json({
      success: true,
      welcomeMessage: `Welcome back, ${user.name}!`,
      today: {
        caloriesConsumed: Math.round(todaysTotals.calories),
        proteinConsumed: Math.round(todaysTotals.protein * 10) / 10,
        carbsConsumed: Math.round(todaysTotals.carbs * 10) / 10,
        fatConsumed: Math.round(todaysTotals.fat * 10) / 10,
        recommendedCalories,
        remainingCalories: Math.max(0, recommendedCalories - Math.round(todaysTotals.calories)),
      },
      bmi: {
        value: bmi,
        category,
      },
      goal: user.goal,
      mealSummary,
      recentMeals,
      weeklyProgress,
      metrics: { bmr, tdee, recommendedCalories },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a daily or weekly nutrition report with data suitable for
 *          progress graphs.
 * @route   GET /api/dashboard/report?range=daily|weekly&date=YYYY-MM-DD
 * @access  Private
 */
const getReport = async (req, res, next) => {
  try {
    const { range = 'weekly', date } = req.query;
    const referenceDate = date ? new Date(date) : new Date();

    if (Number.isNaN(referenceDate.getTime())) {
      res.status(400);
      throw new Error('Invalid date provided');
    }

    if (range === 'daily') {
      const dayStart = startOfDay(referenceDate);
      const dayEnd = endOfDay(referenceDate);

      const meals = await Meal.find({
        userId: req.user._id,
        mealDate: { $gte: dayStart, $lte: dayEnd },
      }).sort({ mealDate: 1 });

      const totals = meals.reduce(
        (acc, meal) => {
          acc.calories += meal.totalCalories;
          acc.protein += meal.totalProtein;
          acc.carbs += meal.totalCarbs;
          acc.fat += meal.totalFat;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      return res.status(200).json({
        success: true,
        range: 'daily',
        date: dayStart.toISOString().split('T')[0],
        totals,
        meals,
      });
    }

    // Weekly report: 7 days ending on referenceDate
    const weekEnd = endOfDay(referenceDate);
    const weekStart = startOfDay(referenceDate);
    weekStart.setDate(weekStart.getDate() - 6);

    const meals = await Meal.find({
      userId: req.user._id,
      mealDate: { $gte: weekStart, $lte: weekEnd },
    });

    const dailyMap = {};
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = { date: key, calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    meals.forEach((meal) => {
      const key = new Date(meal.mealDate).toISOString().split('T')[0];
      if (dailyMap[key]) {
        dailyMap[key].calories += meal.totalCalories;
        dailyMap[key].protein += meal.totalProtein;
        dailyMap[key].carbs += meal.totalCarbs;
        dailyMap[key].fat += meal.totalFat;
      }
    });

    const dailyBreakdown = Object.values(dailyMap);
    const totals = dailyBreakdown.reduce(
      (acc, day) => {
        acc.calories += day.calories;
        acc.protein += day.protein;
        acc.carbs += day.carbs;
        acc.fat += day.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    res.status(200).json({
      success: true,
      range: 'weekly',
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      totals,
      averages: {
        calories: Math.round(totals.calories / 7),
        protein: Math.round((totals.protein / 7) * 10) / 10,
        carbs: Math.round((totals.carbs / 7) * 10) / 10,
        fat: Math.round((totals.fat / 7) * 10) / 10,
      },
      dailyBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, getReport };
