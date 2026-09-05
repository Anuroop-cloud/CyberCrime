'use client';

import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';
import { Case, CaseHealth } from '../../types/case-model';
import { CasesStore } from '@/lib/cases-store';
import { useToast } from '@/lib/toast-context';

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
    officerName: 'Shri Sanjay Shintre, IPS',
    designation: 'Superintendent of Police, Maharashtra Cyber',
    address: 'World Trade Centre, 32nd Floor, Cuffe Parade, Mumbai - 400005',
    email: 'sp.cyber-mah@gov.in',
    phone: '+91 22 2216 0080',
  },
  Karnataka: {
    state: 'Karnataka',
    officerName: 'Dr. B. M. Laxmi Prasad, IPS',
    designation: 'Superintendent of Police, CID Cyber Crime Division',
    address: 'Carlton House, Palace Road, Bengaluru, Karnataka - 560001',
    email: 'spcyber-cid@ksp.gov.in',
    phone: '+91 80 2209 4499',
  },
  Delhi: {
    state: 'Delhi',
    officerName: 'Shri Hemant Tiwari, IPS',
    designation: 'DCP Cyber Crime Unit (IFSO), Special Cell',
    address: 'Sector 17, Dwarka, New Delhi - 110078',
    email: 'dcp-cyber-delhi@nic.in',
    phone: '+91 11 2089 2623',
  },
  Gujarat: {
    state: 'Gujarat',
    officerName: 'Shri Dharmendra Sharma, IPS',
    designation: 'Superintendent of Police, State Cyber Crime Cell',
    address: 'Police Bhavan, Sector 18, Gandhinagar, Gujarat - 382018',
    email: 'cc-cid@gujarat.gov.in',
    phone: '+91 79 2325 4388',
  },
  Kerala: {
    state: 'Kerala',
    officerName: 'Shri Hari Sankar, IPS',
    designation: 'SP Cyber Operations & Cyberdome Desk',
    address: 'Police Headquarters, Vazhuthacaud, Thiruvananthapuram - 695010',
    email: 'spcyberops.pol@kerala.gov.in',
    phone: '+91 471 272 2215',
  },
  Rajasthan: {
    state: 'Rajasthan',
    officerName: 'Shri Vikas Kumar, IPS',
    designation: 'DIG Police, Cyber Crime Cell & CID-CB',
    address: 'Police Headquarters, Lal Kothi, Jaipur, Rajasthan - 302015',
    email: 'cyber-cell-raj@nic.in',
    phone: '+91 141 274 0848',
  },
};

function getHealthBadge(health: CaseHealth) {
  switch (health) {
    case 'Urgent':
      return {
        label: 'Urgent',
        color: '#991B1B',
        bg: '#FEF2F2',
        border: '#FECACA',
        dotColor: '#DC2626',
      };
    case 'Attention Required':
      return {
        label: 'Attention Required',
        color: '#92400E',
        bg: '#FFFBEB',
        border: '#FDE68A',
        dotColor: '#D97706',
      };
    case 'Waiting':
      return {
        label: 'Waiting',
        color: '#075985',
        bg: '#F0F9FF',
        border: '#BAE6FD',
        dotColor: '#0284C7',
      };
    case 'On Track':
      return {
        label: 'On Track',
        color: '#065F46',
        bg: '#ECFDF5',
        border: '#A7F3D0',
        dotColor: '#059669',
      };
    default:
      return {
        label: 'Unknown',
        color: '#475569',
        bg: '#F8FAFC',
        border: '#E2E8F0',
        dotColor: '#94A3B8',
      };
  }
}

