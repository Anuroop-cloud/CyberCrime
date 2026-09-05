import { Case } from '../types/case-model';

export const INITIAL_DEMO_CASES: Case[] = [
  // ── CASE 1: FINANCIAL FRAUD (Golden Hour Inter-Bank Freeze) ───────────────
  {
    id: 'CC-2026-88192',
    ackNumber: 'NCRP-2026-MH-981249',
    status: 'investigation',
    primaryCrimeType: 'FINANCIAL_FRAUD',
    subtype: 'UPI / QR Code Fraud',
    intakeMode: 'ai',
    isAnonymous: false,
    health: 'Critical',
    needsAttention: true,
    incident: {
      date: '2026-09-04',
      time: '14:30',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      whereOccurred: 'Online Banking / UPI App',
      description: 'Defrauded of ₹52,000 via a fraudulent electricity bill update message. Fraudster instructed to scan a QR code on Google Pay which triggered an unauthorized debit to taskpay@okhdfcbank.'
    },
    financial: {
      lostMoney: true,
      amount: '52,000',
      utr: '418293847291',
      bank: 'State Bank of India',
      paymentMode: 'UPI (Google Pay)',
      beneficiaryAccount: 'taskpay@okhdfcbank (HDFC Bank)'
    },
    suspect: {
      name: 'Ramesh Sharma (Fake Electricity Officer)',
      identifiers: [
        { id: '1', type: 'mobile', value: '+91 98210 49182' },
        { id: '2', type: 'upi', value: 'taskpay@okhdfcbank' }
      ]
    },
    evidence: [
      {
        id: 'ev-1',
        name: 'sbi_debit_alert.png',
        size: 245000,
        type: 'image/png',
        category: 'Bank Statement / Alert',
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        uploadedAt: '04 Sep 2026, 14:45',
        extractedMetadata: { amount: '52000', utr: '418293847291', bank: 'State Bank of India', date: '04 Sep 2026' }
      }
    ],
    fieldStatuses: {
      fraudAmount: 'confirmed',
      utrNumber: 'confirmed',
      bankName: 'confirmed'
    },
    conflicts: [],
    workflow: [
      { stageId: 'submitted', label: 'Complaint Registered', description: 'NCRP Acknowledgement Number generated.', status: 'completed', date: '04 Sep, 14:42' },
      { stageId: 'validated', label: 'Automated Audit', description: 'UTR verified with NPCI reconciliation switch.', status: 'completed', date: '04 Sep, 14:50' },
      { stageId: 'routed', label: '1930 Helpline Dispatch', description: 'Beneficiary bank nodal officer alerted within golden hour.', status: 'completed', date: '04 Sep, 15:10' },
      { stageId: 'freeze', label: 'Lien Marker Placed', description: '₹52,000 frozen in beneficiary HDFC account.', status: 'completed', date: '04 Sep, 15:45' },
      { stageId: 'investigation', label: 'Police Investigation', description: 'FIR under Sec 66D IT Act lodged at Cyber Police Station Bandra.', status: 'current', date: 'Active' },
      { stageId: 'recovery', label: 'Court Restitution Order', description: 'Sec 457 CrPC application awaiting magistrate signoff.', status: 'upcoming' }
    ],
    events: [
      { id: 'ev-1', timestamp: '04 Sep, 14:42', title: 'NCRP Formal Acknowledgment', desc: 'Complaint registered under NCRP-2026-MH-981249.', type: 'system' },
      { id: 'ev-2', timestamp: '04 Sep, 15:45', title: '1930 Inter-Bank Freeze Successful', desc: 'HDFC Bank Nodal confirmed lien marker on suspect wallet taskpay@okhdfcbank.', type: 'officer' },
      { id: 'ev-3', timestamp: '05 Sep, 11:20', title: 'IO Notice Issued', desc: 'Investigating Officer issued Sec 91 CrPC notice for suspect KYC details.', type: 'officer' }
    ],
    nextActions: [
      { id: 'act-1', title: 'Call 1930 with Token', description: 'Verify lien marker status with Maharashtra Cyber Fraud Helpline.', type: 'urgent_call', actionLabel: 'Call 1930 Helpline' },
      { id: 'act-2', title: 'Download Formal NCRP FIR Slip', description: 'Present this receipt at your home bank branch for chargeback processing.', type: 'download_receipt', actionLabel: 'Download PDF Receipt' }
    ],
    createdAt: '2026-09-04T14:42:00Z',
    updatedAt: '2026-09-05T11:20:00Z'
  },

  // ── CASE 2: INSTAGRAM IMPERSONATION (Social Media / Sec 79 Takedown) ─────
  {
    id: 'CC-2026-77341',
    ackNumber: 'NCRP-2026-KA-410291',
    status: 'assigned',
    primaryCrimeType: 'SOCIAL_MEDIA',
    subtype: 'Fake Profile / Account Impersonation',
    intakeMode: 'manual',
    isAnonymous: false,
    health: 'Good',
    needsAttention: false,
    incident: {
      date: '2026-09-02',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      whereOccurred: 'Instagram',
      description: 'An impersonation account with username @riya_cyber_xx is using my personal family photos and sending fraudulent money requests to my followers claiming emergency hospital bills.'
    },
    social: {
      platform: 'Instagram',
      offenderHandle: '@riya_cyber_xx',
      profileUrl: 'https://instagram.com/riya_cyber_xx',
      impersonatedPerson: 'Complainant (Self)',
      reportedToPlatform: 'Reported, platform did not take action'
    },
    suspect: {
      name: 'Unknown Impersonator (@riya_cyber_xx)',
      identifiers: [
        { id: '1', type: 'handle', value: '@riya_cyber_xx' },
        { id: '2', type: 'url', value: 'https://instagram.com/riya_cyber_xx' }
      ]
    },
    evidence: [
      {
        id: 'ev-2',
        name: 'fake_profile_screenshot.png',
        size: 420000,
        type: 'image/png',
        category: 'Profile Screenshot',
        sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        uploadedAt: '02 Sep 2026, 18:10'
      }
    ],
    fieldStatuses: {
      offenderHandle: 'confirmed',
      profileUrl: 'confirmed'
    },
    conflicts: [],
    workflow: [
      { stageId: 'submitted', label: 'Impersonation Registered', description: 'Complaint filed under Sec 66C/66D IT Act.', status: 'completed', date: '02 Sep, 18:15' },
      { stageId: 'validated', label: 'URL & Profile Archival', description: 'Digital hash preserved for legal admissibility.', status: 'completed', date: '02 Sep, 19:30' },
      { stageId: 'takedown', label: 'Sec 79 Intermediary Notice', description: 'Legal notice sent to Meta Grievance Officer India.', status: 'current', date: '03 Sep, 10:00' },
      { stageId: 'ip_log', label: 'Registration IP Trace', description: 'Awaiting Meta compliance for suspect IP and mobile number.', status: 'upcoming' },
      { stageId: 'resolved', label: 'Account Disabled', description: 'Confirmation from platform.', status: 'upcoming' }
    ],
    events: [
      { id: 'ev-1', timestamp: '02 Sep, 18:15', title: 'Case Registered', desc: 'Case assigned to Cyber Crime Cell Bengaluru Central.', type: 'system' },
      { id: 'ev-2', timestamp: '03 Sep, 10:00', title: 'Notice Served to Meta India', desc: 'Sec 79 IT Act Takedown Notice dispatched to grievance-officer@meta.com.', type: 'officer' }
    ],
    nextActions: [
      { id: 'act-1', title: 'Check Profile Status', description: 'Verify if @riya_cyber_xx is still publicly accessible.', type: 'takedown_check', actionLabel: 'Verify Profile URL' }
    ],
    createdAt: '2026-09-02T18:15:00Z',
    updatedAt: '2026-09-03T10:00:00Z'
  },

  // ── CASE 3: ACCOUNT HACKING (Email & 2FA Bypass) ──────────────────────────
  {
    id: 'CC-2026-65129',
    ackNumber: 'NCRP-2026-DL-192834',
    status: 'investigation',
    primaryCrimeType: 'HACKING',
    subtype: 'Email / Gmail / Outlook Hijacking',
    intakeMode: 'ai',
    isAnonymous: false,
    health: 'Attention',
    needsAttention: true,
    incident: {
      date: '2026-09-01',
      time: '03:15',
      state: 'Delhi',
      district: 'New Delhi',
      whereOccurred: 'Google Workspace Account',
      description: 'Primary business email breached. Attacker bypassed 2FA, replaced recovery phone number with an international VoIP line (+44), and initiated password resets across connected accounts.'
    },
    account: {
      platform: 'Google / Gmail',
      accountType: 'Corporate & Personal Gmail',
      username: 'anuroop.cloud@gmail.com',
      accessLostDate: '01 Sep 2026, 03:15',
      recoveryChanged: 'Yes, replaced with +44 7911 123456',
      twoFactorChanged: 'Yes, 2FA bypassed via session cookie hijacking'
    },
    suspect: {
      name: 'Intruder (IP 185.220.101.5)',
      identifiers: [
        { id: '1', type: 'mobile', value: '+44 7911 123456' },
        { id: '2', type: 'email', value: 'recovery_drop_box@mailfence.com' }
      ]
    },
    evidence: [
      {
        id: 'ev-3',
        name: 'google_security_alert_russia.png',
        size: 310000,
        type: 'image/png',
        category: 'Security Alert Email',
        sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        uploadedAt: '01 Sep 2026, 08:30'
      }
    ],
    fieldStatuses: {
      compromisedUsername: 'confirmed'
    },
    conflicts: [],
    workflow: [
      { stageId: 'submitted', label: 'Breach Registered', description: 'Logged under Sec 43/66 IT Act.', status: 'completed', date: '01 Sep, 08:45' },
      { stageId: 'preservation', label: 'Session Invalidation Notice', description: 'Emergency preservation order issued to Google LLC.', status: 'completed', date: '01 Sep, 11:00' },
      { stageId: 'forensics', label: 'IP & Session Audit', description: 'Digital forensics report identifies infostealer malware (RedLine Trojan).', status: 'current', date: 'Active' },
      { stageId: 'recovery', label: 'Account Restoration', description: 'Secondary verification scheduled with Google Trust & Safety.', status: 'upcoming' }
    ],
    events: [
      { id: 'ev-1', timestamp: '01 Sep, 08:45', title: 'Case Filed', desc: 'Case assigned to Special Cell IFSO Delhi Police.', type: 'system' },
      { id: 'ev-2', timestamp: '02 Sep, 14:00', title: 'Forensic Triage Completed', desc: 'Malware artifact identified from desktop session dump.', type: 'officer' }
    ],
    nextActions: [
      { id: 'act-1', title: 'Submit Clean Device Scan', description: 'Upload antivirus scan log proving trojan was removed from laptop.', type: 'upload_evidence', actionLabel: 'Upload Scan Log' }
    ],
    createdAt: '2026-09-01T08:45:00Z',
    updatedAt: '2026-09-02T14:00:00Z'
  },

  // ── CASE 4: RANSOMWARE (Healthcare / Server Encryption) ───────────────────
  {
    id: 'CC-2026-59102',
    ackNumber: 'NCRP-2026-GJ-881923',
    status: 'investigation',
    primaryCrimeType: 'RANSOMWARE',
    subtype: 'Ransomware (Files Encrypted / .locked)',
    intakeMode: 'ai',
    isAnonymous: false,
    health: 'Critical',
    needsAttention: true,
    incident: {
      date: '2026-08-30',
      time: '06:00',
      state: 'Gujarat',
      district: 'Ahmedabad',
      whereOccurred: 'Diagnostic Clinic Local Server',
      description: 'Clinic diagnostic server infected overnight. All patient records, X-ray archives, and billing databases renamed with extension .phobos_locked. Attacker left ransom note demanding 0.08 Bitcoin.'
    },
    device: {
      deviceType: 'Hospital / Clinic System (Windows Server 2019)',
      ransomExtension: '.phobos_locked',
      ransomDemand: '0.08 Bitcoin (approx ₹4,10,000)',
      ransomAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      systemAccessible: 'bootable'
    },
    suspect: {
      name: 'Phobos Ransomware Syndicate',
      identifiers: [
        { id: '1', type: 'email', value: 'phobos_recovery@onionmail.org' },
        { id: '2', type: 'bank', value: 'BTC: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' }
      ]
    },
    evidence: [
      {
        id: 'ev-4',
        name: 'info.hta_ransom_note.txt',
        size: 14200,
        type: 'text/plain',
        category: 'Ransom Note',
        sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        uploadedAt: '30 Aug 2026, 09:15'
      }
    ],
    fieldStatuses: {
      ransomExtension: 'confirmed',
      ransomDemand: 'confirmed'
    },
    conflicts: [],
    workflow: [
      { stageId: 'submitted', label: 'CERT-In Incident Logged', description: 'Emergency national CERT-In ticket #CERT-IN-2026-8910 opened.', status: 'completed', date: '30 Aug, 09:30' },
      { stageId: 'quarantine', label: 'System Isolation Guidance', description: 'Network disconnected to prevent lateral subnet spread.', status: 'completed', date: '30 Aug, 10:15' },
      { stageId: 'decryption', label: 'NoMoreRansom Match', description: 'Phobos variant decryptor tested by forensics team.', status: 'current', date: 'Active' },
      { stageId: 'crypto_track', label: 'Blockchain Ledger Trace', description: 'Wallet address monitored on Chainalysis for exchange cashout.', status: 'upcoming' }
    ],
    events: [
      { id: 'ev-1', timestamp: '30 Aug, 09:30', title: 'CERT-In Alert Generated', desc: 'Critical healthcare infrastructure cyber incident notification sent.', type: 'system' }
    ],
    nextActions: [
      { id: 'act-1', title: 'Do NOT Pay Ransom', description: 'CERT-In and Police guidelines strictly advise against extortion payments.', type: 'takedown_check', actionLabel: 'View CERT-In Advisory' }
    ],
    createdAt: '2026-08-30T09:30:00Z',
    updatedAt: '2026-08-31T12:00:00Z'
  },

  // ── CASE 5: CYBER HARASSMENT / STALKING (Threats on WhatsApp) ────────────
  {
    id: 'CC-2026-44219',
    ackNumber: 'NCRP-2026-KL-330192',
    status: 'assigned',
    primaryCrimeType: 'HARASSMENT',
    subtype: 'Persistent Cyberstalking / Tracking',
    intakeMode: 'manual',
    isAnonymous: false,
    health: 'Good',
    needsAttention: false,
    incident: {
      date: '2026-08-28',
      state: 'Kerala',
      district: 'Ernakulam',
      whereOccurred: 'WhatsApp & Direct Mobile Calls',
      description: 'Receiving continuous abusive and threatening calls and messages from multiple unknown numbers after blocking the primary caller. Suspect claims to know home location.'
    },
    communication: {
      channel: 'WhatsApp & Phone Calls',
      senderNumber: '+91 94001 23456, +91 94002 99881',
      immediateSafetyConcern: 'no'
    },
    suspect: {
      name: 'Unknown Caller',
      identifiers: [
        { id: '1', type: 'mobile', value: '+91 94001 23456' },
        { id: '2', type: 'mobile', value: '+91 94002 99881' }
      ]
    },
    evidence: [
      {
        id: 'ev-5',
        name: 'whatsapp_threat_audio.mp3',
        size: 1800000,
        type: 'audio/mp3',
        category: 'Audio Recording / Voicemail',
        sha256: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
        uploadedAt: '28 Aug 2026, 16:20'
      }
    ],
    fieldStatuses: {},
    conflicts: [],
    workflow: [
      { stageId: 'submitted', label: 'Complaint Registered', description: 'Sec 354D IPC cyberstalking case filed.', status: 'completed', date: '28 Aug, 16:30' },
      { stageId: 'safety', label: 'Safety Audit', description: 'Local beat officer alerted for neighborhood security.', status: 'completed', date: '28 Aug, 18:00' },
      { stageId: 'telecom', label: 'Call Detail Record (CDR) Trace', description: 'Tower location triangulation initiated with BSNL & Jio.', status: 'current', date: 'Active' },
      { stageId: 'intervention', label: 'Police Warning / Summons', description: 'Suspect identification in progress.', status: 'upcoming' }
    ],
    events: [
      { id: 'ev-1', timestamp: '28 Aug, 16:30', title: 'Case Allocated', desc: 'Case assigned to Sub-Inspector Cyber Cell Kochi.', type: 'officer' }
    ],
    nextActions: [
      { id: 'act-1', title: 'Preserve Call Logs', description: 'Do not delete chat history or call duration records.', type: 'download_receipt', actionLabel: 'View Evidence Guidelines' }
    ],
    createdAt: '2026-08-28T16:30:00Z',
    updatedAt: '2026-08-29T10:00:00Z'
  },

  // ── CASE 6: WOMEN & CHILDREN SENSITIVE (Anonymous Fast-Track Report) ─────
  {
    id: 'CC-2026-31094',
    ackNumber: 'NCRP-2026-POCSO-CONF-0091',
    status: 'investigation',
    primaryCrimeType: 'WOMEN_CHILDREN',
    subtype: 'Child Sexual Abuse Material (CSAM) / Non-Consensual Imagery',
    intakeMode: 'ai',
    isAnonymous: true,
    health: 'Critical',
    needsAttention: true,
    incident: {
      date: '2026-09-03',
      state: 'Rajasthan',
      district: 'Jaipur',
      whereOccurred: 'Telegram Channel',
      description: 'Illegal non-consensual morphed media circulating in a public Telegram channel with over 15,000 subscribers. Channel admin soliciting cryptocurrency donations for unblurred content.'
    },
    communication: {
      channel: 'Telegram Channel',
      immediateSafetyConcern: 'yes'
    },
    social: {
      platform: 'Telegram Channel / Group',
      profileUrl: 'https://t.me/cyber_leak_hub_archive'
    },
    suspect: {
      name: 'Channel Administrator (@leak_admin_india)',
      identifiers: [
        { id: '1', type: 'handle', value: '@leak_admin_india' },
        { id: '2', type: 'url', value: 'https://t.me/cyber_leak_hub_archive' }
      ]
    },
    evidence: [
      {
        id: 'ev-6',
        name: 'telegram_channel_catalog_proof.png',
        size: 580000,
        type: 'image/png',
        category: 'URL / Link of Illegal Online Content',
        sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
        uploadedAt: '03 Sep 2026, 12:05'
      }
    ],
    fieldStatuses: {},
    conflicts: [],
    workflow: [
      { stageId: 'submitted', label: 'Emergency POCSO/IT Intake', description: 'Confidential report logged with highest priority.', status: 'completed', date: '03 Sep, 12:10' },
      { stageId: 'takedown', label: 'Emergency Global Takedown', description: 'Notice served to Telegram FZ-LLC under Rule 3(1)(b) IT Rules.', status: 'completed', date: '03 Sep, 12:45' },
      { stageId: 'preservation', label: 'PhotoDNA Hash Preservation', description: 'Cryptographic hash added to national child protection database.', status: 'completed', date: '03 Sep, 14:00' },
      { stageId: 'investigation', label: 'CBI Special Cyber Unit', description: 'Financial transactions of admin wallet under active surveillance.', status: 'current', date: 'Active' },
      { stageId: 'resolved', label: 'Channel Banned & Case Concluded', description: 'Telegram banned channel globally; FIR filed.', status: 'upcoming' }
    ],
    events: [
      { id: 'ev-1', timestamp: '03 Sep, 12:10', title: 'Confidential Priority Assigned', desc: '100% Anonymous status guaranteed under NCRP guidelines.', type: 'system' },
      { id: 'ev-2', timestamp: '03 Sep, 12:45', title: 'Channel Takedown Dispatched', desc: 'Telegram Nodal Desk India acknowledged receipt.', type: 'officer' }
    ],
    nextActions: [
      { id: 'act-1', title: 'Zero Identity Disclosure', description: 'Your report is completely anonymous; no personal information will be revealed.', type: 'takedown_check', actionLabel: 'View Privacy Guarantee' }
    ],
    createdAt: '2026-09-03T12:10:00Z',
    updatedAt: '2026-09-03T14:00:00Z'
  }
];

