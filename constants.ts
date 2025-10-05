export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 500;

export const PADDLE_WIDTH = 15;
export const PADDLE_HEIGHT = 100;
export const PADDLE_PADDING = 5;

export const BALL_RADIUS = 10;
export const BALL_INITIAL_SPEED_X = 6;
export const BALL_INITIAL_SPEED_Y = -2;

export const TABLE_Y_POSITION = GAME_HEIGHT - 150;
export const TABLE_HEIGHT = 20;

export const NET_WIDTH = 4;
export const NET_HEIGHT = 30;

export const TABLE_BOUNCE_DAMPING = 1.0;

export const WINNING_SCORE = 5;

// Used to normalize spin values for visual indicators.
// A higher value makes the indicator appear less sensitive.
export const MAX_VISUAL_SPIN = 5;

export const GAME_SPEEDS = {
  slow: {
    PADDLE_SPEED: 6,
    AI_PADDLE_SPEED: 3,
    GRAVITY: 0.12,
    PADDLE_BOUNCE_ACCEL: 1.03,
    MAX_BALL_SPEED: 12,
    PADDLE_LIFT: 1.2,
    PADDLE_SPIN_FACTOR: 4,
    SPIN_MAGNUS_EFFECT: 0.02,
    SPIN_DECAY: 0.995,
    TABLE_SPIN_FRICTION: 0.5,
    PADDLE_SIDESPIN_EFFECT: 0.3,
    TABLE_SIDESPIN_EFFECT: 0.2,
  },
  normal: {
    PADDLE_SPEED: 8,
    AI_PADDLE_SPEED: 4,
    GRAVITY: 0.15,
    PADDLE_BOUNCE_ACCEL: 1.05,
    MAX_BALL_SPEED: 15,
    PADDLE_LIFT: 1.5,
    PADDLE_SPIN_FACTOR: 5,
    SPIN_MAGNUS_EFFECT: 0.03,
    SPIN_DECAY: 0.99,
    TABLE_SPIN_FRICTION: 0.4,
    PADDLE_SIDESPIN_EFFECT: 0.4,
    TABLE_SIDESPIN_EFFECT: 0.3,
  },
  fast: {
    PADDLE_SPEED: 10,
    AI_PADDLE_SPEED: 5.5,
    GRAVITY: 0.18,
    PADDLE_BOUNCE_ACCEL: 1.07,
    MAX_BALL_SPEED: 18,
    PADDLE_LIFT: 1.8,
    PADDLE_SPIN_FACTOR: 6,
    SPIN_MAGNUS_EFFECT: 0.04,
    SPIN_DECAY: 0.985,
    TABLE_SPIN_FRICTION: 0.3,
    PADDLE_SIDESPIN_EFFECT: 0.5,
    TABLE_SIDESPIN_EFFECT: 0.4,
  },
};