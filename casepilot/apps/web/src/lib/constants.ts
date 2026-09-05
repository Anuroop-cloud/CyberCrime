// Shared label maps for the web app
export const CATEGORY_LABELS: Record<string, string> = {
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

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  acknowledged: 'Acknowledged',
  assigned: 'Assigned',
  under_investigation: 'Under Investigation',
  closed: 'Closed',
  rejected: 'Rejected',
  escalated: 'Escalated',
};

export const STATUS_BADGE: Record<string, string> = {
  draft: 'badge-draft',
  submitted: 'badge-submitted',
  acknowledged: 'badge-acknowledged',
  assigned: 'badge-assigned',
  under_investigation: 'badge-investigation',
  closed: 'badge-closed',
  rejected: 'badge-rejected',
  escalated: 'badge-escalated',
};

export const EVIDENCE_ICON: Record<string, string> = {
  'image/jpeg': '🖼️',
  'image/png': '🖼️',
  'image/webp': '🖼️',
  'application/pdf': '📄',
  'video/mp4': '🎥',
};

export const PAYMENT_MODE_LABELS: Record<string, string> = {
  upi: 'UPI',
  netbanking: 'Net Banking',
  card: 'Card',
  cash: 'Cash',
  crypto: 'Cryptocurrency',
  wallet: 'Wallet',
  other: 'Other',
};
