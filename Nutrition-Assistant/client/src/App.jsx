// App.jsx
// Root application component: defines all routes and the authenticated
// app layout (Navbar + Sidebar + page content).

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Meals from './pages/Meals';
import FoodLog from './pages/FoodLog';
import Recipes from './pages/Recipes';
import FoodSearch from './pages/FoodSearch';
import Profile from './pages/Profile';
import UserData from './pages/UserData';
import AIChat from './pages/AIChat';
import DietPlans from './pages/DietPlans';
import Plans from './pages/Plans';
import NewPlan from './pages/NewPlan';
import Suggestions from './pages/Suggestions';
import SuggestedNutrition from './pages/SuggestedNutrition';
import NewSuggestion from './pages/NewSuggestion';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Layout wrapper for all authenticated pages
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-h-[calc(100vh-4rem)] flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected app routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/meals"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Meals />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/food-log"
          element={
            <ProtectedRoute>
              <AppLayout>
                <FoodLog />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Recipes />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/diet-plans"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DietPlans />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Plans />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans/new"
          element={
            <ProtectedRoute>
              <AppLayout>
                <NewPlan />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suggestions"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suggestions />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suggested-nutrition"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SuggestedNutrition />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suggestions/new"
          element={
            <ProtectedRoute>
              <AppLayout>
                <NewSuggestion />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Reports />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/food-search"
          element={
            <ProtectedRoute>
              <AppLayout>
                <FoodSearch />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-data"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UserData />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AIChat />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
