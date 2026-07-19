// pages/Dashboard.jsx
// Main authenticated landing page: today's nutrition, BMI, goal, recent
// meals, and a weekly progress chart.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { FiZap, FiActivity, FiTarget, FiPieChart } from 'react-icons/fi';
import api from '../services/api';
import StatCard from '../components/StatCard';
import MealCard from '../components/MealCard';
import Loader from '../components/Loader';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const GOAL_LABELS = {
  weight_loss: 'Weight Loss',
  weight_gain: 'Weight Gain',
  maintain_weight: 'Maintain Weight',
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: response } = await api.get('/dashboard');
        setData(response);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader fullScreen label="Loading your dashboard..." />;
  if (!data) return null;

  const { welcomeMessage, today, bmi, goal, recentMeals, weeklyProgress } = data;

  const progressPercent = today.recommendedCalories
    ? Math.round((today.caloriesConsumed / today.recommendedCalories) * 100)
    : 0;

  const chartData = {
    labels: weeklyProgress.map((day) =>
      new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })
    ),
    datasets: [
      {
        label: 'Calories',
        data: weeklyProgress.map((day) => day.calories),
        borderColor: '#16a34e',
        backgroundColor: 'rgba(34, 197, 99, 0.15)',
        tension: 0.35,
        fill: true,
      },
      {
        label: 'Protein (g)',
        data: weeklyProgress.map((day) => day.protein),
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        tension: 0.35,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="page-title">{welcomeMessage}</h1>
        <p className="text-sm text-gray-500">Here's your nutrition summary for today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FiZap}
          label="Calories Today"
          value={today.caloriesConsumed}
          unit={`/ ${today.recommendedCalories} kcal`}
          progress={progressPercent}
          accent="amber"
        />
        <StatCard icon={FiPieChart} label="Protein Intake" value={today.proteinConsumed} unit="g" accent="sky" />
        <StatCard icon={FiActivity} label="BMI" value={bmi.value} unit={bmi.category} accent="primary" />
        <StatCard icon={FiTarget} label="Goal" value={GOAL_LABELS[goal] || goal} accent="rose" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="mb-4 font-semibold text-gray-800">Weekly Progress</h2>
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="card">
          <h2 className="mb-4 font-semibold text-gray-800">Today's Macros</h2>
          <div className="flex flex-col gap-3">
            <MacroBar label="Carbs" value={today.carbsConsumed} color="bg-sky-500" />
            <MacroBar label="Protein" value={today.proteinConsumed} color="bg-primary-500" />
            <MacroBar label="Fat" value={today.fatConsumed} color="bg-amber-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Recent Meals</h2>
          <Link to="/meals" className="text-sm font-medium text-primary-700 hover:underline">
            View all
          </Link>
        </div>

        {recentMeals.length === 0 ? (
          <div className="card text-center text-sm text-gray-500">
            No meals logged yet.{' '}
            <Link to="/meals" className="font-semibold text-primary-700 hover:underline">
              Log your first meal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentMeals.map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MacroBar = ({ label, value, color }) => {
  const capped = Math.min(100, value); // simple visual cap for the bar width
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span>{value}g</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${capped}%` }} />
      </div>
    </div>
  );
};

export default Dashboard;
