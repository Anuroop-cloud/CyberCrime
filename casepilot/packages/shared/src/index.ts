// =============================================================
// @casepilot/shared – All DTOs and Zod validation schemas
// Single source of truth for web + api
// =============================================================
import { z } from 'zod';

// ─── Auth ────────────────────────────────────────────────────

export const SendOtpSchema = z.object({
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
});
export type SendOtpDTO = z.infer<typeof SendOtpSchema>;

export const VerifyOtpSchema = z.object({
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});
export type VerifyOtpDTO = z.infer<typeof VerifyOtpSchema>;

export interface AuthUserDTO {
  id: string;
  mobile: string;
  name: string;
  email?: string;
}

export interface SessionPayload {
  sub: string;      // userId
  mobile: string;
  name: string;
  iat?: number;
  exp?: number;
}

// ─── Case Enums ──────────────────────────────────────────────

export const CaseCategoryEnum = z.enum([
  'upi_fraud',
  'credit_debit_fraud',
  'investment_scam',
  'phishing',
  'job_fraud',
  'matrimonial_fraud',
  'otp_fraud',
  'identity_theft',
  'sextortion',
  'ransomware',
  'cyber_harassment',
  'impersonation',
  'account_compromise',
  'other',
]);
export type CaseCategory = z.infer<typeof CaseCategoryEnum>;

export const CaseStatusEnum = z.enum([
  'draft',
  'submitted',
  'acknowledged',
  'assigned',
  'under_investigation',
  'closed',
  'rejected',
  'escalated',
]);
export type CaseStatus = z.infer<typeof CaseStatusEnum>;

export const PaymentModeEnum = z.enum([
  'upi', 'netbanking', 'card', 'cash', 'crypto', 'wallet', 'other',
]);
export type PaymentMode = z.infer<typeof PaymentModeEnum>;

// ─── Transaction ─────────────────────────────────────────────

export const TransactionSchema = z.object({
  amountLost: z.number().min(0).optional(),
  currency: z.string().default('INR'),
  transactionId: z.string().optional(),
  transactionDate: z.string().optional(),
  upiRef: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  paymentMode: PaymentModeEnum.optional(),
  additionalNotes: z.string().optional(),
});
export type TransactionDTO = z.infer<typeof TransactionSchema>;

// ─── Suspect ─────────────────────────────────────────────────

export const SuspectSchema = z.object({
  name: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  bankAccount: z.string().optional(),
  upiId: z.string().optional(),
  socialHandle: z.string().optional(),
  platform: z.string().optional(),
  ipAddress: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  additionalInfo: z.string().optional(),
});
export type SuspectDTO = z.infer<typeof SuspectSchema>;

// ─── Victim ──────────────────────────────────────────────────

export const VictimSchema = z.object({
  name: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  aadhaarLast4: z.string().max(4).optional(),
  panLast4: z.string().max(4).optional(),
  occupation: z.string().optional(),
});
export type VictimDTO = z.infer<typeof VictimSchema>;

// ─── Case ────────────────────────────────────────────────────

export const CreateCaseSchema = z.object({
  category: CaseCategoryEnum,
  title: z.string().min(5, 'Title is too short').max(200),
  description: z.string().min(10, 'Please provide more details'),
  incidentDate: z.string().optional(),
  incidentLocation: z.string().optional(),
  platform: z.string().optional(),
  transaction: TransactionSchema.optional(),
  suspects: z.array(SuspectSchema).optional(),
  victim: VictimSchema.optional(),
  status: CaseStatusEnum.default('draft'),
});
export type CreateCaseDTO = z.infer<typeof CreateCaseSchema>;

export const UpdateCaseSchema = CreateCaseSchema.partial();
export type UpdateCaseDTO = z.infer<typeof UpdateCaseSchema>;

// ─── Full Case Response ──────────────────────────────────────

export interface EvidenceFileDTO {
  id: string;
  caseId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  malwareStatus: 'pending' | 'clean' | 'flagged';
  uploadedAt: string;
  description?: string;
  url: string;
}

export interface CaseEventDTO {
  id: string;
  eventType: string;
  note?: string;
  createdAt: string;
  actor?: string;
}

export interface EscalationDTO {
  id: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_review' | 'resolved' | 'dismissed';
  requestedAt: string;
  resolvedAt?: string;
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
  submittedAt?: string;
  transaction?: TransactionDTO;
  suspects: SuspectDTO[];
  victim?: VictimDTO;
  evidence: EvidenceFileDTO[];
  events: CaseEventDTO[];
  escalations: EscalationDTO[];
  missingFieldsCount: number;
  conflictsCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Case Health ─────────────────────────────────────────────

export interface CaseHealthDTO {
  score: number;                  // 0–100
  urgency: 'low' | 'medium' | 'high' | 'critical';
  completeness: number;           // 0–100
  missingFields: string[];
  nextActions: string[];
  estimatedProcessingDays: number;
  lastActivity: string;
  riskFlags: string[];
  canEscalate: boolean;
}

// ─── AI Pipeline ─────────────────────────────────────────────

export const AIIntakeSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  caseId: z.string().optional(),
  existingData: z
    .object({
      category: CaseCategoryEnum.optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      transaction: TransactionSchema.optional(),
      suspects: z.array(SuspectSchema).optional(),
      victim: VictimSchema.optional(),
    })
    .optional(),
});
export type AIIntakeDTO = z.infer<typeof AIIntakeSchema>;

export interface AIFieldExtraction {
  field: string;
  label: string;
  value: unknown;
  confidence: number;  // 0–1
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
  updatedCase: Partial<CreateCaseDTO>;
  confidence: Record<string, number>;
  category?: CaseCategory;
  stages: AIStageResult[];
}

// ─── Notifications ───────────────────────────────────────────

export interface NotificationDTO {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'case_update' | 'evidence_requested' | 'system' | 'urgent' | 'escalation';
  read: boolean;
  caseId?: string;
  caseNumber?: string;
  createdAt: string;
}

// ─── Escalation Request ──────────────────────────────────────

export const EscalateSchema = z.object({
  caseId: z.string(),
  reason: z.string().min(10, 'Please provide a reason'),
  urgency: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
});
export type EscalateDTO = z.infer<typeof EscalateSchema>;

// ─── API Response Wrappers ───────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
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

export function maskEmail(email?: string | null): string {
  if (!email) return '';
  const [local, domain] = email.split('@');
  return local.slice(0, 2) + '***@' + domain;
}

// ─── Category Labels ─────────────────────────────────────────

export const CATEGORY_LABELS: Record<CaseCategory, string> = {
  upi_fraud: 'UPI Fraud',
  credit_debit_fraud: 'Credit/Debit Card Fraud',
  investment_scam: 'Investment Scam',
  phishing: 'Phishing',
  job_fraud: 'Job Fraud',
  matrimonial_fraud: 'Matrimonial Fraud',
  otp_fraud: 'OTP Fraud',
  identity_theft: 'Identity Theft',
  sextortion: 'Sextortion',
  ransomware: 'Ransomware',
  cyber_harassment: 'Cyber Harassment',
  impersonation: 'Impersonation',
  account_compromise: 'Account Compromise',
  other: 'Other',
};

export const STATUS_LABELS: Record<CaseStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  acknowledged: 'Acknowledged',
  assigned: 'Assigned',
  under_investigation: 'Under Investigation',
  closed: 'Closed',
  rejected: 'Rejected',
  escalated: 'Escalated',
};