const STORAGE_KEY = 'casepilot_active_cases_v2';

export class CasesStore {
  private static cases: Case[] | null = null;

  static getAllCases(): Case[] {
    if (typeof window === 'undefined') return INITIAL_DEMO_CASES;

    if (!this.cases) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          this.cases = JSON.parse(saved);
        } else {
          this.cases = [...INITIAL_DEMO_CASES];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cases));
        }
      } catch (e) {
        this.cases = [...INITIAL_DEMO_CASES];
      }
    }
    return this.cases || INITIAL_DEMO_CASES;
  }

  static getCaseById(id: string): Case | undefined {
    return this.getAllCases().find(c => c.id === id);
  }

  static saveCase(caseData: Case): void {
    const all = this.getAllCases();
    const idx = all.findIndex(c => c.id === caseData.id);
    if (idx >= 0) {
      all[idx] = { ...caseData, updatedAt: new Date().toISOString() };
    } else {
      all.unshift({ ...caseData, updatedAt: new Date().toISOString() });
    }
    this.cases = all;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      } catch (e) {}
    }
  }

  static resolveConflict(caseId: string, conflictId: string, resolvedValue: string): void {
    const c = this.getCaseById(caseId);
    if (!c) return;

    const conf = c.conflicts.find(cf => cf.id === conflictId);
    if (conf) {
      conf.resolved = true;
      conf.resolvedValue = resolvedValue;

      // Update the actual field if it was a fraudAmount conflict
      if (conf.field === 'fraudAmount' && c.financial) {
        c.financial.amount = resolvedValue;
      }
      this.saveCase(c);
    }
  }
}
