import { Case, CaseHealth, CaseEvent } from '../types/case-model';

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
    health: 'Urgent',
    healthReason: 'Lien marker placed on suspect wallet; 48-hour bank window open. Immediate formal follow-up needed for chargeback before funds are dispersed.',
    daysStagnant: 1,
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
      {
        id: 'ev-1',
        timestamp: '04 Sep, 14:42',
        title: 'Formal NCRP Complaint Registered',
        desc: 'Complaint successfully registered on the National Cybercrime Reporting Portal. Acknowledgment token NCRP-2026-MH-981249 generated with priority routing tag to the National Cyber Fraud Reporting & Management System (CFCFRMS).',
        source: 'official',
        type: 'system',
        referenceNumber: 'NCRP-2026-MH-981249',
        statutorySection: 'Section 66D IT Act / Section 420 IPC',
        stationOrAgency: 'National Cyber Crime Reporting Portal (MHA)',
      },
      {
        id: 'ev-2',
        timestamp: '04 Sep, 14:52',
        title: 'Automated NPCI Switch Reconciliation',
        desc: 'Automated transaction switch audit verified UTR 418293847291 across the UPI reconciliation switch. Originating debit: State Bank of India; Destination credit: taskpay@okhdfcbank.',
        source: 'official',
        type: 'system',
        referenceNumber: 'NPCI/UPI/RECON-89104',
        stationOrAgency: 'National Payments Corporation of India (NPCI)',
      },
      {
        id: 'ev-3',
        timestamp: '04 Sep, 15:10',
        title: '1930 Inter-Bank Freeze Dispatch',
        desc: 'Maharashtra Cyber Fraud Command Centre alerted HDFC Bank Nodal officer under Golden Hour freeze protocol. Requisition issued to place emergency lien hold on suspect account.',
        source: 'official',
        type: 'officer',
        officerName: 'Desk Officer #14 (1930 Desk)',
        stationOrAgency: 'Maharashtra State Cyber Command Centre',
      },
      {
        id: 'ev-4',
        timestamp: '04 Sep, 15:45',
        title: 'Lien Marker Confirmed by Beneficiary Bank',
        desc: 'HDFC Bank Central Fraud Control Unit confirmed placement of emergency lien marker of ₹52,000 on beneficiary account linked to taskpay@okhdfcbank.',
        source: 'official',
        type: 'officer',
        referenceNumber: 'HDFC/LIEN/2026/0942',
        stationOrAgency: 'HDFC Bank Central Fraud Control Unit',
        outcome: 'Funds Frozen in Destination Wallet',
      },
      {
        id: 'ev-5',
        timestamp: '05 Sep, 09:30',
        title: 'Complainant In-Person Branch Submission',
        desc: 'Complainant visited SBI Bandra branch, submitted dispute form with certified bank statement, and physical copy of NCRP acknowledgment slip for chargeback processing.',
        source: 'user_reported',
        type: 'citizen',
        stationOrAgency: 'State Bank of India, Bandra West Branch',
        officerName: 'Branch Operations Desk',
      },
      {
        id: 'ev-6',
        timestamp: '05 Sep, 11:20',
        title: 'Section 91 CrPC Notice Issued by IO',
        desc: 'Investigating Officer issued formal requisition under Section 91 CrPC directing HDFC Bank to freeze debits, preserve digital audit trails, and submit suspect account opening KYC documents.',
        source: 'official',
        type: 'officer',
        officerName: 'Inspector K. Patil',
        stationOrAgency: 'Cyber Crime Police Station, Bandra, Mumbai',
        statutorySection: 'Section 91 CrPC / Section 94 BNSS',
      },
      {
        id: 'ev-7',
        timestamp: '05 Sep, 14:00',
        title: 'CasePilot Procedural Assessment',
        desc: 'Active lien hold confirmed. Beneficiary bank requires court order under Section 457 CrPC / Section 503 BNSS for release and restitution of frozen funds to the victim\'s account. Action window: 7 days before bank reviews temporary hold.',
        source: 'casepilot_assessment',
        type: 'system',
        statutorySection: 'Section 457 CrPC (Magistrate Restitution Order)',
      },
    ],
    nextActions: [
      { id: 'act-1', title: 'Call 1930 with Token', description: 'Verify lien marker status with Maharashtra Cyber Fraud Helpline.', type: 'urgent_call', actionLabel: 'Call 1930 Helpline' },
      { id: 'act-2', title: 'Download Formal NCRP FIR Slip', description: 'Present this receipt at your home bank branch for chargeback processing.', type: 'download_receipt', actionLabel: 'Download PDF Receipt' }
    ],
    createdAt: '2026-09-04T14:42:00Z',
    updatedAt: '2026-09-05T14:00:00Z'
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
    health: 'Attention Required',
    healthReason: 'Sec 79 IT Act notice sent to Meta 72h ago. Fake account is still active and requesting funds from contacts.',
    daysStagnant: 3,
    needsAttention: true,
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
      {
        id: 'ev-1',
        timestamp: '02 Sep, 18:15',
        title: 'Impersonation Complaint Lodged',
        desc: 'Complaint registered under Section 66C and 66D of the IT Act regarding unauthorized creation of fake profile @riya_cyber_xx soliciting money from contacts.',
        source: 'official',
        type: 'system',
        referenceNumber: 'NCRP-2026-KA-410291',
        stationOrAgency: 'Cyber Crime Police Station, Bengaluru Central',
      },
      {
        id: 'ev-2',
        timestamp: '02 Sep, 19:30',
        title: 'Digital Forensic Hash Archival',
        desc: 'Digital forensic team preserved full webpage archival, HTML source, and SHA-256 cryptographic hash of offending posts for evidentiary admissibility under Section 65B Indian Evidence Act.',
        source: 'official',
        type: 'officer',
        statutorySection: 'Section 65B Indian Evidence Act / Section 63 BSA',
        referenceNumber: 'DIGI-EVID-KA-8819',
        stationOrAgency: 'CID Cyber Crime Division, Karnataka',
      },
      {
        id: 'ev-3',
        timestamp: '03 Sep, 10:00',
        title: 'Section 79 Notice Served to Meta India',
        desc: 'Statutory intermediary notice under Section 79(3)(b) IT Act and Rule 3(1)(d) IT Rules 2021 dispatched to Meta India Grievance Officer directing disabling of impersonator account within 36 hours.',
        source: 'official',
        type: 'officer',
        officerName: 'SI Manjunath H.',
        stationOrAgency: 'Cyber Crime Police Station, Bengaluru Central',
        statutorySection: 'Section 79(3)(b) IT Act 2000',
      },
      {
        id: 'ev-4',
        timestamp: '04 Sep, 17:30',
        title: 'Complainant Follow-up: Account Still Active',
        desc: 'Complainant verified and logged that impersonator profile remains online and has posted new fraudulent stories requesting money transfers.',
        source: 'user_reported',
        type: 'citizen',
        stationOrAgency: 'Instagram Web Platform',
      },
      {
        id: 'ev-5',
        timestamp: '05 Sep, 10:00',
        title: 'CasePilot Assessment: Takedown Stalled',
        desc: 'Statutory 36-hour takedown window under Rule 3(1)(d) Information Technology (Intermediary Guidelines) Rules 2021 has elapsed without platform compliance. Immediate grievance escalation to Karnataka State Cyber Nodal Officer recommended.',
        source: 'casepilot_assessment',
        type: 'system',
        statutorySection: 'Rule 3(1)(d) IT Rules 2021',
      },
    ],
    nextActions: [
      { id: 'act-1', title: 'Check Profile Status', description: 'Verify if @riya_cyber_xx is still publicly accessible.', type: 'takedown_check', actionLabel: 'Verify Profile URL' }
    ],
    createdAt: '2026-09-02T18:15:00Z',
    updatedAt: '2026-09-05T10:00:00Z'
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
    health: 'Waiting',
    healthReason: 'Emergency preservation order acknowledged by Google LLC. Awaiting secondary trust verification and forensic IP triage.',
    daysStagnant: 2,
    needsAttention: false,
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
      {
        id: 'ev-1',
        timestamp: '01 Sep, 08:45',
        title: 'Intrusion & Compromise Case Allocated',
        desc: 'Case registered under Section 43 & Section 66 IT Act for unauthorized computer access, session hijacking, and international recovery number substitution.',
        source: 'official',
        type: 'system',
        referenceNumber: 'NCRP-2026-DL-192834',
        stationOrAgency: 'Special Cell IFSO, Delhi Police',
      },
      {
        id: 'ev-2',
        timestamp: '01 Sep, 11:30',
        title: 'Emergency Preservation Notice Served to Google',
        desc: 'Legal preservation requisition under Section 91 CrPC served to Google Legal Support India requesting preservation of connection logs, session identifiers, and originating IP addresses.',
        source: 'official',
        type: 'officer',
        officerName: 'DCP IFSO Special Cell Desk',
        statutorySection: 'Section 91 CrPC',
        stationOrAgency: 'Special Cell (IFSO), Dwarka, Delhi',
      },
      {
        id: 'ev-3',
        timestamp: '02 Sep, 14:00',
        title: 'Forensic Triage: RedLine Stealer Identified',
        desc: 'Device memory inspection revealed intrusion initiated via malicious browser extension infostealer malware (RedLine variant) exfiltrating active session tokens.',
        source: 'official',
        type: 'officer',
        referenceNumber: 'IFSO/LAB/2026/4102',
        stationOrAgency: 'Delhi Police Cyber Forensic Laboratory',
      },
      {
        id: 'ev-4',
        timestamp: '03 Sep, 11:30',
        title: 'Clean Antivirus Scan Submitted by Citizen',
        desc: 'Complainant uploaded clean full-system scan report proving malware removal and revoked all active OAuth application permissions.',
        source: 'user_reported',
        type: 'citizen',
        stationOrAgency: 'Complainant Primary Workstation',
      },
      {
        id: 'ev-5',
        timestamp: '04 Sep, 16:00',
        title: 'CasePilot Assessment: Enterprise Support SLA',
        desc: 'Enterprise account restoration request pending with Google Trust & Safety. Case is within standard 5-7 business day turnaround SLA window; no premature escalation required.',
        source: 'casepilot_assessment',
        type: 'system',
      },
    ],
    nextActions: [
      { id: 'act-1', title: 'Submit Clean Device Scan', description: 'Upload antivirus scan log proving trojan was removed from laptop.', type: 'upload_evidence', actionLabel: 'Upload Scan Log' }
    ],
    createdAt: '2026-09-01T08:45:00Z',
    updatedAt: '2026-09-04T16:00:00Z'
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
    health: 'Attention Required',
    healthReason: 'No Investigating Officer assigned by local cyber cell after 6 days, despite healthcare service disruption.',
    daysStagnant: 6,
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
      {
        id: 'ev-1',
        timestamp: '30 Aug, 09:30',
        title: 'National CERT-In Incident Notification',
        desc: 'Critical healthcare infrastructure cyber incident logged under mandatory 6-hour cybersecurity reporting directive. Ticket #CERT-IN-2026-8910 registered.',
        source: 'official',
        type: 'system',
        referenceNumber: 'CERT-IN-2026-8910',
        stationOrAgency: 'Indian Computer Emergency Response Team (CERT-In)',
      },
      {
        id: 'ev-2',
        timestamp: '30 Aug, 10:15',
        title: 'System Quarantine Advisory Issued',
        desc: 'Forensics desk verified clinic systems isolated from local network; official police guidelines issued strictly advising against extortion payment.',
        source: 'official',
        type: 'officer',
        stationOrAgency: 'Gujarat State Cyber Command Cell',
      },
      {
        id: 'ev-3',
        timestamp: '01 Sep, 12:00',
        title: 'Clinic Administrator Visited Cyber Police Station',
        desc: 'Clinic administrator handed over physical server audit logs, encrypted sample files, and ransom note text at Ahmedabad Cyber Crime Police Station.',
        source: 'user_reported',
        type: 'citizen',
        stationOrAgency: 'Cyber Crime Police Station, Ahmedabad',
        officerName: 'Duty Officer Desk',
      },
      {
        id: 'ev-4',
        timestamp: '05 Sep, 12:00',
        title: 'CasePilot Assessment: Investigation Delay Alert',
        desc: 'No Investigating Officer assigned by local station after 6 days, despite healthcare diagnostic disruption. Formal escalation to Gujarat Cyber Nodal Officer (SP Cyber Crime Cell) recommended.',
        source: 'casepilot_assessment',
        type: 'system',
        statutorySection: 'Section 66 & 66F IT Act (Cyber Terrorism)',
      },
    ],
    nextActions: [
      { id: 'act-1', title: 'Do NOT Pay Ransom', description: 'CERT-In and Police guidelines strictly advise against extortion payments.', type: 'takedown_check', actionLabel: 'View CERT-In Advisory' }
    ],
    createdAt: '2026-08-30T09:30:00Z',
    updatedAt: '2026-09-05T12:00:00Z'
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
    health: 'On Track',
    healthReason: 'Active investigation. Investigating Officer has dispatched CDR and tower triangulation requisitions to telecom providers.',
    daysStagnant: 0,
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
      {
        id: 'ev-1',
        timestamp: '28 Aug, 16:30',
        title: 'Offence Registered under Section 354D IPC',
        desc: 'Complaint registered for persistent cyberstalking, anonymous threat calls, and criminal intimidation.',
        source: 'official',
        type: 'officer',
        referenceNumber: 'NCRP-2026-KL-330192',
        statutorySection: 'Section 354D IPC / Section 78 BNS',
        stationOrAgency: 'Cyber Crime Police Station, Kochi',
      },
      {
        id: 'ev-2',
        timestamp: '29 Aug, 11:00',
        title: 'In-Person Statement Recorded under Sec 161 CrPC',
        desc: 'Complainant met with Investigating Officer at Kochi Cyber Cell; formal statement recorded under Section 161 CrPC; 4 audio recordings and timestamped call logs deposited.',
        source: 'user_reported',
        type: 'citizen',
        officerName: 'SI Suresh Kumar',
        stationOrAgency: 'Kochi Cyber Crime Police Station',
        statutorySection: 'Section 161 CrPC',
      },
      {
        id: 'ev-3',
        timestamp: '31 Aug, 15:45',
        title: 'CDR & Tower Triangulation Requisition',
        desc: 'Investigating Officer issued Section 91 CrPC notice to telecom service providers (BSNL & Reliance Jio) for Call Detail Records, IMEI history, and cell tower triangulation.',
        source: 'official',
        type: 'officer',
        officerName: 'SI Suresh Kumar',
        statutorySection: 'Section 91 CrPC / Section 94 BNSS',
        referenceNumber: 'KOCHI/CYBER/CDR/892',
        stationOrAgency: 'Cyber Crime Police Station, Kochi',
      },
      {
        id: 'ev-4',
        timestamp: '03 Sep, 10:30',
        title: 'Telecom Subscriber Data Received',
        desc: 'Preliminary telecom report received for suspect SIMs; tower locations pinpointed to Ernakulam North sector. Suspect identification in active progress.',
        source: 'official',
        type: 'officer',
        stationOrAgency: 'Cyber Crime Police Station, Kochi',
        outcome: 'Suspect Location Triangulated',
      },
    ],
    nextActions: [
      { id: 'act-1', title: 'Preserve Call Logs', description: 'Do not delete chat history or call duration records.', type: 'download_receipt', actionLabel: 'View Evidence Guidelines' }
    ],
    createdAt: '2026-08-28T16:30:00Z',
    updatedAt: '2026-09-03T10:30:00Z'
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
    health: 'On Track',
    healthReason: 'Emergency takedown notice dispatched. Platform compliance and forensic preservation active.',
    daysStagnant: 1,
    needsAttention: false,
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
      {
        id: 'ev-1',
        timestamp: '03 Sep, 12:10',
        title: 'Confidential Priority Assigned',
        desc: '100% Anonymous status guaranteed under NCRP guidelines. Metadata scrubbed for complainant privacy.',
        source: 'official',
        type: 'system',
        referenceNumber: 'POCSO-CONF-0091',
        stationOrAgency: 'Special Cyber Cell (Women & Child Safety), Jaipur',
      },
      {
        id: 'ev-2',
        timestamp: '03 Sep, 12:45',
        title: 'Channel Takedown Requisition Dispatched',
        desc: 'Emergency statutory notice under Rule 3(1)(b) IT Rules dispatched to Telegram FZ-LLC Nodal Officer India.',
        source: 'official',
        type: 'officer',
        statutorySection: 'Rule 3(1)(b) IT Rules 2021',
        stationOrAgency: 'CBI Special Cyber Crime Division',
      },
    ],
    nextActions: [
      { id: 'act-1', title: 'Zero Identity Disclosure', description: 'Your report is completely anonymous; no personal information will be revealed.', type: 'takedown_check', actionLabel: 'View Privacy Guarantee' }
    ],
    createdAt: '2026-09-03T12:10:00Z',
    updatedAt: '2026-09-03T14:00:00Z'
  }
];

