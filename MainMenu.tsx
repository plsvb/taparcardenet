import React from 'react';
import { Link } from 'react-router-dom';
import { GameMode, GameSpeed } from '../types';
import Instructions from './Instructions';

interface MainMenuProps {
  onStartGame: (mode: GameMode) => void;
  gameSpeed: GameSpeed;
  onSetGameSpeed: (speed: GameSpeed) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, gameSpeed, onSetGameSpeed }) => {
  const isTouchDevice = 'ontouchstart' in window;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center font-mono text-white text-center p-4">
      <h1 className="text-6xl font-bold mb-4" style={{ textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>
        Gravity Table Tennis
      </h1>
      <p className="text-lg text-gray-400 mb-8 max-w-lg">
        A classic table tennis game with a twist of realistic gravity. Outsmart the opponent in single or two-player mode. First to 5 points wins!
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-300">Game Speed</h2>
        <div className="flex justify-center space-x-4">
          {(['slow', 'normal', 'fast'] as GameSpeed[]).map((speed) => {
            const isSelected = gameSpeed === speed;
            const selectedClasses = 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/50';
            const unselectedClasses = 'bg-gray-700 text-white hover:bg-gray-600';
            return (
              <button
                key={speed}
                onClick={() => onSetGameSpeed(speed)}
                className={`font-bold text-lg py-2 px-6 rounded-lg capitalize transition-all duration-200 transform hover:scale-105 ${isSelected ? selectedClasses : unselectedClasses}`}
              >
                {speed}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
        <button
          onClick={() => onStartGame('vsCPU')}
          className="bg-cyan-500 text-gray-900 font-bold text-2xl py-4 px-10 rounded-lg shadow-[0_0_20px_5px] shadow-cyan-500/50 hover:bg-cyan-400 hover:shadow-cyan-400/60 transform hover:scale-105 transition-all duration-300"
        >
          Player vs. Computer
        </button>
        <button
          onClick={() => onStartGame('vsPlayer')}
          className="bg-pink-500 text-gray-900 font-bold text-2xl py-4 px-10 rounded-lg shadow-[0_0_20px_5px] shadow-pink-500/50 hover:bg-pink-400 hover:shadow-pink-400/60 transform hover:scale-105 transition-all duration-300"
        >
          Player vs. Player
        </button>
      </div>

      <div className="mt-12 mb-4">
        <Link 
          to="/"
          className="text-gray-400 hover:text-white hover:underline transition-colors duration-200 text-lg"
        >
          &larr; Back to Arcade
        </Link>
      </div>

      <Instructions gameMode={'vsPlayer'} isTouchDevice={isTouchDevice} />
    </div>
  );
};

export default MainMenu;