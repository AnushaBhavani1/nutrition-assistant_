// pages/UserData.jsx
// Read-only summary view of the logged-in user's profile data and derived
// health metrics (name, email, age, height, weight, activity level, goal,
// BMI, BMR, TDEE). For editing, users go to /profile.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';

const GOAL_LABELS = {
  weight_loss: 'Weight Loss',
  weight_gain: 'Weight Gain',
  maintain_weight: 'Maintain Weight',
};

const ACTIVITY_LABELS = {
  sedentary: 'Sedentary',
  light: 'Light',
  moderate: 'Moderate',
  active: 'Active',
  very_active: 'Very Active',
};

const UserData = () => {
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile(data.user);
        setMetrics(data.metrics);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Loader fullScreen label="Loading your data..." />;
  if (!profile) return null;

  const rows = [
    { label: 'Name', value: profile.name },
    { label: 'Email', value: profile.email },
    { label: 'Age', value: profile.age ? `${profile.age} years` : '—' },
    { label: 'Height', value: profile.height ? `${profile.height} cm` : '—' },
    { label: 'Weight', value: profile.weight ? `${profile.weight} kg` : '—' },
    { label: 'Activity Level', value: ACTIVITY_LABELS[profile.activityLevel] || profile.activityLevel },
    { label: 'Goal', value: GOAL_LABELS[profile.goal] || profile.goal },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Data</h1>
          <p className="text-sm text-gray-500">A read-only summary of your profile and health metrics.</p>
        </div>
        <Link to="/profile" className="btn-secondary">
          Edit Profile
        </Link>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="BMI" value={metrics.bmi} unit={metrics.bmiCategory} accent="primary" />
          <StatCard label="BMR" value={metrics.bmr} unit="kcal/day" accent="sky" />
          <StatCard label="TDEE" value={metrics.tdee} unit="kcal/day" accent="amber" />
          <StatCard label="Daily Target" value={metrics.recommendedCalories} unit="kcal" accent="rose" />
        </div>
      )}

      <div className="card">
        <dl className="divide-y divide-gray-100">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-3 text-sm">
              <dt className="font-medium text-gray-500">{row.label}</dt>
              <dd className="text-gray-800">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default UserData;
