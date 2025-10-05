import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, GameMode, Vector2D, GameSpeed } from '../types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_PADDING,
  BALL_RADIUS,
  TABLE_Y_POSITION,
  NET_WIDTH,
  NET_HEIGHT,
  TABLE_BOUNCE_DAMPING,
  WINNING_SCORE,
  GAME_SPEEDS,
} from '../constants';
import ScoreBoard from '../components/ScoreBoard';
import GameCanvas from '../components/GameCanvas';
import MainMenu from '../components/MainMenu';
import GameOverScreen from '../components/GameOverScreen';
import PointScoredNotification from '../components/PointScoredNotification';
import RotateDevice from '../components/RotateDevice';
import { audioManager } from '../utils/audio';

interface PointInfo {
    scorer: string;
    newScore: { player1: number; player2: number };
    reason: string;
}

const getInitialState = (): GameState => ({
  ball: {
    pos: { x: -100, y: -100 }, // Start off-screen
    vel: { x: 0, y: 0 },
    radius: BALL_RADIUS,
    spin: 0,
    sideSpin: 0,
  },
  player1: {
    pos: { x: PADDLE_PADDING * 5, y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    size: { x: PADDLE_WIDTH, y: PADDLE_HEIGHT },
  },
  player2: {
    pos: { x: GAME_WIDTH - PADDLE_WIDTH - PADDLE_PADDING * 5, y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    size: { x: PADDLE_WIDTH, y: PADDLE_HEIGHT },
  },
  score: { player1: 0, player2: 0 },
  gameStatus: 'menu',
  gameMode: 'vsCPU', // Default mode, will be set on start
  gameSpeed: 'normal',
  isServing: false,
  lastHitBy: null,
  serveTo: 'player1',
  ballTrail: [],
  hasBouncedOnServe: false,
});


const PingPongPage: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const [preGameSpeed, setPreGameSpeed] = useState<GameSpeed>('normal');
  const [pointScoredInfo, setPointScoredInfo] = useState<PointInfo | null>(null);
  const [scale, setScale] = useState(1);
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const animationFrameId = useRef<number>(0);
  const lastTouchPos = useRef<{ [key: number]: Vector2D }>({});

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
      
      const availableWidth = window.innerWidth;
      const availableHeight = window.innerHeight;

      const scaleX = availableWidth / GAME_WIDTH;
      const scaleY = availableHeight / GAME_HEIGHT;
      
      const newScale = Math.min(scaleX, scaleY);
      
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 


  const startGame = useCallback((mode: GameMode) => {
    audioManager.unlockAudio();
    audioManager.play('menu_click');
    setPointScoredInfo(null);
    setGameState({
        ...getInitialState(),
        gameStatus: 'playing',
        gameMode: mode,
        gameSpeed: preGameSpeed,
        isServing: true,
        serveTo: 'player1',
    });
  }, [preGameSpeed]);
  
  const returnToMenu = useCallback(() => {
    audioManager.play('menu_click');
    setGameState(getInitialState());
  }, []);

  const serveBall = useCallback(() => {
    setGameState(prev => {
        if (!prev.isServing) return prev;

        const { serveTo } = prev;
        
        const serveSpeedX = 4;
        const serveSpeedY = 2; // Downwards

        return {
            ...prev,
            ball: {
                ...prev.ball,
                vel: { 
                    x: serveTo === 'player1' ? serveSpeedX : -serveSpeedX, 
                    y: serveSpeedY 
                },
                spin: 0,
                sideSpin: 0,
            },
            isServing: false,
            lastHitBy: serveTo,
            hasBouncedOnServe: false,
        };
    });
  }, []);
  
  const getTouchPosition = useCallback((touch: React.Touch, targetElement: HTMLDivElement): Vector2D => {
    const rect = targetElement.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    return { x: x / scale, y: y / scale };
  }, [scale]);

  const movePaddleRelative = useCallback((paddle: 'player1' | 'player2', delta: Vector2D) => {
      setGameState(prev => {
          if (prev.gameStatus !== 'playing') return prev;

          const newPaddleState = { ...prev[paddle] };
          newPaddleState.pos.x += delta.x;
          newPaddleState.pos.y += delta.y;
          
          if (paddle === 'player1') {
               newPaddleState.pos.y = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newPaddleState.pos.y));
               newPaddleState.pos.x = Math.max(PADDLE_PADDING, Math.min(GAME_WIDTH / 2 - PADDLE_WIDTH, newPaddleState.pos.x));
          } else {
               newPaddleState.pos.y = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newPaddleState.pos.y));
               newPaddleState.pos.x = Math.max(GAME_WIDTH / 2, Math.min(GAME_WIDTH - PADDLE_WIDTH - PADDLE_PADDING, newPaddleState.pos.x));
          }
          
          return { ...prev, [paddle]: newPaddleState };
      });
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gameState.isServing && gameState.gameStatus === 'playing') {
      serveBall();
    }
    Array.from(e.targetTouches).forEach(touch => {
        const pos = getTouchPosition(touch, e.currentTarget);
        lastTouchPos.current[touch.identifier] = pos;
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gameState.gameStatus !== 'playing') return;
    e.preventDefault();

    const targetElement = e.currentTarget;
    Array.from(e.targetTouches).forEach(touch => {
        const pos = getTouchPosition(touch, targetElement);
        const lastPos = lastTouchPos.current[touch.identifier];

        if (lastPos) {
            const delta: Vector2D = {
                x: pos.x - lastPos.x,
                y: pos.y - lastPos.y,
            };

            if (pos.x < GAME_WIDTH / 2) {
                 movePaddleRelative('player1', delta);
            } else if (gameState.gameMode === 'vsPlayer') {
                 movePaddleRelative('player2', delta);
            }
        }
        lastTouchPos.current[touch.identifier] = pos;
    });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    Array.from(e.changedTouches).forEach(touch => {
        delete lastTouchPos.current[touch.identifier];
    });
  };

  const triggerHapticFeedback = (duration: number = 20) => {
    if ('vibrate' in navigator) {
        try {
            navigator.vibrate(duration);
        } catch (e) {
            console.warn("Haptic feedback failed.", e);
        }
    }
  };

  const gameLoop = useCallback(() => {
    if (gameState.gameStatus !== 'playing' || pointScoredInfo) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
      return;
    }

    setGameState(prev => {
      let newState = JSON.parse(JSON.stringify(prev)) as GameState;
      let scorer: 'player1' | 'player2' | null = null;
      let pointReason = '';
      const speedSettings = GAME_SPEEDS[newState.gameSpeed];
      
      const setScorer = (player: 'player1' | 'player2', reason: string) => {
        if (!scorer) {
            scorer = player;
            pointReason = reason;
        }
      };

      // 1. Move Paddles
      if (keysPressed.current['w'] || keysPressed.current['W']) newState.player1.pos.y = Math.max(0, newState.player1.pos.y - speedSettings.PADDLE_SPEED);
      if (keysPressed.current['s'] || keysPressed.current['S']) newState.player1.pos.y = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newState.player1.pos.y + speedSettings.PADDLE_SPEED);
      if (keysPressed.current['a'] || keysPressed.current['A']) newState.player1.pos.x = Math.max(PADDLE_PADDING, newState.player1.pos.x - speedSettings.PADDLE_SPEED);
      if (keysPressed.current['d'] || keysPressed.current['D']) newState.player1.pos.x = Math.min(GAME_WIDTH / 2 - PADDLE_WIDTH, newState.player1.pos.x + speedSettings.PADDLE_SPEED);
      
      if (newState.gameMode === 'vsCPU') {
        const { ball, player2 } = newState;
        const aiReactionOffset = (PADDLE_HEIGHT / 3) * (Math.random() - 0.5);
        const targetY = ball.pos.y - (PADDLE_HEIGHT / 2) + aiReactionOffset;
        
        if (player2.pos.y < targetY) player2.pos.y = Math.min(targetY, player2.pos.y + speedSettings.AI_PADDLE_SPEED);
        else if (player2.pos.y > targetY) player2.pos.y = Math.max(targetY, player2.pos.y - speedSettings.AI_PADDLE_SPEED);
        
        let targetX = (ball.vel.x > 0 && ball.pos.x > GAME_WIDTH / 2) ? ball.pos.x - (PADDLE_WIDTH / 2) : GAME_WIDTH - PADDLE_WIDTH - (PADDLE_PADDING * 10);
        if (player2.pos.x < targetX) player2.pos.x = Math.min(targetX, player2.pos.x + speedSettings.AI_PADDLE_SPEED);
        else if (player2.pos.x > targetX) player2.pos.x = Math.max(targetX, player2.pos.x - speedSettings.AI_PADDLE_SPEED);
        
        player2.pos.y = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, player2.pos.y));
        player2.pos.x = Math.max(GAME_WIDTH / 2, Math.min(GAME_WIDTH - PADDLE_WIDTH - PADDLE_PADDING, player2.pos.x));
      } else {
        if (keysPressed.current['ArrowUp']) newState.player2.pos.y = Math.max(0, newState.player2.pos.y - speedSettings.PADDLE_SPEED);
        if (keysPressed.current['ArrowDown']) newState.player2.pos.y = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newState.player2.pos.y + speedSettings.PADDLE_SPEED);
        if (keysPressed.current['ArrowLeft']) newState.player2.pos.x = Math.max(GAME_WIDTH / 2, newState.player2.pos.x - speedSettings.PADDLE_SPEED);
        if (keysPressed.current['ArrowRight']) newState.player2.pos.x = Math.min(GAME_WIDTH - PADDLE_WIDTH - PADDLE_PADDING, newState.player2.pos.x + speedSettings.PADDLE_SPEED);
      }
      
      // 2. Handle Ball
      if (newState.isServing) {
        const serverPaddle = newState.serveTo === 'player1' ? newState.player1 : newState.player2;
        newState.ball.pos.y = serverPaddle.pos.y + serverPaddle.size.y / 2;
        if (newState.serveTo === 'player1') {
          newState.ball.pos.x = serverPaddle.pos.x + serverPaddle.size.x + newState.ball.radius;
        } else {
          newState.ball.pos.x = serverPaddle.pos.x - newState.ball.radius;
        }
        newState.ball.vel = { x: 0, y: 0 };
        newState.ball.spin = 0;
        newState.ball.sideSpin = 0;
        newState.ballTrail = [];
      } else {
        newState.ball.vel.y += speedSettings.GRAVITY;

        // Apply Magnus effect and spin decay
        newState.ball.vel.y += newState.ball.spin * newState.ball.vel.x * speedSettings.SPIN_MAGNUS_EFFECT;
        newState.ball.spin *= speedSettings.SPIN_DECAY;
        newState.ball.sideSpin *= speedSettings.SPIN_DECAY;

        newState.ball.pos.x += newState.ball.vel.x;
        newState.ball.pos.y += newState.ball.vel.y;
        
        newState.ballTrail = [...(newState.ballTrail || []), { ...newState.ball.pos }].slice(-10);
      
        if (newState.ball.pos.y - newState.ball.radius < 0) {
          newState.ball.pos.y = newState.ball.radius;
          newState.ball.vel.y *= -1;
        }

        const netLeft = GAME_WIDTH / 2 - NET_WIDTH / 2;
        const netRight = GAME_WIDTH / 2 + NET_WIDTH / 2;
        const netTop = TABLE_Y_POSITION - NET_HEIGHT;
        if (newState.ball.pos.x + newState.ball.radius > netLeft && newState.ball.pos.x - newState.ball.radius < netRight && newState.ball.pos.y + newState.ball.radius > netTop) {
          const { lastHitBy, serveTo } = newState;
          const reason = "Hit the Net";
          if (lastHitBy === 'player1') setScorer('player2', reason);
          else if (lastHitBy === 'player2') setScorer('player1', reason);
          else setScorer(serveTo === 'player1' ? 'player2' : 'player1', reason);
        }

        // Table Bounce Logic
        if (newState.ball.pos.y + newState.ball.radius > TABLE_Y_POSITION && newState.ball.vel.y > 0) {
            const hitPlayer1Side = newState.ball.pos.x < GAME_WIDTH / 2;
            const hitPlayer2Side = newState.ball.pos.x > GAME_WIDTH / 2;
            
            const { lastHitBy, hasBouncedOnServe } = newState;

            const applyTableSpin = () => {
              newState.ball.vel.x += newState.ball.spin * speedSettings.TABLE_SPIN_FRICTION;
              newState.ball.spin *= -speedSettings.TABLE_SPIN_FRICTION;
              
              const sideSpinKick = newState.ball.sideSpin * speedSettings.TABLE_SIDESPIN_EFFECT;
              newState.ball.vel.y *= -TABLE_BOUNCE_DAMPING;
              newState.ball.vel.y -= sideSpinKick;
              newState.ball.sideSpin *= 0.7;

              newState.ball.pos.y = TABLE_Y_POSITION - newState.ball.radius;
              triggerHapticFeedback(10);
              audioManager.play('table_bounce');
            };

            if (lastHitBy !== null && !hasBouncedOnServe) {
                const serverIsP1 = lastHitBy === 'player1';
                
                if ((serverIsP1 && hitPlayer1Side) || (!serverIsP1 && hitPlayer2Side)) {
                    newState.hasBouncedOnServe = true;
                    applyTableSpin();
                } else {
                    setScorer(lastHitBy === 'player1' ? 'player2' : 'player1', "Serve Fault");
                }
            } else { 
                const lastHitterIsP1 = lastHitBy === 'player1';

                if ((lastHitterIsP1 && hitPlayer1Side) || (!lastHitterIsP1 && hitPlayer2Side)) {
                     setScorer(lastHitterIsP1 ? 'player2' : 'player1', "Rally Fault");
                } else {
                    applyTableSpin();
                }
            }
        }

        // Paddle Collisions
        if (newState.ball.vel.x < 0 && newState.ball.pos.x - newState.ball.radius < newState.player1.pos.x + newState.player1.size.x && newState.ball.pos.x + newState.ball.radius > newState.player1.pos.x && newState.ball.pos.y + newState.ball.radius > newState.player1.pos.y && newState.ball.pos.y - newState.ball.radius < newState.player1.pos.y + newState.player1.size.y) {
          newState.lastHitBy = 'player1';
          
          const impactFactor = ((newState.ball.pos.y - newState.player1.pos.y) / newState.player1.size.y) - 0.5;
          const maxAngle = Math.PI / 4;
          const bounceAngle = (impactFactor * 2) * maxAngle;

          const currentSpeed = Math.sqrt(newState.ball.vel.x**2 + newState.ball.vel.y**2);
          const newSpeed = Math.min(currentSpeed * speedSettings.PADDLE_BOUNCE_ACCEL, speedSettings.MAX_BALL_SPEED);
          
          newState.ball.spin = -impactFactor * speedSettings.PADDLE_SPIN_FACTOR;

          newState.ball.vel.x = newSpeed * Math.cos(bounceAngle);
          newState.ball.vel.y = (newSpeed * -Math.sin(bounceAngle)) - speedSettings.PADDLE_LIFT;
          newState.ball.vel.y -= newState.ball.sideSpin * speedSettings.PADDLE_SIDESPIN_EFFECT;
          newState.ball.sideSpin *= -0.4;
          
          newState.ball.pos.x = newState.player1.pos.x + newState.player1.size.x + newState.ball.radius;
          triggerHapticFeedback(30);
          audioManager.play('paddle_hit');
        }
        if (newState.ball.vel.x > 0 && newState.ball.pos.x + newState.ball.radius > newState.player2.pos.x && newState.ball.pos.x - newState.ball.radius < newState.player2.pos.x + newState.player2.size.x && newState.ball.pos.y + newState.ball.radius > newState.player2.pos.y && newState.ball.pos.y - newState.ball.radius < newState.player2.pos.y + newState.player2.size.y) {
          newState.lastHitBy = 'player2';
          
          const impactFactor = ((newState.ball.pos.y - newState.player2.pos.y) / newState.player2.size.y) - 0.5;
          const maxAngle = Math.PI / 4;
          const bounceAngle = (impactFactor * 2) * maxAngle;

          const currentSpeed = Math.sqrt(newState.ball.vel.x**2 + newState.ball.vel.y**2);
          const newSpeed = Math.min(currentSpeed * speedSettings.PADDLE_BOUNCE_ACCEL, speedSettings.MAX_BALL_SPEED);

          newState.ball.spin = -impactFactor * speedSettings.PADDLE_SPIN_FACTOR;

          newState.ball.vel.x = newSpeed * -Math.cos(bounceAngle);
          newState.ball.vel.y = (newSpeed * -Math.sin(bounceAngle)) - speedSettings.PADDLE_LIFT;
          newState.ball.vel.y -= newState.ball.sideSpin * speedSettings.PADDLE_SIDESPIN_EFFECT;
          newState.ball.sideSpin *= -0.4;
          
          newState.ball.pos.x = newState.player2.pos.x - newState.ball.radius;
          triggerHapticFeedback(30);
          audioManager.play('paddle_hit');
        }

        if (newState.ball.pos.x + newState.ball.radius < 0) setScorer('player2', 'Out of Bounds');
        if (newState.ball.pos.x - newState.ball.radius > GAME_WIDTH) setScorer('player1', 'Out of Bounds');
        if (newState.ball.pos.y - newState.ball.radius > GAME_HEIGHT) {
          const { lastHitBy, serveTo } = newState;
          const reason = "Out of Bounds";
          if (lastHitBy === 'player1') setScorer('player2', reason);
          else if (lastHitBy === 'player2') setScorer('player1', reason);
          else setScorer(serveTo === 'player1' ? 'player2' : 'player1', reason);
        }
      }

      if (scorer) {
        const newScore = { ...newState.score };
        const scorerName = scorer === 'player1' ? 'Player 1' : (newState.gameMode === 'vsCPU' ? 'Computer' : 'Player 2');
        if (scorer === 'player1') newScore.player1++; else newScore.player2++;
        setPointScoredInfo({ scorer: scorerName, newScore, reason: pointReason });
        return { ...newState, score: newScore, ballTrail: [] };
      }
      return newState;
    });

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gameState.gameStatus, pointScoredInfo, gameState.gameMode, movePaddleRelative]);
  
  // AI auto-serve
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.isServing && gameState.gameMode === 'vsCPU' && gameState.serveTo === 'player2') {
        const serveTimer = setTimeout(() => {
            serveBall();
        }, 800 + Math.random() * 400);
        return () => clearTimeout(serveTimer);
    }
  }, [gameState.gameStatus, gameState.isServing, gameState.gameMode, gameState.serveTo, serveBall]);

  useEffect(() => {
    if (pointScoredInfo) {
      const { newScore } = pointScoredInfo;
      if (newScore.player1 >= WINNING_SCORE || newScore.player2 >= WINNING_SCORE) {
        audioManager.play('game_over');
        setGameState(prev => ({...prev, gameStatus: 'gameOver'})); 
        return;
      } else {
        audioManager.play('point_scored');
      }

      const timer = setTimeout(() => {
        setPointScoredInfo(null);
        setGameState(prev => ({ 
            ...prev, 
            isServing: true,
            serveTo: prev.serveTo === 'player1' ? 'player2' : 'player1',
            ball: { ...prev.ball, pos: { x: -100, y: -100 }, vel: {x: 0, y: 0}, spin: 0, sideSpin: 0 },
            hasBouncedOnServe: false,
        }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [pointScoredInfo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
        if (e.code === 'Space' && gameState.gameStatus === 'playing' && gameState.isServing) {
            e.preventDefault();
            serveBall();
        }
        keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animationFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameLoop, gameState.gameStatus, gameState.isServing, serveBall]);
  
  if (gameState.gameStatus === 'menu') {
    return <MainMenu onStartGame={startGame} gameSpeed={preGameSpeed} onSetGameSpeed={setPreGameSpeed} />;
  }

  const getWinnerName = () => {
    if (gameState.score.player1 >= WINNING_SCORE) return 'Player 1';
    return gameState.gameMode === 'vsCPU' ? 'Computer' : 'Player 2';
  };
  
  return (
    <>
      {isPortrait && <RotateDevice />}
      <div className={`h-screen w-screen bg-gray-900 flex items-center justify-center font-mono overflow-hidden ${isPortrait ? 'hidden' : ''}`}>
        <div
          style={{
            position: 'relative',
            width: `${GAME_WIDTH}px`,
            height: `${GAME_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
          onClick={() => {
              if (gameState.gameStatus === 'playing' && gameState.isServing) {
                  serveBall();
              }
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative shadow-2xl shadow-black" style={{width: '100%', height: '100%'}}>
              <ScoreBoard score={gameState.score} />
              <GameCanvas gameState={gameState} />
              {pointScoredInfo && <PointScoredNotification scorer={pointScoredInfo.scorer} score={pointScoredInfo.newScore} reason={pointScoredInfo.reason} />}
              {gameState.gameStatus === 'gameOver' && <GameOverScreen winner={getWinnerName()} score={gameState.score} onRestart={() => startGame(gameState.gameMode)} onMainMenu={returnToMenu} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default PingPongPage;