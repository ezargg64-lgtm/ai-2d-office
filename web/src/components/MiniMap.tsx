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

  const handleMiniMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    const worldW = 40 * 32;
    const worldH = 30 * 32;

    eventBus.emit('mobile:move', { x: 0, y: 0 }); // reset joystick
    // Dispatch world waypoint click to phaser
    const phaserCanvas = document.querySelector('#phaser-container canvas');
    if (phaserCanvas) {
      const simPointer = new MouseEvent('pointerdown', {
        clientX: clickX * window.innerWidth,
        clientY: clickY * window.innerHeight
      });
      phaserCanvas.dispatchEvent(simPointer);
    }
  };

  return (
    <div
      className="pixel-box-amber"
      style={{
        position: 'absolute',
        top: 68,
        left: 12,
        width: 136,
        height: 104,
        zIndex: 35,
        borderRadius: 8,
        padding: 5,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.7)'
      }}
    >
      <div
        onClick={handleMiniMapClick}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#1E1B4B',
          position: 'relative',
          borderRadius: 4,
          border: '1px solid #78350F',
          cursor: 'crosshair',
          overflow: 'hidden'
        }}
      >
        {/* Subtle grid lines */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(rgba(245, 158, 11, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.08) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            pointerEvents: 'none'
          }}
        />

        {/* All-Hands Meeting Pod zone */}
        <div
          title="All-Hands Meeting Room"
          style={{
            position: 'absolute',
            left: `${(13 / 40) * 100}%`,
            top: `${(2 / 30) * 100}%`,
            width: `${(8 / 40) * 100}%`,
            height: `${(7 / 30) * 100}%`,
            border: '1px dashed #A855F7',
            backgroundColor: 'rgba(168, 85, 247, 0.2)'
          }}
        />

        {/* Cafe Corner zone */}
        <div
          title="Artisanal Cafe Bar"
          style={{
            position: 'absolute',
            left: `${(14 / 40) * 100}%`,
            top: `${(12 / 30) * 100}%`,
            width: `${(6 / 40) * 100}%`,
            height: `${(5 / 30) * 100}%`,
            backgroundColor: 'rgba(234, 88, 12, 0.25)',
            border: '1px solid rgba(234, 88, 12, 0.4)'
          }}
        />

        {/* Lounge / Arcade zone */}
        <div
          title="Cozy Lounge & Arcade"
          style={{
            position: 'absolute',
            left: `${(13 / 40) * 100}%`,
            top: `${(19 / 30) * 100}%`,
            width: `${(7 / 40) * 100}%`,
            height: `${(6 / 30) * 100}%`,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}
        />

        {/* Player blip (pulsing gold) */}
        <div
          style={{
            position: 'absolute',
            left: `${playerNorm.x * 100}%`,
            top: `${playerNorm.y * 100}%`,
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#F59E0B',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 8px #F59E0B, 0 0 14px #FEF08A',
            zIndex: 10
          }}
        />

        {/* Fixed agent stations */}
        {/* Sarah (PM) */}
        <div title="Sarah (PM)" style={{ position: 'absolute', left: '15%', top: '53%', width: 5, height: 5, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
        {/* Maya (Product) */}
        <div title="Maya (Product)" style={{ position: 'absolute', left: '12%', top: '20%', width: 5, height: 5, borderRadius: '50%', backgroundColor: '#EC4899' }} />
        {/* Dana (Frontend) */}
        <div title="Dana (Frontend)" style={{ position: 'absolute', left: '62%', top: '20%', width: 5, height: 5, borderRadius: '50%', backgroundColor: '#06B6D4' }} />
        {/* Dev (Backend) */}
        <div title="Dev (Backend)" style={{ position: 'absolute', left: '70%', top: '20%', width: 5, height: 5, borderRadius: '50%', backgroundColor: '#10B981' }} />
        {/* Uma (Design) */}
        <div title="Uma (Design)" style={{ position: 'absolute', left: '85%', top: '20%', width: 5, height: 5, borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
        {/* Quinn (QA) */}
        <div title="Quinn (QA)" style={{ position: 'absolute', left: '85%', top: '53%', width: 5, height: 5, borderRadius: '50%', backgroundColor: '#3B82F6' }} />
        {/* Owen (DevOps) */}
        <div title="Owen (DevOps)" style={{ position: 'absolute', left: '85%', top: '76%', width: 5, height: 5, borderRadius: '50%', backgroundColor: '#EF4444' }} />
      </div>
    </div>
  );
};
