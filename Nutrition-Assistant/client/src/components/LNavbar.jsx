// components/LNavbar.jsx
// Navbar used on the public Landing page (before login).

import React from 'react';
import { Link } from 'react-router-dom';

const LNavbar = () => {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-primary-700">
        <span className="text-2xl">🥗</span> Nutrition Assistant
      </Link>
      <div className="flex items-center gap-3">
        <Link to="/login" className="btn-secondary !px-4 !py-2">
          Login
        </Link>
        <Link to="/register" className="btn-primary !px-4 !py-2">
          Get Started
        </Link>
      </div>
    </header>
  );
};

export default LNavbar;
