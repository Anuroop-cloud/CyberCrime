'use client';
import React from 'react';

export function PortalIdentity() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: '#E6F5F2',
        border: '1px solid #D0EBE5',
        borderRadius: 999,
        padding: '5px 16px 5px 6px',
        userSelect: 'none',
        boxShadow: '0 1px 2px rgba(15, 118, 110, 0.04)',
      }}
    >
      {/* Circular Avatar / Badge with subtle teal outline matching Aarvak reference */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1.5px solid rgba(0, 122, 120, 0.35)',
          background: 'rgba(0, 122, 120, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#007A78',
          fontWeight: 700,
          fontSize: 14,
          flexShrink: 0,
          fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        C
      </div>

      {/* Brand Text Column */}
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
        <span
          style={{
            fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 13.5,
            fontWeight: 700,
            color: '#007A78',
            letterSpacing: '-0.01em',
          }}
        >
          CasePilot
        </span>
        <span
          style={{
            fontSize: 11,
            color: '#4B7C79',
            fontWeight: 500,
            letterSpacing: '0.01em',
            marginTop: 1,
          }}
        >
          Citizen Cybercrime Portal
        </span>
      </div>
    </div>
  );
}
