import React, { useState } from 'react';
import { Icons } from './Icons';
import { portalTheme } from './portalTheme';
import { SecondaryPortalNav } from './SecondaryPortalNav';

export function HelpPortalView() {
  const [helpSubTab, setHelpSubTab] = useState<'faq' | 'immediate' | 'numbers' | 'safety' | 'workflow'>('faq');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <SecondaryPortalNav
        tabs={[
          { id: 'faq', label: 'Frequently Asked Questions' },
          { id: 'immediate', label: 'What Should I Do Now?' },
          { id: 'numbers', label: 'Emergency & Helplines' },
          { id: 'safety', label: 'Cyber Safety Guidelines' },
          { id: 'workflow', label: 'How Reporting Works' },
        ]}
        activeTab={helpSubTab}
        onTabChange={setHelpSubTab}
      />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          background: '#FFFFFF',
        }}
      >
        {/* ── Tab 1: FAQs ── */}
        {helpSubTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              {
                q: 'How does reporting cybercrime on CasePilot work?',
                a: 'You do not need to memorize complicated legal sections or police jurisdiction codes. Simply explain what happened conversationally in your own words, or upload bank SMS alerts and screenshots. CasePilot automatically structures the complaint to match the National Cyber Crime Reporting Portal (NCRP) specifications.',
              },
              {
                q: 'What is the "Golden Hour" in cyber financial fraud?',
                a: 'The first 2 to 4 hours immediately following an unauthorized transaction are vital. Dialing 1930 or lodging your complaint immediately triggers an electronic freeze alert across RBI inter-bank nodal gateways before scammers can withdraw cash at ATMs or transfer to mules.',
              },
              {
                q: 'Can I report sensitive crimes anonymously?',
                a: 'Yes. For cases involving women, minors, cyber blackmail, or sensitive extortions, the portal offers a confidential reporting pathway where your personal contact information is protected from public disclosure.',
              },
              {
                q: 'What information should I keep ready before submitting?',
                a: 'For financial frauds: Your bank name, account number, 12-digit UTR/transaction number, and the scammer UPI/VPA handle. For social media or blackmail: Scammer profile links, phone numbers, and unedited screenshot proof.',
              },
            ].map((faq, idx) => (
              <div key={idx} style={portalTheme.containers.sectionCard}>
                <div style={portalTheme.containers.cardHeader}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>{faq.q}</div>
                </div>
                <div style={{ padding: '14px 20px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab 2: Immediate Steps ── */}
        {helpSubTab === 'immediate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...portalTheme.containers.sectionCard, border: '1px solid #FECACA' }}>
              <div style={{ ...portalTheme.containers.cardHeader, background: '#FEF2F2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#991B1B', fontWeight: 700, fontSize: 13.5 }}>
                  <Icons.AlertTriangle /> If you lost money in the last 24 hours:
                </div>
              </div>
              <div style={portalTheme.containers.cardBody}>
                <ol style={{ fontSize: 13, color: '#7F1D1D', margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                  <li><strong>Call 1930 immediately:</strong> Report the 12-digit UTR to trigger an inter-bank fund hold.</li>
                  <li><strong>Freeze your accounts:</strong> Contact your bank&apos;s customer support to block net banking, cards, and UPI.</li>
                  <li><strong>Do NOT entertain callback scams:</strong> Scammers often call back posing as &quot;cyber police refund agents&quot;. Never pay a &quot;refund release fee&quot;.</li>
                  <li><strong>Submit your complaint here:</strong> Complete the Register form so official police investigation commences.</li>
                </ol>
              </div>
            </div>

            <div style={{ ...portalTheme.containers.sectionCard, border: '1px solid #BBF7D0' }}>
              <div style={{ ...portalTheme.containers.cardHeader, background: '#F0FDF4' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534', fontWeight: 700, fontSize: 13.5 }}>
                  <Icons.ShieldAlert /> If someone is blackmailing you online:
                </div>
              </div>
              <div style={portalTheme.containers.cardBody}>
                <ol style={{ fontSize: 13, color: '#14532D', margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                  <li><strong>Do NOT transfer money:</strong> Paying money never stops extortion; it only increases extortion demands.</li>
                  <li><strong>Preserve evidence:</strong> Take full screenshots of usernames, phone numbers, and chat threats before blocking.</li>
                  <li><strong>Lock profile privacy:</strong> Set your social media profiles to private and restrict tag permissions.</li>
                  <li><strong>File under Women & Children pathway:</strong> You can lodge an anonymous complaint with state cyber police.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: Emergency & Helplines (Data Table / Clean Grid) ── */}
        {helpSubTab === 'numbers' && (
          <div style={portalTheme.containers.sectionCard}>
            <div style={portalTheme.containers.cardHeader}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                Official Government & Police Helplines
              </span>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>Toll-Free 24x7 Direct Lines</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={portalTheme.table.table}>
                <thead>
                  <tr style={portalTheme.table.theadRow}>
                    <th style={{ ...portalTheme.table.th, width: '32%' }}>Helpline Agency</th>
                    <th style={{ ...portalTheme.table.th, width: '22%' }}>Dial Number</th>
                    <th style={{ ...portalTheme.table.th, width: '46%' }}>Jurisdiction & Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'National Cyber Fraud Helpline', num: '1930', desc: 'Urgent electronic fund freeze & inter-bank gateway holds' },
                    { name: 'National Emergency Response (All-India)', num: '112', desc: 'Unified emergency response for police, fire, and medical' },
                    { name: 'National Women Helpline', num: '1091', desc: 'Dedicated 24x7 assistance for women safety & cyber stalking' },
                    { name: 'National Childline', num: '1098', desc: 'Protection and reporting of crimes against children & minors' },
                  ].map((item, i) => (
                    <tr key={i} style={portalTheme.table.tbodyRow}>
                      <td style={portalTheme.table.td}>
                        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 13 }}>{item.name}</div>
                      </td>
                      <td style={portalTheme.table.td}>
                        <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 800, color: '#0F766E' }}>
                          {item.num}
                        </span>
                      </td>
                      <td style={portalTheme.table.td}>
                        <span style={{ fontSize: 12.5, color: '#475569' }}>{item.desc}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 4: Cyber Safety Guidelines ── */}
        {helpSubTab === 'safety' && (
          <div style={portalTheme.containers.sectionCard}>
            <div style={portalTheme.containers.cardHeader}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                Key Prevention Principles
              </span>
            </div>
            <div style={portalTheme.containers.cardBody}>
              <ul style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: 0, paddingLeft: 20 }}>
                <li>Banks never ask for your PIN, OTP, or CVV over phone calls, SMS, or WhatsApp.</li>
                <li>Entering your UPI PIN always <strong>deducts</strong> money from your account, never receives money.</li>
                <li>Never install remote screen sharing apps (AnyDesk, TeamViewer, RustDesk) on the instructions of callers.</li>
                <li>Enable Two-Factor Authentication (2FA) on all email, banking, and social media accounts.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── Tab 5: How Reporting Works ── */}
        {helpSubTab === 'workflow' && (
          <div style={portalTheme.containers.sectionCard}>
            <div style={portalTheme.containers.cardHeader}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                Official National Cybercrime Reporting Workflow
              </span>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { step: '1. Incident Intake', desc: 'Citizen inputs incident details or chats with CasePilot AI assistant.' },
                  { step: '2. Evidence Verification', desc: 'AI OCR extracts 12-digit UTR numbers and verifies amount match.' },
                  { step: '3. NCRP Registration', desc: 'Official statutory cybercrime complaint is lodged with state police.' },
                  { step: '4. Bank Hold & FIR', desc: '1930 alert sent to freeze beneficiary accounts and police investigation begins.' },
                ].map((s, idx) => (
                  <div key={idx} style={{ padding: 14, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F766E', marginBottom: 6 }}>{s.step}</div>
                    <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
