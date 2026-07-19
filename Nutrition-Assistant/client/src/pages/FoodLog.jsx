// pages/FoodLog.jsx
// Daily food log: search a food, add it with a serving size/quantity, and
// view/edit/delete logged entries. Backed by the FoodLog model and the
// /api/foods/log endpoints (distinct from the multi-food Meal/"Meals" page).

import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiPlus, FiTrash2, FiClock } from 'react-icons/fi';
import api from '../services/api';
import Loader from '../components/Loader';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snacks'];

const FoodLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mealType, setMealType] = useState('breakfast');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);

  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await api.get('/foods/log');
      setLogs(data.logs);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load food log');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const { data } = await api.get('/foods/search', { params: { q: query } });
      setResults(data.foods);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Food search failed');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedFood) {
      toast.error('Select a food from search results first');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/foods/log', {
        food: selectedFood._id,
        quantity: Number(quantity) || 1,
        mealType,
        servingSize: selectedFood.servingSize,
      });
      toast.success('Food added to log');
      setSelectedFood(null);
      setQuantity(1);
      setResults([]);
      setQuery('');
      fetchLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add food to log');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (log) => {
    setEditingId(log._id);
    setEditQuantity(log.quantity);
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/foods/log/${id}`, { quantity: Number(editQuantity) || 1 });
      toast.success('Log entry updated');
      setEditingId(null);
      fetchLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update log entry');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/foods/log/${id}`);
      toast.success('Log entry deleted');
      setLogs((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete log entry');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="page-title">Food Log</h1>
        <p className="text-sm text-gray-500">Search a food and log it with a serving size.</p>
      </div>

      <div className="card flex flex-col gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search foods (e.g. banana, rice, chicken)"
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-secondary">
            Search
          </button>
        </form>

        {results.length > 0 && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {results.map((food) => (
              <button
                key={food._id}
                type="button"
                onClick={() => setSelectedFood(food)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm ${
                  selectedFood?._id === food._id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-100 hover:bg-primary-50'
                }`}
              >
                <span>{food.name}</span>
                <span className="text-xs text-gray-400">{food.calories} kcal</span>
              </button>
            ))}
          </div>
        )}

        {selectedFood && (
          <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3 rounded-lg bg-primary-50 p-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Food</label>
              <p className="text-sm font-semibold text-gray-800">{selectedFood.name}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Quantity</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-24 rounded-md border border-gray-200 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Meal</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="rounded-md border border-gray-200 px-2 py-1.5 text-sm capitalize"
              >
                {MEAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary !px-4 !py-2">
              <FiPlus /> {submitting ? 'Adding...' : 'Add to Log'}
            </button>
          </form>
        )}
      </div>

      {loading ? (
        <Loader label="Loading your food log..." />
      ) : logs.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">No food logged yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map((log) => (
            <div key={log._id} className="card flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-gray-800">
                  {log.foodName} <span className="text-xs capitalize text-gray-400">· {log.mealType}</span>
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-400">
                  <FiClock size={12} />
                  {new Date(log.logDate).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>🔥 {log.calories} kcal</span>
                <span>🥩 {log.protein}g</span>
                <span>🍞 {log.carbs}g</span>
                <span>🥑 {log.fat}g</span>
                <span>🌾 {log.fiber}g</span>
              </div>

              <div className="flex items-center gap-2">
                {editingId === log._id ? (
                  <>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      className="w-20 rounded-md border border-gray-200 px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(log._id)}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-primary-700 hover:bg-primary-50"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(log)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-primary-700 hover:bg-primary-50"
                  >
                    Qty: {log.quantity}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(log._id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  aria-label="Delete log entry"
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

export default FoodLog;
