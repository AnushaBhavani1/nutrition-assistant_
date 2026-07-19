// components/StatCard.jsx
// Reusable stat card used across the Dashboard for calories, protein, BMI, etc.

import React from 'react';

// Tailwind needs literal class names to detect them at build time, so we
// map the "accent" prop to full, static class strings instead of
// interpolating the color name directly.
const ACCENT_CLASSES = {
  primary: 'bg-primary-100 text-primary-600',
  amber: 'bg-amber-100 text-amber-600',
  sky: 'bg-sky-100 text-sky-600',
  rose: 'bg-rose-100 text-rose-600',
};

const StatCard = ({ icon: Icon, label, value, unit, accent = 'primary', progress }) => {
  const accentClass = ACCENT_CLASSES[accent] || ACCENT_CLASSES.primary;

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {Icon && (
          <span className={`rounded-full p-2 ${accentClass}`}>
            <Icon size={18} />
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
      {typeof progress === 'number' && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-primary-500 transition-all"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default StatCard;
