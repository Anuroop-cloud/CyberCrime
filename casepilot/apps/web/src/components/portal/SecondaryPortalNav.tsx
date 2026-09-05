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
        padding: '12px 32px 0',
        gap: 24,
        borderBottom: '1px solid #E2E8F0',
        background: '#F8FAFC',
        overflowX: 'auto',
        flexShrink: 0,
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
              padding: '0 0 10px 0',
              border: 'none',
              borderBottom: isActive ? '2.5px solid #0F766E' : '2.5px solid transparent',
              background: 'transparent',
              color: isActive ? '#0F766E' : '#64748B',
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
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
