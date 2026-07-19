// components/SuggestionCard.jsx
// Displays a single saved nutrition suggestion.

import React from 'react';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';

const SuggestionCard = ({ suggestion, onEdit, onDelete }) => {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold capitalize text-primary-700">
          {suggestion.category.replace('_', ' ')}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(suggestion.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>

      <p className="whitespace-pre-line text-sm text-gray-600">{suggestion.suggestionText}</p>

      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(suggestion)}
              className="rounded-lg p-2 text-primary-600 hover:bg-primary-50"
              aria-label="Edit suggestion"
            >
              <FiEdit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(suggestion._id)}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
              aria-label="Delete suggestion"
            >
              <FiTrash2 size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestionCard;
