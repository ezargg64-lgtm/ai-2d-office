import React, { useState, useEffect } from 'react';
import { eventBus } from '../game/eventBus';

export const MiniMap: React.FC = () => {
  const [playerNorm, setPlayerNorm] = useState({ x: 0.5, y: 0.9 });

  useEffect(() => {
    const unsub = eventBus.on('player:pos', (pos: { x: number; y: number }) => {
      setPlayerNorm(pos);
    });
    return unsub;
  }, []);

  return (
    <div
      className="pixel-box"
      style={{
        position: 'absolute',
        top: 72,
        left: 12,
        width: 120,
        height: 90,
        zIndex: 35,
        borderRadius: 6,
        padding: 4,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#0F172A',
          position: 'relative',
          borderRadius: 3,
          border: '1px solid #1E293B'
        }}
      >
        {/* Meeting Pod zone */}
        <div
          style={{
            position: 'absolute',
            left: `${(13 / 40) * 100}%`,
            top: `${(2 / 30) * 100}%`,
            width: `${(8 / 40) * 100}%`,
            height: `${(7 / 30) * 100}%`,
            border: '1px dashed #7E22CE',
            backgroundColor: 'rgba(126, 34, 206, 0.15)'
          }}
        />

        {/* Player blip (blinking amber) */}
        <div
          style={{
            position: 'absolute',
            left: `${playerNorm.x * 100}%`,
            top: `${playerNorm.y * 100}%`,
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#F59E0B',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 6px #F59E0B'
          }}
        />

        {/* Fixed agent stations */}
        {/* Sarah */}
        <div style={{ position: 'absolute', left: '15%', top: '53%', width: 4, height: 4, borderRadius: '50%', backgroundColor: '#B45309' }} />
        {/* Maya */}
        <div style={{ position: 'absolute', left: '12%', top: '20%', width: 4, height: 4, borderRadius: '50%', backgroundColor: '#BE185D' }} />
        {/* Dana */}
        <div style={{ position: 'absolute', left: '62%', top: '20%', width: 4, height: 4, borderRadius: '50%', backgroundColor: '#0891B2' }} />
        {/* Dev */}
        <div style={{ position: 'absolute', left: '70%', top: '20%', width: 4, height: 4, borderRadius: '50%', backgroundColor: '#047857' }} />
        {/* Uma */}
        <div style={{ position: 'absolute', left: '85%', top: '20%', width: 4, height: 4, borderRadius: '50%', backgroundColor: '#6D28D9' }} />
        {/* Quinn */}
        <div style={{ position: 'absolute', left: '85%', top: '53%', width: 4, height: 4, borderRadius: '50%', backgroundColor: '#1D4ED8' }} />
        {/* Owen */}
        <div style={{ position: 'absolute', left: '85%', top: '76%', width: 4, height: 4, borderRadius: '50%', backgroundColor: '#B91C1C' }} />
      </div>
    </div>
  );
};
