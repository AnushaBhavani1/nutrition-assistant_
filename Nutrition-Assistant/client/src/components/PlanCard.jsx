// components/PlanCard.jsx
// Displays a single diet plan summary card.

import React from 'react';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';

const GOAL_LABELS = {
  weight_loss: 'Weight Loss',
  weight_gain: 'Weight Gain',
  maintenance: 'Maintenance',
};

const STATUS_COLORS = {
  active: 'bg-primary-100 text-primary-700',
  completed: 'bg-sky-100 text-sky-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

const PlanCard = ({ plan, onEdit, onDelete }) => {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-800">{plan.title}</h3>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[plan.status] || ''}`}>
          {plan.status}
        </span>
      </div>
      <p className="text-sm text-gray-500">{GOAL_LABELS[plan.goal] || plan.goal}</p>
      {plan.targetCalories && <p className="text-xs text-gray-400">Target: {plan.targetCalories} kcal/day</p>}
      <p className="text-xs text-gray-400">
        {new Date(plan.startDate).toLocaleDateString()} → {new Date(plan.endDate).toLocaleDateString()}
      </p>
      {plan.description && <p className="text-sm text-gray-600">{plan.description}</p>}

      {(onEdit || onDelete) && (
        <div className="mt-auto flex justify-end gap-2 border-t border-gray-100 pt-3">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(plan)}
              className="rounded-lg p-2 text-primary-600 hover:bg-primary-50"
              aria-label="Edit plan"
            >
              <FiEdit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(plan._id)}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
              aria-label="Delete plan"
            >
              <FiTrash2 size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanCard;
