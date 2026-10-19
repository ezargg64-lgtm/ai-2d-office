import React, { useState, useEffect } from 'react';
import { X, Save, Sliders, ShieldCheck, RefreshCw } from 'lucide-react';
import { Agent } from '../types';

interface SettingsModalProps {
  agents: Agent[];
  onClose: () => void;
  onUpdateAgent: (updated: Agent) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ agents, onClose, onUpdateAgent }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'sarah');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const a = agents.find(ag => ag.id === selectedAgentId);
    if (a) {
      setSelectedAgent(a);
      setPromptInput(a.systemPrompt);
      setRoleInput(a.role);
    }
  }, [selectedAgentId, agents]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent || isSaving) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/agents/${selectedAgent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: roleInput,
          systemPrompt: promptInput
        })
      });

      if (res.ok) {
        const updated = await res.json();
        onUpdateAgent(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update agent:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(11, 15, 25, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 55,
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
          maxWidth: 640,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          boxShadow: '0 20px 50px rgba(0,0,0,0.85)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(30, 41, 59, 0.7)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={18} color="#38BDF8" />
            <span style={{ fontWeight: 600, fontSize: 15, color: '#F8FAFC' }}>
              Office Settings & Agent Prompts
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', gap: 16 }}>
          {/* Agent Picker List */}
          <div style={{ width: 180, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>
              STAFF ROSTER
            </div>
            {agents.map(ag => (
              <button
                key={ag.id}
                onClick={() => setSelectedAgentId(ag.id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 6,
                  textAlign: 'left',
                  backgroundColor: selectedAgentId === ag.id ? '#0284C7' : '#1E293B',
                  border: selectedAgentId === ag.id ? '1px solid #38BDF8' : '1px solid #334155',
                  color: '#F8FAFC',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: ag.color }} />
                <span>{ag.name}</span>
              </button>
            ))}
          </div>

          {/* Form Editor */}
          {selectedAgent && (
            <form onSubmit={handleSave} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>
                  AGENT TITLE & ROLE
                </label>
                <input
                  type="text"
                  value={roleInput}
                  onChange={e => setRoleInput(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: 6,
                    padding: '8px 12px',
                    color: '#F8FAFC',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>
                  GEMINI SYSTEM INSTRUCTION (PERSISTENT)
                </label>
                <textarea
                  value={promptInput}
                  onChange={e => setPromptInput(e.target.value)}
                  rows={8}
                  style={{
                    flex: 1,
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: 6,
                    padding: '10px 12px',
                    color: '#F8FAFC',
                    fontSize: 12,
                    lineHeight: 1.5,
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <div style={{ fontSize: 11, color: saveSuccess ? '#34D399' : '#64748B' }}>
                  {saveSuccess ? '✓ Saved & Persisted to data store' : 'Changes write to /home/container/data/'}
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="pixel-btn pixel-btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Save size={13} />
                  <span>{isSaving ? 'Saving...' : 'Save Agent'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
