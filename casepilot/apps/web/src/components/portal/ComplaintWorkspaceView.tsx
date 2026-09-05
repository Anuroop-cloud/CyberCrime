import React from 'react';
import { Icons } from './Icons';
import { portalTheme } from './portalTheme';
import { SecondaryPortalNav } from './SecondaryPortalNav';
import { EvidenceTableView, EvidenceItem } from './EvidenceTableView';

export interface SuspectIdentifier {
  id: string;
  type: 'mobile' | 'email' | 'handle' | 'bank' | 'url';
  value: string;
}

type FieldStatus = 'empty' | 'ai-captured' | 'confirmed' | 'user-edited' | 'needs-review';

interface Props {
  // Navigation
  registerSubTab: number;
  onSubTabChange: (tabIndex: number) => void;
  registerTabs: { id: number; label: string }[];
  
  // Field values & setters
  category: string;
  setCategory: (val: string) => void;
  subCategory: string;
  setSubCategory: (val: string) => void;
  CATEGORIES: Record<string, string[]>;
  
  incidentDate: string;
  setIncidentDate: (val: string) => void;
  incidentHour: string;
  setIncidentHour: (val: string) => void;
  incidentMin: string;
  setIncidentMin: (val: string) => void;
  incidentAmPm: string;
  setIncidentAmPm: (val: string) => void;
  stateUt: string;
  setStateUt: (val: string) => void;
  district: string;
  setDistrict: (val: string) => void;
  INDIAN_STATES: string[];
  whereOccurred: string;
  setWhereOccurred: (val: string) => void;
  CRIME_LOCATIONS: string[];
  policeStation: string;
  setPoliceStation: (val: string) => void;
  incidentDescription: string;
  setIncidentDescription: (val: string) => void;
  
  // Suspects
  suspectName: string;
  setSuspectName: (val: string) => void;
  suspectIdentifiers: SuspectIdentifier[];
  newIdType: 'mobile' | 'email' | 'handle' | 'bank' | 'url';
  setNewIdType: (val: any) => void;
  newIdVal: string;
  setNewIdVal: (val: string) => void;
  onAddSuspectIdentifier: () => void;
  onRemoveSuspectIdentifier: (id: string) => void;
  
  // Financial
  isFinancial: boolean;
  bankName: string;
  setBankName: (val: string) => void;
  paymentMode: string;
  setPaymentMode: (val: string) => void;
  utrNumber: string;
  setUtrNumber: (val: string) => void;
  fraudAmount: string;
  setFraudAmount: (val: string) => void;
  beneficiaryAccount: string;
  setBeneficiaryAccount: (val: string) => void;
  
  // Hacking / Social
  isHacking: boolean;
  affectedDevice: string;
  setAffectedDevice: (val: string) => void;
  ransomExtension: string;
  setRansomExtension: (val: string) => void;
  ransomDemand: string;
  setRansomDemand: (val: string) => void;
  ransomAddress: string;
  setRansomAddress: (val: string) => void;
  
  isSocial: boolean;
  socialPlatform: string;
  setSocialPlatform: (val: string) => void;
  offenderHandle: string;
  setOffenderHandle: (val: string) => void;
  harassmentNature: string;
  setHarassmentNature: (val: string) => void;
  
  // Evidence
  evidenceList: EvidenceItem[];
  onEvidenceUpload: (fileName: string, simulatedAmt?: string, simulatedUtr?: string) => void;
  onEvidenceRemove: (id: string) => void;
  
  // Review & Submit
  collapsedReviewSections: Record<string, boolean>;
  onToggleReviewSection: (section: string) => void;
  declarationAccepted: boolean;
  setDeclarationAccepted: (val: boolean) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
  onSaveDraft: () => void;
  
  // Field state & conflict tracking
  fieldStates: Record<string, FieldStatus>;
  fieldConflicts: Record<string, { evidenceVal: string; statedVal: string; note: string }>;
  onResolveConflict: (field: string, val: string) => void;
  onUserEdit: (fieldKey: string, setter: (val: any) => void, val: any) => void;
}

