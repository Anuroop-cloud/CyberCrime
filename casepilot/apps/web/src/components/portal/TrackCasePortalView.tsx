import React, { useState } from 'react';
import { Icons } from './Icons';
import { portalTheme } from './portalTheme';
import { CaseRecord } from './HomePortalView';
import { SecondaryPortalNav } from './SecondaryPortalNav';

interface Props {
  cases: CaseRecord[];
  selectedCaseId: string;
  onSelectCaseId: (id: string) => void;
  onGrievanceEscalate?: (caseId: string) => void;
}

export function TrackCasePortalView({
  cases,
  selectedCaseId,
  onSelectCaseId,
  onGrievanceEscalate,
}: Props) {
  const [trackSubTab, setTrackSubTab] = useState<'all' | 'attention' | 'timeline' | 'escalation'>('all');
  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const attentionCases = cases.filter(c => c.needsAttention);
  const displayCases = trackSubTab === 'attention' ? attentionCases : cases;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* ── Secondary Navigation for Track & Take Action ── */}
      <SecondaryPortalNav
        tabs={[
          { id: 'all', label: `All Cases (${cases.length})` },
          { id: 'attention', label: `Needs Attention (${attentionCases.length})` },
          { id: 'timeline', label: 'Case Timeline' },
          { id: 'escalation', label: 'Escalations & Grievances' },
        ]}
        activeTab={trackSubTab}
        onTabChange={setTrackSubTab}
      />

      {/* ── Content Canvas ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          background: '#FFFFFF',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* ── Section 1: Strong Case Header Summary Container (Section 14) ── */}
        <div style={portalTheme.containers.sectionCard}>
          <div style={portalTheme.containers.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Active Case Summary
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 13, color: '#0F172A' }}>
                {selectedCase.id}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 4,
                  background: selectedCase.needsAttention ? '#FEF2F2' : '#DCFCE7',
                  color: selectedCase.needsAttention ? '#DC2626' : '#15803D',
                  border: selectedCase.needsAttention ? '1px solid #FECACA' : '1px solid #BBF7D0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: selectedCase.needsAttention ? '#DC2626' : '#15803D',
                  }}
                />
                {selectedCase.status.toUpperCase()}
              </span>

              <span style={{ fontSize: 11.5, color: '#64748B' }}>
                Health: <strong style={{ color: '#0F766E' }}>{selectedCase.health}</strong>
              </span>
            </div>
          </div>

          <div style={portalTheme.containers.cardBody}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Category</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginTop: 3 }}>{selectedCase.category}</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>{selectedCase.subCategory}</div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Disputed Amount</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 3 }}>{selectedCase.amount}</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>SBI Net Banking / UPI</div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Filing Date</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginTop: 3 }}>04 Sep 2026</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>NCRP Ack: Generated</div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Assigned Police Station</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginTop: 3 }}>Cyber Crime PS, Mandir Marg</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>Central Delhi District</div>
              </div>
            </div>

            {/* Next Action Box inside Case Header */}
            <div
              style={{
                marginTop: 8,
                padding: '12px 16px',
                borderRadius: 8,
                background: selectedCase.needsAttention ? '#FEF2F2' : '#F8FAFC',
                border: selectedCase.needsAttention ? '1px solid #FECACA' : '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: selectedCase.needsAttention ? '#991B1B' : '#334155' }}>
                <Icons.Clock />
                <span>
                  <strong>Next Step:</strong> {selectedCase.nextAction}
                </span>
              </div>

              {selectedCase.needsAttention && (
                <button
                  type="button"
                  style={{
                    background: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 4,
                    padding: '5px 12px',
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Take Action
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Section 2: Cases Table View (When tab is 'all' or 'attention') ── */}
        {(trackSubTab === 'all' || trackSubTab === 'attention') && (
          <div style={portalTheme.containers.sectionCard}>
            <div style={portalTheme.containers.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                  {trackSubTab === 'attention' ? 'Cases Requiring Immediate Action' : 'Registered Cases'}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, background: '#F1F5F9', color: '#334155', padding: '2px 8px', borderRadius: 12 }}>
                  {displayCases.length}
                </span>
              </div>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>
                Select a case row to inspect full investigation logs
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={portalTheme.table.table}>
                <thead>
                  <tr style={portalTheme.table.theadRow}>
                    <th style={{ ...portalTheme.table.th, width: '20%' }}>Case Number</th>
                    <th style={{ ...portalTheme.table.th, width: '28%' }}>Category & Classification</th>
                    <th style={{ ...portalTheme.table.th, width: '14%' }}>Amount</th>
                    <th style={{ ...portalTheme.table.th, width: '18%' }}>Investigation Status</th>
                    <th style={{ ...portalTheme.table.th, width: '20%' }}>Next Milestone</th>
                  </tr>
                </thead>
                <tbody>
                  {displayCases.map(c => {
                    const isSelected = c.id === selectedCase.id;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => onSelectCaseId(c.id)}
                        style={{
                          ...portalTheme.table.tbodyRow,
                          background: isSelected ? '#F0FDFA' : '#FFFFFF',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) e.currentTarget.style.background = '#FFFFFF';
                        }}
                      >
                        <td style={portalTheme.table.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {isSelected && (
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F766E' }} />
                            )}
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: '#0F172A' }}>
                              {c.id}
                            </span>
                          </div>
                        </td>

                        <td style={portalTheme.table.td}>
                          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: 13 }}>{c.category}</div>
                          <div style={{ fontSize: 11.5, color: '#64748B' }}>{c.subCategory}</div>
                        </td>

                        <td style={portalTheme.table.td}>
                          <span style={{ fontWeight: 600, color: '#0F172A' }}>{c.amount}</span>
                        </td>

                        <td style={portalTheme.table.td}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: 4,
                              background: c.needsAttention ? '#FEF2F2' : '#DCFCE7',
                              color: c.needsAttention ? '#DC2626' : '#15803D',
                              border: c.needsAttention ? '1px solid #FECACA' : '1px solid #BBF7D0',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            {c.status}
                          </span>
                        </td>

                        <td style={portalTheme.table.td}>
                          <span style={{ fontSize: 12, color: '#475569' }}>{c.nextAction}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Section 3: Chronological Case Timeline (Section 13 & 17) ── */}
        {(trackSubTab === 'timeline' || trackSubTab === 'all') && (
          <div style={portalTheme.containers.sectionCard}>
            <div style={portalTheme.containers.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Clock />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                  Investigation Timeline • {selectedCase.id}
                </span>
              </div>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>
                Official NCRP Police Log
              </span>
            </div>

            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingLeft: 14, borderLeft: '2px solid #E2E8F0', marginLeft: 8 }}>
                {selectedCase.timeline.map((evt, i) => (
                  <div key={i} style={{ position: 'relative', paddingLeft: 18 }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: -21,
                        top: 2,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: '#0F766E',
                        border: '2px solid #FFFFFF',
                        boxShadow: '0 0 0 2px #CCFBF1',
                      }}
                    />
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{evt.date}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', marginTop: 1 }}>{evt.title}</div>
                    <div style={{ fontSize: 12.5, color: '#475569', marginTop: 2, lineHeight: 1.5 }}>{evt.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Section 4: Grievance Escalation Module (Section 13 & 23) ── */}
        {(trackSubTab === 'escalation' || trackSubTab === 'all') && (
          <div style={{ ...portalTheme.containers.sectionCard, border: '1px solid #CBD5E1' }}>
            <div style={portalTheme.containers.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.AlertTriangle />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                  Official Grievance Escalation (State Nodal Cyber Officer)
                </span>
              </div>
              <span style={{ fontSize: 11, color: '#64748B' }}>Statutory Citizen Charter Right</span>
            </div>

            <div style={portalTheme.containers.cardBody}>
              <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                If no meaningful investigation progress or transaction hold response has been registered on your complaint for more than 7 days, you have the legal right under state cybercrime citizen charters to escalate directly to the State Cyber Crime Nodal Officer.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6 }}>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  Target: <strong>State Nodal Officer, Delhi State Cyber Crime Cell</strong>
                </div>

                <button
                  type="button"
                  onClick={() => onGrievanceEscalate?.(selectedCase.id)}
                  style={{
                    background: '#0F766E',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Icons.Send /> Raise Formal Grievance Escalation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
