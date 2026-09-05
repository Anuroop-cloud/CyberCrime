'use client';

import { Suspense } from 'react';
import { CyberCrimePortalWorkspace } from '@/components/portal/CyberCrimePortalWorkspace';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32 }}>Loading workspace...</div>}>
      <CyberCrimePortalWorkspace />
    </Suspense>
  );
}
