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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        background: '#F1F5F9',
        border: '1px solid #E2E8F0',
        padding: '3px 4px',
        borderRadius: 999,
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
              padding: '5px 14px',
              border: 'none',
              background: isActive ? '#0F172A' : 'transparent',
              color: isActive ? '#FFFFFF' : '#475569',
              fontSize: 12.5,
              fontWeight: isActive ? 600 : 500,
              borderRadius: 999,
              cursor: 'pointer',
              transition: 'all 150ms ease',
              fontFamily: "'Manrope', Helvetica, sans-serif",
              whiteSpace: 'nowrap',
              boxShadow: isActive ? '0 1px 3px rgba(15, 23, 42, 0.15)' : 'none',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
