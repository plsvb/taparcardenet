import React from 'react';
import { GameState } from '../types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  TABLE_Y_POSITION,
  TABLE_HEIGHT,
  NET_WIDTH,
  NET_HEIGHT,
  MAX_VISUAL_SPIN,
} from '../constants';

interface GameCanvasProps {
  gameState: GameState;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
  const { ball, player1, player2, ballTrail } = gameState;

  const ballClasses = 'absolute bg-white rounded-full shadow-[0_0_15px_2px] shadow-white/70';
  const trailClass = 'absolute bg-white rounded-full';
  
  // Normalize spin values for visual effect
  const topspinOpacity = Math.min(1, Math.max(0, ball.spin) / MAX_VISUAL_SPIN);
  const backspinOpacity = Math.min(1, Math.max(0, -ball.spin) / MAX_VISUAL_SPIN);
  const leftSidespinOpacity = Math.min(1, Math.max(0, ball.sideSpin) / MAX_VISUAL_SPIN);
  const rightSidespinOpacity = Math.min(1, Math.max(0, -ball.sideSpin) / MAX_VISUAL_SPIN);

  const spinIndicatorBaseStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    pointerEvents: 'none',
    transition: 'opacity 0.1s ease-out',
  };

  return (
    <div
      className="relative bg-black bg-opacity-50 border-2 border-gray-700 cursor-pointer overflow-hidden"
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
    >
      {/* Table */}
      <div
        className="absolute bottom-0 bg-gray-600"
        style={{
          left: 0,
          width: '100%',
          height: `${GAME_HEIGHT - TABLE_Y_POSITION}px`,
          bottom: 0,
        }}
      />
      <div
        className="absolute bg-gray-400"
        style={{
          left: 0,
          top: `${TABLE_Y_POSITION}px`,
          width: '100%',
          height: `${TABLE_HEIGHT}px`,
        }}
      />
      {/* Net */}
      <div
        className="absolute bg-white shadow-[0_0_8px_1px] shadow-white/50"
        style={{
          left: `${GAME_WIDTH / 2 - NET_WIDTH / 2}px`,
          top: `${TABLE_Y_POSITION - NET_HEIGHT}px`,
          width: `${NET_WIDTH}px`,
          height: `${NET_HEIGHT}px`,
        }}
      />

      {/* Player 1 Paddle */}
      <div
        className="absolute bg-cyan-400 rounded-sm shadow-[0_0_15px_2px] shadow-cyan-400/70"
        style={{
          left: `${player1.pos.x}px`,
          top: `${player1.pos.y}px`,
          width: `${player1.size.x}px`,
          height: `${player1.size.y}px`,
        }}
      />

      {/* Player 2 Paddle */}
      <div
        className="absolute bg-pink-500 rounded-sm shadow-[0_0_15px_2px] shadow-pink-500/70"
        style={{
          left: `${player2.pos.x}px`,
          top: `${player2.pos.y}px`,
          width: `${player2.size.x}px`,
          height: `${player2.size.y}px`,
        }}
      />
      
      {/* Ball Trail */}
      {ballTrail.map((pos, index) => {
        const trailSize = ball.radius * 2 * (index / ballTrail.length);
        const opacity = 0.4 * (index / ballTrail.length);
        return (
          <div
            key={index}
            className={trailClass}
            style={{
              left: `${pos.x - trailSize / 2}px`,
              top: `${pos.y - trailSize / 2}px`,
              width: `${trailSize}px`,
              height: `${trailSize}px`,
              opacity: opacity,
              transition: 'opacity 0.1s, width 0.1s, height 0.1s'
            }}
          />
        );
      })}

      {/* Ball and Spin Indicators Container */}
      <div
        className="absolute"
        style={{
          left: `${ball.pos.x - ball.radius}px`,
          top: `${ball.pos.y - ball.radius}px`,
          width: `${ball.radius * 2}px`,
          height: `${ball.radius * 2}px`,
        }}
      >
        {/* Ball */}
        <div
            className={ballClasses}
            style={{
                width: '100%',
                height: '100%',
            }}
        />
        
        {/* Topspin Indicator (Orange) */}
        <div
          style={{
            ...spinIndicatorBaseStyle,
            opacity: topspinOpacity,
            boxShadow: '0px -6px 12px 2px rgba(255, 165, 0, 0.8)',
          }}
        />

        {/* Backspin Indicator (Blue) */}
        <div
          style={{
            ...spinIndicatorBaseStyle,
            opacity: backspinOpacity,
            boxShadow: '0px 6px 12px 2px rgba(0, 191, 255, 0.8)',
          }}
        />

        {/* Left Sidespin Indicator (Cyan) */}
        <div
          style={{
            ...spinIndicatorBaseStyle,
            opacity: leftSidespinOpacity,
            boxShadow: '-6px 0px 12px 2px rgba(0, 255, 255, 0.8)',
          }}
        />

        {/* Right Sidespin Indicator (Magenta) */}
        <div
          style={{
            ...spinIndicatorBaseStyle,
            opacity: rightSidespinOpacity,
            boxShadow: '6px 0px 12px 2px rgba(255, 0, 255, 0.8)',
          }}
        />
      </div>
    </div>
  );
};

export default GameCanvas;