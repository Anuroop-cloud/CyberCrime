'use client';

interface BrandLogoProps {
  collapsed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showcase?: boolean;
}

export function BrandLogo({ collapsed = false, size = 'md', showcase = false }: BrandLogoProps) {
  if (showcase) {
    if (collapsed) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
              flexShrink: 0,
              padding: 2,
            }}
          >
            <img
              src="/casepilot-logo.png"
              alt="CasePilot Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none', textAlign: 'center' }}>
        {/* Prominent Large Logo Emblem (Aarvak reference style) */}
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: 14,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.07)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
            flexShrink: 0,
            padding: 4,
          }}
        >
          <img
            src="/casepilot-logo.png"
            alt="CasePilot Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* CasePilot Brand Title */}
        <div
          style={{
            fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#0F172A',
            marginTop: 10,
            lineHeight: 1.15,
          }}
        >
          CasePilot
        </div>

        {/* Subtle Subtitle */}
        <div
          style={{
            fontSize: 11,
            color: '#64748B',
            fontWeight: 500,
            marginTop: 3,
            letterSpacing: '0.01em',
          }}
        >
          Citizen Cybercrime Portal
        </div>
      </div>
    );
  }

  const iconSize = size === 'sm' ? 30 : size === 'lg' ? 48 : 42;

  return (
    <div style={{ display: 'flex', alignItems: 'center', userSelect: 'none' }}>
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: 10,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
          flexShrink: 0,
          padding: 2,
        }}
      >
        <img
          src="/casepilot-logo.png"
          alt="CasePilot Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
}
