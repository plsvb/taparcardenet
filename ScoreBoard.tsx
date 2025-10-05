
import React from 'react';

interface ScoreBoardProps {
  score: { player1: number; player2: number };
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center space-x-16 text-white font-bold text-5xl tracking-wider">
      <div className="text-cyan-400" style={{ textShadow: '0 0 10px #22d3ee' }}>
        {score.player1}
      </div>
      <div className="text-pink-500" style={{ textShadow: '0 0 10px #ec4899' }}>
        {score.player2}
      </div>
    </div>
  );
};

export default ScoreBoard;
