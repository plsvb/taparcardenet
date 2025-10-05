import React from 'react';

const RotateDevice: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center text-white font-mono z-50">
      <svg
        className="w-24 h-24 mb-4 transform rotate-90 animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        ></path>
      </svg>
      <h2 className="text-3xl font-bold">Please Rotate Your Device</h2>
      <p className="text-lg mt-2 text-gray-400">This game is best played in landscape mode.</p>
    </div>
  );
};

export default RotateDevice;
