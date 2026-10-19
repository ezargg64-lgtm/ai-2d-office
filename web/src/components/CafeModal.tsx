import React from 'react';
import { X, Coffee, Sparkles, Zap, Heart } from 'lucide-react';
import { soundEffects } from '../game/audio/SoundEffects';

interface CafeModalProps {
  onClose: () => void;
  onBrew: (type: string, energyGain: number, speedBuff?: number, toastMsg?: string) => void;
}

export const CafeModal: React.FC<CafeModalProps> = ({ onClose, onBrew }) => {
  const drinks = [
    {
      id: 'macchiato',
      name: 'Caramel Macchiato',
      desc: 'Steamed creamy oat milk, double espresso shot, golden caramel drizzle.',
      icon: '☕',
      energy: 20,
      speedBuff: 1.35,
      buffDesc: '+20% Energy & +35% Sprint Speed (90s)',
      color: '#F59E0B'
    },
    {
      id: 'nitro',
      name: 'Nitro Cold Brew',
      desc: 'Slow-steeped Ethiopian roast infused with nitrogen micro-bubbles. Ultra smooth.',
      icon: '🧊',
      energy: 35,
      speedBuff: 1.25,
      buffDesc: '+35% Energy & Hyperfocus Mode',
      color: '#38BDF8'
    },
    {
      id: 'matcha',
      name: 'Ceremonial Matcha Latte',
      desc: 'Stone-ground Uji green tea, velvet micro-foam. Zen state of calm clarity.',
      icon: '🍵',
      energy: 25,
      speedBuff: 1.15,
      buffDesc: '+25% Energy & Team Morale Boost',
      color: '#10B981'
    },
    {
      id: 'croissant',
      name: 'Almond Croissant & Pour-Over',
      desc: 'Freshly baked flaky almond pastry served with single-origin drip coffee.',
      icon: '🥐',
      energy: 50,
      buffDesc: 'Maximum Energy Recovery (+50%)',
      color: '#EC4899'
    }
  ];

  const handleOrder = (drink: typeof drinks[0]) => {
    soundEffects.playCoffeeBrew();
    onBrew(drink.name, drink.energy, drink.speedBuff, `☕ Poured fresh ${drink.name}! ${drink.buffDesc}`);
    onClose();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 10, 8, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      <div
        className="pixel-box-amber"
        style={{
          width: '100%',
          maxWidth: 520,
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 0 30px rgba(245, 158, 11, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#2A1810',
            borderBottom: '2px solid #78350F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>☕</span>
            <div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 13, color: '#FDE68A' }}>
                COZY ESPRESSO BAR
              </div>
              <div style={{ fontSize: 11, color: '#D97706' }}>Artisanal Roasts & Team Morale Brews</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FDE68A',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Cards */}
        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12, backgroundColor: '#1C120C' }}>
          {drinks.map(d => (
            <div
              key={d.id}
              onClick={() => handleOrder(d)}
              style={{
                padding: '14px 16px',
                borderRadius: 8,
                backgroundColor: '#2A1B12',
                border: '1px solid #78350F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#F59E0B';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.backgroundColor = '#382215';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#78350F';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = '#2A1B12';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 30 }}>{d.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#FEF3C7', marginBottom: 3 }}>
                    {d.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#D97706', maxWidth: 300, lineHeight: 1.4 }}>
                    {d.desc}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: d.color,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    padding: '3px 8px',
                    borderRadius: 12,
                    border: `1px solid ${d.color}55`
                  }}
                >
                  {d.buffDesc}
                </span>
                <span style={{ fontSize: 11, color: '#FDE68A', fontWeight: 600 }}>Order Brew ➔</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
