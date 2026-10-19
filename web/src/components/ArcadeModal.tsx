import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Trophy, Volume2, ShieldAlert } from 'lucide-react';
import { soundEffects } from '../game/audio/SoundEffects';

interface ArcadeModalProps {
  onClose: () => void;
}

interface Item {
  id: number;
  x: number;
  y: number;
  type: 'fix' | 'bug' | 'star';
  speed: number;
}

export const ArcadeModal: React.FC<ArcadeModalProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('arcade_highscore') || '450', 10);
  });
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const [paddleX, setPaddleX] = useState(160);
  const itemsRef = useRef<Item[]>([]);
  const [, setTick] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const paddleRef = useRef(160);

  const GAME_WIDTH = 340;
  const GAME_HEIGHT = 400;
  const PADDLE_WIDTH = 54;

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setCombo(0);
    paddleRef.current = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
    setPaddleX(paddleRef.current);
    itemsRef.current = [];
    soundEffects.playArcade8Bit('coin');
  };

  // Keyboard controls for paddle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        paddleRef.current = Math.max(0, paddleRef.current - 24);
        setPaddleX(paddleRef.current);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        paddleRef.current = Math.min(GAME_WIDTH - PADDLE_WIDTH, paddleRef.current + 24);
        setPaddleX(paddleRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  // Main arcade animation loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    let spawnTimer = 0;

    const loop = () => {
      spawnTimer++;
      // Spawn falling items
      if (spawnTimer % 45 === 0) {
        const rand = Math.random();
        const type: 'fix' | 'bug' | 'star' = rand < 0.5 ? 'fix' : rand < 0.8 ? 'bug' : 'star';
        itemsRef.current.push({
          id: Date.now() + Math.random(),
          x: Math.random() * (GAME_WIDTH - 24),
          y: 0,
          type,
          speed: 2.2 + Math.random() * 1.8
        });
      }

      // Move items & collision detection
      const currentItems: Item[] = [];
      const currentPaddle = paddleRef.current;

      for (const item of itemsRef.current) {
        item.y += item.speed;

        // Check catch collision with paddle (Y ~ 360)
        if (item.y >= 355 && item.y <= 380) {
          if (item.x + 16 >= currentPaddle && item.x <= currentPaddle + PADDLE_WIDTH) {
            // Caught item!
            if (item.type === 'fix') {
              soundEffects.playArcade8Bit('score');
              setScore(prev => {
                const next = prev + 100 * (1 + Math.floor(combo / 3));
                if (next > highScore) {
                  setHighScore(next);
                  localStorage.setItem('arcade_highscore', next.toString());
                }
                return next;
              });
              setCombo(c => c + 1);
            } else if (item.type === 'star') {
              soundEffects.playArcade8Bit('coin');
              setScore(prev => prev + 250);
              setCombo(c => c + 2);
            } else if (item.type === 'bug') {
              soundEffects.playArcade8Bit('hit');
              setCombo(0);
              setLives(l => {
                const next = l - 1;
                if (next <= 0) {
                  soundEffects.playArcade8Bit('gameover');
                  setGameOver(true);
                }
                return next;
              });
            }
            continue; // Item consumed
          }
        }

        // Drop below screen
        if (item.y < GAME_HEIGHT) {
          currentItems.push(item);
        }
      }

      itemsRef.current = currentItems;
      setTick(t => t + 1);

      if (!gameOver) {
        gameLoopRef.current = requestAnimationFrame(loop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, combo, highScore]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(10, 12, 22, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      {/* Retro Arcade Machine Cabinet Wrapper */}
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'linear-gradient(180deg, #581C87 0%, #3B0764 40%, #1E1B4B 100%)',
          border: '4px solid #A855F7',
          borderRadius: 16,
          boxShadow: '0 0 35px rgba(168, 85, 247, 0.4), 0 25px 60px rgba(0,0,0,0.9)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Arcade Marquee Header */}
        <div
          style={{
            padding: '12px 18px',
            background: 'linear-gradient(90deg, #7E22CE 0%, #F59E0B 50%, #7E22CE 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid #FDE047'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🕹️</span>
            <div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 13, color: '#FFFFFF', letterSpacing: 1 }}>
                CYBER BUG BUSTER
              </div>
              <div style={{ fontSize: 10, color: '#FEF08A' }}>Lounge Arcade • High Score: {highScore}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid #FEF08A',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: 28,
              height: 28,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* CRT Screen Display */}
        <div
          style={{
            margin: 16,
            backgroundColor: '#090D16',
            borderRadius: 10,
            border: '3px solid #334155',
            boxShadow: 'inset 0 0 25px rgba(56, 189, 248, 0.25)',
            position: 'relative',
            height: GAME_HEIGHT,
            overflow: 'hidden'
          }}
        >
          {/* Scanline CRT overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 2px, transparent 2px, transparent 4px)',
              pointerEvents: 'none',
              zIndex: 10
            }}
          />

          {!isPlaying ? (
            /* Start Screen */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: 24,
                textAlign: 'center',
                gap: 16
              }}
            >
              <div style={{ fontSize: 48 }}>👾</div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 16, color: '#38BDF8' }}>
                INSERT COIN
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8', maxWidth: 260, lineHeight: 1.5 }}>
                Catch green fixes (✅) and golden stars (⭐). Dodge critical production bugs (🐛)!
              </p>
              <button
                onClick={startGame}
                className="pixel-btn pixel-btn-primary"
                style={{
                  fontSize: 12,
                  padding: '12px 24px',
                  borderRadius: 6,
                  backgroundColor: '#0284C7',
                  border: '2px solid #38BDF8',
                  boxShadow: '0 0 15px rgba(56, 189, 248, 0.6)'
                }}
              >
                <Play size={14} /> START GAME
              </button>
            </div>
          ) : (
            /* Active Game Screen */
            <>
              {/* HUD: Score & Lives */}
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 12,
                  right: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: 10,
                  color: '#38BDF8',
                  zIndex: 15
                }}
              >
                <div>SCORE: {score}</div>
                <div>COMBO: x{Math.max(1, Math.floor(combo / 3))}</div>
                <div style={{ color: '#F43F5E' }}>
                  {'❤️'.repeat(Math.max(0, lives))}
                </div>
              </div>

              {/* Falling items */}
              {itemsRef.current.map(item => (
                <div
                  key={item.id}
                  style={{
                    position: 'absolute',
                    left: item.x,
                    top: item.y,
                    fontSize: 20,
                    userSelect: 'none',
                    filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))'
                  }}
                >
                  {item.type === 'fix' ? '✅' : item.type === 'star' ? '⭐' : '🐛'}
                </div>
              ))}

              {/* Player Paddle */}
              <div
                style={{
                  position: 'absolute',
                  left: paddleX,
                  top: 360,
                  width: PADDLE_WIDTH,
                  height: 12,
                  background: 'linear-gradient(90deg, #38BDF8 0%, #0284C7 50%, #38BDF8 100%)',
                  borderRadius: 6,
                  border: '1px solid #7DD3FC',
                  boxShadow: '0 0 12px #38BDF8'
                }}
              />

              {/* Game Over Screen Overlay */}
              {gameOver && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(15, 23, 42, 0.88)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    zIndex: 20
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 18, color: '#EF4444' }}>
                    GAME OVER
                  </div>
                  <div style={{ fontSize: 14, color: '#F8FAFC' }}>
                    Final Score: <span style={{ color: '#F59E0B', fontWeight: 700 }}>{score}</span>
                  </div>
                  {score >= highScore && score > 0 && (
                    <div style={{ fontSize: 12, color: '#34D399', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Trophy size={14} /> NEW OFFICE HIGH SCORE!
                    </div>
                  )}
                  <button
                    onClick={startGame}
                    className="pixel-btn pixel-btn-primary"
                    style={{ marginTop: 10, fontSize: 11, padding: '10px 18px' }}
                  >
                    <RotateCcw size={14} /> PLAY AGAIN
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Arcade Physical Controls (On-Screen Touch Buttons for mobile/mouse) */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#1E1B4B',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => {
                paddleRef.current = Math.max(0, paddleRef.current - 35);
                setPaddleX(paddleRef.current);
              }}
              style={{
                width: 48,
                height: 38,
                borderRadius: 8,
                backgroundColor: '#334155',
                border: '2px solid #475569',
                color: '#38BDF8',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ◀
            </button>
            <button
              onClick={() => {
                paddleRef.current = Math.min(GAME_WIDTH - PADDLE_WIDTH, paddleRef.current + 35);
                setPaddleX(paddleRef.current);
              }}
              style={{
                width: 48,
                height: 38,
                borderRadius: 8,
                backgroundColor: '#334155',
                border: '2px solid #475569',
                color: '#38BDF8',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ▶
            </button>
          </div>

          <div style={{ fontSize: 11, color: '#94A3B8' }}>
            Use <span style={{ color: '#F59E0B' }}>[A / D]</span> or Arrows
          </div>
        </div>
      </div>
    </div>
  );
};
