# Nutrition Assistant — Server

This is the Express + MongoDB REST API for the Nutrition Assistant application.

See the [root README](../README.md) for full project documentation, including setup
instructions, environment variables, and complete API reference.

## Quick Start

```bash
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY, etc.
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the server with nodemon (auto-restart on changes) |
| `npm start` | Start the server in production mode |
| `npm run seed` | Seed sample foods & recipes (skips if data already exists) |
| `npm run seed:reset` | Clear and re-seed sample foods & recipes |

## Architecture (MVC)

- `config/` — MongoDB connection setup
- `models/` — Mongoose schemas: `User`, `Suggestion`, `DietPlan`, `FoodLog` (single logged food item), plus `Food` (food database), `Meal` (multi-food grouping), `Recipe`
- `controllers/` — Business logic: auth, user, food (+ food log), diet plan, suggestion, dashboard (incl. reports), plus meal, recipe, AI
- `routes/` — REST endpoint definitions (`authRoute.js`, `userRoute.js`, `foodRoute.js`, `dietPlanRoute.js`, `suggestionRoute.js`, `dashboardRoute.js`, plus `mealRoutes.js`, `recipeRoutes.js`, `aiRoutes.js`)
- `middlewares/` — Auth guard and centralized error handling
- `utils/` — Reusable helpers (`suggestNutrition`, `calculateBMI`, `calculateCalories`, `generateToken`)
- `server.js` — Application entry point
