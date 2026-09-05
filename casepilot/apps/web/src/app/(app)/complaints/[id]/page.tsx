'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, CaseDetail, CaseHealth, EvidenceFile } from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_BADGE, EVIDENCE_ICON } from '@/lib/constants';

const EVENT_LABELS: Record<string, string> = {
  case_created: 'Complaint created',
  status_change: 'Status updated',
  fields_updated: 'Details updated',
  evidence_uploaded: 'Evidence added',
  escalation: 'Case escalated',
};

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [health, setHealth] = useState<CaseHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'evidence' | 'timeline'>('overview');
  const [escalating, setEscalating] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');
  const [showEscalate, setShowEscalate] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    Promise.all([api.cases.findOne(id), api.ai.health(id)])
      .then(([c, h]) => { setCaseData(c); setHealth(h); })
      .catch(() => toast({ type: 'error', title: 'Could not load case' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEscalate = async () => {
    if (!escalateReason.trim()) return;
    setEscalating(true);
    try {
      await api.cases.escalate(id, { reason: escalateReason, urgency: 'high' });
      toast({ type: 'success', title: 'Case escalated', body: 'A senior officer will review within 48 hours.' });
      setShowEscalate(false);
      router.refresh();
    } catch (e: any) {
      toast({ type: 'error', title: 'Escalation failed', body: e.message });
    } finally {
      setEscalating(false);
    }
  };

  if (loading) return (
    <div className="page-content">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card" style={{ marginBottom: 12 }}>
          <div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: 8 }} />
          <div className="skeleton skeleton-text" style={{ width: '80%' }} />
        </div>
      ))}
    </div>
  );

  if (!caseData) return (
    <div className="page-content empty-state">
      <div className="empty-icon">🔍</div>
      <div className="empty-title">Case not found</div>
      <Link href="/complaints/my" className="btn btn-secondary">← Back to My Complaints</Link>
    </div>
  );

  const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const healthColor = health ? (health.score >= 70 ? 'var(--success)' : health.score >= 40 ? 'var(--warning)' : 'var(--error)') : 'var(--text-muted)';

  return (
    <>
      <header className="topbar">
        <div>
          <code style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block' }}>{caseData.caseNumber}</code>
          <div className="topbar-title">{caseData.title}</div>
        </div>
        <div className="topbar-right">
          <span className={`badge ${STATUS_BADGE[caseData.status] ?? ''}`}>
            {STATUS_LABELS[caseData.status] ?? caseData.status}
          </span>
          {health?.canEscalate && !showEscalate && (
            <button className="btn btn-danger btn-sm" onClick={() => setShowEscalate(true)}>
              ⬆ Escalate
            </button>
          )}
          <Link href="/track" className="btn btn-secondary btn-sm">Track →</Link>
        </div>
      </header>

      <main className="page-content" id="main-content">
        {/* Escalate form */}
        {showEscalate && (
          <div className="card" style={{ marginBottom: 16, border: '1px solid rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.04)' }}>
            <div style={{ fontWeight: 600, marginBottom: 10, color: 'var(--status-escalated)' }}>Escalate Case</div>
            <div className="form-group">
              <label htmlFor="esc-reason" className="form-label">Reason for escalation <span className="required">*</span></label>
              <textarea id="esc-reason" className="form-input" rows={3} value={escalateReason}
                onChange={e => setEscalateReason(e.target.value)}
                placeholder="No update in 30+ days, high financial loss, urgent action needed…" />
            </div>
            <div className="flex gap-2" style={{ marginTop: 10 }}>
              <button className="btn btn-danger" onClick={handleEscalate} disabled={!escalateReason.trim() || escalating} aria-busy={escalating}>
                {escalating ? 'Escalating…' : 'Confirm Escalation'}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowEscalate(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Health bar */}
        {health && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Case Health</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: healthColor }}>{health.score}/100</div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${health.score}%`, background: `linear-gradient(90deg, ${healthColor}, ${healthColor}88)` }} />
            </div>
            {health.nextActions.length > 0 && (
              <ul style={{ marginTop: 12, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {health.nextActions.slice(0, 3).map(a => (
                  <li key={a} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                    <span aria-hidden>→</span> {a}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Tab nav */}
        <div className="tabs" style={{ marginBottom: 16 }}>
          {(['overview', 'evidence', 'timeline'] as const).map(t => (
            <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
              {t} {t === 'evidence' && `(${caseData.evidence.length})`}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>📋 Incident Summary</div>
              <div className="grid-2" style={{ gap: 16 }}>
                {[
                  { label: 'Category', value: CATEGORY_LABELS[caseData.category] ?? caseData.category },
                  { label: 'Platform', value: caseData.platform ?? '—' },
                  { label: 'Incident Date', value: fmtDate(caseData.incidentDate) },
                  { label: 'Location', value: caseData.incidentLocation ?? '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Description</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {caseData.description}
                </div>
              </div>
            </div>

            {(caseData.transaction as any)?.amountLost && (
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>💰 Financial Details</div>
                <div className="grid-2">
                  {[
                    { label: 'Amount Lost', value: `₹${Number((caseData.transaction as any).amountLost).toLocaleString('en-IN')}`, highlight: true },
                    { label: 'Payment Mode', value: (caseData.transaction as any).paymentMode ?? '—' },
                    { label: 'UPI Reference', value: (caseData.transaction as any).upiRef ?? '—' },
                    { label: 'Bank', value: (caseData.transaction as any).bankName ?? '—' },
                  ].map(({ label, value, highlight }) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: highlight ? 'var(--error)' : undefined }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Evidence tab */}
        {tab === 'evidence' && (
          <div>
            {caseData.evidence.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📎</div>
                <div className="empty-title">No evidence uploaded</div>
                <div className="empty-text">Upload screenshots, receipts, and other files to strengthen your case.</div>
              </div>
            ) : (
              <div className="evidence-grid">
                {caseData.evidence.map((ev: EvidenceFile) => (
                  <div key={ev.id} className="evidence-item">
                    <div className="evidence-icon">{EVIDENCE_ICON[ev.mimeType] ?? '📄'}</div>
                    <div className="evidence-name" title={ev.originalName}>{ev.originalName}</div>
                    <div className={`evidence-malware ${ev.malwareStatus}`}>
                      {ev.malwareStatus === 'pending' ? '⏳ Scanning' : ev.malwareStatus === 'clean' ? '✓ Clean' : '⚠ Flagged'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timeline tab */}
        {tab === 'timeline' && (
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 16 }}>📍 Case Timeline</div>
            {caseData.events.length === 0 ? (
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No events yet</div>
              </div>
            ) : (
              <div className="timeline">
                {caseData.events.map((ev, i) => (
                  <div key={ev.id} className="timeline-item">
                    <div className="timeline-dot-col">
                      <div className={`timeline-dot ${i > 0 ? 'inactive' : ''}`} />
                      {i < caseData.events.length - 1 && <div className="timeline-line" />}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-label">{EVENT_LABELS[ev.eventType] ?? ev.eventType}</div>
                      {ev.note && <div className="timeline-note">{ev.note}</div>}
                      <div className="timeline-time">{new Date(ev.createdAt).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
