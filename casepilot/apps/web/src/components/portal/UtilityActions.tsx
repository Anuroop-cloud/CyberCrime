'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

const PhoneCallIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export function UtilityActions() {
  const { user } = useAuth();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    api.notifications.list().then(r => setNotifCount(r.unreadCount)).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* Statutory 1930 Emergency Helpline */}
      <a
        href="tel:1930"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          color: '#0F766E',
          fontWeight: 600,
          background: '#F0FDFA',
          border: '1px solid #CCFBF1',
          padding: '6px 12px',
          borderRadius: 20,
          textDecoration: 'none',
          transition: 'background 150ms ease',
        }}
        title="Call National Cyber Fraud Helpline"
      >
        <PhoneCallIcon />
        <span>1930 • Cyber Fraud Helpline</span>
      </a>

      {/* Notifications Button */}
      <Link
        href="/notifications"
        aria-label="Notifications"
        title="Notifications"
        style={{
          position: 'relative',
          width: 36,
          height: 36,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748B',
          background: 'transparent',
          border: '1px solid transparent',
          textDecoration: 'none',
          transition: 'all 150ms ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#F1F5F9';
          e.currentTarget.style.color = '#0F172A';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#64748B';
        }}
      >
        <BellIcon />
        {notifCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              background: '#EF4444',
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 700,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              border: '2px solid #FFFFFF',
              lineHeight: 1,
            }}
          >
            {notifCount}
          </span>
        )}
      </Link>

      {/* Divider */}
      <div style={{ width: 1, height: 22, background: '#E2E8F0', margin: '0 2px' }} />

      {/* Profile Capsule */}
      <Link
        href="/profile"
        aria-label="Profile"
        title="Your Profile"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
          padding: '3px 10px 3px 4px',
          borderRadius: 20,
          border: '1px solid #E2E8F0',
          background: '#FFFFFF',
          transition: 'all 150ms ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#CBD5E1';
          e.currentTarget.style.background = '#F8FAFC';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.style.background = '#FFFFFF';
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#0F766E',
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
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', whiteSpace: 'nowrap' }}>
          {user?.name ? user.name.split(' ')[0] : 'Citizen'}
        </span>
      </Link>
    </div>
  );
}