export function TrackCasePortalView({
  cases: propCases,
  selectedCaseId,
  onSelectCaseId,
}: Props) {
  const { toast } = useToast();

  const [casesList, setCasesList] = useState<Case[]>(propCases);
  const [activeTab, setActiveTab] = useState<'cases' | 'tracking' | 'actions'>('cases');
  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState<'All' | CaseHealth>('All');

  // Interactive follow-up modal state
  const [showLogFollowUpModal, setShowLogFollowUpModal] = useState(false);
  const [followUpActivity, setFollowUpActivity] = useState('Visited Police Station');
  const [followUpOfficer, setFollowUpOfficer] = useState('');
  const [followUpStation, setFollowUpStation] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');

  // Escalation Pack modal state
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [isEditingDossier, setIsEditingDossier] = useState(false);
  const [customIssueNarrative, setCustomIssueNarrative] = useState('');
  const [customRequestedAction, setCustomRequestedAction] = useState('');

  // 1930 call confirmation modal state
  const [show1930Modal, setShow1930Modal] = useState(false);

  // Active selected case
  const activeCase = useMemo(() => {
    return casesList.find(c => c.id === selectedCaseId) || casesList[0] || null;
  }, [casesList, selectedCaseId]);

  // Filtered cases list
  const filteredCases = useMemo(() => {
    return casesList.filter(c => {
      if (healthFilter !== 'All' && c.health !== healthFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        (c.ackNumber && c.ackNumber.toLowerCase().includes(q)) ||
        c.subtype.toLowerCase().includes(q) ||
        c.primaryCrimeType.toLowerCase().includes(q) ||
        c.incident.state.toLowerCase().includes(q)
      );
    });
  }, [casesList, healthFilter, searchQuery]);

  // Handle saving new follow-up
  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;

    if (!followUpNotes.trim()) {
      toast({ type: 'warning', title: 'Details Required', body: 'Please enter notes on this follow-up.' });
      return;
    }

    const updated = CasesStore.logFollowUp(activeCase.id, {
      title: `${followUpActivity}: ${followUpStation || activeCase.incident.state + ' Unit'}`,
      desc: followUpNotes,
      officerName: followUpOfficer.trim() || undefined,
      stationOrAgency: followUpStation.trim() || undefined,
      source: 'user_reported',
    });

    if (updated) {
      setCasesList(CasesStore.getAllCases());
      toast({
        type: 'success',
        title: 'Follow-up Recorded',
        body: 'Activity added to case chronology.',
      });
      setShowLogFollowUpModal(false);
      setFollowUpNotes('');
      setFollowUpOfficer('');
      setFollowUpStation('');
    }
  };

  // Open official NCRP tracker
  const handleCheckOfficialNcrp = () => {
    if (activeCase?.ackNumber) {
      navigator.clipboard.writeText(activeCase.ackNumber);
      toast({
        type: 'info',
        title: 'Token Copied to Clipboard',
        body: `${activeCase.ackNumber} copied. Opening official NCRP portal.`,
      });
    }
    window.open('https://cybercrime.gov.in/Webform/Check_Status.aspx', '_blank');
  };

  // Email Nodal Officer
  const handleEmailNodalOfficer = (entry: NodalDirectoryEntry) => {
    if (!activeCase) return;
    const subject = encodeURIComponent(
      `Status Requisition: NCRP Complaint Token ${activeCase.ackNumber || activeCase.id}`
    );
    const body = encodeURIComponent(
      `To:\nThe Superintendent of Police / Nodal Officer\nCyber Crime Division, ${entry.state}\n\n` +
      `Respected Sir/Madam,\n\n` +
      `I am writing to formally request a status update on the preliminary inquiry for the following registered cybercrime complaint:\n\n` +
      `• NCRP Acknowledgment Number: ${activeCase.ackNumber || 'Pending'}\n` +
      `• Internal Reference: ${activeCase.id}\n` +
      `• Date of Registration: ${activeCase.incident.date}\n` +
      `• Location: ${activeCase.incident.district}, ${activeCase.incident.state}\n` +
      `• Category: ${activeCase.subtype}\n` +
      (activeCase.financial?.lostMoney ? `• Disputed Sum: INR ${activeCase.financial.amount}\n` : '') +
      `\nIssue Summary:\n${activeCase.healthReason || activeCase.incident.description}\n\n` +
      `Requested Action:\nKindly direct the concerned Investigating Officer to provide written inquiry status and issue necessary statutory notices under Section 91 CrPC / Section 79 IT Act.\n\n` +
      `Respectfully,\n[Complainant Name]\n[Contact Number]`
    );
    window.location.href = `mailto:${entry.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyDossier = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      type: 'success',
      title: 'Petition Copied',
      body: 'Formal text copied to clipboard.',
    });
  };

  const nodalEntry = activeCase ? NODAL_DIRECTORY[activeCase.incident.state] || NODAL_DIRECTORY['Maharashtra'] : null;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        background: '#F8FAFC',
        fontFamily: "'Manrope', Helvetica, sans-serif",
      }}
    >
      {/* ── Professional Sub-Header ── */}
      <div
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 19, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Track & Take Action
            </h1>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#0F766E',
                background: '#F0FDFA',
                border: '1px solid #CCFBF1',
                padding: '2px 8px',
                borderRadius: 4,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Case Progression & Escalation
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: '#64748B', margin: '2px 0 0' }}>
            Procedural status diagnosis, chronological case milestones, and verified statutory escalations.
          </p>
        </div>

        {/* 3-Pillar Tab Switcher (Zero emojis, minimalist clean) */}
        <div
          style={{
            display: 'flex',
            background: '#F1F5F9',
            padding: 3,
            borderRadius: 8,
            border: '1px solid #E2E8F0',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('cases')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'cases' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'cases' ? '#0F172A' : '#64748B',
              fontWeight: activeTab === 'cases' ? 700 : 600,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: activeTab === 'cases' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 120ms ease',
            }}
          >
            All Complaints ({casesList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tracking')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'tracking' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'tracking' ? '#0F172A' : '#64748B',
              fontWeight: activeTab === 'tracking' ? 700 : 600,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: activeTab === 'tracking' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 120ms ease',
            }}
          >
            Tracking & Timeline
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('actions')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'actions' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'actions' ? '#0F766E' : '#64748B',
              fontWeight: activeTab === 'actions' ? 700 : 600,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: activeTab === 'actions' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 120ms ease',
            }}
          >
            Escalations & Actions
          </button>
        </div>
      </div>

      {/* ── Case Selector Strip (Tracking & Actions tabs) ── */}
      {activeTab !== 'cases' && (
        <div
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            padding: '8px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            overflowX: 'auto',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            Active Case:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
            {casesList.map(c => {
              const b = getHealthBadge(c.health);
              const isSelected = c.id === activeCase?.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectCaseId(c.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: `1px solid ${isSelected ? '#0F766E' : '#E2E8F0'}`,
                    background: isSelected ? '#F0FDFA' : '#FFFFFF',
                    color: isSelected ? '#0F766E' : '#334155',
                    fontSize: 12,
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: b.dotColor }} />
                  <span>{c.id}</span>
                  <span style={{ fontSize: 10.5, color: '#64748B' }}>({c.subtype.split('/')[0].trim()})</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: 3,
                      background: b.bg,
                      color: b.color,
                    }}
                  >
                    {c.health}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main Content Container ── */}
      <div style={{ maxWidth: 1080, width: '100%', margin: '0 auto', padding: '24px 32px 64px' }}>

        {/* ═══════════════════════════════════════════════════════════════════
            PILLAR 1: ALL CASE COMPLAINTS
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'cases' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Filter Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                padding: '10px 16px',
              }}
            >
              <div style={{ position: 'relative', flex: 1, minWidth: 240, maxWidth: 360 }}>
                <span style={{ position: 'absolute', left: 10, top: 9, color: '#94A3B8', pointerEvents: 'none' }}>
                  <Icons.SearchActivity />
                </span>
                <input
                  type="text"
                  placeholder="Filter by Case ID, NCRP Token, Crime type..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 32px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 12.5,
                    color: '#0F172A',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Health:</span>
                {(['All', 'Urgent', 'Attention Required', 'Waiting', 'On Track'] as const).map(hf => (
                  <button
                    key={hf}
                    type="button"
                    onClick={() => setHealthFilter(hf)}
                    style={{
                      padding: '4px 9px',
                      borderRadius: 5,
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: healthFilter === hf ? '1px solid #0F766E' : '1px solid #E2E8F0',
                      background: healthFilter === hf ? '#0F766E' : '#FFFFFF',
                      color: healthFilter === hf ? '#FFFFFF' : '#475569',
                    }}
                  >
                    {hf}
                  </button>
                ))}
              </div>
            </div>

            {/* Complaints List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredCases.map(c => {
                const b = getHealthBadge(c.health);
                const isSelected = c.id === activeCase?.id;
                return (
                  <div
                    key={c.id}
                    style={{
                      background: '#FFFFFF',
                      border: isSelected ? '1.5px solid #0F766E' : '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '18px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                          {c.id}
                        </span>
                        {c.ackNumber && (
                          <span
                            style={{
                              fontSize: 11.5,
                              fontWeight: 600,
                              color: '#0F766E',
                              background: '#F0FDFA',
                              border: '1px solid #CCFBF1',
                              padding: '1px 6px',
                              borderRadius: 4,
                              fontFamily: 'monospace',
                            }}
                          >
                            {c.ackNumber}
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: b.bg,
                          border: `1px solid ${b.border}`,
                          color: b.color,
                          padding: '3px 10px',
                          borderRadius: 4,
                          fontSize: 11.5,
                          fontWeight: 700,
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: b.dotColor }} />
                        <span>{c.health}</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, fontSize: 12.5 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8' }}>Subtype</div>
                        <div style={{ fontWeight: 700, color: '#1E293B', marginTop: 1 }}>{c.subtype}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8' }}>Jurisdiction</div>
                        <div style={{ fontWeight: 500, color: '#475569', marginTop: 1 }}>
                          {c.incident.district}, {c.incident.state} ({c.incident.date})
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8' }}>Financial Loss</div>
                        <div style={{ fontWeight: 700, color: c.financial?.lostMoney ? '#B91C1C' : '#0F766E', marginTop: 1 }}>
                          {c.financial?.lostMoney ? `INR ${c.financial.amount}` : 'Non-financial'}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #F1F5F9',
                        borderRadius: 6,
                        padding: '8px 12px',
                        fontSize: 12,
                        color: '#475569',
                      }}
                    >
                      <strong style={{ color: '#0F172A' }}>Status Note:</strong> {c.healthReason || c.incident.description.slice(0, 160)}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCaseId(c.id);
                          setActiveTab('tracking');
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          border: '1px solid #CBD5E1',
                          background: '#FFFFFF',
                          color: '#334155',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Inspect Timeline
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectCaseId(c.id);
                          setActiveTab('actions');
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 6,
                          border: 'none',
                          background: '#0F766E',
                          color: '#FFFFFF',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Take Action / Escalate →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            PILLAR 2: TRACKING & ELABORATED TIMELINE
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'tracking' && activeCase && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Status & Diagnostic Header Card */}
            {(() => {
              const b = getHealthBadge(activeCase.health);
              return (
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.04em' }}>
                        Case File: {activeCase.id}
                      </div>
                      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '2px 0 0' }}>
                        {activeCase.subtype}
                      </h2>
                    </div>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: b.bg,
                        border: `1px solid ${b.border}`,
                        color: b.color,
                        padding: '5px 14px',
                        borderRadius: 6,
                        fontSize: 12.5,
                        fontWeight: 700,
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: b.dotColor }} />
                      <span>Health: {activeCase.health}</span>
                    </div>
                  </div>

                  {/* 3 Reality Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#0F766E' }}>
                        Verified Current State
                      </div>
                      <p style={{ fontSize: 12.5, color: '#1E293B', margin: '4px 0 0', lineHeight: 1.5 }}>
                        {activeCase.events[0]?.desc || 'Complaint registered.'}
                      </p>
                    </div>

                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#B45309' }}>
                        Procedural Context
                      </div>
                      <p style={{ fontSize: 12.5, color: '#78350F', margin: '4px 0 0', lineHeight: 1.5 }}>
                        {activeCase.healthReason}
                      </p>
                    </div>

                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#475569' }}>
                        Inquiry Stagnation
                      </div>
                      <p style={{ fontSize: 12.5, color: '#334155', margin: '4px 0 0', lineHeight: 1.5 }}>
                        {activeCase.daysStagnant === 0
                          ? 'Activity logged today. Investigation active.'
                          : `${activeCase.daysStagnant} days elapsed since last officially recorded station action.`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Elaborated Chronological Timeline */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                padding: '22px 24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  paddingBottom: 16,
                  borderBottom: '1px solid #F1F5F9',
                  marginBottom: 20,
                }}
              >
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Chronological Investigation Timeline & Audit Trail
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: '#0369A1', fontWeight: 600 }}>● Officially Recorded</span>
                    <span style={{ fontSize: 11, color: '#0F766E', fontWeight: 600 }}>● Citizen Reported</span>
                    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>● Procedural Assessment</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLogFollowUpModal(true)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 6,
                    border: '1px solid #0F766E',
                    background: '#F0FDFA',
                    color: '#0F766E',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Icons.Plus /> Log Follow-up Activity
                </button>
              </div>

              {/* Elaborated Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', paddingLeft: 22 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 6,
                    top: 12,
                    bottom: 12,
                    width: 2,
                    background: '#E2E8F0',
                  }}
                />

                {activeCase.events.map((ev, idx) => {
                  let badgeLabel = 'OFFICIAL RECORD';
                  let badgeColor = '#0369A1';
                  let badgeBg = '#F0F9FF';
                  let badgeBorder = '#BAE6FD';

                  if (ev.source === 'user_reported') {
                    badgeLabel = 'CITIZEN REPORTED';
                    badgeColor = '#0F766E';
                    badgeBg = '#F0FDFA';
                    badgeBorder = '#CCFBF1';
                  } else if (ev.source === 'casepilot_assessment') {
                    badgeLabel = 'PROCEDURAL ASSESSMENT';
                    badgeColor = '#475569';
                    badgeBg = '#F8FAFC';
                    badgeBorder = '#E2E8F0';
                  }

                  return (
                    <div
                      key={ev.id || idx}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        background: '#FAFAFA',
                        border: '1px solid #E2E8F0',
                        borderRadius: 8,
                        padding: '14px 16px',
                      }}
                    >
                      {/* Node circle */}
                      <div
                        style={{
                          position: 'absolute',
                          left: -22,
                          top: 14,
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: badgeColor,
                          border: '2px solid #FFFFFF',
                          boxShadow: '0 0 0 1px #CBD5E1',
                        }}
                      />

                      {/* Header Line */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: 3,
                              background: badgeBg,
                              color: badgeColor,
                              border: `1px solid ${badgeBorder}`,
                              letterSpacing: '0.04em',
                            }}
                          >
                            {badgeLabel}
                          </span>
                          <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                            {ev.title}
                          </span>
                        </div>
                        <span style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 600 }}>
                          {ev.timestamp}
                        </span>
                      </div>

                      {/* Narrative description */}
                      <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.55, margin: '2px 0 0' }}>
                        {ev.desc}
                      </p>

                      {/* Elaborated Metadata Strip */}
                      {(ev.stationOrAgency || ev.officerName || ev.referenceNumber || ev.statutorySection || ev.outcome) && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 12,
                            marginTop: 4,
                            paddingTop: 8,
                            borderTop: '1px solid #E2E8F0',
                            fontSize: 11.5,
                            color: '#64748B',
                          }}
                        >
                          {ev.stationOrAgency && (
                            <span><strong>Agency:</strong> {ev.stationOrAgency}</span>
                          )}
                          {ev.officerName && (
                            <span><strong>Officer:</strong> {ev.officerName}</span>
                          )}
                          {ev.referenceNumber && (
                            <span><strong>Ref:</strong> <code style={{ color: '#0F766E' }}>{ev.referenceNumber}</code></span>
                          )}
                          {ev.statutorySection && (
                            <span><strong>Section:</strong> {ev.statutorySection}</span>
                          )}
                          {ev.outcome && (
                            <span style={{ color: '#065F46', fontWeight: 700 }}><strong>Outcome:</strong> {ev.outcome}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            PILLAR 3: "WHAT CAN I DO NOW?" & ESCALATIONS
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'actions' && activeCase && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Formal Escalation Pack Banner */}
            <div
              style={{
                background: '#0F766E',
                color: '#FFFFFF',
                borderRadius: 10,
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#99F6E4' }}>
                  Formal Requisition Pack
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: '4px 0 2px' }}>
                  Prepare Follow-up & Grievance Dossier
                </h3>
                <p style={{ fontSize: 12.5, color: '#CCFBF1', margin: 0, maxWidth: 600 }}>
                  Compiles a clean, formal legal petition with your NCRP acknowledgment number, investigation timeline, evidence hashes, and formal prayers under CrPC/IT Act for submission to the Station House Officer or State Nodal Officer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCustomIssueNarrative(activeCase.healthReason || '');
                  setCustomRequestedAction(
                    activeCase.primaryCrimeType === 'FINANCIAL_FRAUD'
                      ? 'Direct Investigating Officer to issue Section 91 CrPC notice to beneficiary bank to prevent expiry of lien marker.'
                      : 'Provide written status of inquiry and issue Section 79 IT Act takedown directive.'
                  );
                  setShowEscalationModal(true);
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#FFFFFF',
                  color: '#0F766E',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Prepare Follow-up Dossier →
              </button>
            </div>

            {/* Actions Grid */}
            <div>
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Legitimate Procedural Next Steps for Case {activeCase.id}
                </h3>
                <p style={{ fontSize: 12.5, color: '#64748B', margin: '2px 0 0' }}>
                  Statutory routes based on current stage and crime classification.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 14 }}>
                {/* 1. Official NCRP Status */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0369A1', textTransform: 'uppercase' }}>
                      Official Portal
                    </div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: '4px 0 6px' }}>
                      Check Official NCRP Status
                    </h4>
                    <p style={{ fontSize: 12.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                      Verify official state police station assignment and investigation stage directly on cybercrime.gov.in.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckOfficialNcrp}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 6,
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#0369A1',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Open cybercrime.gov.in (Copies Token)
                  </button>
                </div>

                {/* 2. 1930 Helpline */}
                {activeCase.primaryCrimeType === 'FINANCIAL_FRAUD' && (
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #FECACA',
                      borderRadius: 10,
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', textTransform: 'uppercase' }}>
                        Helpline Action
                      </div>
                      <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: '4px 0 6px' }}>
                        Dial 1930 Cyber Fraud Helpline
                      </h4>
                      <p style={{ fontSize: 12.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                        Verify beneficiary bank lien marker status with Maharashtra Cyber Fraud Desk under CFCFRMS protocol.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShow1930Modal(true)}
                      style={{
                        padding: '7px 12px',
                        borderRadius: 6,
                        border: 'none',
                        background: '#DC2626',
                        color: '#FFFFFF',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Dial 1930 Helpline (Toll Free)
                    </button>
                  </div>
                )}

                {/* 3. Station Follow-up */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0F766E', textTransform: 'uppercase' }}>
                      Station Unit
                    </div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: '4px 0 6px' }}>
                      Follow up with Police Station
                    </h4>
                    <p style={{ fontSize: 12.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                      Jurisdiction: Cyber Crime Cell {activeCase.incident.district}. Carry printed acknowledgment slip, certified bank statement, and ID proof.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLogFollowUpModal(true)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 6,
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#0F766E',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Log Station Visit / Inquiry Call
                  </button>
                </div>

                {/* 4. State Nodal Officer */}
                {nodalEntry && (
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#4338CA', textTransform: 'uppercase' }}>
                        State Nodal Officer
                      </div>
                      <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: '4px 0 2px' }}>
                        {nodalEntry.officerName}
                      </h4>
                      <div style={{ fontSize: 11.5, color: '#475569', marginBottom: 4 }}>
                        {nodalEntry.designation}
                      </div>
                      <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                        {nodalEntry.email} • {nodalEntry.phone}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEmailNodalOfficer(nodalEntry)}
                      style={{
                        padding: '7px 12px',
                        borderRadius: 6,
                        border: '1px solid #C7D2FE',
                        background: '#EEF2FF',
                        color: '#4338CA',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Draft Email to Nodal Desk
                    </button>
                  </div>
                )}

                {/* 5. Bank Grievance & Ombudsman */}
                {activeCase.primaryCrimeType === 'FINANCIAL_FRAUD' && (
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                        Banking Ombudsman
                      </div>
                      <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: '4px 0 6px' }}>
                        Bank Grievance & Chargeback
                      </h4>
                      <p style={{ fontSize: 12.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                        Submit formal dispute citing RBI Zero Liability circular for unauthorized digital transactions.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open('https://cms.rbi.org.in', '_blank')}
                      style={{
                        padding: '7px 12px',
                        borderRadius: 6,
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#059669',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Open RBI CMS Portal
                    </button>
                  </div>
                )}

                {/* 6. CPGRAMS Portal */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase' }}>
                      Central Public Grievance
                    </div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: '4px 0 6px' }}>
                      CPGRAMS Grievance Portal
                    </h4>
                    <p style={{ fontSize: 12.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                      For administrative inaction, lodge a public grievance on pgportal.gov.in under Ministry of Home Affairs / CIS Division.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.open('https://pgportal.gov.in', '_blank')}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 6,
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#7C3AED',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Open CPGRAMS (pgportal.gov.in)
                  </button>
                </div>

                {/* 7. Judicial Remedy */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                      Judicial Remedy
                    </div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: '4px 0 6px' }}>
                      Section 156(3) CrPC / 175(3) BNSS
                    </h4>
                    <p style={{ fontSize: 12.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                      If police fail to register an FIR for a cognizable cyber offence, citizens can petition the Judicial Magistrate through a qualified cyber advocate.
                    </p>
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>
                    Note: CasePilot does not provide legal representation. Consult a qualified cyber advocate.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL 1: LOG FOLLOW-UP ACTIVITY ── */}
      {showLogFollowUpModal && activeCase && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowLogFollowUpModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: 12,
              maxWidth: 500,
              width: '100%',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#F8FAFC',
              }}
            >
              <div>
                <h3 style={{ fontSize: 15.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Log Follow-up Activity
                </h3>
                <span style={{ fontSize: 11.5, color: '#0F766E', fontWeight: 600 }}>
                  Case: {activeCase.id} ({activeCase.ackNumber || 'Inquiry'})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowLogFollowUpModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: '#64748B', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFollowUp} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Activity Type
                </label>
                <select
                  value={followUpActivity}
                  onChange={e => setFollowUpActivity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 12.5,
                    color: '#0F172A',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="Visited Police Station">Visited Police Station in person</option>
                  <option value="Spoke to Investigating Officer (IO)">Phone Call with Investigating Officer (IO)</option>
                  <option value="Visited Bank Branch">Visited Bank Branch for Chargeback</option>
                  <option value="Contacted Platform Grievance Officer">Emailed Platform Grievance Officer</option>
                  <option value="Other Follow-up">Other Citizen Follow-up</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Officer / Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Insp. K. Patil"
                    value={followUpOfficer}
                    onChange={e => setFollowUpOfficer(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: 6,
                      border: '1px solid #CBD5E1',
                      fontSize: 12.5,
                      color: '#0F172A',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Station / Agency / Branch
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bandra Cyber Cell"
                    value={followUpStation}
                    onChange={e => setFollowUpStation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: 6,
                      border: '1px solid #CBD5E1',
                      fontSize: 12.5,
                      color: '#0F172A',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Discussion Summary & Action Taken *
                </label>
                <textarea
                  rows={4}
                  placeholder="Record summary of discussion, documents requested, or instructions provided by the officer..."
                  value={followUpNotes}
                  onChange={e => setFollowUpNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 12.5,
                    color: '#0F172A',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowLogFollowUpModal(false)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '7px 16px',
                    borderRadius: 6,
                    border: 'none',
                    background: '#0F766E',
                    color: '#FFFFFF',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Save to Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: ESCALATION DOSSIER ── */}
      {showEscalationModal && activeCase && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowEscalationModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: 12,
              maxWidth: 720,
              width: '100%',
              maxHeight: '90vh',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#F8FAFC',
              }}
            >
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Case Follow-up Dossier & Requisition Petition
                </h3>
                <span style={{ fontSize: 11.5, color: '#0F766E', fontWeight: 600 }}>
                  Format for Station House Officer & Cyber Nodal Desk
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowEscalationModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: '#64748B', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                id="escalation-document-preview"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: 6,
                  padding: '20px 22px',
                  fontFamily: 'Georgia, serif',
                  color: '#0F172A',
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ textAlign: 'center', borderBottom: '1px solid #CBD5E1', paddingBottom: 10, marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    FORMAL FOLLOW-UP PETITION & INQUIRY STATUS REQUISITION
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                    Under Provisions of CrPC / BNSS 2023 and Information Technology Act 2000
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <strong>To:</strong><br />
                  The Station House Officer / Investigating Officer<br />
                  Cyber Crime Police Station, {activeCase.incident.district}, {activeCase.incident.state}<br /><br />
                  <strong>Copy to:</strong><br />
                  Superintendent of Police / Nodal Officer, Cyber Crime Division, {activeCase.incident.state} Police
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 10px', borderRadius: 4, marginBottom: 12 }}>
                  <strong>SUBJECT:</strong> Status requisition and procedural progression regarding NCRP Token <strong>{activeCase.ackNumber || activeCase.id}</strong>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <strong>1. COMPLAINANT PARTICULARS:</strong><br />
                  Case Reference: {activeCase.id} | Anonymous Filing: {activeCase.isAnonymous ? 'YES' : 'NO'}<br />
                  Incident Jurisdiction: {activeCase.incident.district}, {activeCase.incident.state} ({activeCase.incident.date})
                </div>

                <div style={{ marginBottom: 10 }}>
                  <strong>2. INCIDENT SUMMARY:</strong><br />
                  Classification: {activeCase.primaryCrimeType} ({activeCase.subtype})<br />
                  {activeCase.financial?.lostMoney && (
                    <span>Disputed Sum: INR {activeCase.financial.amount} | UTR: {activeCase.financial.utr || 'Reported'}<br /></span>
                  )}
                  Description: {activeCase.incident.description}
                </div>

                <div style={{ marginBottom: 10 }}>
                  <strong>3. CHRONOLOGICAL TIMELINE & RECORDED STEPS:</strong><br />
                  <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
                    {activeCase.events.map((ev, i) => (
                      <li key={i} style={{ marginBottom: 3 }}>
                        <strong>{ev.timestamp}</strong>: {ev.title} — {ev.desc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <strong>4. PRESERVED EVIDENCE PARTICULARS:</strong><br />
                  <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
                    {activeCase.evidence.map((ev, i) => (
                      <li key={i} style={{ marginBottom: 2 }}>
                        {ev.name} ({ev.category}) — SHA-256: <code style={{ fontSize: 11 }}>{ev.sha256.slice(0, 16)}...</code>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <strong>5. SPECIFIC GRIEVANCE & ROADBLOCK:</strong><br />
                  {isEditingDossier ? (
                    <textarea
                      rows={3}
                      value={customIssueNarrative}
                      onChange={e => setCustomIssueNarrative(e.target.value)}
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #0F766E', fontSize: 12.5 }}
                    />
                  ) : (
                    <div style={{ color: '#334155', fontStyle: 'italic', marginTop: 2 }}>
                      "{customIssueNarrative || activeCase.healthReason}"
                    </div>
                  )}
                </div>

                <div>
                  <strong>6. FORMAL PRAYER / REQUESTED ACTION:</strong><br />
                  {isEditingDossier ? (
                    <textarea
                      rows={3}
                      value={customRequestedAction}
                      onChange={e => setCustomRequestedAction(e.target.value)}
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #0F766E', fontSize: 12.5 }}
                    />
                  ) : (
                    <div style={{ color: '#1E293B', marginTop: 2 }}>
                      1. Furnish a written status report on the preliminary inquiry.<br />
                      2. {customRequestedAction}<br />
                      3. Register regular First Information Report (FIR) if cognizable offences are substantiated.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#FAFAFA',
              }}
            >
              <button
                type="button"
                onClick={() => setIsEditingDossier(!isEditingDossier)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: isEditingDossier ? '#0F766E' : '#475569',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {isEditingDossier ? 'Done Editing' : 'Edit Fields'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('escalation-document-preview');
                    if (el) handleCopyDossier(el.innerText);
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#334155',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Copy Text
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 6,
                    border: 'none',
                    background: '#0F766E',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Download PDF / Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: 1930 HELPLINE PRE-CALL CHECKLIST ── */}
      {show1930Modal && activeCase && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShow1930Modal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: 10,
              maxWidth: 460,
              width: '100%',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
              border: '1px solid #FECACA',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '14px 20px', background: '#FEF2F2', borderBottom: '1px solid #FECACA' }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#991B1B', margin: 0 }}>
                1930 National Cyber Fraud Helpline (Toll-Free)
              </h3>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 12.5, color: '#334155', margin: 0, lineHeight: 1.5 }}>
                Have these verified complaint particulars ready before dialing the desk officer:
              </p>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '10px 14px', fontSize: 12.5 }}>
                <div><strong>NCRP Token:</strong> {activeCase.ackNumber || activeCase.id}</div>
                <div><strong>Disputed Amount:</strong> INR {activeCase.financial?.amount || 'Reported'}</div>
                <div><strong>Transaction UTR:</strong> {activeCase.financial?.utr || 'Check Bank Statement'}</div>
                <div><strong>Victim Bank:</strong> {activeCase.financial?.bank || 'Your Bank'}</div>
                <div><strong>Beneficiary:</strong> {activeCase.financial?.beneficiaryAccount || 'Reported suspect handle'}</div>
              </div>

              <div style={{ fontSize: 11.5, color: '#64748B' }}>
                Operates 24x7 under CFCFRMS. Note down the Officer Desk ID provided during the call.
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShow1930Modal(false)}
                  style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <a
                  href="tel:1930"
                  onClick={() => setShow1930Modal(false)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 6,
                    background: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Dial 1930 Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
