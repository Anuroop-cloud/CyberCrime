import React from 'react';
import { PortalIdentity } from './PortalIdentity';
import { PrimaryPortalNav } from './PrimaryPortalNav';
import { UtilityActions } from './UtilityActions';

type PrimaryTab = 'home' | 'register' | 'track' | 'help';

interface Props {
  activeTab: PrimaryTab;
  onTabChange: (tab: PrimaryTab) => void;
}

export function PortalHeader({ activeTab, onTabChange }: Props) {
  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          padding: '10px 28px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <PortalIdentity />
        <UtilityActions />
      </div>

      {/* Tab Bar Row below Header */}
      <div
        style={{
          padding: '8px 28px 10px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <PrimaryPortalNav activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </header>
  );
}
