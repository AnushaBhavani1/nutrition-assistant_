// components/UnavBar.jsx
// Minimal navbar shown on unauthenticated pages (Login/Register) — just a
// logo linking back to the landing page.

import React from 'react';
import { Link } from 'react-router-dom';

const UnavBar = () => {
  return (
    <header className="flex justify-center py-6">
      <Link to="/" className="text-2xl font-extrabold text-primary-700">
        🥗 Nutrition Assistant
      </Link>
    </header>
  );
};

export default UnavBar;
