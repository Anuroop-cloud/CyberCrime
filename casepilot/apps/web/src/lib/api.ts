// ============================================================
// API client for CasePilot – calls NestJS on port 4000
// ============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cp_token');
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts: { formData?: FormData } = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!opts.formData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: opts.formData ?? (body ? JSON.stringify(body) : undefined),
  });

  if (res.status === 401) {
    localStorage.removeItem('cp_token');
    localStorage.removeItem('cp_user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? 'Request failed');
  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────
export const api = {
  auth: {
    sendOtp: (mobile: string) => request<{ message: string; demo?: boolean }>('POST', '/auth/otp/send', { mobile }),
    verifyOtp: (mobile: string, otp: string) =>
      request<{ token: string; user: Record<string, unknown> }>('POST', '/auth/otp/verify', { mobile, otp }),
    logout: () => request('POST', '/auth/logout'),
  },

  users: {
    me: () => request<Record<string, unknown>>('GET', '/users/me'),
    updateProfile: (data: { name?: string; email?: string }) => request('PATCH', '/users/me', data),
  },

  cases: {
    list: (params?: { status?: string; page?: number; limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.status) q.set('status', params.status);
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      return request<{ data: CaseSummary[]; total: number }>('GET', `/cases?${q}`);
    },
    stats: () => request<CaseStats>('GET', '/cases/stats'),
    findOne: (id: string) => request<CaseDetail>('GET', `/cases/${id}`),
    track: (caseNumber: string) => request<CaseDetail>('GET', `/cases/track/${caseNumber}`),
    create: (data: Record<string, unknown>) => request<{ id: string; caseNumber: string }>('POST', '/cases', data),
    update: (id: string, data: Record<string, unknown>) => request('PATCH', `/cases/${id}`, data),
    submit: (id: string) => request('POST', `/cases/${id}/submit`),
    escalate: (id: string, data: { reason: string; urgency?: string }) =>
      request('POST', `/cases/${id}/escalate`, data),
  },

  ai: {
    intake: (data: { message: string; caseId?: string }) => request<AIIntakeResult>('POST', '/ai/intake', data),
    health: (caseId: string) => request<CaseHealth>('GET', `/ai/cases/${caseId}/health`),
    escalationGuidance: (caseId: string) => request<EscalationGuidance>('GET', `/ai/cases/${caseId}/escalation-guidance`),
  },

  evidence: {
    list: (caseId: string) => request<EvidenceFile[]>('GET', `/evidence/cases/${caseId}`),
    upload: (caseId: string, file: File, description?: string) => {
      const fd = new FormData();
      fd.append('file', file);
      if (description) fd.append('description', description);
      return request<EvidenceFile>('POST', `/evidence/cases/${caseId}/upload`, undefined, { formData: fd });
    },
    delete: (evidenceId: string) => request('DELETE', `/evidence/${evidenceId}`),
    downloadUrl: (evidenceId: string) => `${API_BASE}/evidence/${evidenceId}/download?token=${getToken()}`,
  },

  notifications: {
    list: () => request<{ notifications: Notification[]; unreadCount: number }>('GET', '/notifications'),
    markRead: (id: string) => request('PATCH', `/notifications/${id}/read`),
    markAllRead: () => request('PATCH', '/notifications/read-all'),
  },

  escalations: {
    list: () => request<Escalation[]>('GET', '/escalations'),
  },
};

// ── Types ─────────────────────────────────────────────────────
export interface CaseSummary {
  id: string;
  caseNumber: string;
  category: string;
  status: string;
  title: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  transaction?: { amountLost?: number; currency: string };
  _count?: { evidence: number; suspects: number };
}

export interface CaseDetail {
  id: string;
  caseNumber: string;
  category: string;
  status: string;
  title: string;
  description: string;
  incidentDate?: string;
  incidentLocation?: string;
  platform?: string;
  isDraft: boolean;
  submittedAt?: string;
  transaction?: Record<string, unknown>;
  suspects: Record<string, unknown>[];
  victim?: Record<string, unknown>;
  evidence: EvidenceFile[];
  events: CaseEvent[];
  escalations: Escalation[];
  missingFieldsCount: number;
  conflictsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStats {
  total: number;
  draft: number;
  submitted: number;
  acknowledged: number;
  assigned: number;
  underInv: number;
  closed: number;
  escalated: number;
  totalAmountLost: number;
}

export interface AIIntakeResult {
  message: string;
  extractedFields: Array<{ field: string; label: string; value: unknown; confidence: number }>;
  missingFields: Array<{ field: string; label: string; required: boolean; promptText: string }>;
  suggestedEvidence: string[];
  followUpQuestion: string;
  updatedCase: Record<string, unknown>;
  confidence: Record<string, number>;
  category?: string;
}

export interface CaseHealth {
  score: number;
  urgency: string;
  completeness: number;
  missingFields: string[];
  nextActions: string[];
  estimatedProcessingDays: number;
  riskFlags: string[];
  canEscalate: boolean;
}

export interface EscalationGuidance {
  shouldEscalate: boolean;
  reason: string;
  urgency: string;
  steps: string[];
}

export interface EvidenceFile {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  malwareStatus: 'pending' | 'clean' | 'flagged';
  uploadedAt: string;
  description?: string;
}

export interface CaseEvent {
  id: string;
  eventType: string;
  note?: string;
  createdAt: string;
}

export interface Escalation {
  id: string;
  reason: string;
  urgency: string;
  status: string;
  requestedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  caseId?: string;
  caseNumber?: string;
  createdAt: string;
}
