// pages/NewSuggestion.jsx
// Dedicated standalone page for generating a new nutrition suggestion.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiZap } from 'react-icons/fi';
import api from '../services/api';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'weight_gain', label: 'Weight Gain' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'diabetic', label: 'Diabetic' },
  { value: 'high_protein', label: 'High Protein' },
];

const NewSuggestion = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('general');
  const [prompt, setPrompt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/suggestions', { category, prompt });
      setPreview(data.suggestion);
      toast.success('Suggestion generated and saved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate suggestion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="page-title">New Suggestion</h1>
        <p className="text-sm text-gray-500">
          Generate an instant, rule-based nutrition suggestion tailored to a category.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="card flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Notes (optional)</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Any extra context, e.g. 'vegetarian', 'low budget'..."
            className="input-field"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary self-start">
          <FiZap /> {submitting ? 'Generating...' : 'Generate Suggestion'}
        </button>
      </form>

      {preview && (
        <div className="card">
          <h2 className="mb-2 font-semibold text-gray-800">Preview</h2>
          <p className="whitespace-pre-line text-sm text-gray-600">{preview.suggestionText}</p>
          <button
            type="button"
            onClick={() => navigate('/suggested-nutrition')}
            className="btn-secondary mt-4"
          >
            View All Suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default NewSuggestion;
