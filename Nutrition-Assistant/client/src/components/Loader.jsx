// components/Loader.jsx
// Simple reusable loading spinner.

import React from 'react';

const Loader = ({ fullScreen = false, label = 'Loading...' }) => {
  const wrapperClass = fullScreen
    ? 'flex min-h-[60vh] w-full flex-col items-center justify-center gap-3'
    : 'flex w-full flex-col items-center justify-center gap-3 py-10';

  return (
    <div className={wrapperClass}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
      <p className="text-sm font-medium text-primary-700">{label}</p>
    </div>
  );
};

export default Loader;
