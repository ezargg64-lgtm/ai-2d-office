import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, MessageSquare } from 'lucide-react';
import { eventBus } from '../game/eventBus';

export const MobileControls: React.FC = () => {
  const handleTouchStart = (vx: number, vy: number) => {
    eventBus.emit('mobile:move', { x: vx, y: vy });
  };

  const handleTouchEnd = () => {
    eventBus.emit('mobile:move', { x: 0, y: 0 });
  };

  const handleAction = () => {
    eventBus.emit('mobile:action');
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 30,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'none'
      }}
    >
      {/* Virtual D-Pad */}
      <div
        style={{
          width: 140,
          height: 140,
          position: 'relative',
          pointerEvents: 'auto',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          borderRadius: '50%',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          backdropFilter: 'blur(4px)'
        }}
      >
        {/* UP */}
        <button
          onTouchStart={() => handleTouchStart(0, -1)}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => handleTouchStart(0, -1)}
          onMouseUp={handleTouchEnd}
          style={{
            position: 'absolute',
            top: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 44,
            height: 44,
            borderRadius: 8,
            backgroundColor: '#1E293B',
            border: '1px solid #475569',
            color: '#38BDF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowUp size={20} />
        </button>

        {/* DOWN */}
        <button
          onTouchStart={() => handleTouchStart(0, 1)}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => handleTouchStart(0, 1)}
          onMouseUp={handleTouchEnd}
          style={{
            position: 'absolute',
            bottom: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 44,
            height: 44,
            borderRadius: 8,
            backgroundColor: '#1E293B',
            border: '1px solid #475569',
            color: '#38BDF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowDown size={20} />
        </button>

        {/* LEFT */}
        <button
          onTouchStart={() => handleTouchStart(-1, 0)}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => handleTouchStart(-1, 0)}
          onMouseUp={handleTouchEnd}
          style={{
            position: 'absolute',
            left: 6,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 44,
            height: 44,
            borderRadius: 8,
            backgroundColor: '#1E293B',
            border: '1px solid #475569',
            color: '#38BDF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} />
        </button>

        {/* RIGHT */}
        <button
          onTouchStart={() => handleTouchStart(1, 0)}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => handleTouchStart(1, 0)}
          onMouseUp={handleTouchEnd}
          style={{
            position: 'absolute',
            right: 6,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 44,
            height: 44,
            borderRadius: 8,
            backgroundColor: '#1E293B',
            border: '1px solid #475569',
            color: '#38BDF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Action Button [E] */}
      <button
        onTouchStart={handleAction}
        onClick={handleAction}
        className="pixel-btn-primary"
        style={{
          pointerEvents: 'auto',
          width: 72,
          height: 72,
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          border: '3px solid #7DD3FC',
          boxShadow: '0 4px 20px rgba(2, 132, 199, 0.6)',
          cursor: 'pointer'
        }}
      >
        <MessageSquare size={22} />
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 10 }}>[E]</span>
      </button>
    </div>
  );
};
