import React from 'react';

export function PortalIdentity() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          flexShrink: 0,
        }}
      >
        <img
          src="/casepilot-logo.png"
          alt="CasePilot Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            fontFamily: "'Manrope', Helvetica, sans-serif",
            lineHeight: 1,
          }}
        >
          CasePilot
        </span>
        <span
          style={{
            fontSize: 11,
            color: '#0F766E',
            background: '#F0FDFA',
            border: '1px solid #CCFBF1',
            padding: '2px 8px',
            borderRadius: 6,
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          Citizen Portal
        </span>
      </div>
    </div>
  );
}
