// components/RecipeCard.jsx
// Displays a recipe summary card used in the Recipes page.

import React from 'react';
import { FiClock, FiBarChart2 } from 'react-icons/fi';

const DIFFICULTY_COLORS = {
  easy: 'bg-primary-100 text-primary-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700',
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=60';

const RecipeCard = ({ recipe, onClick }) => {
  const badgeClass = DIFFICULTY_COLORS[recipe.difficulty] || 'bg-gray-100 text-gray-700';

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(recipe)}
      className="card group flex flex-col overflow-hidden p-0 text-left transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="h-40 w-full overflow-hidden">
        <img
          src={recipe.image || FALLBACK_IMAGE}
          alt={recipe.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{recipe.title}</h3>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
            {recipe.difficulty}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-gray-500">{recipe.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FiClock size={14} /> {recipe.prepTime} min
          </span>
          <span className="flex items-center gap-1">
            <FiBarChart2 size={14} /> {recipe.calories} kcal
          </span>
        </div>
      </div>
    </button>
  );
};

export default RecipeCard;
