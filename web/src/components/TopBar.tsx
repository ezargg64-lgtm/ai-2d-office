import React, { useState, useEffect } from 'react';
import { Sun, Moon, Send, Users, Settings as SettingsIcon, Coffee, Zap } from 'lucide-react';
import { eventBus } from '../game/eventBus';

interface TopBarProps {
  onOpenSettings: () => void;
  onOpenMeeting: () => void;
  energy: number;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSettings, onOpenMeeting, energy }) => {
  const [brief, setBrief] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cycleInfo, setCycleInfo] = useState<{ progress: number; isNight: boolean }>({
    progress: 0,
    isNight: false
  });
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const unsub = eventBus.on('time:cycle', (info: { progress: number; isNight: boolean }) => {
      setCycleInfo(info);
    });
    return unsub;
  }, []);

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief })
      });
      if (res.ok) {
        const task = await res.json();
        setBrief('');
        showToast(`📋 Assigned to ${task.department}: "${task.title}"`);
      }
    } catch (err) {
      console.error('Task submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <>
      <header
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          pointerEvents: 'none'
        }}
      >
        {/* Left: Branding & Energy */}
        <div
          className="pixel-box"
          style={{
            pointerEvents: 'auto',
            padding: '8px 14px',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🕹️</span>
            <div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 10, color: '#38BDF8', letterSpacing: 1 }}>
                AI OFFICE
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Pixel RPG v4.0</div>
            </div>
          </div>

          <div style={{ height: 24, width: 1, backgroundColor: '#334155' }} />

          {/* Day/Night indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#CBD5E1' }}>
            {cycleInfo.isNight ? (
              <Moon size={14} color="#A855F7" />
            ) : (
              <Sun size={14} color="#FBBF24" />
            )}
            <span>{cycleInfo.isNight ? 'Night' : 'Day'}</span>
          </div>

          <div style={{ height: 24, width: 1, backgroundColor: '#334155' }} />

          {/* Energy badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#34D399' }}>
            <Zap size={14} />
            <span>{energy}%</span>
          </div>
        </div>

        {/* Center: Global Task Brief Input */}
        <form
          onSubmit={handleTaskSubmit}
          className="pixel-box"
          style={{
            pointerEvents: 'auto',
            flex: 1,
            maxWidth: 580,
            padding: '4px 6px',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <input
            type="text"
            value={brief}
            onChange={e => setBrief(e.target.value)}
            placeholder="Assign brief to office (e.g. 'Build 2D map builder & test Safari matrix')..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F8FAFC',
              fontSize: 13,
              padding: '6px 10px',
              fontFamily: 'inherit'
            }}
          />
          <button
            type="submit"
            disabled={isSubmitting || !brief.trim()}
            className="pixel-btn pixel-btn-primary"
            style={{ opacity: !brief.trim() ? 0.6 : 1 }}
          >
            <Send size={12} />
            <span>Route</span>
          </button>
        </form>

        {/* Right: Actions */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <button onClick={onOpenMeeting} className="pixel-btn pixel-btn-meeting" title="Call All-Hands Meeting">
            <Users size={13} />
            <span>All-Hands</span>
          </button>

          <button onClick={onOpenSettings} className="pixel-btn" title="Settings & Agent System Prompts">
            <SettingsIcon size={13} />
          </button>
        </div>
      </header>

      {/* Floating notification toast */}
      {notification && (
        <div
          className="pixel-box-amber animate-pulse-subtle"
          style={{
            position: 'absolute',
            top: 72,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            padding: '10px 18px',
            borderRadius: 6,
            fontSize: 12,
            color: '#FDE68A',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 8px 30px rgba(0,0,0,0.8)'
          }}
        >
          <span>{notification}</span>
        </div>
      )}
    </>
  );
};
