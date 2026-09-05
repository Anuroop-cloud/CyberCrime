'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BrandLogo } from './BrandLogo';

/* ── Modern SVG Icon Primitives (Zero Emojis) ──────────────────── */
const Icons = {
  Home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  FilePlus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
  Activity: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <polyline points="11 8 11 12 13 14" />
    </svg>
  ),
  HelpCircle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  LogOut: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  PanelToggle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  ),
};

interface SidebarProps {
  onToggle?: (width: number) => void;
}

export default function Sidebar({ onToggle }: SidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [expanded, setExpanded] = useState(true);
  const [draftCount, setDraftCount] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    api.cases.stats().then(s => setDraftCount(s.draft)).catch(() => {});
  }, [pathname]);

  const W = expanded ? 240 : 74;

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    onToggle?.(next ? 240 : 74);
  };

  const NAV_ITEMS = [
    { href: '/dashboard?tab=home', tabKey: 'home', label: 'Home', Icon: Icons.Home },
    { href: '/dashboard?tab=register', tabKey: 'register', label: 'Register a Complaint', Icon: Icons.FilePlus },
    { href: '/dashboard?tab=track', tabKey: 'track', label: 'Track & Take Action', Icon: Icons.Activity, badge: '4 Urgent', badgeType: 'attention' },
    { href: '/dashboard?tab=help', tabKey: 'help', label: 'Help & Guides', Icon: Icons.HelpCircle },
  ];

  const [activePortalTab, setActivePortalTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      if (tab) return tab;
    }
    if (pathname === '/complaints/new') return 'register';
    if (pathname === '/track') return 'track';
    return 'home';
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<string>;
      if (ce.detail) setActivePortalTab(ce.detail);
    };
    window.addEventListener('portalTabChange', handler);
    return () => window.removeEventListener('portalTabChange', handler);
  }, []);

  const isItemActive = (item: (typeof NAV_ITEMS)[0]) => {
    return activePortalTab === item.tabKey;
  };


  const handleNavClick = (tabKey: string) => {
    setActivePortalTab(tabKey);
    window.dispatchEvent(new CustomEvent('portalTabChange', { detail: tabKey }));
  };



  return (
    <aside
      id="main-sidebar"
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: W,
        background: '#F7F7F7',
        borderRight: '1px solid #E8E8E8',
        display: 'flex',
        flexDirection: 'column',
        padding: '18px 0 16px',
        zIndex: 100,
        transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Brand Header + Collapse Toggle (Aarvak Reference Style) ── */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: expanded ? '14px 14px 18px' : '10px 8px 14px',
          borderBottom: '1px solid #EBEBEB',
          marginBottom: 14,
        }}
      >
        {expanded ? (
          <button
            onClick={toggle}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            style={{
              position: 'absolute',
              top: 10,
              right: 12,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              cursor: 'pointer',
              padding: '4px 5px',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
              transition: 'background 150ms, color 150ms',
              zIndex: 2,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F1F5F9';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <Icons.PanelToggle />
          </button>
        ) : (
          <button
            onClick={toggle}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              cursor: 'pointer',
              padding: '4px 5px',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            }}
          >
            <Icons.PanelToggle />
          </button>
        )}

        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <BrandLogo collapsed={!expanded} showcase={true} />
        </Link>
      </div>

      {/* ── Primary Navigation (New Buttons & Functions, No +New Complaint) ────────────────────────────── */}
      <nav style={{ flex: 1, padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {NAV_ITEMS.map(item => {
          const active = isItemActive(item);
          const hovered = hoveredItem === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => handleNavClick(item.tabKey)}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: expanded ? '10px 14px' : '10px',
                justifyContent: expanded ? 'flex-start' : 'center',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: active ? 600 : 500,
                fontSize: 13,
                color: active ? '#FFFFFF' : hovered ? '#0F172A' : '#475569',
                background: active ? '#0F766E' : hovered ? '#EDEDED' : 'transparent',
                transition: 'background 140ms ease, color 140ms ease',
                position: 'relative',
                whiteSpace: 'nowrap',
                boxShadow: active ? '0 2px 8px rgba(15, 118, 110, 0.28)' : 'none',
              }}
              title={!expanded ? item.label : undefined}
            >
              <span style={{ color: active ? '#FFFFFF' : hovered ? '#0F172A' : '#64748B', display: 'flex', alignItems: 'center' }}>
                <item.Icon />
              </span>
              {expanded && <span style={{ flex: 1 }}>{item.label}</span>}
              {expanded && item.badge !== undefined && (
                <span
                  style={{
                    background: item.badgeType === 'attention' ? (active ? '#EF4444' : '#FEE2E2') : (active ? 'rgba(255, 255, 255, 0.25)' : '#E2E8F0'),
                    color: item.badgeType === 'attention' ? (active ? '#FFFFFF' : '#B91C1C') : (active ? '#FFFFFF' : '#475569'),
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 999,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>


      {/* ── Bottom Section: Notifications, Profile, Sign Out ── */}
      <div
        style={{
          borderTop: '1px solid #EBEBEB',
          padding: '12px 8px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* User Card with Sign Out */}
        <div
          style={{
            padding: expanded ? '10px 10px' : '8px 4px',
            background: '#EFEFEF',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: expanded ? 'space-between' : 'center',
            gap: 8,
          }}
        >
          {expanded ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: '#135D66',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {user?.name ? user.name.slice(0, 1).toUpperCase() : 'A'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {user?.name || 'Citizen User'}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748B', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {user?.mobile || '9989284448'}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  padding: 6,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 150ms, background 150ms',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#EF4444';
                  e.currentTarget.style.background = '#FEE2E2';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#64748B';
                  e.currentTarget.style.background = 'none';
                }}
                title="Sign Out"
              >
                <Icons.LogOut />
              </button>
            </>
          ) : (
            <button
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
                padding: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Sign Out"
            >
              <Icons.LogOut />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
