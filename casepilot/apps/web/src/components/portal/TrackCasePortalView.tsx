'use client';

import React, { useState, useRef } from 'react';
import { Icons } from './Icons';
import { portalTheme } from './portalTheme';
import { Case } from '../../types/case-model';
import { SecondaryPortalNav } from './SecondaryPortalNav';

interface Props {
  cases: Case[];
  selectedCaseId: string;
  onSelectCaseId: (id: string) => void;
  onGrievanceEscalate?: (caseId: string) => void;
  onAddEvidenceToCase?: (caseId: string, file: File) => void;
}

interface NodalDirectoryEntry {
  state: string;
  officerName: string;
  designation: string;
  address: string;
  email: string;
  phone: string;
}

const NODAL_DIRECTORY: Record<string, NodalDirectoryEntry> = {
  Maharashtra: {
    state: 'Maharashtra',
    officerName: 'Shri Sanjay Shintre (IPS)',
    designation: 'Superintendent of Police, Maharashtra Cyber',
    address: 'World Trade Centre, 32nd Floor, Cuffe Parade, Mumbai - 400005',
    email: 'sp.cyber-mah@gov.in',
    phone: '+91 22 2216 0080',
  },
  Karnataka: {
    state: 'Karnataka',
    officerName: 'Dr. B. M. Laxmi Prasad (IPS)',
    designation: 'Superintendent of Police, CID Cyber Crime Division',
    address: 'Carlton House, Palace Road, Bengaluru, Karnataka - 560001',
    email: 'spcyber-cid@ksp.gov.in',
    phone: '+91 80 2209 4499',
  },
  Delhi: {
    state: 'Delhi',
    officerName: 'Shri Hemant Tiwari (IPS)',
    designation: 'DCP Cyber Crime Unit (IFSO), Special Cell',
    address: 'Sector 17, Dwarka, New Delhi - 110078',
    email: 'dcp-cyber-delhi@nic.in',
    phone: '+91 11 2089 2623',
  },
  Gujarat: {
    state: 'Gujarat',
    officerName: 'Shri Dharmendra Sharma (IPS)',
    designation: 'Superintendent of Police, State Cyber Crime Cell',
    address: 'Police Bhavan, Sector 18, Gandhinagar, Gujarat - 382018',
    email: 'cc-cid@gujarat.gov.in',
    phone: '+91 79 2325 4388',
  },
  Kerala: {
    state: 'Kerala',
    officerName: 'Shri Hari Sankar (IPS)',
    designation: 'SP Cyber Operations & Cyberdome Desk',
    address: 'Police Headquarters, Vazhuthacaud, Thiruvananthapuram - 695010',
    email: 'spcyberops.pol@kerala.gov.in',
    phone: '+91 471 272 2215',
  },
};

