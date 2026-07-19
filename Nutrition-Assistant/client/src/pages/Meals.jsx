// pages/Meals.jsx
// Meal tracking page: log new meals (with food search) and view/delete history.

import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';
import api from '../services/api';
import MealCard from '../components/MealCard';
import Loader from '../components/Loader';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snacks'];

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [mealType, setMealType] = useState('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]); // [{ food, name, quantity }]
  const [submitting, setSubmitting] = useState(false);

  const fetchMeals = useCallback(async () => {
    try {
      const { data } = await api.get('/meals');
      setMeals(data.meals);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load meals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const { data } = await api.get('/foods/search', { params: { q: searchQuery } });
      setSearchResults(data.foods);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Food search failed');
    }
  };

  const addFood = (food) => {
    setSelectedFoods((prev) => {
      const existing = prev.find((f) => f.food === food._id);
      if (existing) {
        return prev.map((f) => (f.food === food._id ? { ...f, quantity: f.quantity + 1 } : f));
      }
      return [...prev, { food: food._id, name: food.name, quantity: 1 }];
    });
  };

  const updateQuantity = (foodId, quantity) => {
    setSelectedFoods((prev) =>
      prev.map((f) => (f.food === foodId ? { ...f, quantity: Math.max(0.1, quantity) } : f))
    );
  };

  const removeFood = (foodId) => {
    setSelectedFoods((prev) => prev.filter((f) => f.food !== foodId));
  };

  const resetForm = () => {
    setMealType('breakfast');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedFoods([]);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFoods.length === 0) {
      toast.error('Add at least one food item to log this meal');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/meals', {
        mealType,
        foods: selectedFoods.map(({ food, quantity }) => ({ food, quantity })),
      });
      toast.success('Meal logged successfully');
      resetForm();
      fetchMeals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log meal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/meals/${id}`);
      toast.success('Meal deleted');
      setMeals((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete meal');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Meals</h1>
          <p className="text-sm text-gray-500">Log and review your meal history.</p>
        </div>
        <button type="button" onClick={() => setShowForm((prev) => !prev)} className="btn-primary">
          <FiPlus /> {showForm ? 'Close' : 'Log Meal'}
        </button>
      </div>

      {showForm && (
        <div className="card flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Meal Type</label>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMealType(type)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                    mealType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search foods (e.g. banana, rice, chicken)"
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-secondary">
              Search
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {searchResults.map((food) => (
                <button
                  key={food._id}
                  type="button"
                  onClick={() => addFood(food)}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-left text-sm hover:bg-primary-50"
                >
                  <span>{food.name}</span>
                  <span className="text-xs text-gray-400">{food.calories} kcal</span>
                </button>
              ))}
            </div>
          )}

          {selectedFoods.length > 0 && (
            <div className="flex flex-col gap-2 rounded-lg bg-primary-50 p-3">
              <p className="text-xs font-semibold uppercase text-primary-700">Selected Foods</p>
              {selectedFoods.map((f) => (
                <div key={f.food} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex-1">{f.name}</span>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={f.quantity}
                    onChange={(e) => updateQuantity(f.food, Number(e.target.value))}
                    className="w-20 rounded-md border border-gray-200 px-2 py-1 text-sm"
                  />
                  <button type="button" onClick={() => removeFood(f.food)} className="text-red-500">
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary self-start"
          >
            {submitting ? 'Saving...' : 'Save Meal'}
          </button>
        </div>
      )}

      {loading ? (
        <Loader label="Loading meals..." />
      ) : meals.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">
          No meals logged yet. Use "Log Meal" above to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <MealCard key={meal._id} meal={meal} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Meals;
