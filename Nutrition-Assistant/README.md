# 🥗 Nutrition Assistant

A full-stack **MERN** healthcare web application, built for the **SmartBridge MERN Stack
Internship** evaluation, that helps users maintain a healthy lifestyle through personalized
nutrition guidance — food logging, diet plans, nutrition suggestions, BMI/calorie tracking,
healthy recipes, reports with progress graphs, and an AI-powered nutrition chatbot.

> **Disclaimer:** This application supports healthy living and general nutrition awareness.
> It is **not** a substitute for professional medical advice, diagnosis, or treatment.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [Architecture](#architecture)
6. [Installation](#installation)
7. [Environment Variables](#environment-variables)
8. [Seeding Sample Data](#seeding-sample-data)
9. [API Documentation](#api-documentation)
10. [Testing with Postman](#testing-with-postman)
11. [Deployment](#deployment)
12. [Future Enhancements](#future-enhancements)
13. [Contributors](#contributors)
14. [License](#license)

---

## Project Overview

The Nutrition Assistant lets users register, log in, manage their health profile, log food
consumption day-to-day, create goal-based diet plans, generate and save personalized nutrition
suggestions, track BMI and calories, browse healthy recipes, chat with an AI nutrition assistant
(Google Gemini), and review daily/weekly reports with progress graphs.

## Features

- 🔐 **Authentication** — register, login, logout, JWT auth, bcrypt password hashing
- 👤 **User Profile** — name, email, age, height, weight, activity level, goal; fully editable, plus a read-only Health Data view (BMI/BMR/TDEE)
- 🍽️ **Food Logging** — search food, add food with a serving size/quantity, view/update/delete daily log entries
- 📋 **Diet Plans** — create, edit, delete; goal (weight loss / weight gain / maintain weight), start date, end date, status
- 💡 **Nutrition Suggestions** — generate, store, view, edit, and delete personalized suggestions by category
- 📊 **Nutrition Information** — calories, protein, carbs, fat, fiber (and sugar/sodium on the food database)
- 🧮 **BMI Calculator** — automatic BMI calculation and classification (Underweight / Normal / Overweight / Obese)
- 📈 **Dashboard** — welcome message, today's calories & nutrition, today's meals, BMI, goal, weekly progress
- 📑 **Reports** — daily report, weekly report, and progress charts (Chart.js)
- 🤖 **AI Nutrition Assistant** — Google Gemini API; ask for a high-protein diet, weight-loss meals, a diabetic diet, etc.
- 📱 Fully responsive, professional healthcare-themed UI (green palette)

## Technology Stack

**Client:** React.js, React Router DOM, Axios, Context API, Tailwind CSS, Chart.js, react-chartjs-2

**Server:** Node.js, Express.js

**Database:** MongoDB Atlas, Mongoose

**Authentication:** JWT, bcryptjs

**Other:** dotenv, cors, helmet, morgan, express-validator, multer

## Folder Structure

```
Nutrition-Assistant/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── foodController.js        # food database CRUD/search + FoodLog CRUD
│   │   ├── mealController.js        # multi-food Meal logging (kept, additive)
│   │   ├── recipeController.js      # kept, additive
│   │   ├── dashboardController.js   # dashboard summary + daily/weekly reports
│   │   ├── aiController.js          # kept, additive (Gemini chat)
│   │   ├── dietPlanController.js
│   │   └── suggestionController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Suggestion.js
│   │   ├── DietPlan.js
│   │   ├── FoodLog.js               # single logged food item + serving size
│   │   ├── Food.js                  # food database (kept, additive)
│   │   ├── Meal.js                  # multi-food meal grouping (kept, additive)
│   │   └── Recipe.js                # kept, additive
│   ├── routes/
│   │   ├── authRoute.js
│   │   ├── userRoute.js
│   │   ├── foodRoute.js             # food CRUD/search + /foods/log CRUD
│   │   ├── dietPlanRoute.js         # mounted at both /api/diet-plans and /api/plans
│   │   ├── suggestionRoute.js
│   │   ├── dashboardRoute.js        # includes /dashboard/report
│   │   ├── mealRoutes.js            # kept, additive
│   │   ├── recipeRoutes.js          # kept, additive
│   │   └── aiRoutes.js              # kept, additive
│   ├── utils/
│   │   ├── suggestNutrition.js
│   │   ├── calculateBMI.js
│   │   ├── calculateCalories.js
│   │   └── generateToken.js         # kept, additive
│   ├── uploads/
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── LNavbar.jsx          # public/landing navbar
│   │   │   ├── UnavBar.jsx          # minimal navbar for Login/Register
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── MealCard.jsx
│   │   │   ├── SuggestionCard.jsx
│   │   │   ├── PlanCard.jsx
│   │   │   ├── FoodCard.jsx         # kept, additive
│   │   │   ├── RecipeCard.jsx       # kept, additive
│   │   │   ├── StatCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Home.jsx             # authenticated home (alias of Dashboard)
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NewPlan.jsx
│   │   │   ├── Plans.jsx
│   │   │   ├── NewSuggestion.jsx
│   │   │   ├── SuggestedNutrition.jsx
│   │   │   ├── FoodLog.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── UserData.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Landing.jsx          # kept, additive (LandingPage re-exports this)
│   │   │   ├── Meals.jsx            # kept, additive (multi-food meal logging)
│   │   │   ├── Recipes.jsx          # kept, additive
│   │   │   ├── FoodSearch.jsx       # kept, additive
│   │   │   ├── AIChat.jsx           # kept, additive
│   │   │   ├── DietPlans.jsx        # kept, additive (all-in-one plan manager)
│   │   │   └── Suggestions.jsx      # kept, additive (all-in-one suggestion manager)
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── .env.example
│
├── Nutrition-Assistant.postman_collection.json
└── README.md
```

> **Note on "kept, additive" files:** the audit found some functionality already implemented
> under different names before this update (e.g. `Meal`/`Meals.jsx` for multi-food meal
> logging, `DietPlans.jsx`/`Suggestions.jsx` as all-in-one managers). Per the "don't remove
> working code" requirement, these were left in place and are still fully functional — the
> newly-added, spec-named files (`FoodLog.jsx`, `Plans.jsx`/`NewPlan.jsx`,
> `SuggestedNutrition.jsx`/`NewSuggestion.jsx`) sit alongside them as the literal
> spec-required pages, backed by the required `FoodLog`/`DietPlan`/`Suggestion` models.

## Architecture

The server strictly follows the **MVC (Model-View-Controller)** pattern:

- **Models** — Mongoose schemas define the database structure.
- **Controllers** — All business logic lives here (validation, calculations, database operations).
- **Routes** — Only define REST endpoints and wire them to controllers/middlewares.
- **Config** — Database connection setup only.
- **server.js** — The single application entry point that wires everything together.

## Installation

### Prerequisites

- Node.js v18 or higher
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Google Gemini API key (for the AI Assistant feature)

### 1. Clone / extract the project

```bash
cd Nutrition-Assistant
```

### 2. Server setup

```bash
cd server
cp .env.example .env
# Edit .env and fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY, etc.
npm install
npm run dev
```

The API starts on `http://localhost:5000` (health check: `GET /api/health`).

### 3. Client setup

Open a new terminal:

```bash
cd client
cp .env.example .env
# Edit .env if your server runs on a different URL
npm install
npm run dev
```

The app starts on `http://localhost:5173`.

## Environment Variables

### server/.env

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used to sign JWTs |
| `JWT_EXPIRES_IN` | JWT expiry duration (e.g. `7d`) |
| `CLIENT_URL` | Client app URL, used for CORS |
| `GEMINI_API_KEY` | Google Gemini API key for the AI Assistant |
| `GEMINI_MODEL` | Gemini model name (default `gemini-1.5-flash`) |

### client/.env

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the server API (default `http://localhost:5000/api`) |

## Seeding Sample Data

To populate the database with sample foods and recipes so the app is immediately usable:

```bash
cd server
npm run seed          # inserts sample data if collections are empty
npm run seed:reset    # clears Food & Recipe collections, then re-seeds
```

## API Documentation

Base URL: `http://localhost:5000/api`. All **Private** routes require an
`Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user (hashes password, returns JWT) |
| POST | `/auth/login` | Public | Login and receive a JWT |
| POST | `/auth/logout` | Private | Logout |

### User

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users/profile` | Private | Get profile + BMI/BMR/TDEE metrics |
| PUT | `/users/profile` | Private | Edit profile (supports `multipart/form-data` for photo upload) |

### Food Database & Food Logging

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/foods` | Private | List foods (supports `category`, `page`, `limit`) |
| GET | `/foods/search?q=` | Private | Search foods by name or category |
| GET | `/foods/:id` | Private | Get a single food item |
| POST | `/foods` | Private | Create a food item |
| PUT | `/foods/:id` | Private | Update a food item |
| DELETE | `/foods/:id` | Private | Delete a food item |
| GET | `/foods/log` | Private | Get the user's daily food log (supports `startDate`, `endDate`, `mealType`) |
| POST | `/foods/log` | Private | Add a food to the log (`food` id, `quantity`/serving size, `mealType`) |
| PUT | `/foods/log/:id` | Private | Update a food log entry |
| DELETE | `/foods/log/:id` | Private | Delete a food log entry |

> `Meal` / `/api/meals` (multi-food meal grouping) is also still available — see the
> "kept, additive" note above.

### Diet Plans

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/plans` (alias `/diet-plans`) | Private | List the user's diet plans (supports `status`, `goal`) |
| GET | `/plans/:id` | Private | Get a single diet plan |
| POST | `/plans` | Private | Create a diet plan (`title`, `goal`, `startDate`, `endDate`, optional `targetCalories`, `description`) |
| PUT | `/plans/:id` | Private | Update a diet plan |
| DELETE | `/plans/:id` | Private | Delete a diet plan |

### Nutrition Suggestions

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/suggestions` | Private | List saved suggestions (supports `category`) |
| POST | `/suggestions` | Private | Generate and save a suggestion (`category` optional) |
| PUT | `/suggestions/:id` | Private | Edit a saved suggestion |
| DELETE | `/suggestions/:id` | Private | Delete a saved suggestion |

### Recipes (kept, additive)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/recipes` | Private | List recipes (supports `difficulty`, `maxCalories`) |
| GET | `/recipes/:id` | Private | Get a single recipe |
| POST | `/recipes` | Private | Create a recipe |
| PUT | `/recipes/:id` | Private | Update a recipe |
| DELETE | `/recipes/:id` | Private | Delete a recipe |

### Dashboard & Reports

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Private | Welcome message, today's calories/nutrition/meals, BMI, goal, weekly progress |
| GET | `/dashboard/report?range=daily` | Private | Daily report: meal-by-meal breakdown |
| GET | `/dashboard/report?range=weekly` | Private | Weekly report: 7-day totals/averages for charts |

### AI Assistant (kept, additive)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/ai/recommend` | Private | Ask a nutrition question (Gemini) — e.g. suggest a high-protein diet, weight-loss meals, a diabetic diet |

## Testing with Postman

A ready-to-import Postman collection is included at the project root:

```
Nutrition-Assistant.postman_collection.json
```

Import it, set the `baseUrl` variable (default `http://localhost:5000/api`), run **Register**
or **Login** first, then copy the returned `token` into the collection's `token` variable to
authenticate the remaining requests.

## Deployment

### Client (Vercel)

1. Push the `client/` folder to a Git repository.
2. Import the repository into [Vercel](https://vercel.com).
3. Build command: `npm run build`; output directory: `dist`.
4. Add the environment variable `VITE_API_BASE_URL` pointing to your deployed server (e.g. `https://your-api.onrender.com/api`).
5. Deploy.

### Server (Render)

1. Push the `server/` folder to a Git repository.
2. Create a new **Web Service** on [Render](https://render.com).
3. Build command: `npm install`; start command: `npm start`.
4. Add all variables from `.env.example` under Render's Environment settings.
5. Deploy, then update the client's `VITE_API_BASE_URL` to match the deployed server URL.

### Database (MongoDB Atlas)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist your deployment's IP (or `0.0.0.0/0` for simplicity).
3. Copy the connection string into `MONGO_URI`.

## Future Enhancements

- Barcode scanning for quick food logging
- Push/email reminders for logging meals
- Social features (sharing progress, community recipes)
- Admin dashboard for managing the food/recipe database (role-ready architecture already in place)
- Integration with wearable devices for activity tracking
- Multi-language support

## Contributors

- SmartBridge MERN Stack Internship — Project Submission

## License

This project is licensed under the MIT License.
