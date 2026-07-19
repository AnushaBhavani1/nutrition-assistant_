// components/Sidebar.jsx
// Left-hand navigation used across authenticated app pages.

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiCoffee,
  FiBookOpen,
  FiSearch,
  FiUser,
  FiMessageCircle,
  FiX,
  FiClipboard,
  FiZap,
  FiBarChart2,
  FiActivity,
} from 'react-icons/fi';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/food-log', label: 'Food Log', icon: FiCoffee },
  { to: '/meals', label: 'Meals', icon: FiCoffee },
  { to: '/diet-plans', label: 'Diet Plans', icon: FiClipboard },
  { to: '/suggestions', label: 'Suggestions', icon: FiZap },
  { to: '/recipes', label: 'Recipes', icon: FiBookOpen },
  { to: '/food-search', label: 'Food Search', icon: FiSearch },
  { to: '/reports', label: 'Reports', icon: FiBarChart2 },
  { to: '/ai-assistant', label: 'AI Assistant', icon: FiMessageCircle },
  { to: '/user-data', label: 'Health Data', icon: FiActivity },
  { to: '/profile', label: 'Profile', icon: FiUser },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-primary-50 bg-white transition-transform duration-200 ease-in-out md:sticky md:top-16 md:z-0 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 md:hidden">
          <span className="font-bold text-primary-700">Menu</span>
          <button type="button" onClick={onClose} aria-label="Close sidebar">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-card'
                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
