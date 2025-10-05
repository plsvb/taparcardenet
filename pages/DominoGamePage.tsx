import React from 'react';
import { Link } from 'react-router-dom';

const DominoGamePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white font-mono animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">Domino Game</h1>
      <p className="text-xl text-gray-400 mb-8">This game is coming soon!</p>
      <Link 
        to="/"
        className="bg-cyan-500 text-gray-900 font-bold text-xl py-3 px-8 rounded-lg shadow-[0_0_15px_3px] shadow-cyan-500/50 hover:bg-cyan-400 transform hover:scale-105 transition-all duration-300"
      >
        Back to Arcade
      </Link>
    </div>
  );
};

export default DominoGamePage;