export function TrackCasePortalView({
  cases,
  selectedCaseId,
  onSelectCaseId,
  onGrievanceEscalate,
  onAddEvidenceToCase,
}: Props) {
  const [trackSubTab, setTrackSubTab] = useState<'all' | 'attention' | 'timeline' | 'escalation'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | 'investigation' | 'assigned' | 'attention'>('all');

  // Modals state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showTakedownModal, setShowTakedownModal] = useState(false);
  const [showAdvisoryModal, setShowAdvisoryModal] = useState(false);
  const [targetActionCase, setTargetActionCase] = useState<Case | null>(null);

  // Escalation form state
  const [escalateCaseId, setEscalateCaseId] = useState<string>(selectedCaseId);
  const [grievanceCategory, setGrievanceCategory] = useState('1930_delay');
  const [grievanceNarrative, setGrievanceNarrative] = useState('');
  const [escalateSuccess, setEscalateSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadCaseId, setActiveUploadCaseId] = useState<string | null>(null);

  // Safe case selector
  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0] || null;
  const attentionCases = cases.filter(c => c.needsAttention);

  // Filtering for table
  const filteredCases = cases.filter(c => {
    if (stageFilter === 'attention' && !c.needsAttention) return false;
    if (stageFilter === 'investigation' && c.status !== 'investigation') return false;
    if (stageFilter === 'assigned' && c.status !== 'assigned') return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      (c.ackNumber && c.ackNumber.toLowerCase().includes(q)) ||
      c.primaryCrimeType.toLowerCase().includes(q) ||
      c.subtype.toLowerCase().includes(q) ||
      c.incident.state.toLowerCase().includes(q)
    );
  });

  const handleActionClick = (actionType: string, c: Case) => {
    setTargetActionCase(c);
    if (actionType === 'urgent_call') {
      if (confirm(`You are about to dial 1930 National Cyber Fraud Helpline for Case ${c.id}.\n\nHave your NCRP Acknowledgment token (${c.ackNumber}) ready for the desk officer.`)) {
        window.location.href = 'tel:1930';
      }
    } else if (actionType === 'download_receipt') {
      onSelectCaseId(c.id);
      setShowReceiptModal(true);
    } else if (actionType === 'upload_evidence') {
      setActiveUploadCaseId(c.id);
      fileInputRef.current?.click();
    } else if (actionType === 'takedown_check') {
      onSelectCaseId(c.id);
      setShowTakedownModal(true);
    } else if (actionType === 'view_advisory') {
      onSelectCaseId(c.id);
      setShowAdvisoryModal(true);
    } else {
      onSelectCaseId(c.id);
    }
  };

  const handleEvidenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const targetId = activeUploadCaseId || selectedCase?.id;
    if (!files || files.length === 0 || !targetId) return;

    for (let i = 0; i < files.length; i++) {
      onAddEvidenceToCase?.(targetId, files[i]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setActiveUploadCaseId(null);
  };

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = escalateCaseId || selectedCase?.id;
    if (!targetId) return;

    onGrievanceEscalate?.(targetId);
    const trackingRef = `ESC-2026-${targetId.replace(/[^0-9]/g, '').slice(-5)}-${Math.floor(100 + Math.random() * 900)}`;
    setEscalateSuccess(trackingRef);
    setGrievanceNarrative('');
  };

  const getNodalOfficerForCase = (c?: Case | null): NodalDirectoryEntry => {
    const state = c?.incident?.state || 'National';
    return (
      NODAL_DIRECTORY[state] || {
        state: state,
        officerName: 'State Cyber Crime Desk / I4C Secretariat',
        designation: 'Supervisory Cyber Crime Nodal Desk',
        address: 'National Cybercrime Reporting Portal, I4C MHA, New Delhi - 110001',
        email: 'cybercrime-i4c@gov.in',
        phone: '1930 / 011-23438000',
      }
    );
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

      {/* ── Sub Navigation Tabs ── */}
      <SecondaryPortalNav
        tabs={[
          { id: 'all', label: `All Registered Cases (${cases.length})` },
          { id: 'attention', label: `Needs Attention (${attentionCases.length})` },
          { id: 'timeline', label: 'Workflow & Milestones' },
          { id: 'escalation', label: 'Escalations & Nodal Officer' },
        ]}
        activeTab={trackSubTab}
        onTabChange={tabId => {
          setTrackSubTab(tabId);
          if (tabId === 'attention' && attentionCases.length > 0 && (!selectedCase || !selectedCase.needsAttention)) {
            onSelectCaseId(attentionCases[0].id);
          }
          if (tabId === 'escalation' && selectedCase) {
            setEscalateCaseId(selectedCase.id);
          }
        }}
      />

      {/* ── Content Canvas ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 28px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          background: '#FFFFFF',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* ══════════════════════════════════════════════════════════════
            SUBTAB 1: ALL REGISTERED CASES
           ══════════════════════════════════════════════════════════════ */}
        {trackSubTab === 'all' && (
          <>
            {/* KPI Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              <div style={{ ...portalTheme.containers.sectionCard, padding: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Total Registered
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                  {cases.length}
                </div>
                <div style={{ fontSize: 11, color: '#0F766E', marginTop: 2 }}>Formal NCRP acknowledgments</div>
              </div>

              <div style={{ ...portalTheme.containers.sectionCard, padding: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Active Investigations
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0284C7', marginTop: 4 }}>
                  {cases.filter(c => c.status === 'investigation').length}
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Assigned police stations</div>
              </div>

              <div style={{ ...portalTheme.containers.sectionCard, padding: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>
                  Urgent Attention
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#DC2626', marginTop: 4 }}>
                  {attentionCases.length}
                </div>
                <div style={{ fontSize: 11, color: '#991B1B', marginTop: 2 }}>Pending citizen action</div>
              </div>

              <div style={{ ...portalTheme.containers.sectionCard, padding: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Restitution / Holds
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#15803D', marginTop: 4 }}>
                  ₹52,000
                </div>
                <div style={{ fontSize: 11, color: '#15803D', marginTop: 2 }}>Frozen in suspect accounts</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 380 }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by Case ID, NCRP Token, Crime type, State..."
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    fontSize: 12.5,
                    outline: 'none',
                    fontFamily: "'Manrope', Helvetica, sans-serif",
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {(['all', 'investigation', 'assigned', 'attention'] as const).map(stage => {
                  const isActive = stageFilter === stage;
                  const labelMap = {
                    all: 'All Stages',
                    investigation: 'Investigation',
                    assigned: 'Assigned',
                    attention: 'Needs Action',
                  };
                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => setStageFilter(stage)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid',
                        borderColor: isActive ? '#0F172A' : '#E2E8F0',
                        background: isActive ? '#0F172A' : '#FFFFFF',
                        color: isActive ? '#FFFFFF' : '#475569',
                        fontSize: 12,
                        fontWeight: isActive ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 120ms ease',
                      }}
                    >
                      {labelMap[stage]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Case List Table */}
            <div style={portalTheme.containers.sectionCard}>
              <div style={portalTheme.containers.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                    Registered Cases Dossier
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: '#F1F5F9', color: '#334155', padding: '2px 8px', borderRadius: 12 }}>
                    {filteredCases.length}
                  </span>
                </div>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>
                  Click row to inspect active case file or click action buttons to execute next step
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={portalTheme.table.table}>
                  <thead>
                    <tr style={portalTheme.table.theadRow}>
                      <th style={{ ...portalTheme.table.th, width: '22%' }}>Case Number & Ack</th>
                      <th style={{ ...portalTheme.table.th, width: '26%' }}>Classification & Subtype</th>
                      <th style={{ ...portalTheme.table.th, width: '16%' }}>Key Impact</th>
                      <th style={{ ...portalTheme.table.th, width: '16%' }}>Current Stage</th>
                      <th style={{ ...portalTheme.table.th, width: '20%' }}>Next Action Trigger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.map(c => {
                      const isSelected = c.id === selectedCase?.id;
                      const nextAction = (c.nextActions && c.nextActions[0]) || {
                        id: 'inspect',
                        title: 'Inspect Case',
                        type: 'inspect',
                        actionLabel: 'Inspect File',
                      };

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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>{c.id}</span>
                              {isSelected && (
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F766E' }} />
                              )}
                            </div>
                            <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 500, fontFamily: 'sans-serif', marginTop: 2 }}>
                              {c.ackNumber || 'Token pending'}
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
                                border: c.needsAttention ? '1px solid #FECACA' : '1px solid #BBF7D0',
                              }}
                            >
                              {c.status.toUpperCase()}
                            </span>
                          </td>

                          <td style={portalTheme.table.td} onClick={e => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleActionClick(nextAction.type, c)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 12px',
                                borderRadius: 6,
                                border: 'none',
                                background: c.needsAttention ? '#DC2626' : '#0F766E',
                                color: '#FFFFFF',
                                fontSize: 11.5,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'transform 100ms ease, opacity 100ms ease',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                              <span>{nextAction.actionLabel}</span>
                              <span style={{ fontSize: 10 }}>→</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Case Inspector Card */}
            {selectedCase && (
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
                    <button
                      type="button"
                      onClick={() => setShowReceiptModal(true)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 6,
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#334155',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Formal Receipt Slip
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEscalateCaseId(selectedCase.id);
                        setTrackSubTab('escalation');
                      }}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 6,
                        border: 'none',
                        background: '#DC2626',
                        color: '#FFFFFF',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Escalate to Nodal DSP →
                    </button>
                  </div>
                </div>

                <div style={portalTheme.containers.cardBody}>
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
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginTop: 3 }}>{selectedCase.communication?.channel || 'Online Platform'}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>Safety Concern: {selectedCase.communication?.immediateSafetyConcern === 'yes' ? 'Urgent' : 'Standard'}</div>
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

                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Complainant Incident Statement</div>
                    <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.5, marginTop: 4 }}>
                      {selectedCase.incident.description || 'No statement entered.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════
            SUBTAB 2: NEEDS ATTENTION
           ══════════════════════════════════════════════════════════════ */}
        {trackSubTab === 'attention' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                padding: '16px 20px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#DC2626' }}>
                  <Icons.AlertTriangle />
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#991B1B' }}>
                    {attentionCases.length} Case(s) Require Your Action
                  </div>
                  <div style={{ fontSize: 12, color: '#B91C1C', marginTop: 2 }}>
                    Deadlines for inter-bank holds, malware scan log audits, or platform compliance queries.
                  </div>
                </div>
              </div>
              <a
                href="tel:1930"
                style={{
                  padding: '7px 16px',
                  borderRadius: 6,
                  background: '#DC2626',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: 12.5,
                }}
              >
                1930 Golden Helpline
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {attentionCases.map(c => {
                const nextAction = (c.nextActions && c.nextActions[0]) || {
                  id: 'inspect',
                  title: 'Action Needed',
                  type: 'inspect',
                  actionLabel: 'Take Action',
                };

                return (
                  <div
                    key={c.id}
                    style={{
                      ...portalTheme.containers.sectionCard,
                      borderLeft: '4px solid #DC2626',
                      padding: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 14,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 13, color: '#0F172A' }}>
                          {c.id}
                        </span>
                        <span style={{ fontSize: 11, background: '#FEE2E2', color: '#B91C1C', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                          CRITICAL ACTION
                        </span>
                      </div>

                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginTop: 8 }}>
                        {c.primaryCrimeType.replace(/_/g, ' ')} • {c.subtype}
                      </div>

                      <div style={{ fontSize: 12, color: '#475569', marginTop: 6, lineHeight: 1.4 }}>
                        <strong>Required:</strong> {nextAction.description || nextAction.title}
                      </div>

                      {c.financial && (
                        <div style={{ fontSize: 12, color: '#B91C1C', fontWeight: 700, marginTop: 6 }}>
                          Disputed Funds: ₹{c.financial.amount} (UTR: {c.financial.utr})
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
                      <span style={{ fontSize: 11, color: '#64748B' }}>
                        Jurisdiction: {c.incident.state}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleActionClick(nextAction.type, c)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 6,
                          border: 'none',
                          background: '#DC2626',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        {nextAction.actionLabel} →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            SUBTAB 3: WORKFLOW & MILESTONES
           ══════════════════════════════════════════════════════════════ */}
        {trackSubTab === 'timeline' && selectedCase && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* In-Tab Case Selector Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 18px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Inspect Case Workflow:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cases.map(c => {
                  const isSel = c.id === selectedCase.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelectCaseId(c.id)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 6,
                        border: '1px solid',
                        borderColor: isSel ? '#0F766E' : '#CBD5E1',
                        background: isSel ? '#0F766E' : '#FFFFFF',
                        color: isSel ? '#FFFFFF' : '#334155',
                        fontSize: 11.5,
                        fontWeight: isSel ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>{c.id}</span>
                      <span style={{ opacity: 0.8, fontSize: 10 }}>({c.primaryCrimeType.split('_')[0]})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Crime Pipeline Tracker */}
            <div style={portalTheme.containers.sectionCard}>
              <div style={portalTheme.containers.cardHeader}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                    Crime-Specific Statutory Investigation Pipeline
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    NCRP & IT Act procedural milestones for Case {selectedCase.id} ({selectedCase.primaryCrimeType.replace(/_/g, ' ')})
                  </div>
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#F0FDFA', color: '#0F766E' }}>
                  State: {selectedCase.incident.state} Desk
                </div>
              </div>

              <div style={portalTheme.containers.cardBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {(selectedCase.workflow || []).map((stage, idx) => {
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

                        <div style={{ flex: 1, paddingBottom: 14, borderBottom: idx < (selectedCase.workflow || []).length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontSize: 13.5, fontWeight: 700, color: isCurrent ? '#0F766E' : '#0F172A' }}>
                                {stage.label}
                              </span>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  padding: '1px 6px',
                                  borderRadius: 4,
                                  background: isCompleted ? '#DCFCE7' : isCurrent ? '#E0F2FE' : '#F1F5F9',
                                  color: isCompleted ? '#15803D' : isCurrent ? '#0369A1' : '#64748B',
                                }}
                              >
                                {isCompleted ? 'COMPLETED' : isCurrent ? 'IN PROGRESS' : 'UPCOMING'}
                              </span>
                            </div>

                            {stage.date && (
                              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                                {stage.date}
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                            {stage.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Official Chronological Events Audit */}
            <div style={portalTheme.containers.sectionCard}>
              <div style={portalTheme.containers.cardHeader}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                  Statutory Audit Log & Police Dispatch Events
                </div>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>
                  Cryptographically timestamped action logs
                </span>
              </div>

              <div style={portalTheme.containers.cardBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(selectedCase.events || []).map(ev => (
                    <div
                      key={ev.id}
                      style={{
                        padding: '10px 14px',
                        background: '#F8FAFC',
                        borderRadius: 6,
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', minWidth: 90, marginTop: 1 }}>
                        {ev.timestamp}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>{ev.title}</div>
                        <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{ev.desc}</div>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: ev.type === 'officer' ? '#0F766E' : ev.type === 'citizen' ? '#0284C7' : '#64748B',
                        }}
                      >
                        {ev.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            SUBTAB 4: ESCALATIONS & NODAL OFFICER
           ══════════════════════════════════════════════════════════════ */}
        {trackSubTab === 'escalation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Escalation Header */}
            <div
              style={{
                padding: '16px 20px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: '#991B1B' }}>
                  State Cyber Crime Nodal Desk Grievance Escalation
                </div>
                <div style={{ fontSize: 12, color: '#7F1D1D', marginTop: 3 }}>
                  Under NCRP provisions, citizens may elevate unresolved cases directly to the Supervisory DSP / SP Cyber Crime.
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', background: '#FFFFFF', padding: '4px 10px', borderRadius: 6, border: '1px solid #FECACA' }}>
                Sec 91/156(3) IT Protocol
              </span>
            </div>

            {/* Escalation Success Confirmation */}
            {escalateSuccess && (
              <div
                style={{
                  padding: '16px 20px',
                  background: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: '#15803D' }}>
                  ✓ Grievance Notice Formally Dispatched
                </div>
                <div style={{ fontSize: 12.5, color: '#166534' }}>
                  Your escalation docket has been queued for review by the Supervisory Nodal Officer. Tracking Reference: <strong>{escalateSuccess}</strong>.
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18 }}>
              {/* Left Column: Escalation Form */}
              <div style={portalTheme.containers.sectionCard}>
                <div style={portalTheme.containers.cardHeader}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                    Grievance Escalation Dossier Form
                  </div>
                  <span style={{ fontSize: 11.5, color: '#64748B' }}>
                    Select case file and specify reason for grievance
                  </span>
                </div>

                <div style={portalTheme.containers.cardBody}>
                  <form onSubmit={handleEscalateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                        Target Case File *
                      </label>
                      <select
                        value={escalateCaseId}
                        onChange={e => {
                          setEscalateCaseId(e.target.value);
                          onSelectCaseId(e.target.value);
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #CBD5E1',
                          fontSize: 12.5,
                          outline: 'none',
                        }}
                      >
                        {cases.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.id} ({c.primaryCrimeType.replace(/_/g, ' ')}) — {c.incident.state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                        Primary Reason for Escalation *
                      </label>
                      <select
                        value={grievanceCategory}
                        onChange={e => setGrievanceCategory(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #CBD5E1',
                          fontSize: 12.5,
                          outline: 'none',
                        }}
                      >
                        <option value="1930_delay">1930 Inter-bank hold delayed beyond Golden Hour</option>
                        <option value="platform_takedown_failed">Social media intermediary failed 36-hour takedown under IT Rules</option>
                        <option value="no_io_assigned">No Investigating Officer (IO) allocated after 7 days</option>
                        <option value="extortion_threat">Suspect continuing active threats or blackmail</option>
                        <option value="bank_dispute">Bank refusing chargeback despite verified NCRP token</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                        Grievance Statement & Timeline Narrative *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={grievanceNarrative}
                        onChange={e => setGrievanceNarrative(e.target.value)}
                        placeholder="State clearly why police/nodal intervention is urgently requested (e.g. Beneficiary account balance still unverified; impersonation account still messaging contacts...)"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #CBD5E1',
                          fontSize: 12.5,
                          outline: 'none',
                          fontFamily: "'Manrope', Helvetica, sans-serif",
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                      <button
                        type="submit"
                        style={{
                          padding: '9px 20px',
                          borderRadius: 6,
                          border: 'none',
                          background: '#DC2626',
                          color: '#FFFFFF',
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Submit Grievance to State Nodal Officer →
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Jurisdiction Nodal Officer Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(() => {
                  const targetCase = cases.find(c => c.id === escalateCaseId) || selectedCase;
                  const nodal = getNodalOfficerForCase(targetCase);

                  return (
                    <div style={portalTheme.containers.sectionCard}>
                      <div style={portalTheme.containers.cardHeader}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                          Jurisdictional Nodal Officer
                        </div>
                        <span style={{ fontSize: 10.5, color: '#0F766E', fontWeight: 700 }}>
                          {nodal.state}
                        </span>
                      </div>

                      <div style={{ ...portalTheme.containers.cardBody, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                            {nodal.officerName}
                          </div>
                          <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 1 }}>
                            {nodal.designation}
                          </div>
                        </div>

                        <div style={{ fontSize: 11.5, color: '#334155', lineHeight: 1.4, borderTop: '1px solid #F1F5F9', paddingTop: 8 }}>
                          <strong>Office Address:</strong>
                          <div style={{ color: '#64748B', marginTop: 2 }}>{nodal.address}</div>
                        </div>

                        <div style={{ fontSize: 11.5, color: '#334155', borderTop: '1px solid #F1F5F9', paddingTop: 8 }}>
                          <div><strong>Official Email:</strong> <a href={`mailto:${nodal.email}`} style={{ color: '#0F766E', textDecoration: 'none' }}>{nodal.email}</a></div>
                          <div style={{ marginTop: 4 }}><strong>Helpline / Tel:</strong> <a href={`tel:${nodal.phone}`} style={{ color: '#0F766E', textDecoration: 'none' }}>{nodal.phone}</a></div>
                        </div>

                        <div style={{ fontSize: 10.5, color: '#64748B', background: '#F8FAFC', padding: 8, borderRadius: 6, marginTop: 4 }}>
                          Submissions made here are sent through certified government channels to the DSP office for statutory supervision.
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Formal Receipt Modal ── */}
      {showReceiptModal && selectedCase && (
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

      {/* ── Platform Takedown Compliance Modal ── */}
      {showTakedownModal && selectedCase && (
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
              width: 520,
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
                Intermediary Takedown Audit (IT Rules Rule 3(1)(b))
              </div>
              <button
                type="button"
                onClick={() => setShowTakedownModal(false)}
                style={{ border: 'none', background: 'none', fontSize: 16, cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: '#334155' }}>
              <div><strong>Case File:</strong> {selectedCase.id}</div>
              <div><strong>Offending Platform:</strong> {selectedCase.social?.platform || 'Social Media'}</div>
              <div><strong>Offender Handle / URL:</strong> {selectedCase.social?.offenderHandle || selectedCase.social?.profileUrl || 'Profile under audit'}</div>
              <div><strong>Statutory Notice Status:</strong> <span style={{ color: '#0F766E', fontWeight: 700 }}>Dispatched under Sec 79(3)(b) IT Act</span></div>
              <div style={{ padding: 12, background: '#F0FDFA', borderRadius: 8, fontSize: 12, color: '#134E4A' }}>
                Under Information Technology (Intermediary Guidelines) Rules, intermediaries are mandated to acknowledge grievances within 24 hours and disable unlawful content within 36 hours.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
              <button
                type="button"
                onClick={() => {
                  alert(`Platform Ping Sent: Re-dispatched compliance reminder to Grievance Desk for Case ${selectedCase.id}.`);
                  setShowTakedownModal(false);
                }}
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
                Send Compliance Reminder
              </button>
              <button
                type="button"
                onClick={() => setShowTakedownModal(false)}
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
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CERT-In Advisory Modal ── */}
      {showAdvisoryModal && selectedCase && (
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
              width: 540,
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
                CERT-In Security Advisory • CI-ADV-2026
              </div>
              <button
                type="button"
                onClick={() => setShowAdvisoryModal(false)}
                style={{ border: 'none', background: 'none', fontSize: 16, cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: '#334155' }}>
              <div><strong>Threat Variant:</strong> {selectedCase.device?.ransomExtension || 'Phobos / LockBit Ransomware'}</div>
              <div><strong>CERT-In Directive:</strong> <span style={{ color: '#DC2626', fontWeight: 700 }}>DO NOT PAY RANSOM</span></div>
              <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                National cyber defense guidelines strictly advise against extortion payments. Payment does not guarantee decryption keys and funds international criminal syndicates.
              </p>
              <ul style={{ paddingLeft: 20, margin: 0, fontSize: 12, color: '#334155', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Immediately isolate infected nodes from local network and subnet.</li>
                <li>Preserve sample encrypted files and ransom note hash.</li>
                <li>Report to CERT-In Incident Desk: incident@cert-in.org.in</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
              <button
                type="button"
                onClick={() => setShowAdvisoryModal(false)}
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
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
