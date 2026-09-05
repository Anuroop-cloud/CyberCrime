import React from 'react';
import { PortalIdentity } from './PortalIdentity';
import { UtilityActions } from './UtilityActions';

interface Props {
  activeTab?: string;
  onTabChange?: (tab: any) => void;
}

export function PortalHeader({}: Props) {
  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        flexShrink: 0,
        zIndex: 20,
        height: 74,
      }}
    >
      <PortalIdentity />
      <UtilityActions />
    </header>
  );
}
