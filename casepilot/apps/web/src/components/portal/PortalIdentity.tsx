import React from 'react';

export function PortalIdentity() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
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

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1 }}>
          CasePilot
        </div>
        <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>Citizen Cybercrime Portal</span>
          <span style={{ color: '#CBD5E1' }}>•</span>
          <span style={{ fontSize: 10, color: '#64748B', background: '#F1F5F9', padding: '1px 5px', borderRadius: 4 }}>
            Prototype
          </span>
        </div>
      </div>
    </div>
  );
}
