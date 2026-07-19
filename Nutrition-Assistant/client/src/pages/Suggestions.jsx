// pages/Suggestions.jsx
// Generate rule-based nutrition suggestions, view saved ones, edit or delete them.
// Complements the AI Assistant chat: suggestions here are instant and persisted.

import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiZap, FiTrash2, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import api from '../services/api';
import Loader from '../components/Loader';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'weight_gain', label: 'Weight Gain' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'diabetic', label: 'Diabetic' },
  { value: 'high_protein', label: 'High Protein' },
];

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('general');
  const [generating, setGenerating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

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

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.post('/suggestions', { category });
      toast.success('New suggestion generated');
      fetchSuggestions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate suggestion');
    } finally {
      setGenerating(false);
    }
  };

  const startEdit = (suggestion) => {
    setEditingId(suggestion._id);
    setEditText(suggestion.suggestionText);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/suggestions/${id}`, { suggestionText: editText });
      toast.success('Suggestion updated');
      cancelEdit();
      fetchSuggestions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update suggestion');
    }
  };

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
      <div>
        <h1 className="page-title">Nutrition Suggestions</h1>
        <p className="text-sm text-gray-500">
          Generate personalized suggestions and revisit them anytime. For open-ended questions,
          try the AI Assistant instead.
        </p>
      </div>

      <div className="card flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={handleGenerate} disabled={generating} className="btn-primary">
          <FiZap /> {generating ? 'Generating...' : 'Generate Suggestion'}
        </button>
      </div>

      {loading ? (
        <Loader label="Loading suggestions..." />
      ) : suggestions.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">
          No suggestions saved yet. Generate one above.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {suggestions.map((s) => (
            <div key={s._id} className="card flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold capitalize text-primary-700">
                  {s.category.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(s.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {editingId === s._id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={5}
                  className="input-field"
                />
              ) : (
                <p className="whitespace-pre-line text-sm text-gray-600">{s.suggestionText}</p>
              )}

              <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                {editingId === s._id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEdit(s._id)}
                      className="rounded-lg p-2 text-primary-600 hover:bg-primary-50"
                      aria-label="Save"
                    >
                      <FiCheck size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                      aria-label="Cancel"
                    >
                      <FiX size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(s)}
                      className="rounded-lg p-2 text-primary-600 hover:bg-primary-50"
                      aria-label="Edit suggestion"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s._id)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      aria-label="Delete suggestion"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suggestions;
