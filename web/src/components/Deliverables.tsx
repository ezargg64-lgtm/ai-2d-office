import React, { useState } from 'react';
import { Mail, CheckCircle2, X, ChevronRight } from 'lucide-react';
import { Deliverable } from '../types';

interface DeliverablesProps {
  deliverables: Deliverable[];
}

export const Deliverables: React.FC<DeliverablesProps> = ({ deliverables }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (deliverables.length === 0) return null;

  return (
    <>
      {/* Floating Deliverables Pill (Bottom Right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pixel-box-amber"
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          zIndex: 35,
          padding: '8px 14px',
          borderRadius: 24,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#FDE68A',
          fontSize: 12,
          fontWeight: 600,
          border: '2px solid #F59E0B'
        }}
      >
        <Mail size={15} />
        <span>📬 {deliverables.length} Deliverable{deliverables.length > 1 ? 's' : ''}</span>
      </button>

      {/* Expanded Deliverables Modal */}
      {isOpen && (
        <div
          className="pixel-box"
          style={{
            position: 'absolute',
            bottom: 74,
            right: 24,
            width: 360,
            maxHeight: 460,
            zIndex: 40,
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 12px 35px rgba(0,0,0,0.8)'
          }}
        >
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: '#38BDF8' }}>
              <CheckCircle2 size={16} />
              <span>Office Deliverables</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {deliverables.map(deliv => (
              <div
                key={deliv.id}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#1E293B',
                  borderRadius: 6,
                  border: '1px solid #334155'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#F59E0B', marginBottom: 4 }}>
                  <span>{deliv.author}</span>
                  <span>{new Date(deliv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#F8FAFC', marginBottom: 4 }}>
                  {deliv.title}
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.4 }}>
                  {deliv.summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
