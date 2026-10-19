import React, { useState, useEffect } from 'react';
import { Sun, Moon, Send, Users, Settings as SettingsIcon, Volume2, VolumeX, ZoomIn, ZoomOut, Zap, Heart } from 'lucide-react';
import { eventBus } from '../game/eventBus';
import { soundEffects } from '../game/audio/SoundEffects';

interface TopBarProps {
  onOpenSettings: () => void;
  onOpenMeeting: () => void;
  energy: number;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSettings, onOpenMeeting, energy }) => {
  const [brief, setBrief] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEffects.getMuted());
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
    soundEffects.playInteractionPing();
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief })
      });
      if (res.ok) {
        const task = await res.json();
        setBrief('');
        soundEffects.playTaskChime();
        showToast(`📋 Assigned to ${task.department}: "${task.title}"`);
      }
    } catch (err) {
      console.error('Task submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSound = () => {
    const nextMuted = soundEffects.toggleMute();
    setIsMuted(nextMuted);
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
        {/* Left: Branding & Status */}
        <div
          className="pixel-box-amber"
          style={{
            pointerEvents: 'auto',
            padding: '7px 14px',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>☕</span>
            <div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 10, color: '#FDE68A', letterSpacing: 1 }}>
                COZY AI OFFICE
              </div>
              <div style={{ fontSize: 10, color: '#D97706' }}>Warm Indie Edition</div>
            </div>
          </div>

          <div style={{ height: 20, width: 1, backgroundColor: '#78350F' }} />

          {/* Day/Night indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#FEF3C7' }}>
            {cycleInfo.isNight ? (
              <Moon size={14} color="#A855F7" />
            ) : (
              <Sun size={14} color="#FBBF24" />
            )}
            <span>{cycleInfo.isNight ? 'Dusk' : 'Golden Sun'}</span>
          </div>

          <div style={{ height: 20, width: 1, backgroundColor: '#78350F' }} />

          {/* Energy & Morale badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#F59E0B' }} title="Owner Energy">
              <Zap size={14} />
              <span>{energy}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#EC4899' }} title="Team Morale">
              <Heart size={13} />
              <span>98%</span>
            </div>
          </div>
        </div>

        {/* Center: Global Task Brief Input */}
        <form
          onSubmit={handleTaskSubmit}
          className="pixel-box"
          style={{
            pointerEvents: 'auto',
            flex: 1,
            maxWidth: 540,
            padding: '4px 6px',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: '2px solid #D97706'
          }}
        >
          <input
            type="text"
            value={brief}
            onChange={e => setBrief(e.target.value)}
            placeholder="Assign brief to office (e.g. 'Build mobile touch joystick & test in Chrome')..."
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
            className="pixel-btn pixel-btn-amber"
            style={{ opacity: !brief.trim() ? 0.6 : 1 }}
          >
            <Send size={12} />
            <span>Route</span>
          </button>
        </form>

        {/* Right: Quick Game Controls & Modals */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {/* Zoom Controls */}
          <button
            onClick={() => eventBus.emit('camera:zoomIn')}
            className="pixel-btn"
            title="Zoom In"
            style={{ padding: '7px 10px' }}
          >
            <ZoomIn size={13} />
          </button>
          <button
            onClick={() => eventBus.emit('camera:zoomOut')}
            className="pixel-btn"
            title="Zoom Out"
            style={{ padding: '7px 10px' }}
          >
            <ZoomOut size={13} />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="pixel-btn"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            style={{ padding: '7px 10px', color: isMuted ? '#94A3B8' : '#38BDF8' }}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>

          {/* All-Hands Meeting Button */}
          <button onClick={onOpenMeeting} className="pixel-btn pixel-btn-meeting" title="Call All-Hands Meeting">
            <Users size={13} />
            <span>All-Hands</span>
          </button>

          {/* Settings Modal */}
          <button onClick={onOpenSettings} className="pixel-btn" title="Settings & Agent Prompts">
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
            borderRadius: 8,
            fontSize: 12,
            color: '#FDE68A',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 8px 30px rgba(0,0,0,0.85)'
          }}
        >
          <span>{notification}</span>
        </div>
      )}
    </>
  );
};
