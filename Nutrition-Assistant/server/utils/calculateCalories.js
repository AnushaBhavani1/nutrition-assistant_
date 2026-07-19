// utils/calculateCalories.js
// Utility to calculate BMR (Basal Metabolic Rate), TDEE (Total Daily Energy
// Expenditure) and a goal-adjusted daily calorie recommendation.

// Activity multipliers used to convert BMR into TDEE
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Calorie adjustment applied on top of TDEE based on the user's goal
const GOAL_ADJUSTMENT = {
  weight_loss: -500,
  weight_gain: 500,
  maintain_weight: 0,
};

/**
 * Calculates BMR using the Mifflin-St Jeor Equation.
 * Men:   BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
 * Women: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
 *
 * @param {number} weightKg
 * @param {number} heightCm
 * @param {number} age
 * @param {string} gender - 'male' | 'female' | 'other'
 * @returns {number} BMR in kcal/day
 */
const calculateBMR = (weightKg, heightCm, age, gender) => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') return Math.round(base + 5);
  if (gender === 'female') return Math.round(base - 161);
  // neutral average offset for 'other'
  return Math.round(base - 78);
};

/**
 * Calculates the recommended daily calorie intake for a user based on
 * their body metrics, activity level, and goal.
 *
 * @param {Object} user - user object containing weight, height, age, gender,
 *                         activityLevel, goal
 * @returns {{ bmr: number, tdee: number, recommendedCalories: number }}
 */
const calculateDailyCalories = (user) => {
  const { weight, height, age, gender, activityLevel, goal } = user;

  if (!weight || !height || !age) {
    return { bmr: 0, tdee: 0, recommendedCalories: 2000 };
  }

  const bmr = calculateBMR(weight, height, age, gender);
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderate;
  const tdee = Math.round(bmr * multiplier);
  const adjustment = GOAL_ADJUSTMENT[goal] ?? 0;
  const recommendedCalories = Math.max(1200, tdee + adjustment);

  return { bmr, tdee, recommendedCalories };
};

module.exports = { calculateBMR, calculateDailyCalories };
