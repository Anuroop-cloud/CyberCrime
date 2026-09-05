'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BrandLogo } from './BrandLogo';

/* ── Modern SVG Icon Primitives (Zero Emojis) ──────────────────── */
const Icons = {
  Grid: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  FileText: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Edit: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
  const [notifCount, setNotifCount] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    api.cases.stats().then(s => setDraftCount(s.draft)).catch(() => {});
    api.notifications.list().then(r => setNotifCount(r.unreadCount)).catch(() => {});
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const W = expanded ? 240 : 74;

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    onToggle?.(next ? 240 : 74);
  };

  const NAV_ITEMS = [
    { href: '/dashboard', label: 'Overview', Icon: Icons.Grid },
    { href: '/complaints/my', label: 'My Complaints', Icon: Icons.FileText },
    { href: '/complaints/drafts', label: 'Drafts', Icon: Icons.Edit, badge: draftCount || undefined },
    { href: '/track', label: 'Track Your Case', Icon: Icons.Search },
  ];

  const BOTTOM_ITEMS = [
    { href: '/notifications', label: 'Notifications', Icon: Icons.Bell, badge: notifCount || undefined },
    { href: '/profile', label: 'Profile', Icon: Icons.User },
  ];

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
      {/* ── Brand Header + Collapse Toggle ────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: expanded ? '0 16px 18px' : '0 12px 18px',
          justifyContent: expanded ? 'space-between' : 'center',
          borderBottom: '1px solid #EBEBEB',
          marginBottom: 14,
        }}
      >
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <BrandLogo collapsed={!expanded} size="md" />
        </Link>
        <button
          onClick={toggle}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 6,
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 150ms, color 150ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#E8E8E8';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <Icons.PanelToggle />
        </button>
      </div>

      {/* ── CTA: + New Complaint Button ───────────────────── */}
      <div style={{ padding: '0 12px', marginBottom: 16 }}>
        <Link
          href="/complaints/new"
          id="sidebar-new-complaint-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: expanded ? 'flex-start' : 'center',
            gap: 10,
            padding: expanded ? '10px 14px' : '10px',
            background: 'linear-gradient(135deg, #135D66 0%, #10A19D 100%)',
            color: '#FFFFFF',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            textDecoration: 'none',
            boxShadow: '0 3px 8px rgba(19, 93, 102, 0.22)',
            transition: 'opacity 150ms, transform 150ms',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '0.92';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          title="File a New Cybercrime Complaint"
        >
          <Icons.Plus />
          {expanded && <span>+ New Complaint</span>}
        </Link>
      </div>

      {/* ── Primary Navigation ────────────────────────────── */}
      <nav style={{ flex: 1, padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href);
          const hovered = hoveredItem === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: expanded ? '9px 12px' : '9px',
                justifyContent: expanded ? 'flex-start' : 'center',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: active ? 600 : 500,
                fontSize: 13,
                color: active ? '#FFFFFF' : hovered ? '#0F172A' : '#475569',
                background: active ? '#135D66' : hovered ? '#EDEDED' : 'transparent',
                transition: 'background 150ms, color 150ms',
                position: 'relative',
                whiteSpace: 'nowrap',
              }}
              title={!expanded ? item.label : undefined}
            >
              <item.Icon />
              {expanded && <span style={{ flex: 1 }}>{item.label}</span>}
              {expanded && item.badge !== undefined && (
                <span
                  style={{
                    background: active ? 'rgba(255, 255, 255, 0.25)' : '#E2E8F0',
                    color: active ? '#FFFFFF' : '#475569',
                    fontSize: 11,
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
        {BOTTOM_ITEMS.map(item => {
          const active = isActive(item.href);
          const hovered = hoveredItem === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: expanded ? '9px 12px' : '9px',
                justifyContent: expanded ? 'flex-start' : 'center',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: active ? 600 : 500,
                fontSize: 13,
                color: active ? '#FFFFFF' : hovered ? '#0F172A' : '#475569',
                background: active ? '#135D66' : hovered ? '#EDEDED' : 'transparent',
                transition: 'background 150ms, color 150ms',
                whiteSpace: 'nowrap',
              }}
              title={!expanded ? item.label : undefined}
            >
              <item.Icon />
              {expanded && <span style={{ flex: 1 }}>{item.label}</span>}
              {expanded && item.badge !== undefined && (
                <span
                  style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 999,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* User Card with Sign Out */}
        <div
          style={{
            marginTop: 8,
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
