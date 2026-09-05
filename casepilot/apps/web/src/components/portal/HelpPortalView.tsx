'use client';

import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';

type HelpTab = 'immediate' | 'numbers' | 'safety' | 'workflow' | 'faq';
type TriageScenario = 'financial' | 'blackmail' | 'account';

interface Props {
  onNavigateToRegister?: () => void;
  onNavigateToTrack?: () => void;
}

interface FaqItem {
  id: string;
  category: 'financial' | 'evidence' | 'privacy' | 'police' | 'general';
  categoryLabel: string;
  q: string;
  a: string;
  statutoryRef?: string;
  keyPoints?: string[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    categoryLabel: 'Intake Protocol',
    q: 'How does CasePilot prepare a legally admissible cybercrime petition?',
    a: 'CasePilot structures your incident narrative to comply strictly with the National Cyber Crime Reporting Portal (NCRP) statutory standard. It extracts critical identifiers (12-digit UTR, IP timestamps, destination accounts), cryptographically hashes all uploaded media using SHA-256 for Section 65B compliance, and automatically routes the petition to the jurisdictional Cyber Police Station.',
    statutoryRef: 'Section 65B Indian Evidence Act / Section 63 Bharatiya Sakshya Adhiniyam 2023',
    keyPoints: [
      'Standardized against Ministry of Home Affairs (MHA) NCRP formats.',
      'Cryptographic SHA-256 hash stamp for digital evidence admissibility in court.',
      'Identifies the exact jurisdictional Cyber Crime Police Station in your district.',
    ],
  },
  {
    id: 'faq-2',
    category: 'financial',
    categoryLabel: 'Financial Fraud',
    q: 'What is the "Golden Hour" in cyber financial fraud, and how does it work?',
    a: 'The Golden Hour is the critical 2 to 4-hour window following an unauthorized transaction. Reporting immediately via the 1930 helpline triggers the CFCFRMS (Citizen Financial Cyber Fraud Reporting & Management System), sending automated electronic holds to destination banks and payment gateways before fraudsters can disperse or withdraw the funds.',
    statutoryRef: 'Section 102 CrPC / Section 106 Bharatiya Nagarik Suraksha Sanhita 2023',
    keyPoints: [
      'Dial 1930 immediately with your 12-digit UTR and victim account number.',
      'Beneficiary banks place an emergency administrative lien on suspect accounts.',
      'Acting within the Golden Hour yields up to 94% fund recovery potential.',
    ],
  },
  {
    id: 'faq-3',
    category: 'privacy',
    categoryLabel: 'Privacy & Safety',
    q: 'Can I report sensitive cyber harassment or sextortion anonymously?',
    a: 'Yes. Under Ministry of Home Affairs (MHA) cybercrime guidelines, complaints involving women, minors, non-consensual deepfake media, or cyber extortion can be lodged via the confidential reporting pathway without disclosing personal identifying particulars to the suspect or public.',
    statutoryRef: 'Section 67 & 67A IT Act 2000; MHA Confidential Reporting Directive',
    keyPoints: [
      'Zero public identity disclosure for sensitive offences against women and minors.',
      'Digital evidence (chat URLs, IP metadata, handles) preserved without exposing complainant name.',
      'Directly assigned to specialized State Women & Child Cyber Crime Units.',
    ],
  },
  {
    id: 'faq-4',
    category: 'evidence',
    categoryLabel: 'Evidence Standard',
    q: 'What exact technical evidence is required before filing a complaint?',
    a: 'For financial fraud: certified bank statement with debit timestamp, 12-digit Unique Transaction Reference (UTR), beneficiary UPI VPA/account number. For social harassment or extortion: unedited screenshots showing profile URL, account username/handle, timestamped message threads, and suspect phone numbers before blocking.',
    statutoryRef: 'Rule 3(1)(d) Information Technology Intermediary Guidelines Rules',
    keyPoints: [
      'Financial Fraud: Bank statement, 12-digit UTR, transaction timestamp, payment gateway receipt.',
      'Extortion & Impersonation: Profile URL, unedited chat logs, contact number, header metadata.',
      'Malware & Hacking: SMS alert logs, downloaded .apk file name, ransomware note text.',
    ],
  },
  {
    id: 'faq-5',
    category: 'police',
    categoryLabel: 'Police Procedure',
    q: 'How does an online complaint convert into a registered First Information Report (FIR)?',
    a: 'The NCRP acknowledgment receipt routes to the Cyber Crime Unit of your local district police station. The assigned Investigating Officer (IO) conducts preliminary verification. When a cognizable offence is established under the Information Technology Act or Bharatiya Nyaya Sanhita (BNS), the station issues a formal FIR number.',
    statutoryRef: 'Section 154 CrPC / Section 173 Bharatiya Nagarik Suraksha Sanhita 2023',
    keyPoints: [
      'Online NCRP acknowledgment acts as the primary formal petition for police verification.',
      'Investigating Officers issue statutory Section 91 notices to banks and telecom operators.',
      'Complainants can take the stamped acknowledgment to their bank branch for internal claim processing.',
    ],
  },
  {
    id: 'faq-6',
    category: 'financial',
    categoryLabel: 'Fund Restitution',
    q: 'The beneficiary bank has frozen the money. What is the legal procedure to get it refunded?',
    a: 'Once funds are placed on lien, banks require a judicial order to release the money back to your account. The Investigating Officer submits a property seizure report before the jurisdictional Judicial Magistrate. The victim then submits an application under Section 457 CrPC for an expedited restitution directive.',
    statutoryRef: 'Section 457 CrPC / Section 503 Bharatiya Nagarik Suraksha Sanhita 2023',
    keyPoints: [
      'Administrative lien markers hold the balance in the destination account.',
      'Investigating Officer submits formal seizure verification to the Magistrate Court.',
      'Judicial Magistrate directs the destination bank to credit the frozen amount to victim account.',
    ],
  },
];

