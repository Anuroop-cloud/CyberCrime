'use client';
import { useEffect, useState } from 'react';
import { api, Notification } from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import Link from 'next/link';

const TYPE_ICON: Record<string, string> = {
  case_update: '📋', evidence_requested: '📎', system: 'ℹ', urgent: '🔴', escalation: '⬆',
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = () => {
    api.notifications.list()
      .then(r => { setNotifs(r.notifications); setUnreadCount(r.unreadCount); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markAll = async () => {
    await api.notifications.markAllRead();
    setNotifs(p => p.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    toast({ type: 'success', title: 'All marked as read' });
  };

  const markOne = async (id: string) => {
    await api.notifications.markRead(id);
    setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  };

  const fmtDate = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <>
      <header className="topbar">
        <div>
          <div className="topbar-title">Notifications</div>
          <div className="topbar-subtitle">{unreadCount} unread</div>
        </div>
        <div className="topbar-right">
          {unreadCount > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={markAll}>Mark all read</button>
          )}
        </div>
      </header>

      <main className="page-content" id="main-content" style={{ maxWidth: 700, margin: '0 auto' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card" style={{ padding: 14 }}>
                <div className="skeleton skeleton-text" style={{ width: '50%', marginBottom: 6 }} />
                <div className="skeleton skeleton-text" style={{ width: '80%' }} />
              </div>
            ))}
          </div>
        ) : notifs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <div className="empty-title">No notifications yet</div>
            <div className="empty-text">Case updates, evidence requests and alerts will appear here.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifs.map(n => (
              <div
                key={n.id}
                className="card"
                style={{
                  padding: '14px 16px',
                  opacity: n.read ? 0.7 : 1,
                  borderLeft: `3px solid ${n.read ? 'var(--border-subtle)' : 'var(--brand-primary)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onClick={() => { if (!n.read) markOne(n.id); }}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && !n.read && markOne(n.id)}
                aria-label={n.read ? n.title : `Unread: ${n.title}`}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <div className="flex items-center gap-2">
                    <span aria-hidden>{TYPE_ICON[n.type] ?? '🔔'}</span>
                    <span style={{ fontSize: 13, fontWeight: n.read ? 500 : 700 }}>{n.title}</span>
                    {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-primary)' }} aria-label="unread" />}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmtDate(n.createdAt)}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 22 }}>{n.body}</div>
                {n.caseNumber && (
                  <Link href={`/complaints/my`} style={{ fontSize: 11, color: 'var(--brand-light)', marginLeft: 22, display: 'block', marginTop: 4 }}
                    onClick={e => e.stopPropagation()}>
                    View case {n.caseNumber} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
