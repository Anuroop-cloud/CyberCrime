'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, CaseDetail, CaseHealth } from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_BADGE } from '@/lib/constants';

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<CaseDetail | null>(null);
  const [health, setHealth] = useState<CaseHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatAnswer, setChatAnswer] = useState('');
  const { toast } = useToast();

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setHealth(null);
    try {
      const c = await api.cases.track(query.trim().toUpperCase());
      const h = await api.ai.health(c.id);
      setResult(c);
      setHealth(h);
    } catch {
      toast({ type: 'error', title: 'Case not found', body: 'Check the case number and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!chatMsg.trim() || !result) return;
    const q = chatMsg.toLowerCase();
    let answer = '';
    if (q.includes('where') || q.includes('status') || q.includes('update')) {
      answer = `Your case ${result.caseNumber} is currently ${STATUS_LABELS[result.status]}. ${result.events[0]?.note ?? ''}`;
    } else if (q.includes('how long') || q.includes('when')) {
      answer = health ? `Based on current completeness, estimated processing time is ${health.estimatedProcessingDays} working days.` : 'Unable to estimate at this time.';
    } else if (q.includes('next') || q.includes('action')) {
      answer = health?.nextActions[0] ?? 'Ensure all required fields and evidence are uploaded.';
    } else if (q.includes('escalate')) {
      answer = health?.canEscalate ? 'This case qualifies for escalation. Use the Escalate button on the case detail page.' : 'This case is within normal processing time. Escalation is not yet recommended.';
    } else {
      answer = `Your case ${result.caseNumber} (${CATEGORY_LABELS[result.category] ?? result.category}) was filed on ${new Date(result.createdAt).toLocaleDateString('en-IN')} and is currently ${STATUS_LABELS[result.status]}. Keep your acknowledgement number safe.`;
    }
    setChatAnswer(answer);
    setChatMsg('');
  };

  const healthColor = health ? (health.score >= 70 ? 'var(--success)' : health.score >= 40 ? 'var(--warning)' : 'var(--error)') : 'var(--text-muted)';

  return (
    <>
      <header className="topbar">
        <div>
          <div className="topbar-title">Track Your Case</div>
          <div className="topbar-subtitle">Enter your case number or ask the AI assistant</div>
        </div>
      </header>

      <main className="page-content" id="main-content" style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Search */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>🔍 Search by Case Number</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CP2024000001"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              aria-label="Case number"
              style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
            />
            <button className="btn btn-primary" onClick={search} disabled={!query.trim() || loading} aria-busy={loading}>
              {loading ? <span className="spin">↺</span> : '🔍'} Search
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Status card */}
            <div className="card">
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <div>
                  <code style={{ fontSize: 12, color: 'var(--text-muted)' }}>{result.caseNumber}</code>
                  <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>{result.title}</div>
                </div>
                <span className={`badge ${STATUS_BADGE[result.status] ?? ''}`} style={{ fontSize: 12 }}>
                  {STATUS_LABELS[result.status] ?? result.status}
                </span>
              </div>

              {/* Timeline mini */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
                {['submitted', 'acknowledged', 'assigned', 'under_investigation', 'closed'].map((s, i) => {
                  const statuses = ['submitted', 'acknowledged', 'assigned', 'under_investigation', 'closed', 'escalated'];
                  const currentIdx = statuses.indexOf(result.status);
                  const isActive = i <= currentIdx;
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 70 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: isActive ? 'var(--brand-primary)' : 'var(--border-default)', border: `2px solid ${isActive ? 'var(--brand-primary)' : 'var(--border-subtle)'}`, transition: 'all 0.3s' }} />
                        <span style={{ fontSize: 9, color: isActive ? 'var(--brand-light)' : 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          {STATUS_LABELS[s]}
                        </span>
                      </div>
                      {i < 4 && <div style={{ flex: 1, height: 1, background: isActive && i < currentIdx ? 'var(--brand-primary)' : 'var(--border-subtle)', transition: 'all 0.3s', minWidth: 20 }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Health */}
            {health && (
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Case Health</div>
                <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: healthColor }}>{health.score}</div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>out of 100</div>
                    <div style={{ fontSize: 11, color: healthColor, fontWeight: 600, textTransform: 'capitalize' }}>
                      {health.urgency} urgency
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${health.score}%`, background: `linear-gradient(90deg, ${healthColor}88, ${healthColor})` }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      {health.completeness}% complete · ~{health.estimatedProcessingDays} days processing
                    </div>
                  </div>
                </div>
                {health.nextActions.length > 0 && (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {health.nextActions.map(a => (
                      <li key={a} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--brand-primary)', flexShrink: 0 }}>→</span> {a}
                      </li>
                    ))}
                  </ul>
                )}
                {health.riskFlags.map(f => (
                  <div key={f} style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--status-escalated)' }}>
                    ⚠ {f}
                  </div>
                ))}
              </div>
            )}

            {/* AI Q&A */}
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>💬 Ask about this case</div>
              {chatAnswer && (
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 12, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  🤖 {chatAnswer}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder='e.g. "Where is my case?" or "What should I do next?"'
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && askQuestion()}
                  aria-label="Ask a question about your case"
                />
                <button className="btn btn-primary btn-sm" onClick={askQuestion} disabled={!chatMsg.trim()}>Ask</button>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Where is my case?', 'What should I do next?', 'Can I escalate?'].map(q => (
                  <button key={q} className="btn btn-ghost btn-sm"
                    style={{ fontSize: 11, border: '1px solid var(--border-subtle)' }}
                    onClick={() => { setChatMsg(q); }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <div className="empty-title">Enter your case number above</div>
            <div className="empty-text">Your case number looks like CP2024000001. You can find it in your confirmation SMS.</div>
          </div>
        )}
      </main>
    </>
  );
}
