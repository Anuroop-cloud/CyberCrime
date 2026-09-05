'use client';

import { Suspense } from 'react';
import { CyberCrimePortalWorkspace } from '@/components/portal/CyberCrimePortalWorkspace';

export default function NewComplaintPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32 }}>Loading complaint registration...</div>}>
      <CyberCrimePortalWorkspace initialTab="register" />
    </Suspense>
  );
}
