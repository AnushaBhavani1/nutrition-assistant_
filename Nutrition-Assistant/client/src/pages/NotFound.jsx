// pages/NotFound.jsx
// 404 page shown for unknown routes.

import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary-50 px-4 text-center">
      <span className="text-6xl">🥦</span>
      <h1 className="text-3xl font-extrabold text-primary-900">404 - Page Not Found</h1>
      <p className="max-w-md text-gray-500">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
