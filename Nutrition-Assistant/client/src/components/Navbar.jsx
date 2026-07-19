// components/Navbar.jsx
// Top navigation bar shown on authenticated (app) pages.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary-50 bg-white/90 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-primary-700 hover:bg-primary-50 md:hidden"
          aria-label="Toggle sidebar"
        >
          <FiMenu size={22} />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2 font-extrabold text-primary-700">
          <span className="text-xl">🥗</span>
          <span className="hidden text-lg sm:inline">Nutrition Assistant</span>
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full border border-primary-100 px-3 py-1.5 hover:bg-primary-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
            {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
          </span>
          <span className="hidden text-sm font-medium text-gray-700 sm:inline">
            {user?.name || 'Account'}
          </span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50"
            >
              <FiUser /> Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
