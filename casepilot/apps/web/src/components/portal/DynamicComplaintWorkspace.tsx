'use client';

import React, { useState, useRef } from 'react';
import { ComplaintFlowConfig, FlowId, FlowTabConfig } from '../../lib/complaint-flows/types';
import { computeTabStatus } from '../../lib/complaint-flows/flow-engine';
import { EvidenceItem, FieldConflict, SuspectIdentifier } from '../../types/case-model';
import { processUploadedEvidence, detectEvidenceConflicts } from '../../lib/evidence-pipeline';
import { portalTheme } from './portalTheme';
import { Icons } from './Icons';

const baseInputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 6,
  border: '1px solid #CBD5E1',
  fontSize: 13,
  color: '#0F172A',
  background: '#FFFFFF',
  outline: 'none',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
};

interface Props {
  flowConfig: ComplaintFlowConfig;
  activeTabs: FlowTabConfig[];
  activeTabIndex: number;
  onTabChange: (index: number) => void;

  caseState: Record<string, any>;
  onFieldChange: (fieldId: string, value: any, isUserEdit?: boolean) => void;
  fieldStatuses: Record<string, 'empty' | 'ai-captured' | 'user-edited' | 'confirmed'>;

  conflicts: FieldConflict[];
  onResolveConflict: (conflictId: string, resolvedValue: string) => void;

  evidenceList: EvidenceItem[];
  onAddEvidence: (item: EvidenceItem) => void;
  onRemoveEvidence: (id: string) => void;

  intakeMode: 'manual' | 'ai';
  onToggleIntakeMode: (mode: 'manual' | 'ai') => void;

  onSaveDraft: () => void;
  onSubmitComplaint: () => void;
}

