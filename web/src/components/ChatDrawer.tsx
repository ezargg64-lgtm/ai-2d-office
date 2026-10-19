import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { Agent, MeetingMessage, ChatMessage } from '../types';
import { eventBus } from '../game/eventBus';

interface ChatDrawerProps {
  agent: Agent | null;
  isMeeting: boolean;
  onClose: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ agent, isMeeting, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [meetingTopic, setMeetingTopic] = useState('Sprint 14: 60FPS Mobile Optimization & Deployment');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation
  useEffect(() => {
    if (isMeeting) {
      startMeeting();
    } else if (agent) {
      loadAgentIntro();
    }
  }, [agent, isMeeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadAgentIntro = () => {
    if (!agent) return;
    setMessages([
      {
        sender: agent.id,
        name: agent.name,
        text: getAgentWelcome(agent),
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const getAgentWelcome = (a: Agent) => {
    switch (a.id) {
      case 'sarah':
        return `Hey boss! Sprint 14 is running smooth. 3 tasks in flight, Dana's touch controls are wrapped, and Owen is staging the container. What's on your mind?`;
      case 'maya':
        return `Hello! PRD v2.1 is open on my screen. We have 4 critical user stories awaiting your priority ranking before development kicks off.`;
      case 'uma':
        return `Hey there! Check out the 16-bit color palettes I put together. Do you prefer the warm retro wood aesthetic or the clean modern office look?`;
      case 'dana':
        return `Yo! Phaser 3 canvas is rendering at crisp 60fps on mobile with zero frame drops. Component library is 80% done!`;
      case 'dev':
        return `Hey! Auth token gateway and data persistence to /home/container/data are rock-solid. Let me know if you want to inspect API schemas.`;
      case 'owen':
        return `Everything is green on my dashboard. Pterodactyl container memory is 38MB. Ready to deploy whenever you give the word!`;
      case 'quinn':
        return `Reporting in: touch input test suite passed on mobile Safari and Android Chrome. Boundary boxes verified!`;
      default:
        return `Hello Owner! Ready to assist with today's objectives.`;
    }
  };

  const startMeeting = async () => {
    eventBus.emit('meeting:gather');
    setIsTyping(true);
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: meetingTopic })
      });
      if (res.ok) {
        const meeting = await res.json();
        setMessages(
          meeting.messages.map((m: MeetingMessage) => ({
            sender: m.sender,
            name: m.speaker,
            text: m.text,
            timestamp: new Date(m.timestamp).toLocaleTimeString()
          }))
        );
      }
    } catch (err) {
      console.error('Meeting error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    setInputValue('');

    const newMsg: ChatMessage = {
      sender: 'user',
      name: 'The Owner (You)',
      text: userText,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    try {
      if (isMeeting) {
        const res = await fetch('/api/meetings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText, topic: meetingTopic })
        });
        if (res.ok) {
          const meeting = await res.json();
          setMessages(
            meeting.messages.map((m: MeetingMessage) => ({
              sender: m.sender,
              name: m.speaker,
              text: m.text,
              timestamp: new Date(m.timestamp).toLocaleTimeString()
            }))
          );
        }
      } else if (agent) {
        const res = await fetch(`/api/agents/${agent.id}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            history: messages.slice(-6)
          })
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(prev => [
            ...prev,
            {
              sender: agent.id,
              name: data.name,
              text: data.reply,
              timestamp: new Date().toLocaleTimeString()
            }
          ]);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEndMeeting = async () => {
    try {
      await fetch('/api/meetings/end', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    eventBus.emit('meeting:dismiss');
    onClose();
  };

  return (
    <aside
      className="pixel-box"
      style={{
        position: 'absolute',
        top: 68,
        right: 12,
        bottom: 12,
        width: '100%',
        maxWidth: 420,
        zIndex: 45,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 35px rgba(0, 0, 0, 0.75)'
      }}
    >
      {/* Drawer Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(30, 41, 59, 0.7)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isMeeting ? (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                backgroundColor: '#7E22CE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={18} color="#FFFFFF" />
            </div>
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                backgroundColor: agent?.color || '#0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-pixel)',
                fontSize: 12,
                color: '#FFFFFF'
              }}
            >
              {agent?.name.charAt(0)}
            </div>
          )}

          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#F8FAFC' }}>
              {isMeeting ? 'All-Hands Meeting Room' : agent?.name}
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>
              {isMeeting ? '7 Staff Assembled at Pod' : agent?.role}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isMeeting && (
            <button
              onClick={handleEndMeeting}
              className="pixel-btn"
              style={{ fontSize: 9, padding: '4px 8px', borderColor: '#EF4444', color: '#F87171' }}
            >
              Conclude
            </button>
          )}
          <button
            onClick={() => {
              if (isMeeting) eventBus.emit('meeting:dismiss');
              onClose();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Agent status banner if 1-on-1 */}
      {!isMeeting && agent && (
        <div
          style={{
            padding: '8px 16px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderBottom: '1px solid #1E293B',
            fontSize: 11,
            color: '#38BDF8',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Sparkles size={12} />
          <span>Status: {agent.status}</span>
        </div>
      )}

      {/* Messages stream */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}
      >
        {messages.map((msg, i) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: 4
              }}
            >
              <div style={{ fontSize: 10, color: '#64748B', padding: '0 4px' }}>
                {msg.name} • {msg.timestamp}
              </div>
              <div
                style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  lineHeight: 1.5,
                  backgroundColor: isUser ? '#0284C7' : '#1E293B',
                  color: '#F8FAFC',
                  border: isUser ? '1px solid #38BDF8' : '1px solid #334155',
                  wordBreak: 'break-word'
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#38BDF8' }}>
            <Bot size={13} className="animate-spin" />
            <span>Consulting intelligence network...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input box */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '12px 14px',
          borderTop: '1px solid #334155',
          background: 'rgba(15, 23, 42, 0.9)',
          display: 'flex',
          gap: 8
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={isMeeting ? 'Speak to the team in meeting...' : `Talk to ${agent?.name}...`}
          style={{
            flex: 1,
            backgroundColor: '#1E293B',
            border: '1px solid #475569',
            borderRadius: 6,
            padding: '8px 12px',
            color: '#F8FAFC',
            fontSize: 13,
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="pixel-btn pixel-btn-primary"
          style={{ opacity: !inputValue.trim() ? 0.6 : 1 }}
        >
          <Send size={13} />
        </button>
      </form>
    </aside>
  );
};
