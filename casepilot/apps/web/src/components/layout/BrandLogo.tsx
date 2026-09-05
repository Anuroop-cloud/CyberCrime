'use client';

interface BrandLogoProps {
  collapsed?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ collapsed = false, size = 'md' }: BrandLogoProps) {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 42 : 34;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, userSelect: 'none' }}>
      {/* Official CasePilot Cyber Logo */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
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

      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: size === 'lg' ? 22 : 18,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#0F172A',
                lineHeight: 1.15,
              }}
            >
              CasePilot
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: '#135D66',
                background: 'rgba(19, 93, 102, 0.1)',
                padding: '2px 6px',
                borderRadius: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              AI Portal
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              color: '#64748B',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            Cybercrime Resolution
          </span>
        </div>
      )}
    </div>
  );
}
