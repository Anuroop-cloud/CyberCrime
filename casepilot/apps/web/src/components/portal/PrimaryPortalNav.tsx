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
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 10,
        padding: '3px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
        gap: 2,
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
              padding: '6px 16px',
              border: 'none',
              background: isActive ? '#000000' : 'transparent',
              color: isActive ? '#FFFFFF' : '#475569',
              fontSize: 12.5,
              fontWeight: isActive ? 600 : 500,
              borderRadius: 7,
              cursor: 'pointer',
              transition: 'all 120ms ease',
              fontFamily: "'Manrope', Helvetica, sans-serif",
              whiteSpace: 'nowrap',
              lineHeight: 1.3,
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.color = '#0F172A';
                e.currentTarget.style.background = '#F8FAFC';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.color = '#475569';
                e.currentTarget.style.background = 'transparent';
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
