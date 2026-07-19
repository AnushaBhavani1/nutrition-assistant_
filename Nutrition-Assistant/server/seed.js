// seed.js
// Optional utility script to populate MongoDB Atlas with sample Food and
// Recipe documents so the app is immediately usable after setup.
//
// Usage:
//   node seed.js         -> inserts sample data (skips if already present)
//   node seed.js --reset -> clears Food & Recipe collections, then re-seeds

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Food = require('./models/Food');
const Recipe = require('./models/Recipe');

const foods = [
  { name: 'Banana', servingSize: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, sodium: 1, category: 'fruits' },
  { name: 'Apple', servingSize: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 2, category: 'fruits' },
  { name: 'Brown Rice (cooked)', servingSize: '1 cup (195g)', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.7, sodium: 10, category: 'grains' },
  { name: 'Grilled Chicken Breast', servingSize: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, category: 'protein' },
  { name: 'Broccoli (steamed)', servingSize: '1 cup (156g)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, sugar: 2.2, sodium: 33, category: 'vegetables' },
  { name: 'Greek Yogurt (plain)', servingSize: '1 cup (245g)', calories: 146, protein: 25, carbs: 8, fat: 4, fiber: 0, sugar: 7, sodium: 82, category: 'dairy' },
  { name: 'Almonds', servingSize: '1 oz (28g)', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2, sodium: 0, category: 'snacks' },
  { name: 'Oatmeal (cooked)', servingSize: '1 cup (234g)', calories: 158, protein: 6, carbs: 27, fat: 3.2, fiber: 4, sugar: 1, sodium: 115, category: 'grains' },
  { name: 'Salmon (baked)', servingSize: '100g', calories: 206, protein: 22, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 61, category: 'protein' },
  { name: 'Spinach (raw)', servingSize: '1 cup (30g)', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sugar: 0.1, sodium: 24, category: 'vegetables' },
  { name: 'Whole Wheat Bread', servingSize: '1 slice (28g)', calories: 69, protein: 3.6, carbs: 12, fat: 0.9, fiber: 1.9, sugar: 1.4, sodium: 132, category: 'grains' },
  { name: 'Eggs (boiled)', servingSize: '1 large (50g)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, sugar: 0.6, sodium: 62, category: 'protein' },
  { name: 'Avocado', servingSize: '1/2 fruit (68g)', calories: 114, protein: 1.3, carbs: 6, fat: 10.5, fiber: 4.6, sugar: 0.3, sodium: 5, category: 'fruits' },
  { name: 'Skim Milk', servingSize: '1 cup (245g)', calories: 83, protein: 8.3, carbs: 12, fat: 0.2, fiber: 0, sugar: 12, sodium: 103, category: 'dairy' },
  { name: 'Orange Juice', servingSize: '1 cup (248g)', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sugar: 21, sodium: 2, category: 'beverages' },
];

const recipes = [
  {
    title: 'Grilled Chicken & Broccoli Bowl',
    description: 'A simple high-protein bowl with grilled chicken, steamed broccoli, and brown rice.',
    ingredients: [
      '200g grilled chicken breast, sliced',
      '1 cup steamed broccoli',
      '1 cup cooked brown rice',
      '1 tbsp olive oil',
      'Salt and pepper to taste',
    ],
    steps: [
      'Season chicken breast with salt and pepper, then grill until fully cooked.',
      'Steam the broccoli until tender but still bright green.',
      'Cook the brown rice according to package instructions.',
      'Assemble the bowl with rice, broccoli, and sliced chicken.',
      'Drizzle with olive oil and serve warm.',
    ],
    calories: 520,
    protein: 45,
    carbs: 48,
    fat: 14,
    prepTime: 25,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'Greek Yogurt Berry Parfait',
    description: 'A refreshing high-protein breakfast layered with yogurt, berries, and almonds.',
    ingredients: [
      '1 cup Greek yogurt',
      '1/2 cup mixed berries',
      '2 tbsp almonds, chopped',
      '1 tsp honey',
    ],
    steps: [
      'Spoon half the yogurt into a glass.',
      'Add a layer of berries and a sprinkle of almonds.',
      'Repeat the layers with the remaining yogurt and toppings.',
      'Drizzle honey on top and serve immediately.',
    ],
    calories: 320,
    protein: 28,
    carbs: 30,
    fat: 10,
    prepTime: 10,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'Baked Salmon with Spinach Salad',
    description: 'Omega-3 rich baked salmon served over a light spinach salad.',
    ingredients: [
      '200g salmon fillet',
      '2 cups fresh spinach',
      '1/2 avocado, sliced',
      '1 tbsp olive oil',
      '1 tsp lemon juice',
      'Salt and pepper to taste',
    ],
    steps: [
      'Preheat oven to 200°C (400°F).',
      'Season salmon with salt, pepper, and lemon juice, then bake for 12-15 minutes.',
      'Toss spinach with olive oil and a pinch of salt.',
      'Top the salad with avocado slices and the baked salmon.',
      'Serve warm or chilled.',
    ],
    calories: 480,
    protein: 38,
    carbs: 10,
    fat: 30,
    prepTime: 20,
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'Overnight Oats with Banana',
    description: 'An easy make-ahead breakfast that is fiber-rich and naturally sweetened.',
    ingredients: [
      '1/2 cup rolled oats',
      '1/2 cup skim milk',
      '1/2 banana, sliced',
      '1 tsp chia seeds',
      '1 tsp honey',
    ],
    steps: [
      'Combine oats, milk, and chia seeds in a jar.',
      'Stir well, cover, and refrigerate overnight.',
      'In the morning, top with banana slices and honey.',
      'Enjoy cold or warm slightly before eating.',
    ],
    calories: 310,
    protein: 12,
    carbs: 55,
    fat: 5,
    prepTime: 5,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=60',
  },
];

const seed = async () => {
  await connectDB();

  const shouldReset = process.argv.includes('--reset');

  if (shouldReset) {
    await Food.deleteMany({});
    await Recipe.deleteMany({});
    console.log('Existing Food and Recipe data cleared.');
  }

  const foodCount = await Food.countDocuments();
  if (foodCount === 0) {
    await Food.insertMany(foods);
    console.log(`Inserted ${foods.length} sample foods.`);
  } else {
    console.log('Foods collection already has data. Skipping (use --reset to overwrite).');
  }

  const recipeCount = await Recipe.countDocuments();
  if (recipeCount === 0) {
    await Recipe.insertMany(recipes);
    console.log(`Inserted ${recipes.length} sample recipes.`);
  } else {
    console.log('Recipes collection already has data. Skipping (use --reset to overwrite).');
  }

  await mongoose.connection.close();
  console.log('Seeding complete. Database connection closed.');
};

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
