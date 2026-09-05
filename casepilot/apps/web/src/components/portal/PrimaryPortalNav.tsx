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
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
              background: isActive ? '#0F172A' : 'transparent',
              color: isActive ? '#FFFFFF' : '#475569',
              fontSize: 13.5,
              fontWeight: isActive ? 600 : 500,
              borderRadius: 20,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
