'use client';
import Sidebar from '@/components/layout/Sidebar';
import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';

const PAGE_META: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard':         { title: 'Overview',          subtitle: 'Your case portal at a glance' },
  '/complaints/new':    { title: 'New Complaint',     subtitle: 'Three-Zone Structured Workspace • Central Form & Live AI Driver' },
  '/complaints/my':     { title: 'My Complaints',     subtitle: 'All complaints registered to your account' },
  '/complaints/drafts': { title: 'Drafts',            subtitle: 'Saved drafts awaiting submission' },
  '/track':             { title: 'Track Your Case',   subtitle: 'Live status, timeline and escalation guidance' },
  '/notifications':     { title: 'Notifications',     subtitle: 'Updates on your cases and investigation alerts' },
  '/profile':           { title: 'Profile',           subtitle: 'Citizen identification and jurisdictional address' },
};

function Topbar() {
  const pathname = usePathname();
  const base = '/' + pathname.split('/').slice(1, 3).join('/');
  const meta = PAGE_META[pathname] ?? PAGE_META[base] ?? { title: 'CasePilot' };

  return (
    <header
      id="main-topbar"
      role="banner"
      style={{
        height: 60,
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        flexShrink: 0,
      }}
    >
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>{meta.title}</div>
        {meta.subtitle && (
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{meta.subtitle}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} id="topbar-actions">
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: '#135D66',
            background: 'rgba(19, 93, 102, 0.08)',
            padding: '4px 10px',
            borderRadius: 6,
          }}
        >
          National Cybercrime Portal Integration • Active
        </div>
      </div>
    </header>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarW, setSidebarW] = useState(240);

  useEffect(() => {
    const handler = (e: CustomEvent) => setSidebarW(e.detail.width as number);
    window.addEventListener('sidebarToggle', handler as EventListener);
    return () => window.removeEventListener('sidebarToggle', handler as EventListener);
  }, []);

  const isFullWorkspace = pathname === '/complaints/new' || pathname === '/dashboard' || pathname.startsWith('/dashboard') || pathname === '/track';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar
        onToggle={(w: number) => {
          setSidebarW(w);
          window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { width: w } }));
        }}
      />
      <div
        id="main-content"
        style={{
          marginLeft: sidebarW,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          minWidth: 0,
        }}
      >
        {!isFullWorkspace && <Topbar />}
        <main
          id="page-content"
          style={{
            flex: 1,
            padding: isFullWorkspace ? 0 : 24,
            overflowX: 'hidden',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