export function HelpPortalView({ onNavigateToRegister, onNavigateToTrack }: Props) {
  const [activeTab, setActiveTab] = useState<HelpTab>('immediate');
  const [triageScenario, setTriageScenario] = useState<TriageScenario>('financial');
  const [selectedWorkflowPhase, setSelectedWorkflowPhase] = useState<number>(1);
  const [expandedHelplineId, setExpandedHelplineId] = useState<string | null>('1930');
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // 1930 Pre-call interactive checklist
  const [checklist, setChecklist] = useState({
    utr: true,
    account: false,
    timestamp: true,
    suspect: false,
  });

  const checklistCompletedCount = Object.values(checklist).filter(Boolean).length;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      if (faqCategory !== 'all' && item.category !== faqCategory) return false;
      if (!faqSearch.trim()) return true;
      const q = faqSearch.toLowerCase();
      return (
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        (item.statutoryRef && item.statutoryRef.toLowerCase().includes(q))
      );
    });
  }, [faqCategory, faqSearch]);

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
      {/* ── Top Executive Hero & Mission Bar ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #0F2E2E 60%, #115E59 100%)',
          color: '#FFFFFF',
          padding: '24px 36px 20px',
          borderBottom: '1px solid #1E293B',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative background ring */}
        <div
          style={{
            position: 'absolute',
            right: -60,
            top: -60,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: 'rgba(20, 184, 166, 0.2)',
                    border: '1px solid rgba(45, 212, 191, 0.4)',
                    color: '#5EEAD4',
                    padding: '3px 10px',
                    borderRadius: 20,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#2DD4BF',
                      boxShadow: '0 0 8px #2DD4BF',
                    }}
                  />
                  Central Citizen Advisory & Incident Command
                </span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>
                  Statutory Guidelines under IT Act & BNSS 2023
                </span>
              </div>

              <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                Cyber Incident Intelligence & Response Hub
              </h1>
              <p style={{ fontSize: 13, color: '#CBD5E1', margin: 0, maxWidth: 680, lineHeight: 1.5 }}>
                Immediate emergency containment protocols, verified 24x7 government helplines, threat deconstructions, and step-by-step police investigation procedures.
              </p>
            </div>

            {/* Quick Emergency Hotlines Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 10,
                padding: '10px 16px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#F87171', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Emergency Financial Freeze
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'monospace', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  1930
                </div>
              </div>
              <a
                href="tel:1930"
                style={{
                  padding: '8px 14px',
                  background: '#DC2626',
                  color: '#FFFFFF',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
                }}
              >
                Dial Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Segmented Navigation Tabs ── */}
      <div
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '10px 36px',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              background: '#F1F5F9',
              padding: 3,
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'immediate', label: 'Emergency Steps', badge: 'Critical' },
              { id: 'numbers', label: 'Official Helplines', badge: '24x7' },
              { id: 'safety', label: 'Threat Playbooks', badge: 'Analysis' },
              { id: 'workflow', label: 'Legal & Police Workflow', badge: 'Statutory' },
              { id: 'faq', label: 'Frequently Asked Questions', badge: 'Legal' },
            ].map(t => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as HelpTab)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 6,
                    border: 'none',
                    background: isActive ? '#0F766E' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#475569',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 140ms ease',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 1px 3px rgba(15, 118, 110, 0.3)' : 'none',
                  }}
                >
                  <span>{t.label}</span>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: 4,
                      background: isActive ? 'rgba(255, 255, 255, 0.22)' : '#E2E8F0',
                      color: isActive ? '#FFFFFF' : '#64748B',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {onNavigateToRegister && (
              <button
                type="button"
                onClick={onNavigateToRegister}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#0F766E',
                  background: '#F0FDFA',
                  border: '1px solid #CCFBF1',
                  padding: '5px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                File New Complaint →
              </button>
            )}
            {onNavigateToTrack && (
              <button
                type="button"
                onClick={onNavigateToTrack}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#475569',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  padding: '5px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                Track Status
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto', padding: '24px 36px 64px' }}>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: EMERGENCY INCIDENT RESPONSE PLAYBOOKS
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'immediate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Interactive Triage Selector Pills */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                padding: '16px 20px',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                Select Your Active Crisis Scenario for Instant Triage:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                {[
                  {
                    id: 'financial',
                    title: 'Financial Loss (< 24 Hours)',
                    subtitle: 'Unauthorized UPI, Netbanking, or Debit Card deduction',
                    badge: 'Golden Hour Protocol',
                    color: '#DC2626',
                    bg: '#FEF2F2',
                    border: '#FECACA',
                  },
                  {
                    id: 'blackmail',
                    title: 'Online Blackmail / Sextortion',
                    subtitle: 'Threat calls, morphed photos, or video recording coercion',
                    badge: 'Confidential Shield',
                    color: '#7C3AED',
                    bg: '#F5F3FF',
                    border: '#DDD6FE',
                  },
                  {
                    id: 'account',
                    title: 'Account Hijacked / Infostealer',
                    subtitle: 'WhatsApp takeover, locked email, or malicious APK installed',
                    badge: 'Access Containment',
                    color: '#0284C7',
                    bg: '#F0F9FF',
                    border: '#BAE6FD',
                  },
                ].map(scenario => {
                  const isSelected = triageScenario === scenario.id;
                  return (
                    <div
                      key={scenario.id}
                      onClick={() => setTriageScenario(scenario.id as TriageScenario)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 10,
                        border: isSelected ? `2px solid ${scenario.color}` : '1px solid #E2E8F0',
                        background: isSelected ? scenario.bg : '#FAFAFA',
                        cursor: 'pointer',
                        transition: 'all 140ms ease',
                        boxShadow: isSelected ? `0 4px 12px ${scenario.color}15` : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: scenario.color,
                            background: '#FFFFFF',
                            border: `1px solid ${scenario.border}`,
                            padding: '1px 6px',
                            borderRadius: 4,
                            textTransform: 'uppercase',
                          }}
                        >
                          {scenario.badge}
                        </span>
                        {isSelected && (
                          <span style={{ fontSize: 11, fontWeight: 800, color: scenario.color }}>
                            Active Guide ●
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 2 }}>
                        {scenario.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.4 }}>
                        {scenario.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── SCENARIO A: FINANCIAL FRAUD (GOLDEN HOUR) ── */}
            {triageScenario === 'financial' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Visual Golden Hour Funnel Meter */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #FECACA',
                    borderRadius: 12,
                    padding: '20px 24px',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            background: '#DC2626',
                            color: '#FFFFFF',
                            padding: '2px 7px',
                            borderRadius: 4,
                            letterSpacing: '0.04em',
                          }}
                        >
                          CFCFRMS PROTOCOL
                        </span>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#991B1B', margin: 0 }}>
                          The 4-Hour Inter-Bank Restitution Funnel
                        </h3>
                      </div>
                      <p style={{ fontSize: 12.5, color: '#64748B', margin: '3px 0 0' }}>
                        Every minute counts. Beneficiary banks process inter-bank holds in descending recovery tiers.
                      </p>
                    </div>

                    <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626', fontFamily: 'monospace' }}>
                      Target: Freeze before ATM/P2P withdrawal
                    </span>
                  </div>

                  {/* 3-Tier Visual Progress Timeline */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 14 }}>
                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#DC2626' }}>STAGE 1: 0 - 2 HOURS</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#15803D', background: '#DCFCE7', padding: '1px 6px', borderRadius: 3 }}>
                          94% Recovery Rate
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 3 }}>
                        Instant CFCFRMS Lien Mark
                      </div>
                      <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.45, margin: 0 }}>
                        Funds remain held in 1st layer beneficiary account or merchant gateway escrow.
                      </p>
                    </div>

                    <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#B45309' }}>STAGE 2: 2 - 6 HOURS</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '1px 6px', borderRadius: 3 }}>
                          62% Recovery Rate
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 3 }}>
                        Mule Layering Dispersion
                      </div>
                      <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.45, margin: 0 }}>
                        Scammers divide funds into multiple sub-accounts. Multilevel chain freezing required.
                      </p>
                    </div>

                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#64748B' }}>STAGE 3: 6+ HOURS</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '1px 6px', borderRadius: 3 }}>
                          Hard Seizure (30%)
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 3 }}>
                        ATM Withdrawal & Crypto
                      </div>
                      <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.45, margin: 0 }}>
                        Requires magistrate court warrant under Section 457 CrPC to seize destination balance.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Step Action Cards with Interactive Pre-Call Checklist */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                  {/* Step 1 Card: 1930 Helpline */}
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #0F766E',
                      borderRadius: 12,
                      padding: '20px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 14,
                      boxShadow: '0 2px 6px rgba(15, 118, 110, 0.06)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#0F766E', background: '#F0FDFA', border: '1px solid #CCFBF1', padding: '2px 8px', borderRadius: 4 }}>
                          STEP 1 • IMMEDIATE CALL
                        </span>
                        <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 800 }}>
                          ● Toll-Free 24x7
                        </span>
                      </div>

                      <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '0 0 4px' }}>
                        Dial 1930 (National Helpline)
                      </div>
                      <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: '0 0 12px' }}>
                        Connects directly to the Citizen Financial Cyber Fraud Reporting System. Operator logs an administrative freeze across RBI-registered destination banks.
                      </p>

                      {/* Interactive Pre-Call Readiness Checklist */}
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                            Pre-Call Checklist ({checklistCompletedCount}/4 Ready)
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#334155' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={checklist.utr}
                              onChange={e => setChecklist({ ...checklist, utr: e.target.checked })}
                              style={{ accentColor: '#0F766E', width: 14, height: 14 }}
                            />
                            <span><strong>12-digit UTR</strong> (Found in bank debit SMS)</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={checklist.account}
                              onChange={e => setChecklist({ ...checklist, account: e.target.checked })}
                              style={{ accentColor: '#0F766E', width: 14, height: 14 }}
                            />
                            <span><strong>Victim Account Number</strong> & home branch</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={checklist.timestamp}
                              onChange={e => setChecklist({ ...checklist, timestamp: e.target.checked })}
                              style={{ accentColor: '#0F766E', width: 14, height: 14 }}
                            />
                            <span><strong>Debit SMS Timestamp</strong> (Exact minute)</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={checklist.suspect}
                              onChange={e => setChecklist({ ...checklist, suspect: e.target.checked })}
                              style={{ accentColor: '#0F766E', width: 14, height: 14 }}
                            />
                            <span><strong>Suspect Handle / Mobile</strong> (e.g. UPI VPA)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <a
                      href="tel:1930"
                      style={{
                        padding: '10px 16px',
                        background: '#0F766E',
                        color: '#FFFFFF',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <span>Dial 1930 (Toll-Free)</span>
                      <span>→</span>
                    </a>
                  </div>

                  {/* Step 2 Card: Instant Bank Kill Switch */}
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 12,
                      padding: '20px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 14,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', padding: '2px 8px', borderRadius: 4 }}>
                          STEP 2 • ACCOUNT LOCK
                        </span>
                        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                          Stop Secondary Debits
                        </span>
                      </div>

                      <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '0 0 4px' }}>
                        Trigger Bank Kill Switch
                      </div>
                      <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: '0 0 12px' }}>
                        Temporarily block UPI channels, debit cards, and netbanking credentials immediately.
                      </p>

                      {/* Quick Bank Emergency SMS Matrix */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {[
                          { bank: 'SBI', code: 'SMS "BLOCK <last4>" to 567676', phone: '1800 1234' },
                          { bank: 'HDFC', code: 'Call 1800 1600 / 1800 2600 to lock NetBanking', phone: '1800 1600' },
                          { bank: 'ICICI', code: 'SMS "BLOCK <acc>" to 9215676766', phone: '1800 1080' },
                          { bank: 'Axis', code: 'SMS "BLOCKCARD" to 5676782', phone: '1860 419 5555' },
                        ].map((b, i) => (
                          <div
                            key={i}
                            style={{
                              background: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              borderRadius: 6,
                              padding: '8px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: 12,
                            }}
                          >
                            <span style={{ fontWeight: 800, color: '#0F172A', minWidth: 44 }}>{b.bank}</span>
                            <span style={{ color: '#475569', fontSize: 11 }}>{b.code}</span>
                            <a href={`tel:${b.phone.replace(/[^0-9]/g, '')}`} style={{ color: '#0F766E', fontWeight: 700, textDecoration: 'none', fontSize: 11 }}>
                              Call
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ fontSize: 11.5, color: '#64748B', fontStyle: 'italic' }}>
                      Prompt bank branch to issue an acknowledgement token for internal liability claim under RBI circular RBI/2017-18/15.
                    </div>
                  </div>

                  {/* Step 3 Card: Evidence Preservation */}
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 12,
                      padding: '20px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 14,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#0369A1', background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '2px 8px', borderRadius: 4 }}>
                          STEP 3 • PROOF AUDIT
                        </span>
                        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                          Section 65B Standard
                        </span>
                      </div>

                      <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '0 0 4px' }}>
                        Obtain Certified Statement
                      </div>
                      <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: '0 0 12px' }}>
                        Download the official PDF account statement containing the complete 12-digit UTR number and beneficiary account details.
                      </p>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#334155' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Where to locate UTR:</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <div>• <strong>Google Pay:</strong> Tap transaction → UPI transaction ID (12 digits)</div>
                          <div>• <strong>PhonePe:</strong> View Details → UTR Number</div>
                          <div>• <strong>Paytm:</strong> Passbook → Order Details → UPI Ref No</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#065F46', fontWeight: 600 }}>
                      CasePilot automatically verifies and computes SHA-256 hashes for all statement uploads.
                    </div>
                  </div>

                  {/* Step 4 Card: Formal NCRP Petition */}
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 12,
                      padding: '20px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 14,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#4338CA', background: '#EEF2FF', border: '1px solid #C7D2FE', padding: '2px 8px', borderRadius: 4 }}>
                          STEP 4 • POLICE INTAKE
                        </span>
                        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                          Legal Allocation
                        </span>
                      </div>

                      <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '0 0 4px' }}>
                        Lodge NCRP Complaint
                      </div>
                      <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: '0 0 12px' }}>
                        File the structured complaint with CasePilot to receive your official NCRP Acknowledgment token and initiate local police investigation.
                      </p>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#475569' }}>
                        The resulting acknowledgment serves as your legal document for submitting formal Section 457 restitution applications before the Magistrate Court.
                      </div>
                    </div>

                    {onNavigateToRegister && (
                      <button
                        type="button"
                        onClick={onNavigateToRegister}
                        style={{
                          padding: '10px 16px',
                          background: '#0F172A',
                          color: '#FFFFFF',
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <span>Start Structured Complaint</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── SCENARIO B: BLACKMAIL / SEXTORTION / THREATS ── */}
            {triageScenario === 'blackmail' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Visual Do's & Don'ts Matrix */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
                  }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE', padding: '2px 8px', borderRadius: 4 }}>
                      COERCION DEFENSE MATRIX
                    </span>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '6px 0 2px' }}>
                      Immediate Actions vs Critical Mistakes
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                      Extortion criminals exploit panic. Follow this strict procedural playbook to neutralize leverage.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                    {/* DO THIS Column */}
                    <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: 10, padding: '18px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534', fontWeight: 800, fontSize: 14, marginBottom: 12 }}>
                        <span style={{ background: '#16A34A', color: '#FFFFFF', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                          ✓
                        </span>
                        MANDATORY PROTECTIVE ACTIONS
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                          {
                            title: '1. Capture Unedited Screenshots First',
                            desc: 'Preserve complete screens showing the suspect account handle, profile URL, mobile number, and exact message timestamps before blocking.',
                          },
                          {
                            title: '2. Lock Down Social Media Privacy',
                            desc: 'Switch Instagram, Facebook, and LinkedIn profiles to private immediately. Hide follower lists and disable incoming message requests.',
                          },
                          {
                            title: '3. Lodge Anonymous Complaint',
                            desc: 'Under MHA directives, sexual harassment and extortion can be filed via the confidential reporting portal without public disclosure of your identity.',
                          },
                          {
                            title: '4. Issue Direct Platform Takedown',
                            desc: 'Report non-consensual media under Rule 3(1)(d) of the IT Rules. Social platforms are statutorily required to remove explicit content within 24 hours.',
                          },
                        ].map((item, i) => (
                          <div key={i} style={{ borderLeft: '3px solid #16A34A', paddingLeft: 10 }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#14532D', marginBottom: 2 }}>{item.title}</div>
                            <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.45 }}>{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* NEVER DO THIS Column */}
                    <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 10, padding: '18px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#991B1B', fontWeight: 800, fontSize: 14, marginBottom: 12 }}>
                        <span style={{ background: '#DC2626', color: '#FFFFFF', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                          ✕
                        </span>
                        FATAL MISTAKES TO AVOID
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                          {
                            title: '1. Never Transfer Any Money',
                            desc: 'Paying money never stops extortion; it proves vulnerability and triggers demands for 10x higher payments within hours.',
                          },
                          {
                            title: '2. Never Delete Chat Threads',
                            desc: 'Deleting chats destroys technical evidence (IP headers, phone numbers, timestamps) that police require to issue Section 91 notices.',
                          },
                          {
                            title: '3. Never Plead or Negotiate',
                            desc: 'Pleading demonstrates panic, encouraging the extortionist to escalate threats. Stop replying immediately while evidence is being preserved.',
                          },
                          {
                            title: '4. Never Install APKs to "Delete Video"',
                            desc: 'Extortionists often send a "video remover file" which is actually spyware designed to steal your entire phone contact list.',
                          },
                        ].map((item, i) => (
                          <div key={i} style={{ borderLeft: '3px solid #DC2626', paddingLeft: 10 }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#7F1D1D', marginBottom: 2 }}>{item.title}</div>
                            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.45 }}>{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── SCENARIO C: ACCOUNT HIJACKING / INFOSTEALER ── */}
            {triageScenario === 'account' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
                  }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0284C7', background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '2px 8px', borderRadius: 4 }}>
                      SESSION CONTAINMENT
                    </span>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '6px 0 2px' }}>
                      Hijacked Account Recovery Checklist
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                      Follow these 3 technical steps to revoke unauthorized web sessions and prevent contact fraud.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', marginBottom: 4 }}>
                        Action 1 • Session Revocation
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                        Invalidate Stolen Cookies
                      </div>
                      <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: '0 0 10px' }}>
                        Navigate to Google/Apple security settings and select "Sign out of all other devices" to instantly invalidate stolen session tokens.
                      </p>
                    </div>

                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', marginBottom: 4 }}>
                        Action 2 • Device Isolation
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                        Disconnect Malicious Device
                      </div>
                      <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: '0 0 10px' }}>
                        If an unfamiliar .apk file was downloaded, switch phone to Airplane Mode immediately to prevent it from broadcasting SMS OTPs.
                      </p>
                    </div>

                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', marginBottom: 4 }}>
                        Action 3 • Broadcast Warning
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                        Alert Family & Friends
                      </div>
                      <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: '0 0 10px' }}>
                        Scammers immediately message contacts requesting emergency ₹10,000-₹50,000 transfers. Warn close contacts via phone call.
                      </p>
                    </div>
                  </div>

                  {/* Copyable Emergency Broadcast Notice */}
                  <div style={{ marginTop: 20, background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: '#0F172A' }}>
                        Pre-written Warning Template for WhatsApp / Social Media Status:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy('URGENT: My WhatsApp/Social Media account has been compromised. If you receive any message asking for money or emergency UPI transfers from my number, DO NOT SEND MONEY. It is a scammer.', 'broadcast')}
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 4,
                          border: '1px solid #0F766E',
                          background: '#FFFFFF',
                          color: '#0F766E',
                          cursor: 'pointer',
                        }}
                      >
                        {copiedText === 'broadcast' ? '✓ Copied!' : 'Copy Warning Text'}
                      </button>
                    </div>
                    <div style={{ fontSize: 12, color: '#334155', fontStyle: 'italic', fontFamily: 'monospace' }}>
                      "URGENT: My WhatsApp/Social Media account has been compromised. If you receive any message asking for money or emergency UPI transfers from my number, DO NOT SEND MONEY. It is a scammer."
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: VERIFIED OFFICIAL HELPLINES DIRECTORY
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'numbers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                  Verified Government & Police Helplines
                </h2>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                  Direct toll-free lines for immediate fund freezing, crisis dispatch, and statutory consumer redressal.
                </p>
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: '#0F766E', background: '#F0FDFA', border: '1px solid #CCFBF1', padding: '4px 10px', borderRadius: 6 }}>
                Verified Official Directory • Updated 2026
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {[
                {
                  number: '1930',
                  agency: 'National Cyber Fraud Helpline',
                  authority: 'Ministry of Home Affairs & I4C',
                  timing: '24x7 TOLL-FREE',
                  timingColor: '#DC2626',
                  timingBg: '#FEF2F2',
                  purpose: 'Initiates immediate inter-bank administrative lien marker across RBI gateways for unauthorized UPI, card, and netbanking transactions.',
                  checklist: '12-digit UTR, victim account number, debit SMS timestamp, suspect handle.',
                  samplePrompt: 'State clearly: "I need to report an unauthorized debit. My 12-digit UTR is [UTR] debited from [Bank Name] at [Time]. Please place an electronic hold on the beneficiary account."',
                },
                {
                  number: '112',
                  agency: 'Emergency Response Support System (ERSS)',
                  authority: 'Ministry of Home Affairs',
                  timing: '24x7 TOLL-FREE',
                  timingColor: '#0369A1',
                  timingBg: '#F0F9FF',
                  purpose: 'All-India unified emergency dispatch for cyber extortion involving immediate physical threats, unlawful digital detention, or threats to life.',
                  checklist: 'Current residential address, immediate physical threat details, suspect caller number.',
                  samplePrompt: 'State clearly: "I am facing extortion calls from perpetrators claiming to be police officers and threatening physical arrival at my residence."',
                },
                {
                  number: '1091',
                  agency: 'Women Cyber Safety & Stalking Desk',
                  authority: 'State Police Headquarters',
                  timing: '24x7 TOLL-FREE',
                  timingColor: '#7C3AED',
                  timingBg: '#F5F3FF',
                  purpose: 'Specialized crisis desk for women facing cyberstalking, non-consensual deepfake media, blackmail, or abusive online harassment.',
                  checklist: 'Social media profile URL, timestamped screenshots, suspect phone numbers.',
                  samplePrompt: 'State clearly: "I am reporting persistent cyberstalking and non-consensual media distribution. I request confidential handling under MHA guidelines."',
                },
                {
                  number: '1098',
                  agency: 'National Childline (POCSO Protection)',
                  authority: 'Ministry of Women & Child Development',
                  timing: '24x7 TOLL-FREE',
                  timingColor: '#059669',
                  timingBg: '#ECFDF5',
                  purpose: 'Emergency intervention and rapid takedown coordination for online exploitation, grooming, and harmful content targeting minors.',
                  checklist: 'Platform URL, offending profile username, chat screenshots.',
                  samplePrompt: 'State clearly: "I am reporting an online platform soliciting or distributing harmful material involving a minor."',
                },
                {
                  number: '1915',
                  agency: 'National Consumer Helpline (NCH)',
                  authority: 'Department of Consumer Affairs',
                  timing: 'MON-SAT (8 AM - 8 PM)',
                  timingColor: '#475569',
                  timingBg: '#F8FAFC',
                  purpose: 'Statutory dispute redressal for fraudulent e-commerce portals, fake flight booking engines, and non-delivery of prepaid purchases.',
                  checklist: 'Merchant order number, payment gateway reference, email correspondence.',
                  samplePrompt: 'State clearly: "I paid for goods on a merchant portal which failed to deliver and is unresponsive to cancellation requests."',
                },
                {
                  number: '1800-11-4949',
                  agency: 'CERT-In National Incident Response Desk',
                  authority: 'Ministry of Electronics & IT (MeitY)',
                  timing: '24x7 INCIDENT DESK',
                  timingColor: '#B45309',
                  timingBg: '#FFFBEB',
                  purpose: 'National incident coordination for server breaches, enterprise ransomware outbreaks, critical infrastructure compromises, and Zero-Day disclosures.',
                  checklist: 'Affected IP range, firewall logs, ransomware sample, 6-hour reporting mandate.',
                  samplePrompt: 'State clearly: "I am submitting a mandatory cyber security incident disclosure under CERT-In 6-hour reporting directions."',
                },
              ].map((item, i) => {
                const isExpanded = expandedHelplineId === item.number;
                return (
                  <div
                    key={i}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 12,
                      padding: '20px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 14,
                      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: item.timingColor,
                            background: item.timingBg,
                            padding: '2px 7px',
                            borderRadius: 4,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {item.timing}
                        </span>
                        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                          {item.authority}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 900, color: '#0F766E' }}>
                          {item.number}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                          {item.agency}
                        </span>
                      </div>

                      <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: '0 0 10px' }}>
                        {item.purpose}
                      </p>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '8px 10px', fontSize: 11.5, color: '#334155', marginBottom: 10 }}>
                        <strong>Keep Ready:</strong> {item.checklist}
                      </div>

                      {/* Expandable "What to say to operator" */}
                      <button
                        type="button"
                        onClick={() => setExpandedHelplineId(isExpanded ? null : item.number)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: '#0F766E',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <span>{isExpanded ? 'Hide Pre-Call Briefing ▲' : 'View Sample Call Script ▼'}</span>
                      </button>

                      {isExpanded && (
                        <div style={{ marginTop: 8, background: '#F0FDFA', border: '1px solid #CCFBF1', borderRadius: 6, padding: '10px 12px', fontSize: 12, color: '#134E4A', lineHeight: 1.45 }}>
                          <div style={{ fontWeight: 800, marginBottom: 2, fontSize: 11, textTransform: 'uppercase' }}>Recommended Statement:</div>
                          "{item.samplePrompt}"
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <a
                        href={`tel:${item.number.replace(/[^0-9]/g, '')}`}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: '#0F766E',
                          color: '#FFFFFF',
                          borderRadius: 6,
                          fontSize: 12.5,
                          fontWeight: 800,
                          textDecoration: 'none',
                          textAlign: 'center',
                        }}
                      >
                        Dial {item.number}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.number, `helpline-${item.number}`)}
                        style={{
                          padding: '8px 12px',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        {copiedText === `helpline-${item.number}` ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: THREAT DECONSTRUCTION PLAYBOOKS
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'safety' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                Major Threat Playbooks & Citizen Shield
              </h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                Visual anatomy of prominent fraud operations targeting Indian citizens, their psychological triggers, and exact legal countermeasures.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: 16 }}>
              {[
                {
                  title: 'Digital Arrest & Law Enforcement Spoofing',
                  badge: 'CRIMINAL IMPERSONATION',
                  badgeColor: '#B91C1C',
                  badgeBg: '#FEF2F2',
                  hook: 'FEAR & COERCION',
                  simulatedMsg: 'CBI / Mumbai Police: "Your Aadhaar was used to ship a FedEx parcel containing 16 passports and narcotics. Connect to Skype video immediately or non-bailable arrest warrant will issue."',
                  mechanism: 'Offenders impersonate IPS officers in fake police stations, holding victims under 24-72 hours of "digital detention" until funds are transferred to an "RBI verification escrow".',
                  truth: 'Indian Police, CBI, ED, and courts NEVER conduct legal proceedings or issue bails via video calls. No agency requests funds for verification.',
                  action: 'Disconnect video call immediately. Dial 1930 and 112.',
                  section: 'Section 66D IT Act; Section 318 & 204 Bharatiya Nyaya Sanhita 2023',
                },
                {
                  title: 'Electricity Bill & KYC Update (Malicious APK)',
                  badge: 'MALWARE / TROJAN',
                  badgeColor: '#C2410C',
                  badgeBg: '#FFF7ED',
                  hook: 'URGENCY TIMER',
                  simulatedMsg: 'SMS from VK-PWRED: "Dear Consumer, your power supply will be disconnected tonight at 9:30 PM due to unpaid bill. Update KYC via PowerUpdate.apk or call officer at 987XXXXXX."',
                  mechanism: 'The APK requests Android Accessibility Service and SMS permissions, silently reading banking OTPs and siphoning funds without showing alerts.',
                  truth: 'Electricity utility boards (BESCOM, TNEB, Tata Power) never distribute .apk files via SMS. Bills can only be cleared via official consumer portals.',
                  action: 'Never install .apk files. Switch phone to Airplane Mode if installed.',
                  section: 'Section 43 & 66 IT Act; Section 303 Bharatiya Nyaya Sanhita 2023',
                },
                {
                  title: 'Part-Time Task & Telegram Investment Scam',
                  badge: 'TASK FRAUD',
                  badgeColor: '#4338CA',
                  badgeBg: '#EEF2FF',
                  hook: 'GREED & COMMISSIONS',
                  simulatedMsg: 'WhatsApp: "Earn ₹3,000 to ₹8,000 daily rating Google hotels. Initial trial payout: ₹200 credited immediately. Join Telegram VIP Group for high-yield investment."',
                  mechanism: 'Victims receive small genuine payouts to build trust, then are persuaded to deposit ₹50,000+ into crypto or fake portals with promised 500% returns.',
                  truth: 'The balance shown on the website is fake CSS counters. Demands for "tax clearance" or "release fee" will escalate indefinitely.',
                  action: 'Stop deposits immediately. File UTR records on 1930.',
                  section: 'Section 66D IT Act; Banning of Unregulated Deposit Schemes Act 2019',
                },
                {
                  title: 'Social Media Cloning & Deepfake Blackmail',
                  badge: 'IDENTITY EXPLOITATION',
                  badgeColor: '#7C3AED',
                  badgeBg: '#F5F3FF',
                  hook: 'REPUTATIONAL ANXIETY',
                  simulatedMsg: 'Instagram DM: "We have morphed your public photos into explicit video. Pay ₹25,000 in 20 minutes or we send it to your entire follower list."',
                  mechanism: 'Scammers scrape public Instagram photos, use open-source AI deepfake generators to fabricate explicit media, and threaten viral distribution.',
                  truth: 'Paying money never stops extortion. Rule 3(1)(d) of the IT Rules mandates platforms remove non-consensual intimate media within 24 hours.',
                  action: 'Lock profile to private, report under confidential MHA portal.',
                  section: 'Section 66E, 67 & 67A IT Act; Rule 3(1)(d) IT Intermediary Rules',
                },
              ].map((playbook, i) => (
                <div
                  key={i}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    padding: '20px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 14,
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: playbook.badgeColor,
                          background: playbook.badgeBg,
                          padding: '2px 7px',
                          borderRadius: 4,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {playbook.badge}
                      </span>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B' }}>
                        Hook: {playbook.hook}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>
                      {playbook.title}
                    </h3>

                    {/* Simulated Scam Lure Mockup Box */}
                    <div
                      style={{
                        background: '#F1F5F9',
                        borderLeft: `3px solid ${playbook.badgeColor}`,
                        borderRadius: 4,
                        padding: '8px 12px',
                        fontSize: 11.5,
                        color: '#1E293B',
                        fontStyle: 'italic',
                        marginBottom: 10,
                      }}
                    >
                      {playbook.simulatedMsg}
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 2 }}>
                        Technical Attack Mechanism:
                      </div>
                      <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.5, margin: 0 }}>
                        {playbook.mechanism}
                      </p>
                    </div>

                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '10px 12px', marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', marginBottom: 2 }}>
                        Statutory Fact:
                      </div>
                      <p style={{ fontSize: 12, color: '#134E4A', lineHeight: 1.45, margin: 0 }}>
                        {playbook.truth}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 10, fontSize: 12, color: '#0F172A', fontWeight: 800 }}>
                      Immediate Shield: <span style={{ fontWeight: 500, color: '#475569' }}>{playbook.action}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                      Statutory Law: {playbook.section}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: STATUTORY LEGAL & POLICE WORKFLOW
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'workflow' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                Statutory Cyber Investigation & Restitution Pipeline
              </h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                Official procedural progression of a cyber complaint from citizen intake to magistrate court fund restitution. Click each phase to inspect statutory details.
              </p>
            </div>

            {/* Interactive Stage Pipeline Buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 8,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                padding: 8,
              }}
            >
              {[
                { step: 1, label: '01 Intake & Hashing', timing: 'Hour 0-2' },
                { step: 2, label: '02 CFCFRMS Freeze', timing: 'Hour 2-4' },
                { step: 3, label: '03 Station Allocation & FIR', timing: 'Day 1-3' },
                { step: 4, label: '04 Section 91 Notices', timing: 'Day 3-7' },
                { step: 5, label: '05 Court Restitution', timing: 'Day 14-30' },
              ].map(phase => {
                const isSel = selectedWorkflowPhase === phase.step;
                return (
                  <button
                    key={phase.step}
                    type="button"
                    onClick={() => setSelectedWorkflowPhase(phase.step)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: isSel ? '1.5px solid #0F766E' : '1px solid transparent',
                      background: isSel ? '#F0FDFA' : 'transparent',
                      color: isSel ? '#0F766E' : '#475569',
                      fontWeight: isSel ? 800 : 600,
                      fontSize: 12.5,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 120ms ease',
                    }}
                  >
                    <div style={{ fontSize: 10, textTransform: 'uppercase', color: isSel ? '#0F766E' : '#94A3B8', fontWeight: 700 }}>
                      {phase.timing}
                    </div>
                    <div>{phase.label}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Phase Deep Dive Dossier */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #0F766E',
                borderRadius: 12,
                padding: '24px 28px',
                boxShadow: '0 2px 8px rgba(15, 118, 110, 0.05)',
              }}
            >
              {selectedWorkflowPhase === 1 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 10.5, fontWeight: 800, color: '#0F766E', background: '#F0FDFA', border: '1px solid #CCFBF1', padding: '2px 8px', borderRadius: 4 }}>
                        PHASE 01 • CITIZEN INTAKE
                      </span>
                      <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '6px 0 2px' }}>
                        Incident Intake & Cryptographic Evidence Archival
                      </h3>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0369A1', background: '#F0F9FF', padding: '4px 10px', borderRadius: 6 }}>
                      Expected Turnaround: 0 - 2 Hours
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: '0 0 16px' }}>
                    The citizen lodges their complaint through CasePilot or the National Cybercrime Portal. Every digital evidence artifact (bank statements, chat transcripts, payment gateway receipts) is cryptographically stamped with SHA-256 hashes to guarantee chain of custody.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', marginBottom: 4 }}>
                        Statutory Governing Section:
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                        Section 65B Indian Evidence Act / Section 63 BSA 2023
                      </div>
                      <p style={{ fontSize: 11.5, color: '#64748B', margin: '4px 0 0' }}>
                        Mandatory certificate verifying electronic records were generated on an automated computer system without tampering.
                      </p>
                    </div>

                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', marginBottom: 4 }}>
                        Citizen Deliverable:
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                        Official NCRP Acknowledgment Number
                      </div>
                      <p style={{ fontSize: 11.5, color: '#64748B', margin: '4px 0 0' }}>
                        15-digit formal tracking token recognized by all commercial banks and state police cells.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedWorkflowPhase === 2 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 10.5, fontWeight: 800, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', padding: '2px 8px', borderRadius: 4 }}>
                        PHASE 02 • INTER-BANK INTERVENTION
                      </span>
                      <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '6px 0 2px' }}>
                        National Inter-Bank CFCFRMS Lien Placement (Golden Hour)
                      </h3>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', background: '#FEF2F2', padding: '4px 10px', borderRadius: 6 }}>
                      Critical Window: 0 - 4 Hours
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: '0 0 16px' }}>
                    If financial loss is reported via 1930, the complaint triggers an inter-bank dispatch across the National Cyber Fraud Reporting & Management System (CFCFRMS). Beneficiary banks identify the destination account and place an emergency lien hold.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', marginBottom: 4 }}>
                        Legal Authority:
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                        Section 102 CrPC / Section 106 BNSS 2023
                      </div>
                      <p style={{ fontSize: 11.5, color: '#64748B', margin: '4px 0 0' }}>
                        Police power to seize suspected stolen property and direct financial institutions to withhold debits.
                      </p>
                    </div>

                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#15803D', textTransform: 'uppercase', marginBottom: 4 }}>
                        Resulting Protection:
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                        Administrative Account Freeze
                      </div>
                      <p style={{ fontSize: 11.5, color: '#64748B', margin: '4px 0 0' }}>
                        Fraudsters are prevented from withdrawing cash via ATMs or dispersing money into crypto exchanges.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedWorkflowPhase === 3 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 10.5, fontWeight: 800, color: '#0369A1', background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '2px 8px', borderRadius: 4 }}>
                        PHASE 03 • POLICE VERIFICATION
                      </span>
                      <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '6px 0 2px' }}>
                        Jurisdictional Police Allocation & FIR Registration
                      </h3>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0369A1', background: '#F0F9FF', padding: '4px 10px', borderRadius: 6 }}>
                      Turnaround: 1 - 3 Business Days
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: '0 0 16px' }}>
                    The National Portal routes the case to the Cyber Crime Police Station in the victim district. An Investigating Officer (IO) is assigned to verify cognizable offences under the Information Technology Act or Bharatiya Nyaya Sanhita (BNS).
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', marginBottom: 4 }}>
                        Statutory Milestone:
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                        Section 154 CrPC / Section 173 BNSS 2023 (FIR)
                      </div>
                      <p style={{ fontSize: 11.5, color: '#64748B', margin: '4px 0 0' }}>
                        Formal First Information Report registered, initiating statutory police investigation powers.
                      </p>
                    </div>

                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', marginBottom: 4 }}>
                        Next Action for Complainant:
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                        Submit Signed Follow-up Dossier
                      </div>
                      <p style={{ fontSize: 11.5, color: '#64748B', margin: '4px 0 0' }}>
                        Visit station or email the IO with the CasePilot Follow-up Pack and physical stamped bank statements.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedWorkflowPhase === 4 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 10.5, fontWeight: 800, color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE', padding: '2px 8px', borderRadius: 4 }}>
                        PHASE 04 • STATUTORY NOTICES
                      </span>
                      <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '6px 0 2px' }}>
                        Section 91 Notices & Intermediary Takedowns
                      </h3>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', background: '#F5F3FF', padding: '4px 10px', borderRadius: 6 }}>
                      Turnaround: 3 - 7 Business Days
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: '0 0 16px' }}>
                    The IO issues statutory notices under Section 91 CrPC to banks, telecom operators (for Call Detail Records and IMEI tracking), and tech platforms (Google, Meta, WhatsApp, Telegram for IP connection logs and account takedowns under Section 79 IT Act).
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', marginBottom: 4 }}>
                        Statutory Instrument:
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                        Section 91 CrPC (Section 94 BNSS 2023)
                      </div>
                      <p style={{ fontSize: 11.5, color: '#64748B', margin: '4px 0 0' }}>
                        Compulsory legal summons requiring intermediaries to produce digital records within 72 hours.
                      </p>
                    </div>

                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', marginBottom: 4 }}>
                        Intermediary Compliance:
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                        Section 79(3)(b) Safe Harbor Notice
                      </div>
                      <p style={{ fontSize: 11.5, color: '#64748B', margin: '4px 0 0' }}>
                        Social platforms face loss of legal liability protection if they fail to remove unlawful content within statutory windows.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedWorkflowPhase === 5 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 10.5, fontWeight: 800, color: '#15803D', background: '#DCFCE7', border: '1px solid #BBF7D0', padding: '2px 8px', borderRadius: 4 }}>
                        PHASE 05 • FUND RESTITUTION
                      </span>
                      <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '6px 0 2px' }}>
                        Magistrate Court Restitution Order (Fund Release)
                      </h3>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#15803D', background: '#DCFCE7', padding: '4px 10px', borderRadius: 6 }}>
                      Court Directive
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: '0 0 16px' }}>
                    Once funds are held in the destination bank, banks require a court order to release the money back to the victim. The IO submits a formal seizure report, and the victim files an application under Section 457 CrPC for release of property.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#15803D', textTransform: 'uppercase', marginBottom: 4 }}>
                        Court Petition Format:
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                        Section 457 CrPC / Section 503 BNSS 2023
                      </div>
                      <p style={{ fontSize: 11.5, color: '#64748B', margin: '4px 0 0' }}>
                        Directs the beneficiary bank branch manager to debit the lien account and credit the original victim account.
                      </p>
                    </div>

                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', marginBottom: 4 }}>
                        CasePilot Escalation Tool:
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                        Automated Section 457 Petition
                      </div>
                      <p style={{ fontSize: 11.5, color: '#64748B', margin: '4px 0 0' }}>
                        Generate a pre-filled court petition ready for signature in the Track & Take Action tab.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 5: CITIZEN LEGAL FAQ (ACCORDION)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* FAQ Search & Category Filter Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                padding: '14px 20px',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
              }}
            >
              <div style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 420 }}>
                <span style={{ position: 'absolute', left: 12, top: 10, color: '#94A3B8', pointerEvents: 'none' }}>
                  <Icons.SearchActivity />
                </span>
                <input
                  type="text"
                  placeholder="Search questions (e.g. UTR, 1930, Anonymous, Restitution, Section 457)..."
                  value={faqSearch}
                  onChange={e => setFaqSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 12.5,
                    color: '#0F172A',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Topics' },
                  { id: 'financial', label: 'Financial Fraud' },
                  { id: 'evidence', label: 'Evidence Standards' },
                  { id: 'privacy', label: 'Privacy & Anonymous' },
                  { id: 'police', label: 'Police & Courts' },
                ].map(cat => {
                  const isSel = faqCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFaqCategory(cat.id)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: isSel ? 700 : 600,
                        cursor: 'pointer',
                        border: isSel ? '1px solid #0F766E' : '1px solid #E2E8F0',
                        background: isSel ? '#0F766E' : '#FFFFFF',
                        color: isSel ? '#FFFFFF' : '#475569',
                        transition: 'all 120ms ease',
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accordion FAQ Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredFaqs.map(item => {
                const isExpanded = expandedFaqId === item.id;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFFFF',
                      border: isExpanded ? '1.5px solid #0F766E' : '1px solid #E2E8F0',
                      borderRadius: 10,
                      overflow: 'hidden',
                      transition: 'border-color 140ms ease',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isExpanded ? null : item.id)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: isExpanded ? '#F0FDFA' : '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: '#0F766E',
                            background: '#FFFFFF',
                            border: '1px solid #CCFBF1',
                            padding: '2px 7px',
                            borderRadius: 4,
                            textTransform: 'uppercase',
                          }}
                        >
                          {item.categoryLabel}
                        </span>
                        <span style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A' }}>
                          {item.q}
                        </span>
                      </div>
                      <span style={{ fontSize: 18, color: '#64748B', fontWeight: 800, minWidth: 20, textAlign: 'right' }}>
                        {isExpanded ? '−' : '+'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div style={{ padding: '16px 20px 20px', borderTop: '1px solid #F1F5F9', background: '#FFFFFF' }}>
                        <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: '0 0 14px' }}>
                          {item.a}
                        </p>

                        {item.statutoryRef && (
                          <div style={{ marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 10px', borderRadius: 4, fontSize: 11.5, color: '#475569' }}>
                            <strong style={{ color: '#0F766E' }}>Statutory Reference:</strong> {item.statutoryRef}
                          </div>
                        )}

                        {item.keyPoints && (
                          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 16px' }}>
                            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: 6 }}>
                              Key Procedural Takeaways:
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#334155', lineHeight: 1.6 }}>
                              {item.keyPoints.map((pt, idx) => (
                                <li key={idx} style={{ marginBottom: 2 }}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
