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
        padding: '0 24px',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      <PortalIdentity />
      <PrimaryPortalNav activeTab={activeTab} onTabChange={onTabChange} />
      <UtilityActions />
    </header>
  );
}
