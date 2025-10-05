import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ to, title, description, color, children }) => (
  <Link to={to} className="block group">
    <div className={`
      bg-gray-800 p-6 rounded-lg border border-gray-700
      transition-all duration-300 transform
      hover:scale-105 hover:border-${color}-500 hover:shadow-2xl hover:shadow-${color}-500/30
    `}>
      <div className={`w-full h-40 bg-${color}-500 rounded-md mb-4 flex items-center justify-center`}>
        {children}
      </div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 mt-2">{description}</p>
    </div>
  </Link>
);


const HomePage: React.FC = () => {
  return (
    <main className="flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <GameCard 
          to="/pingpong"
          title="Ping Pong Pong"
          description="A classic arcade game with a twist of realistic gravity and spin physics."
          color="cyan"
        >
            <svg className="w-20 h-20 text-gray-900 opacity-80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="12" fill="currentColor"/>
              <rect x="15" y="25" width="10" height="50" rx="5" fill="currentColor" />
              <rect x="75" y="25" width="10" height="50" rx="5" fill="currentColor" />
          </svg>
        </GameCard>
        
        <GameCard 
          to="/domino"
          title="Dominoes"
          description="The classic tile-based game. Matching tiles has never been more fun. (Coming Soon!)"
          color="yellow"
        >
          <svg className="w-16 h-16 text-gray-900 opacity-80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" y="15" width="50" height="70" rx="10" fill="currentColor" />
              <line x1="30" y1="50" x2="70" y2="50" stroke="#1f2937" strokeWidth="4" />
              <circle cx="50" cy="35" r="6" fill="#1f2937" />
              <circle cx="40" cy="65" r="6" fill="#1f2937" />
              <circle cx="60" cy="65" r="6" fill="#1f2937" />
          </svg>
        </GameCard>
      </div>
    </main>
  );
};

export default HomePage;