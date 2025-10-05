import React from 'react';
import { GameMode } from '../types';

interface InstructionsProps {
  gameMode: GameMode;
  isTouchDevice: boolean;
}

const Instructions: React.FC<InstructionsProps> = ({ gameMode, isTouchDevice }) => {
  if (isTouchDevice) {
    return (
      <div className="mt-8 text-center text-gray-400 flex flex-col items-center space-y-4">
        <div className="flex justify-center space-x-16">
          <div>
            <h3 className="font-bold text-cyan-400">Player 1</h3>
            <p>Drag on Left Side</p>
          </div>
          <div>
            <h3 className="font-bold text-pink-500">Player 2</h3>
            {gameMode === 'vsCPU' ? (
              <p>AI Controlled</p>
            ) : (
              <p>Drag on Right Side</p>
            )}
          </div>
        </div>
        <p className="mt-2 font-semibold text-gray-200">Tap Screen to Serve</p>
      </div>
    );
  }

  return (
    <div className="mt-8 text-center text-gray-400 flex flex-col items-center space-y-4">
      <div className="flex justify-center space-x-16">
        <div>
          <h3 className="font-bold text-cyan-400">Player 1</h3>
          <p>W - Up</p>
          <p>S - Down</p>
          <p>A - Left</p>
          <p>D - Right</p>
        </div>
        <div>
          <h3 className="font-bold text-pink-500">Player 2</h3>
          {gameMode === 'vsCPU' ? (
            <p>AI Controlled</p>
          ) : (
            <>
              <p>↑ - Up</p>
              <p>↓ - Down</p>
              <p>← - Left</p>
              <p>→ - Right</p>
            </>
          )}
        </div>
      </div>
       <div className="mt-4">
        <p className="font-semibold text-gray-200">Spacebar or Click to Serve</p>
      </div>
    </div>
  );
};

export default Instructions;