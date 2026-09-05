'use client';

import React, { useState } from 'react';
import { FlowId } from '@/lib/complaint-flows/types';
import { Icons } from './Icons';

interface Props {
  onSelectPathway: (flowId: FlowId) => void;
  onStartAiIntake: (initialPrompt?: string) => void;
}

interface PathwayOption {
  flowId: FlowId;
  title: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  chips: string[];
  icon: React.ReactNode;
  accent: string;
  accentBg: string;
  details: {
    overview: string;
    keyIncidents: string[];
    evidenceNeeded: string[];
    immediateAction: string;
    legalSection: string;
  };
}

const PATHWAYS: PathwayOption[] = [
  {
    flowId: 'FINANCIAL_FRAUD',
    title: 'Financial Fraud & Scams',
    badge: 'Golden Hour (1930)',
    badgeColor: '#15803D',
    badgeBg: '#DCFCE7',
    badgeBorder: '#BBF7D0',
    chips: ['UPI / PhonePe / GPay', 'Fake Task & Job Scam', 'Bank & Card Fraud'],
    icon: <Icons.CreditCard />,
    accent: '#0F766E',
    accentBg: '#F0FDFA',
    details: {
      overview: 'Unauthorized monetary deductions, fraudulent online banking transfers, credit/debit card cloning, loan app extortion, or investment/task scam fraud.',
      keyIncidents: [
        'UPI debit without consent via fraudulent QR codes or payment request links',
        'Part-time job / Telegram task scam requiring upfront deposits',
        'Electricity bill update / KYC update APK malware stealing banking credentials',
        'Unauthorized credit card transactions or ATM cloning',
      ],
      evidenceNeeded: [
        'Bank statement showing the disputed transaction with debit timestamp',
        'UTR (Unique Transaction Reference) / Transaction Reference IDs',
        'Screenshots of payment gateway receipts, UPI confirmations, or chat history',
        'Offender payment handle, beneficiary account, or phone number',
      ],
      immediateAction: 'Act within the Golden Hour: Call 1930 immediately to trigger inter-bank account freeze under CFCFRMS.',
      legalSection: 'Section 66D Information Technology Act (cheating by personation) • Section 420 IPC',
    },
  },
  {
    flowId: 'SOCIAL_MEDIA',
    title: 'Social Media & Impersonation',
    badge: 'Platform Takedown',
    badgeColor: '#4338CA',
    badgeBg: '#EEF2FF',
    badgeBorder: '#C7D2FE',
    chips: ['Cloned Instagram / FB', 'Morphed Photos & Video', 'WhatsApp Identity Theft'],
    icon: <Icons.Smartphone />,
    accent: '#4F46E5',
    accentBg: '#EEF2FF',
    details: {
      overview: 'Offenders creating fake or cloned accounts using your name, photos, or identity to solicit money, defame your reputation, or share deepfake/morphed media.',
      keyIncidents: [
        'Fake Instagram, Facebook, or LinkedIn profile mimicking your identity',
        'Photos/videos morphed or manipulated using AI deepfake technology',
        'WhatsApp profile picture stolen and used to ask contacts for emergency funds',
        'Defamatory remarks, false accusations, or business reputation attacks',
      ],
      evidenceNeeded: [
        'Exact URL or profile handle of the imposter account',
        'Full screenshots of the fake profile, offending posts, and private message threads',
        'Your official photo ID to verify that you are the legitimate identity owner',
        'URLs where the offending content is currently hosted',
      ],
      immediateAction: 'Report the profile directly through the social platform for immediate takedown while filing official police complaint.',
      legalSection: 'Section 66C IT Act (identity theft) • Section 66D IT Act • Section 500 IPC (defamation)',
    },
  },
  {
    flowId: 'HACKING',
    title: 'Hacking & Account Takeover',
    badge: 'Access Recovery',
    badgeColor: '#0369A1',
    badgeBg: '#E0F2FE',
    badgeBorder: '#BAE6FD',
    chips: ['Gmail / Email Breached', 'WhatsApp Session Stolen', '2FA & Cloud Bypass'],
    icon: <Icons.Lock />,
    accent: '#0284C7',
    accentBg: '#F0F9FF',
    details: {
      overview: 'Unauthorized intrusion into personal or corporate email accounts, messaging platforms, cloud infrastructure, or servers with credentials or 2FA compromised.',
      keyIncidents: [
        'Gmail or Microsoft account password changed without your authorization',
        'WhatsApp account logged in on another device via stolen OTP or QR session hijacking',
        'Corporate server, AWS/Azure cloud, or website administrative panel breached',
        'SIM swap attack used to bypass SMS Two-Factor Authentication',
      ],
      evidenceNeeded: [
        'Security alert emails received from the service provider',
        'IP addresses, device names, and timestamps from active login session logs',
        'Recovery email or phone number changed by the attacker',
        'Service provider ticket/reference number if already contacted',
      ],
      immediateAction: 'Revoke all active web sessions from account settings and enable hardware-based or app-based 2FA immediately.',
      legalSection: 'Section 43 & Section 66 IT Act (unauthorized computer access, data theft, and hacking)',
    },
  },
  {
    flowId: 'RANSOMWARE',
    title: 'Ransomware & Extortion',
    badge: 'Critical Priority',
    badgeColor: '#DC2626',
    badgeBg: '#FEE2E2',
    badgeBorder: '#FECACA',
    chips: ['Files Encrypted (.locked)', 'Bitcoin Ransom Demand', 'Server / Data Lockout'],
    icon: <Icons.AlertTriangle />,
    accent: '#DC2626',
    accentBg: '#FEF2F2',
    details: {
      overview: 'Malicious software encrypting local drives, network shares, or database servers with extensions like .locked or .phobos, accompanied by a cryptocurrency ransom note.',
      keyIncidents: [
        'Files across office computers renamed with unknown extensions and unopenable',
        'Ransom note text file (e.g. README_DECRYPT.txt) left on desktop with contact email',
        'Extortion demand specifying Bitcoin, Monero, or crypto wallet address',
        'Attackers threatening to leak sensitive corporate data if ransom is not paid',
      ],
      evidenceNeeded: [
        'A non-sensitive encrypted sample file',
        'Full text and screenshot of the ransom demand note',
        'Attacker email address, Tor website URL, or cryptocurrency wallet address',
        'Firewall logs or server access logs showing initial breach point',
      ],
      immediateAction: 'Disconnect infected systems from the local network and internet immediately. DO NOT pay the ransom.',
      legalSection: 'Section 66 & 66F IT Act (cyber terrorism and computer malware) • Section 384 IPC (extortion)',
    },
  },
  {
    flowId: 'PHISHING',
    title: 'Digital Arrest & Phishing',
    badge: 'Police / CBI Spoofing',
    badgeColor: '#7C3AED',
    badgeBg: '#F5F3FF',
    badgeBorder: '#DDD6FE',
    chips: ['Fake Police / Video Call', 'Malicious APK / SMS Link', 'Customs Parcel Threat'],
    icon: <Icons.PhoneCall />,
    accent: '#7C3AED',
    accentBg: '#F5F3FF',
    details: {
      overview: 'Criminals impersonating police, CBI, customs, or courier agencies over Skype/WhatsApp video calls ("Digital Arrest"), or sending fraudulent bank update links to steal credentials.',
      keyIncidents: [
        'Video call claiming your parcel contains narcotics and threatening immediate "Digital Arrest"',
        'Caller claiming to be TRAI/Police threatening SIM deactivation within 2 hours',
        'Fake bank KYC SMS containing links that mimic official NetBanking portals',
        'Fake traffic challan or income tax refund download links containing spyware',
      ],
      evidenceNeeded: [
        'Incoming phone numbers, WhatsApp handles, or Skype IDs used by offenders',
        'Audio recordings or video call screenshots of the perpetrators posing as officers',
        'Exact phishing URL links received via SMS or messaging apps',
        'Copies of any forged warrants, FIRs, or letters sent by the scammers',
      ],
      immediateAction: 'Indian Law Enforcement never conducts "Digital Arrests" or demands money transfers over video calls. Hang up and report immediately.',
      legalSection: 'Section 170 IPC (personating a public servant) • Section 419/420 IPC • Section 66D IT Act',
    },
  },
  {
    flowId: 'HARASSMENT',
    title: 'Cyber Harassment & Stalking',
    badge: 'Safety & Protection',
    badgeColor: '#BE123C',
    badgeBg: '#FFE4E6',
    badgeBorder: '#FECDD3',
    chips: ['Abusive / Threat Calls', 'Blackmail & Doxxing', 'Online Defamation'],
    icon: <Icons.ShieldAlert />,
    accent: '#E11D48',
    accentBg: '#FFF1F2',
    details: {
      overview: 'Continuous unwanted online communication, abusive calls from multiple untraceable numbers, publishing private personal details (doxxing), or coercive blackmail.',
      keyIncidents: [
        'Repeated abusive or threatening WhatsApp/Telegram messages from unknown numbers',
        'Doxxing: your personal phone number, residential address, or workplace posted online',
        'Blackmail threats to release private chat conversations or sensitive material',
        'Persistent online stalking across multiple social media platforms despite blocking',
      ],
      evidenceNeeded: [
        'Full timestamped call logs and duration records',
        'Unedited screenshot threads of abusive or threatening conversations',
        'Phone numbers, email addresses, or online handles used by the offender',
        'Any voice notes, voicemails, or audio recordings preserved',
      ],
      immediateAction: 'Preserve all messages and call records as forensic evidence. Do not delete threads before exporting.',
      legalSection: 'Section 354D IPC (stalking) • Section 507 IPC (criminal intimidation) • Section 67 IT Act',
    },
  },
  {
    flowId: 'WOMEN_CHILDREN',
    title: 'Women & Children Crime',
    badge: '100% Anonymous Option',
    badgeColor: '#9333EA',
    badgeBg: '#FAF5FF',
    badgeBorder: '#E9D5FF',
    chips: ['Non-Consensual Media', 'Online Stalking & Abuse', 'Fast-Track Police Action'],
    icon: <Icons.HeartHandshake />,
    accent: '#9333EA',
    accentBg: '#FAF5FF',
    details: {
      overview: 'Sensitive cyber offences committed against women and minors, with statutory priority handling, confidentiality safeguards, and optional 100% anonymous complaint filing.',
      keyIncidents: [
        'Circulation or threats to publish non-consensual private photos or videos',
        'Online grooming, enticement, or harassment targeting minors',
        'Sexually explicit comments, messages, or uninvited media on messaging apps',
        'Creation of fake obscene profiles targeting women',
      ],
      evidenceNeeded: [
        'URLs where the content is uploaded or circulating',
        'Screenshots of the threatening or explicit messages with date and time visible',
        'Suspect contact information, phone numbers, or account usernames',
        'Details of websites or platforms hosting the material for legal preservation',
      ],
      immediateAction: 'You have the legal right to file 100% anonymously without providing name or contact information if desired.',
      legalSection: 'Section 67 & 67A IT Act • POCSO Act (where minors are involved) • Section 354A/354B IPC',
    },
  },
  {
    flowId: 'OTHER_CYBERCRIME',
    title: 'Other Cyber Crime',
    badge: 'General Intake',
    badgeColor: '#334155',
    badgeBg: '#F1F5F9',
    badgeBorder: '#CBD5E1',
    chips: ['Crypto Wallet Drain', 'Matrimonial Fraud', 'Identity Document Misuse'],
    icon: <Icons.SearchActivity />,
    accent: '#334155',
    accentBg: '#F8FAFC',
    details: {
      overview: 'Specialized or emerging cyber incidents including cryptocurrency theft, matrimonial fraud, intellectual property theft, SIM swap, or custom corporate breaches.',
      keyIncidents: [
        'Cryptocurrency wallet funds drained via malicious smart contract interaction',
        'Matrimonial website scam: fraudster faking credentials and taking money',
        'Misuse of Aadhaar card, PAN, or passport documents for fraudulent SIM or loan issuance',
        'Corporate intellectual property or source code exfiltration',
      ],
      evidenceNeeded: [
        'Complete chronological narrative of how the incident unfolded',
        'Blockchain transaction hash and wallet addresses (for cryptocurrency matters)',
        'Copies of forged identity documents, receipts, or agreements',
        'Screenshots of all communication channels used with timestamps',
      ],
      immediateAction: 'Contact your telecom provider or crypto exchange support immediately to log an emergency hold.',
      legalSection: 'Relevant provisions of the Information Technology Act 2000 and Indian Penal Code',
    },
  },
];

