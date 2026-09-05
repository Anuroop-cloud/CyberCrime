'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, CaseSummary } from '@/lib/api';
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_BADGE } from '@/lib/constants';

function MyComplaintsInner() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') ?? '';
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(statusFilter);

  useEffect(() => {
    setLoading(true);
    api.cases.list({ status: status || undefined })
      .then(r => { setCases(r.data.filter((c: CaseSummary) => c.status !== 'draft')); setTotal(r.total); })
      .finally(() => setLoading(false));
  }, [status]);

  const fmtAmount = (n?: number) => n ? `₹${n.toLocaleString('en-IN')}` : null;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const statusOptions = [
    '', 'submitted', 'acknowledged', 'assigned', 'under_investigation', 'closed', 'rejected', 'escalated',
  ];

  return (
    <>
      <header className="topbar">
        <div>
          <div className="topbar-title">My Complaints</div>
          <div className="topbar-subtitle">{total} total</div>
        </div>
        <div className="topbar-right">
          <select
            className="form-input"
            style={{ width: 180 }}
            value={status}
            onChange={e => setStatus(e.target.value)}
            aria-label="Filter by status"
          >
            {statusOptions.map(s => (
              <option key={s} value={s}>{s ? STATUS_LABELS[s] ?? s : 'All Statuses'}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="page-content" id="main-content">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card" style={{ padding: 16 }}>
                <div className="skeleton skeleton-text" style={{ width: '30%', marginBottom: 8 }} />
                <div className="skeleton skeleton-text" style={{ width: '70%' }} />
              </div>
            ))}
          </div>
        ) : cases.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No complaints found</div>
            <div className="empty-text">{status ? `No cases with status "${STATUS_LABELS[status] ?? status}"` : 'You have not submitted any complaints yet.'}</div>
            <Link href="/complaints/new" className="btn btn-primary" style={{ marginTop: 8 }}>＋ File a Complaint</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cases.map(c => (
              <Link key={c.id} href={`/complaints/${c.id}`} style={{ textDecoration: 'none' }}>
                <div className="card card-hover" style={{ padding: '16px 20px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${STATUS_BADGE[c.status] ?? ''}`}>
                        {STATUS_LABELS[c.status] ?? c.status}
                      </span>
                      <code style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.caseNumber}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      {(c._count?.evidence ?? 0) > 0 && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>📎 {c._count!.evidence}</span>
                      )}
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmtDate(c.updatedAt)}</span>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 12 }}>
                    <span>{CATEGORY_LABELS[c.category] ?? c.category}</span>
                    {fmtAmount(c.transaction?.amountLost as number) && (
                      <span style={{ color: 'var(--error)' }}>{fmtAmount(c.transaction?.amountLost as number)} lost</span>
                    )}
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

export default function MyComplaintsPage() {
  return (
    <Suspense fallback={<div className="page-content"><div className="skeleton skeleton-text" style={{ width: '60%' }} /></div>}>
      <MyComplaintsInner />
    </Suspense>
  );
}
