import React from 'react';

const PhoneCallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export function UtilityActions() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
      <a
        href="tel:1930"
        id="topbar-helpline-chip"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          fontWeight: 600,
          color: '#0F766E',
          background: '#F0FDFA',
          border: '1px solid #CCFBF1',
          padding: '5px 12px',
          borderRadius: 999,
          textDecoration: 'none',
          transition: 'all 150ms ease',
          fontFamily: "'Manrope', Helvetica, sans-serif",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#CCFBF1';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#F0FDFA';
        }}
      >
        <PhoneCallIcon />
        <span>1930</span>
        <span style={{ color: '#0D9488', fontWeight: 500, fontSize: 11 }}>• Helpline</span>
      </a>
    </div>
  );
}
