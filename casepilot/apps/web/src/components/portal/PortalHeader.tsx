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
      id="portal-top-header"
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0 24px',
        height: 54,
        minHeight: 54,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 30,
        boxSizing: 'border-box',
      }}
    >
      <PortalIdentity />
      <PrimaryPortalNav activeTab={activeTab} onTabChange={onTabChange} />
      <UtilityActions />
    </header>
  );
}
