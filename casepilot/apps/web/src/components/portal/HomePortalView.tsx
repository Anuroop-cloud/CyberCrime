'use client';
import React, { useState } from 'react';
import { Icons } from './Icons';

export interface CaseRecord {
  id: string;
  category: string;
  subCategory: string;
  amount: string;
  status: string;
  health: string;
  nextAction: string;
  needsAttention?: boolean;
  timeline: { date: string; title: string; desc: string }[];
}

interface Props {
  cases: CaseRecord[];
  userName?: string;
  onSelectCategory: (category: string, subCategory?: string) => void;
  onNavigateToRegister: (category?: string, subCategory?: string, mode?: 'manual' | 'ai') => void;
  onNavigateToTrack: (caseId?: string) => void;
  onStartAiIntake: (initialQuery?: string) => void;
}

// HealthSutra font: 'Manrope', Helvetica (from utilities.css)
const MAN = "'Manrope', Helvetica, sans-serif";

// CirclePlus — matches FamilyMembersCard.jsx lucide CirclePlus, strokeWidth=1
function CirclePlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

// ClipboardSearch — exact SVG from HealthSummaryCard.jsx
function ClipboardSearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
      <path d="M8.33 5.21H6.25C5.70 5.21 5.17 5.43 4.78 5.82C4.39 6.21 4.17 6.74 4.17 7.29V19.79C4.17 20.34 4.39 20.87 4.78 21.26C5.17 21.65 5.70 21.87 6.25 21.87H12.18M18.75 12.50V7.29C18.75 6.74 18.53 6.21 18.14 5.82C17.75 5.43 17.22 5.21 16.67 5.21H14.58" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.33 11.46H12.50M8.33 15.63H11.46M19.27 20.31L21.88 22.92M8.33 5.21C8.33 4.66 8.55 4.13 8.94 3.74C9.33 3.34 9.86 3.13 10.42 3.13H12.50C13.05 3.13 13.58 3.34 13.97 3.74C14.36 4.13 14.58 4.66 14.58 5.21C14.58 5.76 14.36 6.29 13.97 6.68C13.58 7.07 13.05 7.29 12.50 7.29H10.42C9.86 7.29 9.33 7.07 8.94 6.68C8.55 6.29 8.33 5.76 8.33 5.21ZM14.58 18.23C14.58 18.92 14.86 19.58 15.35 20.07C15.84 20.56 16.50 20.83 17.19 20.83C17.88 20.83 18.54 20.56 19.03 20.07C19.52 19.58 19.79 18.92 19.79 18.23C19.79 17.54 19.52 16.88 19.03 16.39C18.54 15.90 17.88 15.63 17.19 15.63C16.50 15.63 15.84 15.90 15.35 16.39C14.86 16.88 14.58 17.54 14.58 18.23Z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

import { FolderWithFiles } from './FolderWithFiles';

