
import React from 'react';

interface HeaderProps {
  onSubscribeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSubscribeClick }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        <span className="text-2xl text-green-600 dark:text-green-400 mr-2">🌱</span>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Farmer Support Chatbot
        </h1>
      </div>
      <button
        onClick={onSubscribeClick}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
      >
        Subscribe for Alerts
      </button>
    </header>
  );
};

export default Header;