export function ComplaintWorkspaceView({
  registerSubTab,
  onSubTabChange,
  registerTabs,
  category,
  setCategory,
  subCategory,
  setSubCategory,
  CATEGORIES,
  incidentDate,
  setIncidentDate,
  incidentHour,
  setIncidentHour,
  incidentMin,
  setIncidentMin,
  incidentAmPm,
  setIncidentAmPm,
  stateUt,
  setStateUt,
  district,
  setDistrict,
  INDIAN_STATES,
  whereOccurred,
  setWhereOccurred,
  CRIME_LOCATIONS,
  policeStation,
  setPoliceStation,
  incidentDescription,
  setIncidentDescription,
  suspectName,
  setSuspectName,
  suspectIdentifiers,
  newIdType,
  setNewIdType,
  newIdVal,
  setNewIdVal,
  onAddSuspectIdentifier,
  onRemoveSuspectIdentifier,
  isFinancial,
  bankName,
  setBankName,
  paymentMode,
  setPaymentMode,
  utrNumber,
  setUtrNumber,
  fraudAmount,
  setFraudAmount,
  beneficiaryAccount,
  setBeneficiaryAccount,
  isHacking,
  affectedDevice,
  setAffectedDevice,
  ransomExtension,
  setRansomExtension,
  ransomDemand,
  setRansomDemand,
  ransomAddress,
  setRansomAddress,
  isSocial,
  socialPlatform,
  setSocialPlatform,
  offenderHandle,
  setOffenderHandle,
  harassmentNature,
  setHarassmentNature,
  evidenceList,
  onEvidenceUpload,
  onEvidenceRemove,
  collapsedReviewSections,
  onToggleReviewSection,
  declarationAccepted,
  setDeclarationAccepted,
  isSubmitting,
  onSubmit,
  onSaveDraft,
  fieldStates,
  fieldConflicts,
  onResolveConflict,
  onUserEdit,
}: Props) {
  // Subtle AI Indicator (Section 11)
  const renderAiTag = (fieldKey: string) => {
    const status = fieldStates[fieldKey];
    if (status === 'ai-captured') {
      return (
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: '#0F766E',
            background: '#F0FDFA',
            border: '1px solid #CCFBF1',
            padding: '1px 6px',
            borderRadius: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
          }}
          title="Captured automatically by CasePilot AI"
        >
          <Icons.Sparkles /> AI Captured
        </span>
      );
    }
    if (status === 'confirmed') {
      return (
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: '#15803D',
            background: '#DCFCE7',
            border: '1px solid #BBF7D0',
            padding: '1px 6px',
            borderRadius: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Icons.Check /> Confirmed
        </span>
      );
    }
    if (status === 'needs-review') {
      return (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#DC2626',
            background: '#FEE2E2',
            border: '1px solid #FECACA',
            padding: '1px 6px',
            borderRadius: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Icons.AlertTriangle /> Discrepancy
        </span>
      );
    }
    return null;
  };

  // Input styling based on status
  const getInputStyle = (fieldKey: string) => {
    const status = fieldStates[fieldKey];
    let borderColor = '#CBD5E1';
    let background = '#FFFFFF';
    if (status === 'ai-captured') {
      borderColor = '#99F6E4';
      background = '#FBFDFD';
    } else if (status === 'needs-review') {
      borderColor = '#F87171';
      background = '#FEF2F2';
    } else if (status === 'confirmed') {
      borderColor = '#86EFAC';
      background = '#F0FDF4';
    }
    return {
      ...portalTheme.forms.input,
      border: `1px solid ${borderColor}`,
      background,
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* ── Secondary Section Navigation Strip (Section 4 Benchmark) ── */}
      <SecondaryPortalNav
        tabs={registerTabs}
        activeTab={registerSubTab}
        onTabChange={onSubTabChange}
      />

      {/* ── Discrepancy Alert Banner (Subtle and Contained) ── */}
      {Object.keys(fieldConflicts).length > 0 && (
        <div
          style={{
            background: '#FEF2F2',
            borderBottom: '1px solid #FECACA',
            padding: '10px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: '#991B1B' }}>
            <Icons.AlertTriangle />
            <span>
              <strong>Evidence Discrepancy Detected:</strong> {fieldConflicts['fraudAmount']?.note}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => onResolveConflict('fraudAmount', fieldConflicts['fraudAmount'].evidenceVal)}
              style={{
                background: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 4,
                padding: '4px 10px',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Use Evidence (₹{Number(fieldConflicts['fraudAmount']?.evidenceVal).toLocaleString('en-IN')})
            </button>
            <button
              type="button"
              onClick={() => onResolveConflict('fraudAmount', fieldConflicts['fraudAmount'].statedVal)}
              style={{
                background: '#FFFFFF',
                color: '#475569',
                border: '1px solid #CBD5E1',
                borderRadius: 4,
                padding: '4px 10px',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Keep Stated (₹{Number(fieldConflicts['fraudAmount']?.statedVal).toLocaleString('en-IN')})
            </button>
          </div>
        </div>
      )}

      {/* ── Scrollable Portal Workspace Canvas ── */}
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
        {/* ════════════════════════════════════════════════════════════
            SUBTAB 0: COMPLAINT & INCIDENT DETAILS (Sections 7 & 8)
           ════════════════════════════════════════════════════════════ */}
        {registerSubTab === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* ── Container 1: Incident Classification ── */}
            <div style={portalTheme.containers.sectionCard}>
              <div style={portalTheme.containers.cardHeader}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                  Incident Classification
                </span>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>
                  Statutory NCRP Cybercrime Taxonomy
                </span>
              </div>

              <div style={portalTheme.containers.cardBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={portalTheme.forms.label}>
                      <span>Category of Complaint <span style={{ color: '#DC2626' }}>*</span></span>
                      {renderAiTag('category')}
                    </label>
                    <select
                      value={category}
                      onChange={e => {
                        onUserEdit('category', setCategory, e.target.value);
                        setSubCategory(CATEGORIES[e.target.value]?.[0] || '');
                      }}
                      style={{
                        ...portalTheme.forms.select,
                        border: fieldStates['category'] === 'ai-captured' ? '1px solid #99F6E4' : '1px solid #CBD5E1',
                        background: fieldStates['category'] === 'ai-captured' ? '#FBFDFD' : '#FFFFFF',
                      }}
                    >
                      {Object.keys(CATEGORIES).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={portalTheme.forms.label}>
                      <span>Sub-Category of Complaint <span style={{ color: '#DC2626' }}>*</span></span>
                      {renderAiTag('subCategory')}
                    </label>
                    <select
                      value={subCategory}
                      onChange={e => onUserEdit('subCategory', setSubCategory, e.target.value)}
                      style={{
                        ...portalTheme.forms.select,
                        border: fieldStates['subCategory'] === 'ai-captured' ? '1px solid #99F6E4' : '1px solid #CBD5E1',
                        background: fieldStates['subCategory'] === 'ai-captured' ? '#FBFDFD' : '#FFFFFF',
                      }}
                    >
                      {(CATEGORIES[category] || []).map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Container 2: Complaint / Incident Details ── */}
            <div style={portalTheme.containers.sectionCard}>
              <div style={portalTheme.containers.cardHeader}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                  Incident Details & Narrative
                </span>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>
                  Mandatory Legal Particulars
                </span>
              </div>

              <div style={portalTheme.containers.cardBody}>
                {/* Restrained Info Banner (Section 10) */}
                <div style={portalTheme.containers.infoBanner}>
                  <Icons.Info />
                  <span>
                    Describe what occurred in your own words. You can also chat with the CasePilot AI assistant on the right to populate these fields conversationally.
                  </span>
                </div>

                {/* 2-Column Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Date & Time */}
                  <div>
                    <label style={portalTheme.forms.label}>
                      <span>Approximate Date & Time of Incident <span style={{ color: '#DC2626' }}>*</span></span>
                      {renderAiTag('incidentDate')}
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="date"
                        value={incidentDate}
                        onChange={e => onUserEdit('incidentDate', setIncidentDate, e.target.value)}
                        style={{ ...getInputStyle('incidentDate'), flex: 2 }}
                      />
                      <input
                        type="text"
                        maxLength={2}
                        value={incidentHour}
                        onChange={e => setIncidentHour(e.target.value)}
                        placeholder="HH"
                        style={{ ...portalTheme.forms.input, width: 50, textAlign: 'center' }}
                      />
                      <input
                        type="text"
                        maxLength={2}
                        value={incidentMin}
                        onChange={e => setIncidentMin(e.target.value)}
                        placeholder="MM"
                        style={{ ...portalTheme.forms.input, width: 50, textAlign: 'center' }}
                      />
                      <select
                        value={incidentAmPm}
                        onChange={e => setIncidentAmPm(e.target.value)}
                        style={{ ...portalTheme.forms.select, width: 70 }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Where Occurred / Channel */}
                  <div>
                    <label style={portalTheme.forms.label}>
                      <span>Where did the incident occur? <span style={{ color: '#DC2626' }}>*</span></span>
                      {renderAiTag('whereOccurred')}
                    </label>
                    <select
                      value={whereOccurred}
                      onChange={e => onUserEdit('whereOccurred', setWhereOccurred, e.target.value)}
                      style={{
                        ...portalTheme.forms.select,
                        border: fieldStates['whereOccurred'] === 'ai-captured' ? '1px solid #99F6E4' : '1px solid #CBD5E1',
                        background: fieldStates['whereOccurred'] === 'ai-captured' ? '#FBFDFD' : '#FFFFFF',
                      }}
                    >
                      {CRIME_LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* State / UT & District */}
                  <div>
                    <label style={portalTheme.forms.label}>
                      <span>State / UT & District <span style={{ color: '#DC2626' }}>*</span></span>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <select
                        value={stateUt}
                        onChange={e => setStateUt(e.target.value)}
                        style={portalTheme.forms.select}
                      >
                        {INDIAN_STATES.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={district}
                        onChange={e => setDistrict(e.target.value)}
                        placeholder="District"
                        style={portalTheme.forms.input}
                      />
                    </div>
                  </div>

                  {/* Police Station Jurisdiction */}
                  <div>
                    <label style={portalTheme.forms.label}>
                      <span>Police Station Jurisdiction</span>
                    </label>
                    <input
                      type="text"
                      value={policeStation}
                      onChange={e => setPoliceStation(e.target.value)}
                      placeholder="e.g. Cyber Crime PS, Mandir Marg"
                      style={portalTheme.forms.input}
                    />
                  </div>
                </div>

                {/* 1-Column Narrative Field (Section 8) */}
                <div>
                  <label style={portalTheme.forms.label}>
                    <span>Incident Description / Citizen Statement <span style={{ color: '#DC2626' }}>*</span></span>
                    {renderAiTag('incidentDescription')}
                  </label>
                  <textarea
                    rows={5}
                    value={incidentDescription}
                    onChange={e => onUserEdit('incidentDescription', setIncidentDescription, e.target.value)}
                    placeholder="Describe how the perpetrator contacted you, what instructions they provided, and how the loss or compromise took place..."
                    style={{
                      ...portalTheme.forms.textarea,
                      border: fieldStates['incidentDescription'] === 'ai-captured' ? '1px solid #99F6E4' : '1px solid #CBD5E1',
                      background: fieldStates['incidentDescription'] === 'ai-captured' ? '#FBFDFD' : '#FFFFFF',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginTop: 4 }}>
                    <span>Characters: {incidentDescription.length} / 1500</span>
                    <span>Prohibited special characters are filtered automatically</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <button
                type="button"
                onClick={() => onSubTabChange(1)}
                style={{
                  background: '#0F766E',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '9px 24px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(15, 118, 110, 0.2)',
                }}
              >
                Save & Next: Suspect Details →
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            SUBTAB 1: SUSPECT DETAILS (Section 17 Table / List)
           ════════════════════════════════════════════════════════════ */}
        {registerSubTab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={portalTheme.containers.sectionCard}>
              <div style={portalTheme.containers.cardHeader}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                  Suspect Information & Digital Identifiers
                </span>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>
                  Add phone numbers, social handles, or scammer accounts
                </span>
              </div>

              <div style={portalTheme.containers.cardBody}>
                {/* Suspect Name */}
                <div style={{ maxWidth: 480 }}>
                  <label style={portalTheme.forms.label}>
                    <span>Suspect / Caller Name (if known)</span>
                    {renderAiTag('suspectName')}
                  </label>
                  <input
                    type="text"
                    value={suspectName}
                    onChange={e => onUserEdit('suspectName', setSuspectName, e.target.value)}
                    placeholder="e.g. Caller claimed to be 'Rahul Sharma from SBI KYC desk'"
                    style={getInputStyle('suspectName')}
                  />
                </div>

                {/* Suspect Identifiers Structured Table (Section 17) */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
                    Recorded Suspect Identifiers ({suspectIdentifiers.length})
                  </div>

                  <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
                    <table style={portalTheme.table.table}>
                      <thead>
                        <tr style={portalTheme.table.theadRow}>
                          <th style={{ ...portalTheme.table.th, width: '24%' }}>Identifier Type</th>
                          <th style={{ ...portalTheme.table.th, width: '46%' }}>Value / Handle</th>
                          <th style={{ ...portalTheme.table.th, width: '20%' }}>Verification</th>
                          <th style={{ ...portalTheme.table.th, width: '10%', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suspectIdentifiers.length === 0 ? (
                          <tr>
                            <td colSpan={4} style={{ ...portalTheme.table.td, textAlign: 'center', color: '#94A3B8', padding: '20px' }}>
                              No suspect identifiers added yet. Use the form below to add known numbers or handles.
                            </td>
                          </tr>
                        ) : (
                          suspectIdentifiers.map(item => (
                            <tr key={item.id} style={portalTheme.table.tbodyRow}>
                              <td style={portalTheme.table.td}>
                                <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#0F172A' }}>
                                  {item.type}
                                </span>
                              </td>
                              <td style={portalTheme.table.td}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                                  {item.value}
                                </span>
                              </td>
                              <td style={portalTheme.table.td}>
                                <span style={{ fontSize: 11, background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: 4 }}>
                                  Reported
                                </span>
                              </td>
                              <td style={{ ...portalTheme.table.td, textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => onRemoveSuspectIdentifier(item.id)}
                                  title="Remove identifier"
                                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                                  onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                                  onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                                >
                                  <Icons.Trash />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Inline Add Row */}
                    <div style={{ padding: '12px 16px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 10 }}>
                      <select
                        value={newIdType}
                        onChange={e => setNewIdType(e.target.value)}
                        style={{ ...portalTheme.forms.select, width: 140 }}
                      >
                        <option value="mobile">Mobile Number</option>
                        <option value="handle">Social Handle</option>
                        <option value="email">Email Address</option>
                        <option value="bank">Bank / UPI VPA</option>
                        <option value="url">Phishing URL</option>
                      </select>

                      <input
                        type="text"
                        value={newIdVal}
                        onChange={e => setNewIdVal(e.target.value)}
                        placeholder="e.g. +91 9876543210 or @scam_account"
                        style={{ ...portalTheme.forms.input, flex: 1 }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            onAddSuspectIdentifier();
                          }
                        }}
                      />

                      <button
                        type="button"
                        onClick={onAddSuspectIdentifier}
                        style={{
                          background: '#0F766E',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 6,
                          padding: '0 16px',
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        + Add Identifier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => onSubTabChange(0)}
                style={{
                  background: '#FFFFFF',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  padding: '9px 18px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={() => onSubTabChange(2)}
                style={{
                  background: '#0F766E',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '9px 24px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(15, 118, 110, 0.2)',
                }}
              >
                Save & Next: Specific Details →
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            SUBTAB 2: ADAPTIVE CRIME-SPECIFIC DETAILS (Financial etc.)
           ════════════════════════════════════════════════════════════ */}
        {registerSubTab === 2 && isFinancial && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={portalTheme.containers.sectionCard}>
              <div style={portalTheme.containers.cardHeader}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                  Financial Transaction Details
                </span>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>
                  Mandatory for 1930 Inter-Bank Freeze Integration
                </span>
              </div>

              <div style={portalTheme.containers.cardBody}>
                {/* Restrained Info Banner */}
                <div style={portalTheme.containers.infoBanner}>
                  <Icons.Info />
                  <span>
                    Providing the exact 12-digit UTR and scammer beneficiary account enables Indian cyber police to transmit automated freeze requests directly to beneficiary bank nodal officers.
                  </span>
                </div>

                {/* 2-Column Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Fraud Amount */}
                  <div>
                    <label style={portalTheme.forms.label}>
                      <span>Exact Fraud Amount (INR) <span style={{ color: '#DC2626' }}>*</span></span>
                      {renderAiTag('fraudAmount')}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: 9, color: '#64748B', fontWeight: 600 }}>₹</span>
                      <input
                        type="number"
                        value={fraudAmount}
                        onChange={e => onUserEdit('fraudAmount', setFraudAmount, e.target.value)}
                        placeholder="e.g. 75000"
                        style={{ ...getInputStyle('fraudAmount'), paddingLeft: 28, fontWeight: 700 }}
                      />
                    </div>
                  </div>

                  {/* Complainant Bank */}
                  <div>
                    <label style={portalTheme.forms.label}>
                      <span>Complainant Bank Name <span style={{ color: '#DC2626' }}>*</span></span>
                      {renderAiTag('bankName')}
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={e => onUserEdit('bankName', setBankName, e.target.value)}
                      placeholder="e.g. State Bank of India, HDFC Bank"
                      style={getInputStyle('bankName')}
                    />
                  </div>

                  {/* Payment Mode */}
                  <div>
                    <label style={portalTheme.forms.label}>
                      <span>Payment Method <span style={{ color: '#DC2626' }}>*</span></span>
                    </label>
                    <select
                      value={paymentMode}
                      onChange={e => setPaymentMode(e.target.value)}
                      style={portalTheme.forms.select}
                    >
                      <option value="UPI">UPI (Google Pay, PhonePe, Paytm, BHIM)</option>
                      <option value="Net Banking">Internet Banking (NEFT / RTGS / IMPS)</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="AePS">AePS (Aadhaar Enabled Payment)</option>
                    </select>
                  </div>

                  {/* 12-Digit UTR */}
                  <div>
                    <label style={portalTheme.forms.label}>
                      <span>12-Digit UTR / Transaction ID <span style={{ color: '#DC2626' }}>*</span></span>
                      {renderAiTag('utrNumber')}
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      value={utrNumber}
                      onChange={e => onUserEdit('utrNumber', setUtrNumber, e.target.value)}
                      placeholder="e.g. 418293847291"
                      style={{ ...getInputStyle('utrNumber'), fontFamily: 'monospace', fontWeight: 600 }}
                    />
                  </div>

                  {/* Beneficiary VPA */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={portalTheme.forms.label}>
                      <span>Beneficiary (Scammer) UPI / VPA or Bank Account</span>
                      {renderAiTag('beneficiaryAccount')}
                    </label>
                    <input
                      type="text"
                      value={beneficiaryAccount}
                      onChange={e => onUserEdit('beneficiaryAccount', setBeneficiaryAccount, e.target.value)}
                      placeholder="e.g. taskpay@okhdfcbank or 9876543210@paytm"
                      style={getInputStyle('beneficiaryAccount')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => onSubTabChange(1)}
                style={{
                  background: '#FFFFFF',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  padding: '9px 18px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={() => onSubTabChange(3)}
                style={{
                  background: '#0F766E',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '9px 24px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(15, 118, 110, 0.2)',
                }}
              >
                Save & Next: Evidence →
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            SUBTAB 2 (HACKING / OTHER CYBERCRIME)
           ════════════════════════════════════════════════════════════ */}
        {registerSubTab === 2 && isHacking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={portalTheme.containers.sectionCard}>
              <div style={portalTheme.containers.cardHeader}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                  Technical Attack & Ransomware Parameters
                </span>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>
                  CERT-In Incident Taxonomy
                </span>
              </div>

              <div style={portalTheme.containers.cardBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={portalTheme.forms.label}>Affected Device / Infrastructure</label>
                    <select
                      value={affectedDevice}
                      onChange={e => setAffectedDevice(e.target.value)}
                      style={portalTheme.forms.select}
                    >
                      <option value="Windows Workstation">Windows Workstation</option>
                      <option value="Linux Production Server">Linux Production Server</option>
                      <option value="Cloud Instance (AWS/Azure)">Cloud Instance (AWS/Azure)</option>
                      <option value="Android / iOS Mobile Device">Android / iOS Mobile Device</option>
                    </select>
                  </div>

                  <div>
                    <label style={portalTheme.forms.label}>Ransom Extension & Wallet Address</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        value={ransomExtension}
                        onChange={e => setRansomExtension(e.target.value)}
                        placeholder=".locked"
                        style={{ ...portalTheme.forms.input, width: 110 }}
                      />
                      <input
                        type="text"
                        value={ransomAddress}
                        onChange={e => setRansomAddress(e.target.value)}
                        placeholder="Bitcoin / Crypto Address"
                        style={{ ...portalTheme.forms.input, flex: 1, fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => onSubTabChange(1)}
                style={{ background: '#FFFFFF', color: '#334155', border: '1px solid #CBD5E1', padding: '9px 18px', borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() => onSubTabChange(3)}
                style={{ background: '#0F766E', color: '#FFFFFF', border: 'none', padding: '9px 24px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                Save & Next: Evidence →
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            SUBTAB 2 (SOCIAL MEDIA & EXTORTION)
           ════════════════════════════════════════════════════════════ */}
        {registerSubTab === 2 && isSocial && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={portalTheme.containers.sectionCard}>
              <div style={portalTheme.containers.cardHeader}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                  Platform & Impersonation Details
                </span>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>
                  Social Media Intermediary Notice
                </span>
              </div>

              <div style={portalTheme.containers.cardBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={portalTheme.forms.label}>Social Platform</label>
                    <select
                      value={socialPlatform}
                      onChange={e => setSocialPlatform(e.target.value)}
                      style={portalTheme.forms.select}
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Telegram">Telegram</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="X / Twitter">X / Twitter</option>
                    </select>
                  </div>

                  <div>
                    <label style={portalTheme.forms.label}>Offender Handle / Profile URL</label>
                    <input
                      type="text"
                      value={offenderHandle}
                      onChange={e => setOffenderHandle(e.target.value)}
                      placeholder="@offender_handle"
                      style={portalTheme.forms.input}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={portalTheme.forms.label}>Nature of Harassment / Defamation</label>
                    <input
                      type="text"
                      value={harassmentNature}
                      onChange={e => setHarassmentNature(e.target.value)}
                      placeholder="e.g. Threatening to circulate morphed photographs"
                      style={portalTheme.forms.input}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => onSubTabChange(1)}
                style={{ background: '#FFFFFF', color: '#334155', border: '1px solid #CBD5E1', padding: '9px 18px', borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() => onSubTabChange(3)}
                style={{ background: '#0F766E', color: '#FFFFFF', border: 'none', padding: '9px 24px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                Save & Next: Evidence →
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            SUBTAB 3: EVIDENCE REPOSITORY (Section 12 Document Table)
           ════════════════════════════════════════════════════════════ */}
        {registerSubTab === 3 && (
          <EvidenceTableView
            evidenceList={evidenceList}
            onUpload={onEvidenceUpload}
            onRemove={onEvidenceRemove}
            onNext={() => onSubTabChange(4)}
            onPrev={() => onSubTabChange(2)}
          />
        )}

        {/* ════════════════════════════════════════════════════════════
            SUBTAB 4: REVIEW & SUBMIT (Collapsible Official Record)
           ════════════════════════════════════════════════════════════ */}
        {registerSubTab === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header Box */}
            <div style={portalTheme.containers.sectionCard}>
              <div style={portalTheme.containers.cardHeader}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                  Official Complaint Summary • Ready for Statutory Submission
                </span>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>
                  National Cyber Crime Reporting Portal (NCRP) Standard
                </span>
              </div>

              <div style={portalTheme.containers.cardBody}>
                <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Please inspect the populated records below. Once confirmed, this document generates a formal legal complaint with statutory undertakings submitted to state law enforcement.
                </p>
              </div>
            </div>

            {/* Section 1: Incident Particulars */}
            <div style={portalTheme.containers.sectionCard}>
              <div
                onClick={() => onToggleReviewSection('incident')}
                style={{ ...portalTheme.containers.cardHeader, cursor: 'pointer' }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                  1. Incident Details
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onSubTabChange(0); }}
                    style={{ background: 'none', border: 'none', color: '#0F766E', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    [Edit]
                  </button>
                  {collapsedReviewSections.incident ? <Icons.ChevronRight /> : <Icons.ChevronDown />}
                </div>
              </div>

              {!collapsedReviewSections.incident && (
                <div style={{ padding: '16px 20px', fontSize: 12.5, color: '#334155', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><strong>Category:</strong> {category} ({subCategory})</div>
                  <div><strong>Occurred Via:</strong> {whereOccurred}</div>
                  <div><strong>Incident Date:</strong> {incidentDate}</div>
                  <div><strong>Jurisdiction:</strong> {district}, {stateUt}</div>
                  <div style={{ gridColumn: 'span 2', marginTop: 4, background: '#F8FAFC', border: '1px solid #E2E8F0', padding: 12, borderRadius: 6 }}>
                    <strong style={{ display: 'block', marginBottom: 4, color: '#0F172A' }}>Citizen Statement:</strong>
                    <span style={{ lineHeight: 1.5, color: '#475569' }}>
                      {incidentDescription || 'Statement captured conversationally.'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Suspect Details */}
            <div style={portalTheme.containers.sectionCard}>
              <div
                onClick={() => onToggleReviewSection('suspect')}
                style={{ ...portalTheme.containers.cardHeader, cursor: 'pointer' }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                  2. Suspect Information ({suspectIdentifiers.length} identifiers)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onSubTabChange(1); }}
                    style={{ background: 'none', border: 'none', color: '#0F766E', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    [Edit]
                  </button>
                  {collapsedReviewSections.suspect ? <Icons.ChevronRight /> : <Icons.ChevronDown />}
                </div>
              </div>

              {!collapsedReviewSections.suspect && (
                <div style={{ padding: '16px 20px', fontSize: 12.5, color: '#334155' }}>
                  <div><strong>Reported Name:</strong> {suspectName || 'Unknown Caller'}</div>
                  <div style={{ marginTop: 8 }}>
                    <strong>Identifiers:</strong>
                    <ul style={{ margin: '6px 0 0', paddingLeft: 18, lineHeight: 1.6 }}>
                      {suspectIdentifiers.map(i => (
                        <li key={i.id}>{i.type.toUpperCase()}: <code>{i.value}</code></li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Financial Particulars */}
            {isFinancial && (
              <div style={portalTheme.containers.sectionCard}>
                <div
                  onClick={() => onToggleReviewSection('financial')}
                  style={{ ...portalTheme.containers.cardHeader, cursor: 'pointer' }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                    3. Financial Transactions & 1930 Holds
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); onSubTabChange(2); }}
                      style={{ background: 'none', border: 'none', color: '#0F766E', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      [Edit]
                    </button>
                    {collapsedReviewSections.financial ? <Icons.ChevronRight /> : <Icons.ChevronDown />}
                  </div>
                </div>

                {!collapsedReviewSections.financial && (
                  <div style={{ padding: '16px 20px', fontSize: 12.5, color: '#334155', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><strong>Amount Disputed:</strong> ₹{Number(fraudAmount || 0).toLocaleString('en-IN')}</div>
                    <div><strong>Complainant Bank:</strong> {bankName}</div>
                    <div><strong>12-Digit UTR:</strong> <code>{utrNumber || 'Pending'}</code></div>
                    <div><strong>Scammer Account / VPA:</strong> {beneficiaryAccount || 'Pending'}</div>
                  </div>
                )}
              </div>
            )}

            {/* Section 4: Evidence Files */}
            <div style={portalTheme.containers.sectionCard}>
              <div
                onClick={() => onToggleReviewSection('evidence')}
                style={{ ...portalTheme.containers.cardHeader, cursor: 'pointer' }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                  4. Attached Case Evidence ({evidenceList.length} files)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onSubTabChange(3); }}
                    style={{ background: 'none', border: 'none', color: '#0F766E', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    [Review]
                  </button>
                  {collapsedReviewSections.evidence ? <Icons.ChevronRight /> : <Icons.ChevronDown />}
                </div>
              </div>

              {!collapsedReviewSections.evidence && (
                <div style={{ padding: '16px 20px', fontSize: 12.5, color: '#334155' }}>
                  {evidenceList.length === 0 ? (
                    <div style={{ color: '#94A3B8' }}>No evidence attached.</div>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                      {evidenceList.map(e => (
                        <li key={e.id}>
                          <strong>{e.fileName}</strong> ({e.fileSize}) — OCR Verified
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Mandatory Statutory Undertaking (Section 10 Restrained Info Style) */}
            <div
              style={{
                padding: '16px 20px',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: 8,
              }}
            >
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: '#92400E', cursor: 'pointer', lineHeight: 1.5 }}>
                <input
                  type="checkbox"
                  checked={declarationAccepted}
                  onChange={e => setDeclarationAccepted(e.target.checked)}
                  style={{ marginTop: 3, cursor: 'pointer' }}
                />
                <span>
                  <strong>Mandatory Statutory Undertaking:</strong> I hereby solemnly declare and verify that the facts stated in this cybercrime complaint are true and accurate to the best of my knowledge and belief under provisions of the Bharatiya Nyaya Sanhita (BNS) & Sections 43, 66C and 66D of the Information Technology Act, 2000.
                </span>
              </label>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <button
                type="button"
                onClick={onSaveDraft}
                style={{
                  background: '#FFFFFF',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  padding: '10px 20px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save as Draft
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={onSubmit}
                style={{
                  background: isSubmitting ? '#64748B' : '#0F766E',
                  color: '#FFFFFF',
                  padding: '10px 28px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 1px 3px rgba(15, 118, 110, 0.3)',
                }}
              >
                {isSubmitting ? 'Submitting to Cyber Cell...' : 'Confirm & Submit Complaint'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
