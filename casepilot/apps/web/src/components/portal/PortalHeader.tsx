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
    <div
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '24px 32px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <PortalIdentity />
        <UtilityActions />
      </div>
      
      <PrimaryPortalNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
