import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './game/config';
import { eventBus } from './game/eventBus';
import { Agent, Deliverable } from './types';
import { TopBar } from './components/TopBar';
import { ChatDrawer } from './components/ChatDrawer';
import { Deliverables } from './components/Deliverables';
import { MiniMap } from './components/MiniMap';
import { MobileControls } from './components/MobileControls';
import { SettingsModal } from './components/SettingsModal';
import { ArcadeModal } from './components/ArcadeModal';
import { CafeModal } from './components/CafeModal';
import { ServerTerminalModal } from './components/ServerTerminalModal';

export const App: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeChatAgent, setActiveChatAgent] = useState<Agent | null>(null);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [isCafeOpen, setIsCafeOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [energy, setEnergy] = useState(95);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Phaser Game instance
  useEffect(() => {
    if (!gameContainerRef.current) return;

    if (!phaserGameRef.current) {
      const config = createGameConfig(gameContainerRef.current);
      phaserGameRef.current = new Phaser.Game(config);
    }

    return () => {
      phaserGameRef.current?.destroy(true);
      phaserGameRef.current = null;
    };
  }, []);

  // Fetch initial data & register gameplay events
  useEffect(() => {
    loadAgents();
    loadDeliverables();

    // Event bus handlers
    const unsubAgent = eventBus.on('open:agent', (agentId: string) => {
      setAgents(prev => {
        const found = prev.find(a => a.id === agentId);
        if (found) {
          setIsMeetingOpen(false);
          setActiveChatAgent(found);
        }
        return prev;
      });
    });

    const unsubMeeting = eventBus.on('open:meeting', () => {
      setActiveChatAgent(null);
      setIsMeetingOpen(true);
    });

    const unsubCafe = eventBus.on('open:cafe', () => {
      setIsCafeOpen(true);
    });

    const unsubArcade = eventBus.on('open:arcade', () => {
      setIsArcadeOpen(true);
    });

    const unsubTerminal = eventBus.on('open:terminal', () => {
      setIsTerminalOpen(true);
    });

    const unsubPet = eventBus.on('pet:corgi', () => {
      triggerToast('🐶 You petted Pixel the Corgi! Tail wagging & team morale boosted! ❤️');
      setEnergy(prev => Math.min(100, prev + 5));
    });

    // 3-second simulation state polling
    const pollInterval = setInterval(() => {
      pollSimulationState();
    }, 3000);

    return () => {
      unsubAgent();
      unsubMeeting();
      unsubCafe();
      unsubArcade();
      unsubTerminal();
      unsubPet();
      clearInterval(pollInterval);
    };
  }, []);

  const loadAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
    }
  };

  const loadDeliverables = async () => {
    try {
      const res = await fetch('/api/tasks/deliverables');
      if (res.ok) {
        const data = await res.json();
        setDeliverables(data);
      }
    } catch (err) {
      console.error('Error fetching deliverables:', err);
    }
  };

  const pollSimulationState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const state = await res.json();
        if (state.latestDeliverable) {
          setDeliverables(prev => {
            const exists = prev.some(d => d.id === state.latestDeliverable.id);
            if (!exists) {
              triggerToast(`📬 New delivery from ${state.latestDeliverable.author}!`);
              return [state.latestDeliverable, ...prev];
            }
            return prev;
          });
        }
      }
    } catch {
      // Ignore background network fluctuations
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBrewCoffee = (_type: string, energyGain: number, speedBuff?: number, toastMsg?: string) => {
    setEnergy(prev => Math.min(100, prev + energyGain));
    if (speedBuff) {
      eventBus.emit('buff:speed', speedBuff);
    }
    if (toastMsg) {
      triggerToast(toastMsg);
    }
  };

  const handleUpdateAgent = (updated: Agent) => {
    setAgents(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    if (activeChatAgent?.id === updated.id) {
      setActiveChatAgent(updated);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 1. Phaser 3 Canvas Container */}
      <div id="phaser-container" ref={gameContainerRef} />

      {/* 2. Top Bar HUD Overlay */}
      <TopBar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenMeeting={() => {
          setActiveChatAgent(null);
          setIsMeetingOpen(true);
        }}
        energy={energy}
      />

      {/* 3. Warm Radar MiniMap */}
      <MiniMap />

      {/* 4. Task Deliverables Pill */}
      <Deliverables deliverables={deliverables} />

      {/* 5. Mobile Virtual Controls */}
      <MobileControls />

      {/* 6. Agent Dialogue or All-Hands Chat Drawer */}
      {(activeChatAgent || isMeetingOpen) && (
        <ChatDrawer
          agent={activeChatAgent}
          isMeeting={isMeetingOpen}
          onClose={() => {
            setActiveChatAgent(null);
            setIsMeetingOpen(false);
          }}
        />
      )}

      {/* 7. Settings & Agent Prompt Editor Modal */}
      {isSettingsOpen && (
        <SettingsModal
          agents={agents}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateAgent={handleUpdateAgent}
        />
      )}

      {/* 8. Playable Vintage Arcade Machine Modal */}
      {isArcadeOpen && (
        <ArcadeModal onClose={() => setIsArcadeOpen(false)} />
      )}

      {/* 9. Artisanal Coffee Bar Barista Modal */}
      {isCafeOpen && (
        <CafeModal onClose={() => setIsCafeOpen(false)} onBrew={handleBrewCoffee} />
      )}

      {/* 10. DevOps Server Terminal Modal */}
      {isTerminalOpen && (
        <ServerTerminalModal onClose={() => setIsTerminalOpen(false)} />
      )}

      {/* 11. Global Floating Toast */}
      {toastMessage && (
        <div
          className="pixel-box-amber animate-pulse-subtle"
          style={{
            position: 'absolute',
            bottom: 84,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            padding: '10px 18px',
            borderRadius: 8,
            fontSize: 12,
            color: '#FDE68A',
            pointerEvents: 'none',
            boxShadow: '0 8px 30px rgba(0,0,0,0.85)'
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};
export default App;
