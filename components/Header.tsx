import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6">
      <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
        AI Zoom Background Generator
      </h1>
      <p className="mt-2 text-md md:text-lg text-gray-400">
        Create your perfect, professional background for free.
      </p>
    </header>
  );
};

export default Header;
