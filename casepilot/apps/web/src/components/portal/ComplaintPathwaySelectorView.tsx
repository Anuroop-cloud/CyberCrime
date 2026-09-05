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
  description: string;
  examples: string[];
  requiredFocus: string;
  icon: React.ReactNode;
  accent: string;
  accentBg: string;
}

const PATHWAYS: PathwayOption[] = [
  {
    flowId: 'FINANCIAL_FRAUD',
    title: 'Financial Fraud & Online Scams',
    badge: 'Golden Hour (1930)',
    badgeColor: '#15803D',
    badgeBg: '#DCFCE7',
    badgeBorder: '#BBF7D0',
    description: 'UPI debits, fake job tasks, electricity KYC APKs, card cloning, and unauthorized bank transfers.',
    examples: ['Google Pay / PhonePe unauthorized debit', 'Telegram task / part-time job scam', 'Fake electricity bill APK', 'Credit/debit card skimming'],
    requiredFocus: 'Bank details, UTR transaction number, beneficiary account, amount',
    icon: <Icons.CreditCard />,
    accent: '#0F766E',
    accentBg: '#F0FDFA',
  },
  {
    flowId: 'SOCIAL_MEDIA',
    title: 'Social Media & Impersonation',
    badge: 'Platform Takedown',
    badgeColor: '#4338CA',
    badgeBg: '#EEF2FF',
    badgeBorder: '#C7D2FE',
    description: 'Fake profiles posing as you, morphed images, account cloning, defamation, and identity theft.',
    examples: ['Cloned Instagram / Facebook account', 'Morphed images shared online', 'WhatsApp DP impersonation', 'Defamatory posts / fake handle'],
    requiredFocus: 'Platform name, offender handle/URL, original ID proof, screenshots',
    icon: <Icons.Smartphone />,
    accent: '#4F46E5',
    accentBg: '#EEF2FF',
  },
  {
    flowId: 'HACKING',
    title: 'Hacking & Account Compromise',
    badge: 'Access Recovery',
    badgeColor: '#0369A1',
    badgeBg: '#E0F2FE',
    badgeBorder: '#BAE6FD',
    description: 'Email, WhatsApp, or cloud account takeover, 2FA bypass, and unauthorized credential changes.',
    examples: ['Gmail password changed without consent', 'WhatsApp session hijacked', 'Corporate cloud breached', 'Instagram account locked out'],
    requiredFocus: 'Affected service, recovery email/phone changed, session logs',
    icon: <Icons.Lock />,
    accent: '#0284C7',
    accentBg: '#F0F9FF',
  },
  {
    flowId: 'RANSOMWARE',
    title: 'Ransomware & Encrypted Files',
    badge: 'Critical Priority',
    badgeColor: '#DC2626',
    badgeBg: '#FEE2E2',
    badgeBorder: '#FECACA',
    description: 'Files encrypted with .locked or unknown extensions, server outages, and crypto ransom demands.',
    examples: ['All office files renamed .locked', 'Ransom note (README.txt) left', 'Server locked with Bitcoin demand', 'Critical database encrypted'],
    requiredFocus: 'Ransom note text, extension, wallet address, affected device type',
    icon: <Icons.AlertTriangle />,
    accent: '#DC2626',
    accentBg: '#FEF2F2',
  },
  {
    flowId: 'PHISHING',
    title: 'Phishing, Vishing & Malicious Links',
    badge: 'Digital Arrest / Spoofing',
    badgeColor: '#7C3AED',
    badgeBg: '#F5F3FF',
    badgeBorder: '#DDD6FE',
    description: 'Deceptive bank links, digital arrest extortion calls, TRAI/Police spoofing, and malicious SMS.',
    examples: ['Fake SBI/HDFC netbanking link', 'Call claiming customs/police parcel', 'Digital arrest video call threat', 'Lottery / tax refund SMS link'],
    requiredFocus: 'Phishing URL, caller phone number, claimed organization, SMS header',
    icon: <Icons.PhoneCall />,
    accent: '#7C3AED',
    accentBg: '#F5F3FF',
  },
  {
    flowId: 'HARASSMENT',
    title: 'Cyber Harassment & Cyberstalking',
    badge: 'Safety & Protection',
    badgeColor: '#BE123C',
    badgeBg: '#FFE4E6',
    badgeBorder: '#FECDD3',
    description: 'Persistent abusive messages, threatening calls from unknown numbers, doxxing, and extortion.',
    examples: ['Continuous abusive calls after blocking', 'Threats to leak private photos', 'Doxxing personal address online', 'Coercion / extortion messages'],
    requiredFocus: 'Call logs with timestamps, message exports, suspect numbers, safety concern',
    icon: <Icons.ShieldAlert />,
    accent: '#E11D48',
    accentBg: '#FFF1F2',
  },
  {
    flowId: 'WOMEN_CHILDREN',
    title: 'Women & Children Related Crime',
    badge: '100% Anonymous or Tracked',
    badgeColor: '#9333EA',
    badgeBg: '#FAF5FF',
    badgeBorder: '#E9D5FF',
    description: 'Sensitive cyber offences against women and children with confidential fast-track police handling.',
    examples: ['Circulation of non-consensual images', 'Online stalking and threats to minors', 'Cyber grooming and coercion', 'Obscene content on social apps'],
    requiredFocus: 'Choice of Anonymous vs Tracked report, media URLs, suspect details',
    icon: <Icons.HeartHandshake />,
    accent: '#9333EA',
    accentBg: '#FAF5FF',
  },
  {
    flowId: 'OTHER_CYBERCRIME',
    title: 'Other Cyber Crime & Custom Incident',
    badge: 'General Cyber Intake',
    badgeColor: '#475569',
    badgeBg: '#F1F5F9',
    badgeBorder: '#CBD5E1',
    description: 'Cryptocurrency fraud, matrimonial scams, identity theft, malware infection, or corporate incidents.',
    examples: ['Matrimonial profile fraud', 'Cryptocurrency wallet drainage', 'Identity document misuse', 'Intellectual property theft'],
    requiredFocus: 'Incident narrative, evidence files, suspect identifiers, monetary loss if any',
    icon: <Icons.SearchActivity />,
    accent: '#334155',
    accentBg: '#F8FAFC',
  },
];

