// pages/NewPlan.jsx
// Dedicated standalone page for creating a new diet plan.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const EMPTY_FORM = {
  title: '',
  goal: 'weight_loss',
  targetCalories: '',
  description: '',
  startDate: '',
  endDate: '',
};

const NewPlan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EMPTY_FORM);
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
        targetCalories: formData.targetCalories ? Number(formData.targetCalories) : undefined,
      };
      await api.post('/plans', payload);
      toast.success('Diet plan created');
      navigate('/plans');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create diet plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="page-title">New Diet Plan</h1>
        <p className="text-sm text-gray-500">Set a goal, target calories, and a date range.</p>
      </div>

      <form onSubmit={handleSubmit} className="card grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Summer Weight Loss Plan"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Goal</label>
          <select name="goal" value={formData.goal} onChange={handleChange} className="input-field">
            <option value="weight_loss">Weight Loss</option>
            <option value="weight_gain">Weight Gain</option>
            <option value="maintenance">Maintain Weight</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Target Calories (optional)</label>
          <input
            type="number"
            name="targetCalories"
            min="0"
            value={formData.targetCalories}
            onChange={handleChange}
            placeholder="1800"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            required
            value={formData.startDate}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            required
            value={formData.endDate}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Description (optional)</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Notes about this plan..."
            className="input-field"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary sm:col-span-2">
          {submitting ? 'Creating...' : 'Create Plan'}
        </button>
      </form>
    </div>
  );
};

export default NewPlan;