export function ComplaintPathwaySelectorView({ onSelectPathway, onStartAiIntake }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInfo, setSelectedInfo] = useState<PathwayOption | null>(null);

  const filteredPathways = PATHWAYS.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.chips.some(chip => chip.toLowerCase().includes(q)) ||
      p.badge.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        background: '#F8FAFC',
        padding: '36px 36px 64px',
        fontFamily: "'Manrope', Helvetica, sans-serif",
      }}
    >
      {/* ── Centered Container (Keeps generous space on Left & Right) ── */}
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#0F766E',
                  background: '#F0FDFA',
                  border: '1px solid #CCFBF1',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                ✦ Official NCRP Standard
              </span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Select Cybercrime Reporting Pathway
            </h1>
            <p style={{ fontSize: 13.5, color: '#64748B', margin: 0 }}>
              Choose your category to load the exact police evidence checklist and investigation workflow.
            </p>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', width: 280, minWidth: 240 }}>
            <span style={{ position: 'absolute', left: 12, top: 10, color: '#94A3B8', pointerEvents: 'none' }}>
              <Icons.SearchActivity />
            </span>
            <input
              type="text"
              placeholder="Search (e.g. UPI, Hacking, Instagram)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                fontSize: 13,
                color: '#0F172A',
                outline: 'none',
                fontFamily: "'Manrope', sans-serif",
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'border-color 150ms ease, box-shadow 150ms ease',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#0F766E';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15, 118, 110, 0.1)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
              }}
            />
          </div>
        </div>

        {/* ── 2 Cards Per Row Grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 18,
          }}
        >
          {filteredPathways.map(p => (
            <div
              key={p.flowId}
              onClick={() => onSelectPathway(p.flowId)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onSelectPathway(p.flowId)}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: 14,
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                gap: 16,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = p.accent;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(15, 23, 42, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.04)';
              }}
            >
              <div>
                {/* Top Row: Icon + Priority Badge + Info Button (Reverse Exclamatory) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: p.accentBg,
                      color: p.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}
                  >
                    {p.icon}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: p.badgeColor,
                        background: p.badgeBg,
                        border: `1px solid ${p.badgeBorder}`,
                        padding: '3px 9px',
                        borderRadius: 6,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {p.badge}
                    </span>

                    {/* Reverse Exclamatory / Info Button (i) */}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedInfo(p);
                      }}
                      title={`Learn more about ${p.title}`}
                      aria-label={`Learn more about ${p.title}`}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        border: '1.5px solid #CBD5E1',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        transition: 'all 150ms ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = p.accentBg;
                        e.currentTarget.style.borderColor = p.accent;
                        e.currentTarget.style.color = p.accent;
                        e.currentTarget.style.transform = 'scale(1.12)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#CBD5E1';
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Icons.Info />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: 16.5,
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: '0 0 12px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {p.title}
                </h3>

                {/* Eye-catching Chips (Instant recognition without text clutter) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {p.chips.map((chip, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#334155',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        padding: '4px 9px',
                        borderRadius: 6,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Strip */}
              <div
                style={{
                  paddingTop: 12,
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  fontWeight: 700,
                  color: p.accent,
                }}
              >
                <span
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedInfo(p);
                  }}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = p.accent)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
                >
                  Details & Evidence
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  File Complaint →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── AI Assistant Quick Advisor Banner ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F0FDFA 0%, #FFFFFF 100%)',
            border: '1.5px dashed #0F766E',
            borderRadius: 14,
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            boxShadow: '0 2px 8px rgba(15, 118, 110, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 8px rgba(15, 118, 110, 0.25)',
                flexShrink: 0,
              }}
            >
              <Icons.Bot size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Not sure which category fits your incident?
                </h4>
                <span style={{ fontSize: 10, background: '#DCFCE7', color: '#15803D', fontWeight: 700, padding: '1px 6px', borderRadius: 4 }}>
                  AI Guided
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: '#64748B', margin: '2px 0 0' }}>
                Describe what happened in plain words. CasePilot AI classifies the crime and pre-fills the complaint.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onStartAiIntake('I am not sure what kind of cybercrime this is. Here is what happened: ')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#0F766E',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              padding: '9px 16px',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(15, 118, 110, 0.25)',
              transition: 'all 150ms ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#115E59';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#0F766E';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Icons.Sparkles /> Describe to AI →
          </button>
        </div>
      </div>

      {/* ── Reverse Exclamatory / Info Modal (Details on Crime Complaint) ── */}
      {selectedInfo && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedInfo(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
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
              borderRadius: 16,
              maxWidth: 580,
              width: '100%',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: selectedInfo.accentBg,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: '#FFFFFF',
                    color: selectedInfo.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  }}
                >
                  {selectedInfo.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                    {selectedInfo.title}
                  </h3>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      color: selectedInfo.badgeColor,
                      background: selectedInfo.badgeBg,
                      border: `1px solid ${selectedInfo.badgeBorder}`,
                      padding: '1px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {selectedInfo.badge}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInfo(null)}
                aria-label="Close modal"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 20,
                  color: '#64748B',
                  padding: '4px 8px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 150ms, color 150ms',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.06)';
                  e.currentTarget.style.color = '#0F172A';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = '#64748B';
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '22px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Overview */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: 6 }}>
                  Overview & Coverage
                </div>
                <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.55, margin: 0 }}>
                  {selectedInfo.details.overview}
                </p>
              </div>

              {/* Common Scenarios */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: 8 }}>
                  Common Incident Scenarios
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedInfo.details.keyIncidents.map((inc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#1E293B' }}>
                      <span style={{ color: selectedInfo.accent, fontWeight: 800, marginTop: 1 }}>•</span>
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Evidence */}
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  padding: '14px 16px',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F766E', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icons.Check /> Key Evidence Documents Needed
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>
                  {selectedInfo.details.evidenceNeeded.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>

              {/* Emergency Action */}
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 10,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ color: '#DC2626', display: 'flex', alignItems: 'center' }}>
                  <Icons.AlertTriangle />
                </span>
                <div style={{ fontSize: 12.5, color: '#991B1B', fontWeight: 600 }}>
                  {selectedInfo.details.immediateAction}
                </div>
              </div>

              {/* Legal Reference */}
              <div style={{ fontSize: 11.5, color: '#94A3B8' }}>
                <span style={{ fontWeight: 600, color: '#64748B' }}>Governing Law:</span> {selectedInfo.details.legalSection}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 12,
                background: '#FAFAFA',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedInfo(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const flow = selectedInfo.flowId;
                  setSelectedInfo(null);
                  onSelectPathway(flow);
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: selectedInfo.accent,
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Select This Pathway →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