export function DynamicComplaintWorkspace({
  flowConfig,
  activeTabs,
  activeTabIndex,
  onTabChange,
  caseState,
  onFieldChange,
  fieldStatuses,
  conflicts,
  onResolveConflict,
  evidenceList,
  onAddEvidence,
  onRemoveEvidence,
  intakeMode,
  onToggleIntakeMode,
  onSaveDraft,
  onSubmitComplaint
}: Props) {
  const currentTab = activeTabs[activeTabIndex] || activeTabs[0];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newIdType, setNewIdType] = useState<SuspectIdentifier['type']>('mobile');
  const [newIdVal, setNewIdVal] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Compute status for all tabs
  const tabStatuses = activeTabs.map((tab, idx) => {
    const prevTabs = activeTabs.slice(0, idx);
    const prevAllComplete = prevTabs.every(pt => {
      const s = computeTabStatus(pt, caseState, evidenceList.length, true);
      return s.status === 'complete' || s.status === 'optional';
    });
    return computeTabStatus(tab, caseState, evidenceList.length, prevAllComplete);
  });

  const handleNext = () => {
    setValidationError(null);
    const currStatus = tabStatuses[activeTabIndex];
    if (currStatus.status === 'needs_attention') {
      setValidationError(`Please fill required fields before proceeding: ${currStatus.missingRequiredFields.join(', ')}`);
      return;
    }
    if (activeTabIndex < activeTabs.length - 1) {
      onTabChange(activeTabIndex + 1);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (activeTabIndex > 0) {
      onTabChange(activeTabIndex - 1);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const item = await processUploadedEvidence(file);
      onAddEvidence(item);
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addSuspectId = () => {
    if (!newIdVal.trim()) return;
    const existing: SuspectIdentifier[] = caseState.suspectIdentifiers || [];
    const updated = [
      ...existing,
      { id: Date.now().toString(), type: newIdType, value: newIdVal.trim() }
    ];
    onFieldChange('suspectIdentifiers', updated, true);
    setNewIdVal('');
  };

  const removeSuspectId = (id: string) => {
    const existing: SuspectIdentifier[] = caseState.suspectIdentifiers || [];
    const updated = existing.filter(i => i.id !== id);
    onFieldChange('suspectIdentifiers', updated, true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* ── Top Dynamic Tab Bar with Stretched Pill Styling Matching Home Tab ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 24px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          flexShrink: 0,
          width: '100%',
        }}
      >
        <nav
          aria-label="Complaint Workflow Steps"
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: '4px',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
            gap: 6,
          }}
        >
          {activeTabs.map((tab, idx) => {
            const isActive = idx === activeTabIndex;
            const tabStat = tabStatuses[idx];

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(idx)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  border: 'none',
                  background: isActive ? '#0F172A' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: 13,
                  letterSpacing: '-0.01em',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 140ms ease',
                  whiteSpace: 'nowrap',
                  fontFamily: "'Manrope', Helvetica, sans-serif",
                  lineHeight: 1.3,
                  boxShadow: isActive ? '0 2px 6px rgba(15, 23, 42, 0.18)' : 'none',
                  textAlign: 'center',
                  minHeight: 36,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#0F172A';
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.06)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <span>{tab.label}</span>

                {/* Status Badges */}
                {tabStat.status === 'complete' && (
                  <span
                    style={{
                      fontSize: 10.5,
                      background: isActive ? 'rgba(34, 197, 94, 0.25)' : '#DCFCE7',
                      color: isActive ? '#86EFAC' : '#15803D',
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                )}
                {tabStat.status === 'needs_attention' && (
                  <span
                    style={{
                      fontSize: 10,
                      background: isActive ? 'rgba(245, 158, 11, 0.3)' : '#FEF3C7',
                      color: isActive ? '#FDE68A' : '#B45309',
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontWeight: 700,
                    }}
                  >
                    ⚠ {tabStat.missingRequiredFields.length}
                  </span>
                )}
                {tabStat.status === 'optional' && (
                  <span
                    style={{
                      fontSize: 10,
                      color: isActive ? 'rgba(255, 255, 255, 0.6)' : '#94A3B8',
                      fontWeight: 500,
                    }}
                  >
                    (opt)
                  </span>
                )}
                {tabStat.status === 'locked' && (
                  <span
                    style={{
                      fontSize: 10,
                      color: isActive ? 'rgba(255, 255, 255, 0.6)' : '#94A3B8',
                    }}
                  >
                    🔒
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Scrollable Tab Content Canvas ── */}
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
        {/* Flow Header Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Pathway • {flowConfig.ncrpCategory}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
              {flowConfig.title}
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#64748B', maxWidth: 360, textAlign: 'right' }}>
            {flowConfig.description}
          </div>
        </div>

        {/* Validation Warning Alert */}
        {validationError && (
          <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, color: '#991B1B', fontSize: 13 }}>
            <Icons.AlertTriangle />
            <span>{validationError}</span>
          </div>
        )}

        {/* Conflict Resolution Banner (if any) */}
        {conflicts.filter(c => !c.resolved).map(conflict => (
          <div
            key={conflict.id}
            style={{
              padding: '14px 18px',
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#92400E', fontWeight: 700, fontSize: 13 }}>
              <Icons.AlertTriangle />
              <span>Evidence Discrepancy Detected for {conflict.label}</span>
            </div>
            <div style={{ fontSize: 12.5, color: '#78350F' }}>
              You reported <strong>{conflict.reportedValue}</strong>, but uploaded file <em>"{conflict.evidenceFileName}"</em> indicates <strong>{conflict.evidenceValue}</strong>.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => onResolveConflict(conflict.id, conflict.reportedValue.replace(/[^\d]/g, ''))}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  border: '1px solid #D97706',
                  background: '#FFFFFF',
                  color: '#92400E',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Keep Reported ({conflict.reportedValue})
              </button>
              <button
                type="button"
                onClick={() => onResolveConflict(conflict.id, conflict.evidenceValue.replace(/[^\d]/g, ''))}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#D97706',
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Use Evidence ({conflict.evidenceValue})
              </button>
            </div>
          </div>
        ))}

        {/* ── Tab View: Evidence Upload ── */}
        {currentTab.id === 'evidence' ? (
          <div style={portalTheme.containers.sectionCard}>
            <div style={portalTheme.containers.cardHeader}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                  Digital Evidence & Document Vault
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Upload transaction screenshots, bank statements, chat logs, or suspect URLs. Files are cryptographically hashed via SHA-256 for legal integrity.
                </div>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#0F766E',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: 12.5,
                  cursor: 'pointer',
                }}
              >
                <Icons.Attach />
                <span>{isUploading ? 'Hashing & Uploading...' : 'Add Evidence File'}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.txt,.mp3"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div style={portalTheme.containers.cardBody}>
              {evidenceList.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '36px 20px',
                    border: '2px dashed #CBD5E1',
                    borderRadius: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    background: '#F8FAFC',
                  }}
                >
                  <Icons.Attach />
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                    Click here to attach screenshots, statements or audio
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>
                    Supported formats: PNG, JPG, PDF, TXT, MP3 (Max 25MB). Auto-hashed via SHA-256.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {evidenceList.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 6,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icons.Attach />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                            <span>{item.category}</span>
                            <span>•</span>
                            <span>{(item.size / 1024).toFixed(1)} KB</span>
                            <span>•</span>
                            <span style={{ fontFamily: 'monospace', color: '#475569' }}>
                              SHA-256: {item.sha256.substring(0, 16)}...
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 11, background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                          ✓ Cryptographically Verified
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveEvidence(item.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            padding: 4,
                          }}
                          title="Remove File"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : currentTab.id === 'review' ? (
          /* ── Tab View: Review & Submit ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={portalTheme.containers.sectionCard}>
              <div style={portalTheme.containers.cardHeader}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                    Complaint Summary & Verification
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    Carefully inspect all captured fields before official dispatch to police cyber cell.
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0F766E' }}>
                  {evidenceList.length} Evidence Attachment(s)
                </div>
              </div>

              <div style={portalTheme.containers.cardBody}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Pathway</span>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{flowConfig.title}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Incident Date</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginTop: 2 }}>{caseState.incidentDate || 'Not specified'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Jurisdiction State</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginTop: 2 }}>{caseState.stateUt || 'Not specified'}</div>
                  </div>

                  {caseState.fraudAmount && (
                    <div>
                      <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Defrauded Amount</span>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#B91C1C', marginTop: 2 }}>₹{caseState.fraudAmount}</div>
                    </div>
                  )}

                  {caseState.utrNumber && (
                    <div>
                      <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>UTR / Reference</span>
                      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A', marginTop: 2 }}>{caseState.utrNumber}</div>
                    </div>
                  )}

                  {caseState.offenderHandle && (
                    <div>
                      <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Offender Handle</span>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{caseState.offenderHandle}</div>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Incident Description</span>
                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5, marginTop: 4, whiteSpace: 'pre-line' }}>
                    {caseState.incidentDescription || 'No description provided.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Statutory Legal Declaration */}
            <div style={{ padding: '16px 20px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 8 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(caseState.declarationAccepted)}
                  onChange={e => onFieldChange('declarationAccepted', e.target.checked, true)}
                  style={{ width: 16, height: 16, marginTop: 2 }}
                />
                <span style={{ fontSize: 12.5, color: '#1E293B', lineHeight: 1.5 }}>
                  I hereby declare under penalty of Section 182 and 211 of the Indian Penal Code that the information provided in this cybercrime complaint is true, complete, and accurate to the best of my knowledge and belief. I understand that filing a false complaint is a punishable offense.
                </span>
              </label>
            </div>
          </div>
        ) : (
          /* ── Standard Dynamic Form Rendering from Flow Configuration ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {currentTab.sections.map(section => (
              <div key={section.id} style={portalTheme.containers.sectionCard}>
                <div style={portalTheme.containers.cardHeader}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                      {section.title}
                    </div>
                    {section.description && (
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                        {section.description}
                      </div>
                    )}
                  </div>
                </div>

                <div style={portalTheme.containers.cardBody}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                    {section.fields.map(field => {
                      const value = caseState[field.id] ?? field.defaultValue ?? '';
                      const status = fieldStatuses[field.id] || 'empty';
                      const isFullWidth = field.type === 'textarea' || field.type === 'identifiers_list' || field.type === 'radio';

                      return (
                        <div
                          key={field.id}
                          style={{
                            gridColumn: isFullWidth ? 'span 2' : 'span 1',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label style={{ fontSize: 12.5, fontWeight: 600, color: '#334155' }}>
                              {field.label}
                              {field.required && <span style={{ color: '#DC2626', marginLeft: 2 }}>*</span>}
                            </label>

                            {/* AI Capture / Edit Indicator */}
                            {status === 'ai-captured' && (
                              <span style={{ fontSize: 10, background: '#E0F2FE', color: '#0369A1', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                                ✦ AI captured
                              </span>
                            )}
                            {status === 'user-edited' && (
                              <span style={{ fontSize: 10, background: '#F1F5F9', color: '#475569', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                                Edited by you
                              </span>
                            )}
                          </div>

                          {/* Field Input Rendering */}
                          {field.type === 'text' && (
                            <input
                              type="text"
                              value={value}
                              placeholder={field.placeholder}
                              onChange={e => onFieldChange(field.id, e.target.value, true)}
                              style={{ ...baseInputStyle, padding: '8px 12px' }}
                            />
                          )}

                          {field.type === 'currency' && (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <span style={{ position: 'absolute', left: 12, color: '#64748B', fontWeight: 600 }}>₹</span>
                              <input
                                type="text"
                                value={value}
                                placeholder={field.placeholder}
                                onChange={e => onFieldChange(field.id, e.target.value, true)}
                                style={{ ...baseInputStyle, padding: '8px 12px 8px 28px', fontWeight: 700 }}
                              />
                            </div>
                          )}

                          {field.type === 'date' && (
                            <input
                              type="date"
                              value={value}
                              onChange={e => onFieldChange(field.id, e.target.value, true)}
                              style={{ ...baseInputStyle, padding: '8px 12px' }}
                            />
                          )}

                          {field.type === 'time' && (
                            <input
                              type="time"
                              value={value}
                              onChange={e => onFieldChange(field.id, e.target.value, true)}
                              style={{ ...baseInputStyle, padding: '8px 12px' }}
                            />
                          )}

                          {field.type === 'select' && (
                            <select
                              value={value}
                              onChange={e => onFieldChange(field.id, e.target.value, true)}
                              style={{ ...baseInputStyle, padding: '8px 12px' }}
                            >
                              <option value="">Select {field.label}...</option>
                              {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          )}

                          {field.type === 'textarea' && (
                            <textarea
                              rows={4}
                              value={value}
                              placeholder={field.placeholder}
                              onChange={e => onFieldChange(field.id, e.target.value, true)}
                              style={{ ...baseInputStyle, padding: '10px 12px', resize: 'vertical' }}
                            />
                          )}

                          {field.type === 'radio' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {field.options?.map(opt => (
                                <label
                                  key={opt.value}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 10,
                                    padding: '10px 14px',
                                    borderRadius: 6,
                                    border: value === opt.value ? '1px solid #0F766E' : '1px solid #E2E8F0',
                                    background: value === opt.value ? '#F0FDFA' : '#FFFFFF',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name={field.id}
                                    value={opt.value}
                                    checked={value === opt.value}
                                    onChange={() => onFieldChange(field.id, opt.value, true)}
                                    style={{ marginTop: 2 }}
                                  />
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{opt.label}</div>
                                    {opt.subLabel && (
                                      <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{opt.subLabel}</div>
                                    )}
                                  </div>
                                </label>
                              ))}
                            </div>
                          )}

                          {field.type === 'identifiers_list' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <select
                                  value={newIdType}
                                  onChange={e => setNewIdType(e.target.value as any)}
                                  style={{ ...baseInputStyle, width: 140, padding: '7px 10px' }}
                                >
                                  <option value="mobile">Mobile / Phone</option>
                                  <option value="email">Email Address</option>
                                  <option value="upi">UPI VPA ID</option>
                                  <option value="handle">Social Handle</option>
                                  <option value="url">Website URL</option>
                                </select>
                                <input
                                  type="text"
                                  placeholder="Enter identifier..."
                                  value={newIdVal}
                                  onChange={e => setNewIdVal(e.target.value)}
                                  onKeyDown={e => e.key === 'Enter' && addSuspectId()}
                                  style={{ ...baseInputStyle, flex: 1, padding: '7px 10px' }}
                                />
                                <button
                                  type="button"
                                  onClick={addSuspectId}
                                  style={{
                                    padding: '7px 14px',
                                    borderRadius: 6,
                                    border: 'none',
                                    background: '#0F172A',
                                    color: '#FFFFFF',
                                    fontWeight: 600,
                                    fontSize: 12,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Add
                                </button>
                              </div>

                              {/* List of active identifiers */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {(caseState.suspectIdentifiers || []).map((idItem: SuspectIdentifier) => (
                                  <span
                                    key={idItem.id}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 6,
                                      padding: '3px 8px',
                                      background: '#F1F5F9',
                                      borderRadius: 4,
                                      fontSize: 12,
                                      color: '#334155',
                                    }}
                                  >
                                    <strong style={{ textTransform: 'uppercase', fontSize: 10 }}>{idItem.type}:</strong>
                                    <span>{idItem.value}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeSuspectId(idItem.id)}
                                      style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer' }}
                                    >
                                      ✕
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {field.helperText && (
                            <span style={{ fontSize: 11, color: '#64748B' }}>{field.helperText}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom Interactive Actions Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 32px',
          background: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          disabled={activeTabIndex === 0}
          style={{
            padding: '8px 18px',
            borderRadius: 6,
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: activeTabIndex === 0 ? '#CBD5E1' : '#334155',
            fontSize: 13,
            fontWeight: 600,
            cursor: activeTabIndex === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          ← Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={onSaveDraft}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save Draft
          </button>

          {currentTab.id === 'review' ? (
            <button
              type="button"
              onClick={onSubmitComplaint}
              disabled={!caseState.declarationAccepted}
              style={{
                padding: '8px 24px',
                borderRadius: 6,
                border: 'none',
                background: caseState.declarationAccepted ? '#0F766E' : '#94A3B8',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 700,
                cursor: caseState.declarationAccepted ? 'pointer' : 'not-allowed',
                boxShadow: caseState.declarationAccepted ? '0 2px 6px rgba(15, 118, 110, 0.3)' : 'none',
              }}
            >
              Submit Complaint to NCRP →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              style={{
                padding: '8px 20px',
                borderRadius: 6,
                border: 'none',
                background: '#0F172A',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Next Step →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
