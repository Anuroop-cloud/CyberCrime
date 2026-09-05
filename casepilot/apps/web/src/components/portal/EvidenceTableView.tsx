import React, { useRef } from 'react';
import { Icons } from './Icons';
import { portalTheme } from './portalTheme';

export interface EvidenceItem {
  id: string;
  fileName: string;
  fileSize: string;
  type: string;
  extractedText: string;
  detectedAmount?: string;
  detectedUtr?: string;
  detectedUpi?: string;
}

interface Props {
  evidenceList: EvidenceItem[];
  onUpload: (fileName: string, simulatedAmt?: string, simulatedUtr?: string) => void;
  onRemove: (id: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function EvidenceTableView({ evidenceList, onUpload, onRemove, onNext, onPrev }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Section 1: Upload Dropzone Container ── */}
      <div style={portalTheme.containers.sectionCard}>
        <div style={portalTheme.containers.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icons.Attach />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
              Upload Supporting Evidence
            </span>
          </div>
          <span style={{ fontSize: 11, color: '#64748B' }}>
            Supported formats: PDF, JPG, PNG, WEBP (Max 10MB)
          </span>
        </div>

        <div style={{ padding: '24px 28px' }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed #CBD5E1',
              borderRadius: 8,
              padding: '28px 20px',
              textAlign: 'center',
              background: '#F8FAFC',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#0F766E';
              e.currentTarget.style.background = '#F0FDFA';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.background = '#F8FAFC';
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files?.[0]) {
                  onUpload(e.target.files[0].name, '52000', '418293847291');
                }
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, color: '#0F766E' }}>
              <Icons.Attach />
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>
              Drag and drop case files here, or <span style={{ color: '#0F766E', textDecoration: 'underline' }}>browse</span>
            </div>
            <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 4, maxWidth: 520, margin: '4px auto 0' }}>
              Upload bank statements, UPI debit screenshots, phishing SMS, WhatsApp threat chats, or scam website links.
              CasePilot AI runs optical character recognition (OCR) to automatically extract 12-digit UTRs and timestamps.
            </div>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onUpload('sbi_debit_alert.png', '52000', '418293847291');
                }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: 6,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#0F766E',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#0F766E';
                  e.currentTarget.style.background = '#F0FDFA';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                <Icons.Plus /> Simulate Bank SMS Screenshot (₹52,000)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Structured Evidence Data Table (Section 12 Benchmark) ── */}
      <div style={portalTheme.containers.sectionCard}>
        <div style={portalTheme.containers.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
              Attached Case Evidence
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: evidenceList.length > 0 ? '#DCFCE7' : '#F1F5F9',
                color: evidenceList.length > 0 ? '#15803D' : '#64748B',
                padding: '2px 8px',
                borderRadius: 12,
              }}
            >
              {evidenceList.length} {evidenceList.length === 1 ? 'document' : 'documents'}
            </span>
          </div>

          <div style={{ fontSize: 11.5, color: '#64748B' }}>
            NCRP Evidence Rules: Files must be authentic and unaltered
          </div>
        </div>

        {evidenceList.length === 0 ? (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748B' }}>
            <div style={{ color: '#94A3B8', marginBottom: 6 }}>
              <Icons.FileText />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>No evidence attached yet</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
              Upload screenshots or bank statements above to verify financial discrepancies.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={portalTheme.table.table}>
              <thead>
                <tr style={portalTheme.table.theadRow}>
                  <th style={{ ...portalTheme.table.th, width: '28%' }}>Document / File</th>
                  <th style={{ ...portalTheme.table.th, width: '16%' }}>Type</th>
                  <th style={{ ...portalTheme.table.th, width: '32%' }}>OCR Extracted Data</th>
                  <th style={{ ...portalTheme.table.th, width: '14%' }}>Status</th>
                  <th style={{ ...portalTheme.table.th, width: '10%', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {evidenceList.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    style={portalTheme.table.tbodyRow}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
                  >
                    <td style={portalTheme.table.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            background: '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0F766E',
                            flexShrink: 0,
                          }}
                        >
                          <Icons.FileText />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 13 }}>{item.fileName}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>{item.fileSize}</div>
                        </div>
                      </div>
                    </td>

                    <td style={portalTheme.table.td}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: '#F1F5F9',
                          color: '#334155',
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        {item.fileName.endsWith('.pdf') ? 'Bank Statement' : 'Screenshot / Alert'}
                      </span>
                    </td>

                    <td style={portalTheme.table.td}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {item.detectedAmount && (
                          <div style={{ fontSize: 11.5, color: '#0F172A', fontWeight: 600 }}>
                            Extracted Amount:{' '}
                            <span style={{ color: '#0F766E' }}>₹{Number(item.detectedAmount).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {item.detectedUtr && (
                          <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>
                            UTR: {item.detectedUtr}
                          </div>
                        )}
                        {!item.detectedAmount && !item.detectedUtr && (
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>Verified document checksum</div>
                        )}
                      </div>
                    </td>

                    <td style={portalTheme.table.td}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: '#DCFCE7',
                          color: '#15803D',
                          border: '1px solid #BBF7D0',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Icons.Check /> Processed
                      </span>
                    </td>

                    <td style={{ ...portalTheme.table.td, textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        title="Remove evidence"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          padding: '4px 6px',
                          borderRadius: 4,
                          transition: 'color 120ms ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                      >
                        <Icons.Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Navigation Footer ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {onPrev && (
          <button
            type="button"
            onClick={onPrev}
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
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            style={{
              background: '#0F766E',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px 24px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              marginLeft: 'auto',
              boxShadow: '0 1px 3px rgba(15, 118, 110, 0.2)',
            }}
          >
            Save & Next: Review & Submit →
          </button>
        )}
      </div>
    </div>
  );
}
