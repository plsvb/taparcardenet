import React from 'react';

interface PointScoredNotificationProps {
  scorer: string;
  score: { player1: number; player2: number };
  reason: string;
}

const PointScoredNotification: React.FC<PointScoredNotificationProps> = ({ scorer, score, reason }) => {
  const isPlayer1 = scorer === 'Player 1';
  const colorClass = isPlayer1 ? 'text-cyan-400' : 'text-pink-500';

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white font-mono z-10 animate-fade-in">
      <h2 className={`text-5xl font-bold ${colorClass}`} style={{ textShadow: `0 0 15px var(--tw-shadow-color)`}}>
        {scorer} Scores!
      </h2>
      <p className="text-xl mt-2 text-gray-300">
        {reason}
      </p>
      <p className="text-3xl mt-4">
        {score.player1} - {score.player2}
      </p>
    </div>
  );
};

export default PointScoredNotification;