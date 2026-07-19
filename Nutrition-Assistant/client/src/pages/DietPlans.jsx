// pages/DietPlans.jsx
// Create, view, update, and delete diet plans (weight loss / gain / maintenance).

import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';
import api from '../services/api';
import Loader from '../components/Loader';

const GOAL_LABELS = {
  weight_loss: 'Weight Loss',
  weight_gain: 'Weight Gain',
  maintenance: 'Maintenance',
};

const STATUS_COLORS = {
  active: 'bg-primary-100 text-primary-700',
  completed: 'bg-sky-100 text-sky-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

const EMPTY_FORM = {
  title: '',
  goal: 'weight_loss',
  targetCalories: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'active',
};

const DietPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchPlans = useCallback(async () => {
    try {
      const { data } = await api.get('/diet-plans');
      setPlans(data.dietPlans);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load diet plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (plan) => {
    setEditingId(plan._id);
    setFormData({
      title: plan.title,
      goal: plan.goal,
      targetCalories: plan.targetCalories || '',
      description: plan.description || '',
      startDate: plan.startDate ? plan.startDate.split('T')[0] : '',
      endDate: plan.endDate ? plan.endDate.split('T')[0] : '',
      status: plan.status,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        targetCalories: formData.targetCalories ? Number(formData.targetCalories) : undefined,
      };

      if (editingId) {
        await api.put(`/diet-plans/${editingId}`, payload);
        toast.success('Diet plan updated');
      } else {
        await api.post('/diet-plans', payload);
        toast.success('Diet plan created');
      }

      closeForm();
      fetchPlans();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save diet plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/diet-plans/${id}`);
      toast.success('Diet plan deleted');
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete diet plan');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Diet Plans</h1>
          <p className="text-sm text-gray-500">Create and manage your goal-based diet plans.</p>
        </div>
        <button type="button" onClick={openCreateForm} className="btn-primary">
          <FiPlus /> New Plan
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between sm:col-span-2">
            <h2 className="font-semibold text-gray-800">{editingId ? 'Edit Diet Plan' : 'New Diet Plan'}</h2>
            <button type="button" onClick={closeForm} aria-label="Close form">
              <FiX size={20} />
            </button>
          </div>

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
              <option value="maintenance">Maintenance</option>
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

          {editingId && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

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
            {submitting ? 'Saving...' : editingId ? 'Update Plan' : 'Create Plan'}
          </button>
        </form>
      )}

      {loading ? (
        <Loader label="Loading diet plans..." />
      ) : plans.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">
          No diet plans yet. Create one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan._id} className="card flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-800">{plan.title}</h3>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[plan.status]}`}>
                  {plan.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{GOAL_LABELS[plan.goal]}</p>
              {plan.targetCalories && (
                <p className="text-xs text-gray-400">Target: {plan.targetCalories} kcal/day</p>
              )}
              <p className="text-xs text-gray-400">
                {new Date(plan.startDate).toLocaleDateString()} →{' '}
                {new Date(plan.endDate).toLocaleDateString()}
              </p>
              {plan.description && <p className="text-sm text-gray-600">{plan.description}</p>}
              <div className="mt-auto flex justify-end gap-2 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => openEditForm(plan)}
                  className="rounded-lg p-2 text-primary-600 hover:bg-primary-50"
                  aria-label="Edit plan"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(plan._id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  aria-label="Delete plan"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DietPlans;