export function HomePortalView({ cases, userName = 'Anuroop', onSelectCategory, onNavigateToRegister, onNavigateToTrack, onStartAiIntake }: Props) {
  const [showPathwayModal, setShowPathwayModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState<string | null>(null);
  const b1: React.CSSProperties = { fontFamily: MAN, fontSize: 16, fontWeight: 500 };  // B1-Med-500
  const b3: React.CSSProperties = { fontFamily: MAN, fontSize: 14, fontWeight: 500 };  // B3-Med-500
  const strong16: React.CSSProperties = { fontFamily: MAN, fontSize: 16, fontWeight: 700 };
  const chip = (color: string, bg: string, border: string): React.CSSProperties => ({
    fontFamily: MAN, fontSize: 13, fontWeight: 500, color, background: bg,
    border: `1px solid ${border}`, borderRadius: 999, padding: '3px 10px', cursor: 'pointer',
  });

  return (
    // dashboard.jsx: flex flex-col -m-6 p-6 bg-white w-full lg:max-w-5xl lg:px-8 mx-auto
    <div style={{ flex: 1, overflowY: 'auto', background: '#FFFFFF', width: '100%' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '16px 32px 48px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* GREETING — H3-Med-500: Manrope 28px 500 letter-spacing -0.84px */}
        <div style={{ ...b1, fontSize: 28, letterSpacing: '-0.84px', lineHeight: '100%', color: '#111827', marginBottom: 8 }}>
          Hey {userName},
        </div>

        {/* SmartHealthAdvisorCard -> 'Tell us what happened.'
            Source: rounded-2xl shadow-[inset_0_0_24_1.25_#262626]
            radial-gradient(50%_50%_at_70%_67%, rgba(77,77,77,1), rgba(64,62,62,1))
            p-3.5 flex flex-col justify-between items-start
            title: B1-Med-500 text-white w-35
            button: B3-Med-500 bg-white/10 border-white/15 rounded-lg px-3 py-1 self-end
            CRITICAL: flex-col = title TOP, button BOTTOM-RIGHT */}
        <div id="home-advisor-card" onClick={() => onStartAiIntake()} style={{
          width: '100%', borderRadius: 16,
          boxShadow: 'inset 0 0 24px 1.25px #262626',
          background: 'radial-gradient(50% 50% at 70% 67%, rgba(77,77,77,1) 0%, rgba(64,62,62,1) 100%)',
          padding: 14, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer', minHeight: 80,
        }}>
          <div style={{ ...b1, color: '#FFFFFF', width: 180 }}>Tell us what happened.</div>
          <div onClick={e => { e.stopPropagation(); onStartAiIntake(); }} style={{
            ...b3, color: '#FFFFFF', background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
            padding: '4px 12px', cursor: 'pointer', alignSelf: 'flex-end',
          }}>Start</div>
        </div>

        {/* THREE CARDS ROW
            dashboard.jsx: className='rounded-2xl flex justify-between flex-nowrap min-h-0'
            Each card: min-w-40 max-w-60 flex-1 aspect-[4/3]
            NOTE: explicit height on the row so aspect-ratio resolves correctly */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap', gap: 16, minHeight: 0, height: 200 }}>

          {/* FamilyMembersCard -> Report a Cybercrime
              Source: p-3.5 rounded-2xl bg-white shadow-[inset_0_0_65.4px_-8px_rgba(21,24,27,0.08)]
              B1-Med-500 flex flex-col justify-between h-full
              Top: title + CirclePlus. Body: EMPTY. No border, only inset shadow. */}
          <div style={{ minWidth: 160, maxWidth: 240, flex: 1, aspectRatio: '4/3' }}>
            <div id="home-card-report" onClick={() => setShowPathwayModal(true)} style={{
              cursor: 'pointer', height: '100%', width: '100%', padding: 14,
              borderRadius: 16, background: '#FFFFFF',
              boxShadow: 'inset 0 0 65.4px -8px rgba(21,24,27,0.08)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div style={{ ...b1, color: '#111827', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Report a Cybercrime</span>
                <button type="button" onClick={e => { e.stopPropagation(); setShowPathwayModal(true); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0F766E', padding: 0, display: 'flex' }}>
                  <CirclePlusIcon />
                </button>
              </div>
              <div />
            </div>
          </div>

          {/* ReportsCard -> Your Complaints
              Source: div.relative, FolderWithFiles SVG fills 100%,
              span.absolute.bottom-[7%].left-[7%].text-white.B1-Med-500 */}
          <div style={{ minWidth: 160, maxWidth: 240, flex: 1, aspectRatio: '4/3' }}>
            <div
              id="home-card-register"
              onClick={() => onNavigateToRegister()}
              style={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: 16,
                overflow: 'hidden',
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            >
              <FolderWithFiles style={{ width: '100%', height: '100%', display: 'block' }} />
              <span style={{ position: 'absolute', bottom: '7%', left: '7%', ...b1, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                Your Complaints
              </span>
            </div>
          </div>

          {/* HealthSummaryCard -> Track & Take Action
              Source: h-full rounded-2xl p-3 flex flex-col justify-between text-white gradient
              ClipboardSearch self-end (top-right), B1-Med-500 text bottom-left */}
          <div style={{ minWidth: 160, maxWidth: 240, flex: 1, aspectRatio: '4/3' }}>
            <div id="home-card-track" onClick={() => onNavigateToTrack()} style={{
              height: '100%', borderRadius: 16, cursor: 'pointer', padding: 12,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #2D6A68 0%, #174240 100%)',
            }}>
              <div style={{ alignSelf: 'flex-end' }}><ClipboardSearchIcon /></div>
              <div><div style={{ ...b1, color: '#FFFFFF' }}>Track &amp; Take Action</div></div>
            </div>
          </div>
        </div>

        {/* KeyFindingsCard -> 'Know What To Do'
            Source: rounded-2xl border border-solid px-3.5 py-3 flex flex-col gap-2
            <strong> title, ul.list-disc.ml-8 items (14px 150% #494848)
            'Read More' button: bg-[#141414] text-white rounded-lg px-3 py-1 self-end */}
        <div style={{ borderRadius: 16, border: '1px solid #E5E7EB', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          <strong style={strong16}>Know What To Do</strong>
          <ul style={{ listStyleType: 'disc', paddingLeft: 32, margin: '6px 0 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li style={{ ...b3, lineHeight: '150%', color: '#494848' }}>
              <span style={{ color: '#DC2626', fontWeight: 500 }}>Lost money?</span>{' '}
              Call <strong style={{ color: '#0F766E' }}>1930</strong> within the golden hour to initiate an inter-bank account freeze.{' '}
              <a href="tel:1930" style={{ color: '#141414', fontWeight: 600, textDecoration: 'none' }}>Call now →</a>
            </li>
            <li style={{ ...b3, lineHeight: '150%', color: '#494848' }}>
              <span style={{ color: '#D97706', fontWeight: 500 }}>Account compromised?</span>{' '}
              Change credentials, revoke all active sessions, and preserve security alert screenshots.{' '}
              <button type="button" onClick={() => setShowGuideModal('account')} style={{ background: 'none', border: 'none', padding: 0, ...b3, color: '#141414', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Safety guide →</button>
            </li>
            <li style={{ ...b3, lineHeight: '150%', color: '#494848' }}>
              <span style={{ color: '#2563EB', fontWeight: 500 }}>Suspicious link?</span>{' '}
              Do not click or reopen. Preserve the sender, full URL, and message thread as evidence.{' '}
              <button type="button" onClick={() => setShowGuideModal('phishing')} style={{ background: 'none', border: 'none', padding: 0, ...b3, color: '#141414', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Phishing guide →</button>
            </li>
          </ul>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
            <button type="button" onClick={() => onNavigateToTrack()} style={{ color: '#FFFFFF', background: '#141414', border: 'none', borderRadius: 8, padding: '4px 12px', ...b3, cursor: 'pointer' }}>Read More</button>
          </div>
        </div>

        {/* CategoriesInRangeCard -> 'Cyber Safety'
            Source: rounded-2xl border border-solid border-neutral-200 p-3 flex flex-col items-start gap-[18px] */}
        <div style={{ borderRadius: 16, border: '1px solid #E5E7EB', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
          <strong style={strong16}>Cyber Safety</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, width: '100%' }}>
            {['Phishing & Suspicious Links','Account Takeover','Financial Fraud','Social Media Impersonation','Online Harassment','Ransomware & Malware'].map(c => (
              <span key={c} onClick={() => onStartAiIntake(`I need help with ${c}`)} style={chip('#0F766E','#F0FDFA','#CCFBF1')}>{c}</span>
            ))}
          </div>
        </div>

        {/* CategoriesOutOfRangeCard -> 'Common Threats' (same structure, red chips) */}
        <div style={{ borderRadius: 16, border: '1px solid #E5E7EB', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
          <strong style={strong16}>Common Threats</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, width: '100%' }}>
            {['Fake KYC Calls','UPI / Payment Fraud','Fake Job Offers','Social Media Impersonation','Malicious Links','Account Takeover'].map(c => (
              <span key={c} onClick={() => onStartAiIntake(`I received a ${c} attempt`)} style={chip('#B91C1C','#FEF2F2','#FECACA')}>{c}</span>
            ))}
          </div>
        </div>

        {/* Cases table — only when citizen has registered complaints */}
        {cases.length > 0 && (
          <div style={{ borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #E5E7EB', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong style={strong16}>Your Registered Complaints</strong>
              <button type="button" onClick={() => onNavigateToTrack()} style={{ background: 'none', border: 'none', color: '#0F766E', ...b3, cursor: 'pointer' }}>View All →</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['Case No.','Category','Amount','Status',''].map((h,i) => (
                    <th key={h+i} style={{ padding: '8px 14px', textAlign: i===4?'right' as const:'left' as const, fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontFamily: MAN }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cases.map(c => (
                  <tr key={c.id} onClick={() => onNavigateToTrack(c.id)} style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')} onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#111827' }}>{c.id}</td>
                    <td style={{ padding: '10px 14px' }}><div style={{ fontFamily: MAN, fontSize: 14, fontWeight: 500, color: '#1F2937' }}>{c.category}</div><div style={{ fontFamily: MAN, fontSize: 12, color: '#6B7280' }}>{c.subCategory}</div></td>
                    <td style={{ padding: '10px 14px', fontFamily: MAN, fontSize: 14, color: '#374151' }}>{c.amount}</td>
                    <td style={{ padding: '10px 14px' }}><span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, fontFamily: MAN, background: c.needsAttention?'#FEF2F2':'#DCFCE7', color: c.needsAttention?'#DC2626':'#15803D', border: `1px solid ${c.needsAttention?'#FECACA':'#BBF7D0'}` }}>{c.status}</span></td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: MAN, fontSize: 14, fontWeight: 500, color: '#0F766E' }}>View →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>{/* /inner max-width div */}

      {/* Modal: Pathway Selector */}
      {showPathwayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }} onClick={() => setShowPathwayModal(false)}>
          <div style={{ background: '#FFFFFF', borderRadius: 14, padding: 24, maxWidth: 500, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: '0 0 3px' }}>Select Reporting Pathway</h3>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>Choose an NCRP category or let CasePilot AI guide you.</p>
              </div>
              <button type="button" onClick={() => setShowPathwayModal(false)} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#94A3B8', padding: 4 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: <Icons.CreditCard />, title: 'Online Financial Fraud', desc: 'UPI debit, bank impersonation, KYC fraud, credit card fraud', category: 'Online Financial Fraud', subCategory: 'Bank Impersonation Fraud', danger: false },
                { icon: <Icons.Lock />, title: 'Other Cyber Crime', desc: 'Hacking, ransomware, corporate data leak, SIM cloning', category: 'Hacking / Defacement / Virus / Ransomware', subCategory: 'Ransomware Attack', danger: false },
                { icon: <Icons.HeartHandshake />, title: 'Women & Children Crime', desc: 'Blackmail, morphed media extortion, stalking', category: 'Women & Children Related Crime', subCategory: 'Cyber Blackmail / Sextortion', danger: true },
              ].map(p => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => { setShowPathwayModal(false); onSelectCategory(p.category, p.subCategory); onNavigateToRegister(p.category, p.subCategory); }}
                  style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#FFFFFF', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 120ms' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = p.danger ? '#DC2626' : '#0F766E'; e.currentTarget.style.background = p.danger ? '#FEF2F2' : '#F0FDFA'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#FFFFFF'; }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 7, background: p.danger ? '#FEF2F2' : '#F0FDFA', color: p.danger ? '#DC2626' : '#0F766E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{p.icon}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>{p.title}</div>
                    <div style={{ fontSize: 11.5, color: '#64748B' }}>{p.desc}</div>
                  </div>
                </button>
              ))}
              <div style={{ marginTop: 4, paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                <button type="button" onClick={() => { setShowPathwayModal(false); onStartAiIntake(); }} style={{ width: '100%', padding: '10px 14px', borderRadius: 7, border: '1.5px dashed #0F766E', background: '#F0FDFA', color: '#0F766E', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Icons.Sparkles /> Not sure? Describe what happened to CasePilot AI →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Safety Guidelines */}
      {showGuideModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }} onClick={() => setShowGuideModal(null)}>
          <div style={{ background: '#FFFFFF', borderRadius: 14, padding: 24, maxWidth: 480, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: 0 }}>{showGuideModal === 'account' ? 'Account Compromise Protocol' : 'Phishing Evidence Preservation'}</h3>
              <button type="button" onClick={() => setShowGuideModal(null)} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#94A3B8', padding: 4 }}>✕</button>
            </div>
            <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.65 }}>
              {showGuideModal === 'account' ? (
                <>
                  <p><strong>1. Immediate Password Reset:</strong> Change passwords from a verified secure device.</p>
                  <p><strong>2. Terminate All Active Sessions:</strong> Use the &quot;Log out everywhere&quot; option in account settings.</p>
                  <p><strong>3. Review Recovery Channels:</strong> Check if recovery numbers or backup emails were modified.</p>
                  <p><strong>4. Preserve Session Logs:</strong> Screenshot unauthorized IP login notifications for filing.</p>
                </>
              ) : (
                <>
                  <p><strong>1. Do Not Delete the Message:</strong> WhatsApp, SMS, or Telegram threads contain vital metadata including sender IDs.</p>
                  <p><strong>2. Extract Full URL:</strong> Copy the exact link without opening it.</p>
                  <p><strong>3. Save Financial SMS:</strong> Retain all bank debit alerts displaying the 12-digit UTR number.</p>
                </>
              )}
            </div>
            <button type="button" onClick={() => setShowGuideModal(null)} style={{ marginTop: 16, width: '100%', padding: '9px', borderRadius: 7, border: 'none', background: '#0F766E', color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}