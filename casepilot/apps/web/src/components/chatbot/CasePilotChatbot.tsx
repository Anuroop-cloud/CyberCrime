'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

/* ── Modern SVG Icons (Zero Emojis) ────────────────────────────── */
const BotIcons = {
  Message: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Maximize: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

export function CasePilotChatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello, I am CasePilot Assistant. Have you experienced an online scam, cyber harassment, or financial fraud? I can help you report and draft an official complaint.',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.ai.intake({ message: userText });
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: res.message || 'I have analyzed your situation. Would you like to open the full 50/50 filing workspace to complete your complaint?',
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'I have noted your report. You can click "Open 50/50 Workspace" above to see the official cybercrime form filled live.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openFullWorkspace = () => {
    setIsOpen(false);
    router.push('/complaints/new');
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999 }}>
      {/* Mini Chat Window */}
      {isOpen && (
        <div
          style={{
            width: 380,
            height: 500,
            background: '#FFFFFF',
            borderRadius: 14,
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.18)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            marginBottom: 16,
            animation: 'fadeIn 200ms ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #135D66 0%, #10A19D 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BotIcons.Shield />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>CasePilot Assistant</div>
                <div style={{ fontSize: 10.5, opacity: 0.85 }}>Online • Jiva 2.0 Engine</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                onClick={openFullWorkspace}
                title="Open 50/50 Workspace"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '5px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <BotIcons.Maximize />
                <span>50/50 View</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: 4,
                  cursor: 'pointer',
                }}
              >
                <BotIcons.X />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: 14,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: '#F8FAFC',
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '10px 12px',
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user' ? '#135D66' : '#FFFFFF',
                  color: m.role === 'user' ? '#FFFFFF' : '#0F172A',
                  fontSize: 12.5,
                  lineHeight: 1.45,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: m.role === 'user' ? 'none' : '1px solid #E2E8F0',
                  whiteSpace: 'pre-line',
                }}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: '6px 12px', background: '#FFFFFF', borderRadius: 8, fontSize: 11.5, color: '#64748B', border: '1px solid #E2E8F0' }}>
                Analyzing incident...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt CTA */}
          <div
            style={{
              padding: '8px 12px',
              background: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 11, color: '#64748B' }}>Ready to file your complaint?</span>
            <button
              type="button"
              onClick={openFullWorkspace}
              style={{
                background: '#135D66',
                color: '#FFFFFF',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Open 50/50 Form
            </button>
          </div>

          {/* Input */}
          <div
            style={{
              padding: 10,
              background: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend(input);
              }}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 6,
                border: '1px solid #CBD5E1',
                fontSize: 12.5,
                outline: 'none',
              }}
            />
            <button
              type="button"
              disabled={!input.trim() || loading}
              onClick={() => handleSend(input)}
              style={{
                padding: '8px 10px',
                background: input.trim() && !loading ? '#135D66' : '#E2E8F0',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 6,
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BotIcons.Send />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #135D66 0%, #10A19D 100%)',
            color: '#FFFFFF',
            border: 'none',
            boxShadow: '0 6px 16px rgba(19, 93, 102, 0.35)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 150ms ease, box-shadow 150ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.06)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(19, 93, 102, 0.45)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(19, 93, 102, 0.35)';
          }}
          title="Open CasePilot AI Assistant"
        >
          <BotIcons.Message />
        </button>
      )}
    </div>
  );
}
