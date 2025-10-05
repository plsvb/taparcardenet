import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <Link to="/">
        <h1 className="text-5xl font-bold tracking-widest" style={{ textShadow: '0 0 15px rgba(255,255,255,0.4)' }}>
          TAPARCARDE
        </h1>
        <p className="text-lg text-gray-400 mt-2">Your Retro Arcade Hub</p>
      </Link>
    </header>
  );
};

export default Navbar;
