import React, { useState } from 'react';
import { X, Terminal, Cpu, HardDrive, Activity, Play, RefreshCw, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../game/audio/SoundEffects';

interface ServerTerminalModalProps {
  onClose: () => void;
}

export const ServerTerminalModal: React.FC<ServerTerminalModalProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Pterodactyl Container Node #4 online',
    '[NETWORK] Gateway port: 8080 (0.0.0.0) bound healthy',
    '[DATABASE] Storage path /data/ persistent store synced',
    '[METRICS] Memory: 38.4MB / 1024MB | CPU: 0.8% | Ping: 4ms',
    '[CI/CD] Staging build v4.2 passing automated test suite'
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const runDiagnostics = () => {
    setIsProcessing(true);
    soundEffects.playInteractionPing();
    setLogs(prev => [...prev, '> Running comprehensive container diagnostics...']);

    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        '✓ Memory heap allocation verified (no leaks)',
        '✓ WebSocket event bus heartbeat latency: 1.2ms',
        '✓ Gemin 1.5 Flash API token balance verified',
        '✓ All 7 agent prompt configurations loaded intact'
      ]);
      soundEffects.playTaskChime();
      setIsProcessing(false);
    }, 1200);
  };

  const simulateDeploy = () => {
    setIsProcessing(true);
    soundEffects.playInteractionPing();
    setLogs(prev => [...prev, '> Initiating CI/CD zero-downtime hotfix deployment...']);

    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        '📦 Bundling Vite production distribution assets...',
        '🚀 Rolling container worker update completed!',
        '✓ 60FPS mobile touch loop verified operational'
      ]);
      soundEffects.playTaskChime();
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(10, 15, 28, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      <div
        className="pixel-box"
        style={{
          width: '100%',
          maxWidth: 620,
          borderRadius: 12,
          boxShadow: '0 25px 65px rgba(0,0,0,0.9), 0 0 30px rgba(56, 189, 248, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#0F172A',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Terminal size={18} color="#38BDF8" />
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: '#38BDF8', letterSpacing: 1 }}>
              DEVOPS SERVER RACK CONSOLE
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Server Metrics Summary Bar */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#1E293B',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            borderBottom: '1px solid #334155'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cpu size={16} color="#38BDF8" />
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>CPU LOAD</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#34D399' }}>0.8% Normal</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HardDrive size={16} color="#F59E0B" />
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>RAM USAGE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>38.4 MB</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={16} color="#A855F7" />
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>CONTAINER UPTIME</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>99.98%</div>
            </div>
          </div>
        </div>

        {/* Terminal Screen */}
        <div
          style={{
            backgroundColor: '#090D16',
            padding: 16,
            height: 220,
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#34D399',
            lineHeight: 1.6,
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          {logs.map((log, idx) => (
            <div key={idx} style={{ opacity: idx === logs.length - 1 ? 1 : 0.85 }}>
              {log}
            </div>
          ))}
          {isProcessing && (
            <div style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={12} className="animate-spin" /> Processing command...
            </div>
          )}
        </div>

        {/* Command Buttons */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#0F172A',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10
          }}
        >
          <button
            onClick={runDiagnostics}
            disabled={isProcessing}
            className="pixel-btn"
            style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Activity size={12} /> Run Health Check
          </button>
          <button
            onClick={simulateDeploy}
            disabled={isProcessing}
            className="pixel-btn pixel-btn-primary"
            style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Play size={12} /> Deploy Staging Hotfix
          </button>
        </div>
      </div>
    </div>
  );
};
