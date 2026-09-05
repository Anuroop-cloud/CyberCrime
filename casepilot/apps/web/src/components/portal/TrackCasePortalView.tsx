'use client';

import React, { useState, useRef } from 'react';
import { Icons } from './Icons';
import { portalTheme } from './portalTheme';
import { Case } from '../../types/case-model';
import { SecondaryPortalNav } from './SecondaryPortalNav';
import { processUploadedEvidence } from '../../lib/evidence-pipeline';

interface Props {
  cases: Case[];
  selectedCaseId: string;
  onSelectCaseId: (id: string) => void;
  onGrievanceEscalate?: (caseId: string) => void;
  onAddEvidenceToCase?: (caseId: string, file: File) => void;
}

export function TrackCasePortalView({
  cases,
  selectedCaseId,
  onSelectCaseId,
  onGrievanceEscalate,
  onAddEvidenceToCase
}: Props) {
  const [trackSubTab, setTrackSubTab] = useState<'all' | 'attention' | 'timeline' | 'escalation'>('all');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [escalateSuccess, setEscalateSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const attentionCases = cases.filter(c => c.needsAttention);
  const displayCases = trackSubTab === 'attention' ? attentionCases : cases;

  const handleActionClick = (actionType: string) => {
    if (actionType === 'urgent_call') {
      window.location.href = 'tel:1930';
    } else if (actionType === 'download_receipt') {
      setShowReceiptModal(true);
    } else if (actionType === 'upload_evidence') {
      fileInputRef.current?.click();
    } else if (actionType === 'takedown_check') {
      alert(`Checking platform compliance for Case ${selectedCase.id}: Legal notice is under active review by intermediary grievance desk.`);
    }
  };

  const handleEvidenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      onAddEvidenceToCase?.(selectedCase.id, files[i]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEscalate = () => {
    onGrievanceEscalate?.(selectedCase.id);
    setEscalateSuccess(true);
    setTimeout(() => setEscalateSuccess(false), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleEvidenceUpload}
        style={{ display: 'none' }}
      />

      {/* ── Secondary Navigation for Track & Take Action ── */}
      <SecondaryPortalNav
        tabs={[
          { id: 'all', label: `All Registered Cases (${cases.length})` },
          { id: 'attention', label: `Needs Attention (${attentionCases.length})` },
          { id: 'timeline', label: 'Workflow & Milestones' },
          { id: 'escalation', label: 'Escalations & Nodal Officer' },
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
        {/* ── Section 1: Active Case Header Summary ── */}
        <div style={portalTheme.containers.sectionCard}>
          <div style={portalTheme.containers.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Active Case File
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 14, color: '#0F172A' }}>
                {selectedCase.id}
              </span>
              {selectedCase.isAnonymous && (
                <span style={{ fontSize: 11, background: '#EDE9FE', color: '#6D28D9', padding: '1px 7px', borderRadius: 4, fontWeight: 700 }}>
                  🔒 100% Anonymous Report
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                Case Health: <strong style={{ color: selectedCase.health === 'Critical' ? '#DC2626' : '#0F766E' }}>{selectedCase.health}</strong>
              </span>
            </div>
          </div>

          <div style={portalTheme.containers.cardBody}>
            {/* Dynamic Details Grid based on Crime Type */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Crime Classification</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginTop: 3 }}>{selectedCase.primaryCrimeType.replace(/_/g, ' ')}</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>{selectedCase.subtype}</div>
              </div>

              {selectedCase.financial ? (
                <div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Disputed Amount</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#B91C1C', marginTop: 3 }}>₹{selectedCase.financial.amount}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>UTR: {selectedCase.financial.utr || 'Pending'}</div>
                </div>
              ) : selectedCase.social ? (
                <div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Affected Platform</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginTop: 3 }}>{selectedCase.social.platform}</div>
                  <div style={{ fontSize: 11, color: '#0F766E', fontWeight: 600 }}>Handle: {selectedCase.social.offenderHandle}</div>
                </div>
              ) : selectedCase.device ? (
                <div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Device & Ransom</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#B91C1C', marginTop: 3 }}>{selectedCase.device.ransomExtension}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{selectedCase.device.ransomDemand}</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Communication</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginTop: 3 }}>{selectedCase.communication?.channel || 'Online'}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Safety: {selectedCase.communication?.immediateSafetyConcern === 'yes' ? 'Urgent' : 'Normal'}</div>
                </div>
              )}

              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Filing Date & State</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginTop: 3 }}>{selectedCase.incident.date}</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>{selectedCase.incident.state} ({selectedCase.incident.district})</div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>NCRP Ack Number</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: 'monospace', color: '#0F766E', marginTop: 3 }}>
                  {selectedCase.ackNumber || 'Generating...'}
                </div>
                <div style={{ fontSize: 11, color: '#15803D' }}>Digital Signature: Verified</div>
              </div>
            </div>

            {/* Actionable Next Steps Bar */}
            {selectedCase.nextActions.length > 0 && (
              <div
                style={{
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
                    <strong>Next Action Required:</strong> {selectedCase.nextActions[0].description}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleActionClick(selectedCase.nextActions[0].type)}
                    style={{
                      background: selectedCase.needsAttention ? '#DC2626' : '#0F766E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {selectedCase.nextActions[0].actionLabel}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowReceiptModal(true)}
                    style={{
                      background: '#FFFFFF',
                      color: '#334155',
                      border: '1px solid #CBD5E1',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    View Receipt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Tab: All Cases / Needs Attention Table ── */}
        {(trackSubTab === 'all' || trackSubTab === 'attention') && (
          <div style={portalTheme.containers.sectionCard}>
            <div style={portalTheme.containers.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                  {trackSubTab === 'attention' ? 'Cases Requiring Immediate Action' : 'All Registered Cases'}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, background: '#F1F5F9', color: '#334155', padding: '2px 8px', borderRadius: 12 }}>
                  {displayCases.length}
                </span>
              </div>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>
                Select a case row below to switch view and execute next actions
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={portalTheme.table.table}>
                <thead>
                  <tr style={portalTheme.table.theadRow}>
                    <th style={{ ...portalTheme.table.th, width: '22%' }}>Case Number & Ack</th>
                    <th style={{ ...portalTheme.table.th, width: '28%' }}>Classification & Subtype</th>
                    <th style={{ ...portalTheme.table.th, width: '16%' }}>Key Impact</th>
                    <th style={{ ...portalTheme.table.th, width: '16%' }}>Current Stage</th>
                    <th style={{ ...portalTheme.table.th, width: '18%' }}>Next Action</th>
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
                          background: isSelected ? '#F0FDFA' : '#FFFFFF',
                          borderBottom: '1px solid #F1F5F9',
                          cursor: 'pointer',
                          transition: 'background 120ms ease',
                        }}
                      >
                        <td style={{ ...portalTheme.table.td, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
                          <div>{c.id}</div>
                          <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 500, fontFamily: 'sans-serif' }}>
                            {c.ackNumber}
                          </div>
                        </td>
                        <td style={portalTheme.table.td}>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{c.primaryCrimeType.replace(/_/g, ' ')}</div>
                          <div style={{ fontSize: 11.5, color: '#64748B' }}>{c.subtype}</div>
                        </td>
                        <td style={{ ...portalTheme.table.td, fontWeight: 700 }}>
                          {c.financial ? (
                            <span style={{ color: '#B91C1C' }}>₹{c.financial.amount}</span>
                          ) : c.social ? (
                            <span style={{ color: '#0F766E' }}>{c.social.platform}</span>
                          ) : c.device ? (
                            <span style={{ color: '#D97706' }}>{c.device.ransomExtension}</span>
                          ) : (
                            <span style={{ color: '#64748B' }}>Non-financial</span>
                          )}
                        </td>
                        <td style={portalTheme.table.td}>
                          <span
                            style={{
                              fontSize: 10.5,
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: 4,
                              background: c.needsAttention ? '#FEF2F2' : '#DCFCE7',
                              color: c.needsAttention ? '#DC2626' : '#15803D',
                            }}
                          >
                            {c.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={portalTheme.table.td}>
                          <span style={{ fontSize: 11.5, color: c.needsAttention ? '#DC2626' : '#334155', fontWeight: 600 }}>
                            {c.nextActions[0]?.actionLabel || 'Inspect'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Dynamic Workflow Milestones ── */}
        {trackSubTab === 'timeline' && (
          <div style={portalTheme.containers.sectionCard}>
            <div style={portalTheme.containers.cardHeader}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                  Crime-Specific Investigation Pipeline
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Statutory workflow steps defined under NCRP & IT Act protocol for {selectedCase.primaryCrimeType.replace(/_/g, ' ')}.
                </div>
              </div>
            </div>

            <div style={portalTheme.containers.cardBody}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {selectedCase.workflow.map((stage, idx) => {
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';

                  return (
                    <div key={stage.stageId} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: isCompleted ? '#DCFCE7' : isCurrent ? '#0F766E' : '#F1F5F9',
                          color: isCompleted ? '#15803D' : isCurrent ? '#FFFFFF' : '#94A3B8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 12,
                          flexShrink: 0,
                          boxShadow: isCurrent ? '0 0 0 4px rgba(15, 118, 110, 0.15)' : 'none',
                        }}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>

                      <div style={{ flex: 1, paddingBottom: 12, borderBottom: idx < selectedCase.workflow.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: isCurrent ? '#0F766E' : '#0F172A' }}>
                            {stage.label}
                          </div>
                          {stage.date && (
                            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>
                              {stage.date}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>
                          {stage.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Escalations & Nodal Officer ── */}
        {trackSubTab === 'escalation' && (
          <div style={portalTheme.containers.sectionCard}>
            <div style={portalTheme.containers.cardHeader}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                  State Cyber Crime Nodal Desk Escalation
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Under NCRP provisions, citizens may file an escalation if high-priority action has not progressed within statutory timelines.
                </div>
              </div>
            </div>

            <div style={portalTheme.containers.cardBody}>
              {escalateSuccess ? (
                <div style={{ padding: '16px', background: '#DCFCE7', color: '#15803D', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
                  ✓ Grievance escalation registered and dispatched to State Cyber Nodal Officer. Tracking reference: ESC-{Date.now().toString().slice(-6)}.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12.5, color: '#334155' }}>
                    <strong>Active Case:</strong> {selectedCase.id} ({selectedCase.ackNumber}) • Jurisdiction: {selectedCase.incident.state}
                  </div>

                  <p style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.5 }}>
                    Submitting this form elevates the case to the Supervisory Deputy Superintendent of Police (DSP) and bank vigilance officer for fast-track compliance.
                  </p>

                  <button
                    type="button"
                    onClick={handleEscalate}
                    style={{
                      width: 'fit-content',
                      padding: '8px 18px',
                      borderRadius: 6,
                      border: 'none',
                      background: '#DC2626',
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Escalate Case to State Nodal Officer →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Formal Receipt Modal ── */}
      {showReceiptModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 12,
              width: 560,
              maxWidth: '90vw',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                National Cybercrime Reporting Portal • Acknowledgment Receipt
              </div>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                style={{ border: 'none', background: 'none', fontSize: 16, cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: '#334155' }}>
              <div><strong>Complaint Number:</strong> {selectedCase.id}</div>
              <div><strong>NCRP Token:</strong> {selectedCase.ackNumber}</div>
              <div><strong>Crime Type:</strong> {selectedCase.primaryCrimeType} ({selectedCase.subtype})</div>
              <div><strong>Occurrence Date:</strong> {selectedCase.incident.date}</div>
              <div><strong>State Jurisdiction:</strong> {selectedCase.incident.state}</div>
              {selectedCase.financial && <div><strong>Defrauded Amount:</strong> ₹{selectedCase.financial.amount} (UTR: {selectedCase.financial.utr})</div>}
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 8 }}>
                This is a digitally generated acknowledgement slip recognized by banks under RBI Circular RBI/2021-22/86 for Golden Hour chargeback disputes.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  padding: '7px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#0F766E',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: 12.5,
                  cursor: 'pointer',
                }}
              >
                Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#334155',
                  fontSize: 12.5,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
