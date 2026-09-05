import React from 'react';

type PrimaryTab = 'home' | 'register' | 'track' | 'help';

interface Props {
  activeTab: PrimaryTab;
  onTabChange: (tab: PrimaryTab) => void;
}

const TABS: { id: PrimaryTab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'register', label: 'Register a Complaint' },
  { id: 'track', label: 'Track & Take Action' },
  { id: 'help', label: 'Help' },
];

export function PrimaryPortalNav({ activeTab, onTabChange }: Props) {
  return (
    <nav
      aria-label="Portal Navigation"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        padding: '4px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
        gap: 6,
      }}
    >
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '8px 26px',
              minWidth: tab.id === 'home' || tab.id === 'help' ? 96 : 'auto',
              border: 'none',
              background: isActive ? '#0F172A' : 'transparent',
              color: isActive ? '#FFFFFF' : '#475569',
              fontSize: 13.5,
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
  );
}
