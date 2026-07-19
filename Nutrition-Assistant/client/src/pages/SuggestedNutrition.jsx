// pages/SuggestedNutrition.jsx
// List view of the logged-in user's saved nutrition suggestions, using the
// SuggestionCard component. To generate a new one, see NewSuggestion.jsx.

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiZap } from 'react-icons/fi';
import api from '../services/api';
import SuggestionCard from '../components/SuggestionCard';
import Loader from '../components/Loader';

const SuggestedNutrition = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = useCallback(async () => {
    try {
      const { data } = await api.get('/suggestions');
      setSuggestions(data.suggestions);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/suggestions/${id}`);
      toast.success('Suggestion deleted');
      setSuggestions((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete suggestion');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Suggested Nutrition</h1>
          <p className="text-sm text-gray-500">Your saved nutrition suggestions.</p>
        </div>
        <Link to="/suggestions/new" className="btn-primary">
          <FiZap /> New Suggestion
        </Link>
      </div>

      {loading ? (
        <Loader label="Loading suggestions..." />
      ) : suggestions.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">
          No suggestions saved yet.{' '}
          <Link to="/suggestions/new" className="font-semibold text-primary-700 hover:underline">
            Generate one
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {suggestions.map((s) => (
            <SuggestionCard key={s._id} suggestion={s} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedNutrition;