export function ComplaintPathwaySelectorView({ onSelectPathway, onStartAiIntake }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPathways = PATHWAYS.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.examples.some(ex => ex.toLowerCase().includes(q)) ||
      p.requiredFocus.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        background: '#FFFFFF',
        padding: '28px 36px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        fontFamily: "'Manrope', Helvetica, sans-serif",
      }}
    >
      {/* ── Top Header & Context ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            ✦ Official NCRP Filing
          </span>
          <span style={{ fontSize: 12, color: '#64748B' }}>
            National Cyber Crime Reporting Portal Standard
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
              Select Cybercrime Reporting Pathway
            </h1>
            <p style={{ fontSize: 13.5, color: '#64748B', margin: 0, maxWidth: 680, lineHeight: 1.5 }}>
              CasePilot customizes the complaint structure, evidence upload checklist, and law enforcement escalation workflow based on your specific incident type.
            </p>
          </div>

          {/* Quick Filter Input */}
          <div style={{ position: 'relative', width: 280, minWidth: 240 }}>
            <span style={{ position: 'absolute', left: 12, top: 10, color: '#94A3B8', pointerEvents: 'none' }}>
              <Icons.SearchActivity />
            </span>
            <input
              type="text"
              placeholder="Search crime type (e.g. UPI, Hacking)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                background: '#F8FAFC',
                fontSize: 12.5,
                color: '#0F172A',
                outline: 'none',
                fontFamily: "'Manrope', sans-serif",
                transition: 'border-color 150ms ease, background 150ms ease',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#0F766E';
                e.currentTarget.style.background = '#FFFFFF';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.background = '#F8FAFC';
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Category Cards Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 16,
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
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
              minHeight: 180,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = p.accent;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(15, 23, 42, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.04)';
            }}
          >
            <div>
              {/* Header: Icon + Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: p.accentBg,
                    color: p.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  {p.icon}
                </div>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: p.badgeColor,
                    background: p.badgeBg,
                    border: `1px solid ${p.badgeBorder}`,
                    padding: '2px 8px',
                    borderRadius: 6,
                  }}
                >
                  {p.badge}
                </span>
              </div>

              {/* Title & Description */}
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 12.5, color: '#475569', margin: '0 0 12px', lineHeight: 1.45 }}>
                {p.description}
              </p>

              {/* Example Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {p.examples.slice(0, 3).map((ex, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      color: '#64748B',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      padding: '2px 7px',
                      borderRadius: 4,
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div
              style={{
                paddingTop: 10,
                borderTop: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 12.5,
                fontWeight: 600,
                color: p.accent,
              }}
            >
              <span style={{ fontSize: 11, color: '#94A3B8' }}>
                Requires: {p.requiredFocus.split(',')[0]}...
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                File Complaint →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Featured "I'm Not Sure" AI Advisor Card ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #F0FDFA 0%, #FFFFFF 100%)',
          border: '1.5px dashed #0F766E',
          borderRadius: 14,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
          boxShadow: '0 2px 8px rgba(15, 118, 110, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(15, 118, 110, 0.3)',
              flexShrink: 0,
            }}
          >
            <Icons.Bot size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '0 0 2px' }}>
                I&apos;m Not Sure Which Category Fits
              </h4>
              <span style={{ fontSize: 10, background: '#DCFCE7', color: '#15803D', fontWeight: 700, padding: '1px 6px', borderRadius: 4 }}>
                AI Guided
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: '#475569', margin: 0 }}>
              Speak or describe your incident in plain words. CasePilot AI will classify the offence, identify the correct legal pathway, and automatically pre-fill your complaint.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStartAiIntake("I am not sure what kind of cybercrime this is. Here is what happened: ")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#0F766E',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            padding: '10px 18px',
            fontSize: 13,
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
          <Icons.Sparkles /> Describe to CasePilot AI →
        </button>
      </div>
    </div>
  );
}
