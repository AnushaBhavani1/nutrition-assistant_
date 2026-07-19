// utils/suggestNutrition.js
// Rule-based nutrition suggestion generator. This is a lightweight,
// deterministic alternative/companion to the Gemini-powered AI Assistant —
// used by suggestionController to instantly generate a suggestion that can
// be persisted to MongoDB without depending on an external API call.

const CATEGORY_TIPS = {
  weight_loss: [
    'Favor high-volume, low-calorie foods like leafy greens, cucumbers, and broths to feel full for fewer calories.',
    'Prioritize lean protein (chicken breast, fish, tofu, legumes) at each meal to preserve muscle while losing fat.',
    'Limit sugary drinks and refined carbs; swap for water, whole grains, and fiber-rich vegetables.',
  ],
  weight_gain: [
    'Add calorie-dense, nutritious foods like nuts, nut butters, avocado, and whole milk to your meals.',
    'Eat frequently — aim for 5-6 smaller meals a day instead of 2-3 large ones to hit your calorie target.',
    'Include a protein source with every meal (eggs, dairy, meat, legumes) to support muscle growth.',
  ],
  maintenance: [
    'Keep a balanced plate: roughly half vegetables, a quarter lean protein, a quarter whole grains.',
    'Stay consistent with meal timing and portion sizes to keep your weight stable.',
    'Continue monitoring your intake occasionally to catch any drift from your calorie target.',
  ],
  diabetic: [
    'Choose low glycemic-index carbohydrates (whole grains, legumes, most fruits) and pair them with protein or fat to slow sugar absorption.',
    'Spread carbohydrate intake evenly across meals rather than eating large amounts at once.',
    'Limit sugary drinks and refined sugar; monitor portion sizes of starchy foods like rice, bread, and potatoes.',
  ],
  high_protein: [
    'Include a protein source (eggs, Greek yogurt, chicken, fish, legumes) at every meal and snack.',
    'Aim for roughly 1.2-2.0g of protein per kg of body weight per day, adjusted to your activity level.',
    'Pair protein with resistance training for the best muscle-building results.',
  ],
  general: [
    'Aim for a colorful plate with a variety of vegetables and fruits to cover your micronutrient needs.',
    'Stay hydrated — water supports digestion, energy, and appetite regulation.',
    'Limit ultra-processed foods and added sugars in favor of whole, minimally processed options.',
  ],
};

/**
 * Generates a rule-based nutrition suggestion for a given category and
 * optional user context (goal, recommended calories, BMI category).
 *
 * @param {string} category - one of the keys in CATEGORY_TIPS
 * @param {Object} [context] - optional { recommendedCalories, bmiCategory, goal }
 * @returns {string} a formatted suggestion string
 */
const suggestNutrition = (category = 'general', context = {}) => {
  const key = CATEGORY_TIPS[category] ? category : 'general';
  const tips = CATEGORY_TIPS[key];

  const lines = tips.map((tip, index) => `${index + 1}. ${tip}`);

  let intro = `Here are some nutrition tips for ${key.replace('_', ' ')}:`;
  if (context.recommendedCalories) {
    intro += ` Your estimated daily target is around ${context.recommendedCalories} kcal.`;
  }
  if (context.bmiCategory) {
    intro += ` Your current BMI category is "${context.bmiCategory}".`;
  }

  return `${intro}\n\n${lines.join('\n')}`;
};

module.exports = suggestNutrition;