const STORAGE_KEY = 'casepilot_active_cases_v4';

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

  static logFollowUp(
    caseId: string,
    event: {
      title: string;
      desc: string;
      officerName?: string;
      stationOrAgency?: string;
      source?: 'user_reported' | 'official' | 'casepilot_assessment';
    }
  ): Case | undefined {
    const c = this.getCaseById(caseId);
    if (!c) return undefined;

    const newEv: CaseEvent = {
      id: 'ev-user-' + Date.now(),
      timestamp:
        new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) +
        ', ' +
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      title: event.title,
      desc: event.desc,
      source: event.source || 'user_reported',
      type: 'citizen',
      officerName: event.officerName,
      stationOrAgency: event.stationOrAgency,
    };

    c.events = [newEv, ...c.events];
    c.daysStagnant = 0;
    this.saveCase(c);
    return c;
  }

  static updateCaseHealth(caseId: string, health: CaseHealth, reason?: string): Case | undefined {
    const c = this.getCaseById(caseId);
    if (!c) return undefined;
    c.health = health;
    if (reason) c.healthReason = reason;
    this.saveCase(c);
    return c;
  }

  static resolveConflict(caseId: string, conflictId: string, resolvedValue: string): void {
    const c = this.getCaseById(caseId);
    if (!c) return;

    const conf = c.conflicts.find(cf => cf.id === conflictId);
    if (conf) {
      conf.resolved = true;
      conf.resolvedValue = resolvedValue;

      if (conf.field === 'fraudAmount' && c.financial) {
        c.financial.amount = resolvedValue;
      }
      this.saveCase(c);
    }
  }
}
