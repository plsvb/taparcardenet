export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  pos: Vector2D;
  size: Vector2D;
}

export interface Ball {
  pos: Vector2D;
  vel: Vector2D;
  radius: number;
  spin: number; // z-axis spin, positive is topspin for ball moving right
  sideSpin: number; // y-axis spin, positive is "left" sidespin
}

export interface Paddle extends GameObject {}

export type GameStatus = 'menu' | 'playing' | 'gameOver';
export type GameMode = 'vsCPU' | 'vsPlayer';
export type GameSpeed = 'slow' | 'normal' | 'fast';

export interface GameState {
  ball: Ball;
  player1: Paddle;
  player2: Paddle;
  score: { player1: number; player2: number };
  gameStatus: GameStatus;
  gameMode: GameMode;
  gameSpeed: GameSpeed;
  isServing: boolean;
  lastHitBy: 'player1' | 'player2' | null;
  serveTo: 'player1' | 'player2';
  ballTrail: Vector2D[];
  hasBouncedOnServe: boolean;
}