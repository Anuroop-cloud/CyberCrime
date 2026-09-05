import { FlowId } from '../lib/complaint-flows/types';

export type CaseStatus =
  | 'draft'
  | 'submitted'
  | 'acknowledged'
  | 'assigned'
  | 'investigation'
  | 'recovery'
  | 'resolved';

export interface SuspectIdentifier {
  id: string;
  type: 'mobile' | 'email' | 'handle' | 'bank' | 'url' | 'upi';
  value: string;
}

export interface EvidenceItem {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  sha256: string;
  uploadedAt: string;
  fileDataUrl?: string;
  extractedMetadata?: {
    amount?: string;
    utr?: string;
    bank?: string;
    date?: string;
    sender?: string;
  };
}

export interface FieldConflict {
  id: string;
  field: string;
  label: string;
  reportedValue: string;
  evidenceValue: string;
  evidenceFileName: string;
  resolved: boolean;
  resolvedValue?: string;
}

export interface CaseWorkflowStage {
  stageId: string;
  label: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
}

export type CaseHealth = 'On Track' | 'Waiting' | 'Attention Required' | 'Urgent' | 'Unknown';

export interface CaseEvent {
  id: string;
  timestamp: string;
  title: string;
  desc: string;
  source: 'official' | 'user_reported' | 'casepilot_assessment';
  type?: 'system' | 'officer' | 'citizen';
  officerName?: string;
  stationOrAgency?: string;
  followUpNote?: string;
  referenceNumber?: string;
  statutorySection?: string;
  actionTaken?: string;
  outcome?: string;
}

export interface CaseNextAction {
  id: string;
  title: string;
  description: string;
  type: 'urgent_call' | 'upload_evidence' | 'takedown_check' | 'download_receipt' | 'court_application';
  actionLabel: string;
}

export interface Case {
  id: string;
  ackNumber?: string;
  status: CaseStatus;
  primaryCrimeType: FlowId;
  subtype: string;
  intakeMode: 'manual' | 'ai';
  isAnonymous: boolean;
  health: CaseHealth;
  healthReason?: string;
  daysStagnant?: number;
  needsAttention: boolean;

  // Domain Fields
  incident: {
    date: string;
    time?: string;
    state: string;
    district: string;
    whereOccurred?: string;
    description: string;
  };

  suspect: {
    name?: string;
    identifiers: SuspectIdentifier[];
  };

  financial?: {
    lostMoney: boolean;
    amount?: string;
    utr?: string;
    bank?: string;
    paymentMode?: string;
    beneficiaryAccount?: string;
  };

  account?: {
    platform?: string;
    accountType?: string;
    username?: string;
    accessLostDate?: string;
    recoveryChanged?: string;
    twoFactorChanged?: string;
  };

  social?: {
    platform?: string;
    profileUrl?: string;
    postUrl?: string;
    offenderHandle?: string;
    impersonatedPerson?: string;
    reportedToPlatform?: string;
  };

  communication?: {
    channel?: string;
    senderNumber?: string;
    senderEmail?: string;
    phishingUrl?: string;
    claimedOrg?: string;
    credentialsEntered?: string;
    immediateSafetyConcern?: string;
  };

  device?: {
    deviceType?: string;
    ransomExtension?: string;
    ransomDemand?: string;
    ransomAddress?: string;
    systemAccessible?: string;
  };

  evidence: EvidenceItem[];
  fieldStatuses: Record<string, 'empty' | 'ai-captured' | 'user-edited' | 'confirmed'>;
  conflicts: FieldConflict[];
  workflow: CaseWorkflowStage[];
  events: CaseEvent[];
  nextActions: CaseNextAction[];

  createdAt: string;
  updatedAt: string;
}
