// components/Footer.jsx
// Simple footer shown at the bottom of public and app pages.

import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-primary-50 bg-white py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-center text-sm text-gray-500 sm:flex-row sm:text-left">
        <p>© {year} Nutrition Assistant. All rights reserved.</p>
        <p className="text-xs text-gray-400">
          This app supports healthy living and does not replace professional medical advice.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
