import React from 'react';

interface GameOverScreenProps {
  winner: string;
  score: { player1: number; player2: number };
  onRestart: () => void;
  // FIX: Add onMainMenu to props to allow returning to menu
  onMainMenu: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ winner, score, onRestart, onMainMenu }) => (
  <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white font-mono z-20 animate-fade-in">
    <h2 className="text-6xl font-bold animate-pulse">{winner} Wins!</h2>
    <p className="text-3xl mt-4 mb-8">
      Final Score: {score.player1} - {score.player2}
    </p>
    <div className="flex flex-col space-y-4">
      <button
        onClick={onRestart}
        className="bg-cyan-500 text-gray-900 font-bold text-2xl py-4 px-10 rounded-lg shadow-[0_0_20px_5px] shadow-cyan-500/50 hover:bg-cyan-400 hover:shadow-cyan-400/60 transform hover:scale-105 transition-all duration-300"
      >
        Play Again
      </button>
      <button
        onClick={onMainMenu}
        className="bg-pink-500 text-gray-900 font-bold text-2xl py-4 px-10 rounded-lg shadow-[0_0_20px_5px] shadow-pink-500/50 hover:bg-pink-400 hover:shadow-pink-400/60 transform hover:scale-105 transition-all duration-300"
      >
        Main Menu
      </button>
    </div>
  </div>
);

export default GameOverScreen;
