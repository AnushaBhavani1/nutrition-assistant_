// components/FoodCard.jsx
// Displays a single food item result used in the Food Search page.

import React from 'react';
import { FiPlusCircle } from 'react-icons/fi';

const FoodCard = ({ food, onAdd }) => {
  return (
    <div className="card flex items-center justify-between gap-4">
      <div>
        <h4 className="font-semibold text-gray-800">{food.name}</h4>
        <p className="text-xs text-gray-400">
          {food.servingSize} · {food.category}
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
          <span>🔥 {food.calories} kcal</span>
          <span>🥩 {food.protein}g protein</span>
          <span>🍞 {food.carbs}g carbs</span>
          <span>🥑 {food.fat}g fat</span>
        </div>
      </div>
      {onAdd && (
        <button
          type="button"
          onClick={() => onAdd(food)}
          className="flex items-center gap-1 rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
        >
          <FiPlusCircle size={16} /> Add
        </button>
      )}
    </div>
  );
};

export default FoodCard;
