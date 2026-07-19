// pages/FoodSearch.jsx
// Standalone food database search page (browse & search foods by name/category).

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';
import api from '../services/api';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';

const CATEGORIES = [
  'all',
  'fruits',
  'vegetables',
  'grains',
  'protein',
  'dairy',
  'snacks',
  'beverages',
  'other',
];

const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFoods = async () => {
    setLoading(true);
    try {
      if (query.trim()) {
        const { data } = await api.get('/foods/search', { params: { q: query } });
        setFoods(data.foods);
      } else {
        const params = category !== 'all' ? { category } : {};
        const { data } = await api.get('/foods', { params });
        setFoods(data.foods);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loadFoods();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="page-title">Food Search</h1>
        <p className="text-sm text-gray-500">Browse the food database or search for a specific item.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search foods by name..."
            className="input-field pl-10"
          />
        </div>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setQuery('');
              setCategory(cat);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              category === cat
                ? 'bg-primary-600 text-white'
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading foods..." />
      ) : foods.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">No foods found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {foods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodSearch;
