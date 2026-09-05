'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, CaseSummary } from '@/lib/api';
import { CATEGORY_LABELS } from '@/lib/constants';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.cases.list({ status: 'draft' })
      .then(r => setDrafts(r.data))
      .finally(() => setLoading(false));
  }, []);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <header className="topbar">
        <div>
          <div className="topbar-title">Drafts</div>
          <div className="topbar-subtitle">Unsent complaints — complete and submit when ready</div>
        </div>
        <div className="topbar-right">
          <Link href="/complaints/new" className="btn btn-primary btn-sm">＋ New Complaint</Link>
        </div>
      </header>

      <main className="page-content" id="main-content">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card" style={{ padding: 16 }}>
                <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: 8 }} />
                <div className="skeleton skeleton-text" style={{ width: '40%' }} />
              </div>
            ))}
          </div>
        ) : drafts.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">✏️</div>
            <div className="empty-title">No drafts</div>
            <div className="empty-text">Any incomplete complaints you start will appear here. You can resume them anytime.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {drafts.map(c => (
              <Link key={c.id} href={`/complaints/${c.id}`} style={{ textDecoration: 'none' }}>
                <div className="card card-hover" style={{ padding: '16px 20px', borderLeft: '3px solid var(--status-draft)' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                    <code style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.caseNumber}</code>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last edited {fmtDate(c.updatedAt)}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span>{CATEGORY_LABELS[c.category] ?? c.category}</span>
                    <span style={{ color: 'var(--warning)', fontWeight: 500 }}>● Incomplete</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
