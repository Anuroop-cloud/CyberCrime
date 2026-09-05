import React from 'react';

interface TabItem {
  id: string | number;
  label: string;
}

interface Props {
  tabs: TabItem[];
  activeTab: string | number;
  onTabChange: (id: any) => void;
}

export function SecondaryPortalNav({ tabs, activeTab, onTabChange }: Props) {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 24px',
        borderBottom: '1px solid #E2E8F0',
        background: '#FFFFFF',
        flexShrink: 0,
        width: '100%',
      }}
    >
      <nav
        aria-label="Sub Navigation"
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '4px',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
          gap: 6,
        }}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 16px',
                border: 'none',
                background: isActive ? '#0F172A' : 'transparent',
                color: isActive ? '#FFFFFF' : '#475569',
                fontSize: 13,
                fontWeight: isActive ? 700 : 600,
                letterSpacing: '-0.01em',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 140ms ease',
                fontFamily: "'Manrope', Helvetica, sans-serif",
                whiteSpace: 'nowrap',
                lineHeight: 1.3,
                boxShadow: isActive ? '0 2px 6px rgba(15, 23, 42, 0.18)' : 'none',
                textAlign: 'center',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = '#0F172A';
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.06)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = '#475569';
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
