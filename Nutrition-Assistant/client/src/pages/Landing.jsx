// pages/Landing.jsx
// Public marketing/home page shown to unauthenticated visitors.

import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiPieChart,
  FiBookOpen,
  FiMessageCircle,
  FiTrendingUp,
  FiCheckCircle,
} from 'react-icons/fi';
import Footer from '../components/Footer';
import LNavbar from '../components/LNavbar';

const FEATURES = [
  {
    icon: FiPieChart,
    title: 'Track Nutrition',
    description: 'Log meals and automatically track calories, protein, carbs, and fat.',
  },
  {
    icon: FiActivity,
    title: 'BMI & Calorie Insights',
    description: 'Understand your BMI and get a personalized daily calorie target.',
  },
  {
    icon: FiBookOpen,
    title: 'Healthy Recipes',
    description: 'Browse a curated library of nutritious, easy-to-make recipes.',
  },
  {
    icon: FiMessageCircle,
    title: 'AI Nutrition Assistant',
    description: 'Ask nutrition questions and get instant, friendly AI guidance.',
  },
  {
    icon: FiTrendingUp,
    title: 'Weekly Progress',
    description: 'Visualize your weekly calories and macros with clear charts.',
  },
  {
    icon: FiCheckCircle,
    title: 'Goal-Based Plans',
    description: 'Set a weight loss, weight gain, or maintenance goal and stay on track.',
  },
];

const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary-50 via-white to-white">
      <LNavbar />

      <main className="flex-1">
        <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
          <span className="rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
            Your personal healthy-living companion
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-primary-900 sm:text-5xl">
            Eat smarter. Track better. Live healthier.
          </h1>
          <p className="max-w-2xl text-lg text-gray-500">
            Nutrition Assistant helps you track meals, monitor calories and macros, calculate
            your BMI, and get AI-powered nutrition guidance — all in one simple dashboard.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="btn-primary">
              Create Free Account
            </Link>
            <Link to="/login" className="btn-secondary">
              I already have an account
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <Icon size={22} />
                </div>
                <h3 className="mb-1 font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-20 text-center">
          <div className="card bg-primary-600 text-white">
            <h2 className="mb-2 text-2xl font-bold">Ready to start your health journey?</h2>
            <p className="mb-5 text-primary-50">
              Join Nutrition Assistant today and take the first step toward a healthier you.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-2.5 font-semibold text-primary-700 shadow-card hover:bg-primary-50"
            >
              Sign Up Free
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
