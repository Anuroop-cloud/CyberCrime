'use client';

import { Suspense } from 'react';
import { CyberCrimePortalWorkspace } from '@/components/portal/CyberCrimePortalWorkspace';

export default function TrackPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32 }}>Loading case tracking...</div>}>
      <CyberCrimePortalWorkspace initialTab="track" />
    </Suspense>
  );
}
