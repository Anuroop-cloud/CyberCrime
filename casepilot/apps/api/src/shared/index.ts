// Self-contained type definitions for the API.
// Mirrors packages/shared/src/index.ts but without Zod dependency issues.
// (Zod schemas are still used in packages/shared for the web; API uses class-validator instead)

// ─── Auth ────────────────────────────────────────────────────
export interface SessionPayload {
  sub: string;
  mobile: string;
  name: string;
  iat?: number;
  exp?: number;
}

// ─── Case Enums ──────────────────────────────────────────────
export type CaseCategory =
  | 'upi_fraud' | 'credit_debit_fraud' | 'investment_scam' | 'phishing'
  | 'job_fraud' | 'matrimonial_fraud' | 'otp_fraud' | 'identity_theft'
  | 'sextortion' | 'ransomware' | 'cyber_harassment' | 'impersonation'
  | 'account_compromise' | 'other';

export type CaseStatus =
  | 'draft' | 'submitted' | 'acknowledged' | 'assigned'
  | 'under_investigation' | 'closed' | 'rejected' | 'escalated';

// ─── DTOs ────────────────────────────────────────────────────
export interface TransactionDTO {
  amountLost?: number;
  currency?: string;
  transactionId?: string;
  transactionDate?: string;
  upiRef?: string;
  bankName?: string;
  accountNumber?: string;
  paymentMode?: string;
}

export interface SuspectDTO {
  name?: string;
  mobile?: string;
  email?: string;
  bankAccount?: string;
  upiId?: string;
  socialHandle?: string;
  platform?: string;
}

export interface VictimDTO {
  name?: string;
  mobile?: string;
  email?: string;
  occupation?: string;
}

export interface EvidenceFileDTO {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  malwareStatus: 'pending' | 'clean' | 'flagged';
  uploadedAt: string;
}

export interface CaseDTO {
  id: string;
  caseNumber: string;
  userId: string;
  category: CaseCategory;
  status: CaseStatus;
  title: string;
  description: string;
  incidentDate?: string;
  incidentLocation?: string;
  platform?: string;
  isDraft: boolean;
  transaction?: TransactionDTO;
  suspects: SuspectDTO[];
  victim?: VictimDTO;
  evidence: EvidenceFileDTO[];
  createdAt: string;
  updatedAt: string;
}

// ─── AI Pipeline ─────────────────────────────────────────────
export interface AIIntakeDTO {
  message: string;
  caseId?: string;
  existingData?: Partial<CaseDTO>;
}

export interface AIFieldExtraction {
  field: string;
  label: string;
  value: unknown;
  confidence: number;
  source: 'ai' | 'user' | 'system';
}

export interface AIStageResult {
  stage: string;
  success: boolean;
  data: unknown;
  tokensUsed?: number;
  durationMs?: number;
}

export interface AIIntakeResponse {
  message: string;
  extractedFields: AIFieldExtraction[];
  missingFields: Array<{ field: string; label: string; required: boolean; promptText: string }>;
  conflicts: Array<{ field: string; existing: unknown; new: unknown }>;
  suggestedEvidence: string[];
  followUpQuestion: string;
  updatedCase: Partial<CaseDTO>;
  confidence: Record<string, number>;
  category?: CaseCategory;
  stages: AIStageResult[];
}

// ─── Masking Helpers ─────────────────────────────────────────
export function maskMobile(mobile?: string | null): string {
  if (!mobile) return '';
  return mobile.replace(/^(\d{2})\d{6}(\d{2})$/, '$1XXXXXX$2');
}

export function maskAccount(account?: string | null): string {
  if (!account) return '';
  return 'XXXX XXXX ' + account.slice(-4);
}

// ─── Validation helpers (used by auth service) ────────────────
export const SendOtpSchema = {
  parse: (data: { mobile: string }) => {
    if (!/^[6-9]\d{9}$/.test(data.mobile))
      throw new Error('Enter a valid 10-digit Indian mobile number');
    return data;
  },
};

export const VerifyOtpSchema = {
  parse: (data: { mobile: string; otp: string }) => {
    if (!/^[6-9]\d{9}$/.test(data.mobile))
      throw new Error('Enter a valid 10-digit Indian mobile number');
    if (data.otp.length !== 6) throw new Error('OTP must be exactly 6 digits');
    return data;
  },
};
