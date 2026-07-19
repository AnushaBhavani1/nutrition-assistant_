// pages/Register.jsx
// Registration page for new users, including basic health profile fields.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import UnavBar from '../components/UnavBar';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
  age: '',
  gender: 'male',
  height: '',
  weight: '',
  goal: 'maintain_weight',
  activityLevel: 'moderate',
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        age: formData.age ? Number(formData.age) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
      };
      await register(payload);
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-50 px-4 py-10">
      <div className="w-full max-w-2xl">
        <UnavBar />

        <div className="card">
          <h1 className="page-title mb-1">Create your account</h1>
          <p className="mb-6 text-sm text-gray-500">
            Tell us a bit about yourself so we can personalize your nutrition plan.
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="input-field"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="28"
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                name="height"
                min="0"
                value={formData.height}
                onChange={handleChange}
                placeholder="170"
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                min="0"
                value={formData.weight}
                onChange={handleChange}
                placeholder="65"
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Goal</label>
              <select name="goal" value={formData.goal} onChange={handleChange} className="input-field">
                <option value="weight_loss">Weight Loss</option>
                <option value="weight_gain">Weight Gain</option>
                <option value="maintain_weight">Maintain Weight</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Activity Level</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="input-field"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary sm:col-span-2 mt-2">
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-700 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
