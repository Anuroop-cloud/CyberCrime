import React from 'react';

export function PortalIdentity() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          CasePilot
        </div>
        <div style={{ fontSize: 13, color: '#475569', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Citizen Cybercrime Portal</span>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <span style={{ fontSize: 11, color: '#64748B', background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>
            Prototype • NCRP workflow
          </span>
        </div>
      </div>
    </div>
  );
}
