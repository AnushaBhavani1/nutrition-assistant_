// components/MealCard.jsx
// Displays a single logged meal with its foods and nutrition totals.

import React from 'react';
import { FiTrash2, FiClock } from 'react-icons/fi';

const MEAL_TYPE_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
};

const MEAL_TYPE_COLORS = {
  breakfast: 'bg-amber-100 text-amber-700',
  lunch: 'bg-primary-100 text-primary-700',
  dinner: 'bg-sky-100 text-sky-700',
  snacks: 'bg-rose-100 text-rose-700',
};

const MealCard = ({ meal, onDelete }) => {
  const badgeClass = MEAL_TYPE_COLORS[meal.mealType] || 'bg-gray-100 text-gray-700';

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {MEAL_TYPE_LABELS[meal.mealType] || meal.mealType}
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <FiClock size={14} />
          {new Date(meal.mealDate).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      <ul className="flex flex-col gap-1">
        {meal.foods.map((item) => (
          <li key={`${item.food}-${item.name}`} className="flex justify-between text-sm text-gray-600">
            <span>
              {item.name} <span className="text-gray-400">x{item.quantity}</span>
            </span>
            <span className="font-medium text-gray-700">{item.calories} kcal</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex gap-4 text-xs text-gray-500">
          <span>🔥 {meal.totalCalories} kcal</span>
          <span>🥩 {meal.totalProtein}g</span>
          <span>🍞 {meal.totalCarbs}g</span>
          <span>🥑 {meal.totalFat}g</span>
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(meal._id)}
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
            aria-label="Delete meal"
          >
            <FiTrash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MealCard;
