import { ComplaintFlowConfig, FlowId } from './types';

// Common Indian States & UTs for NCRP complaints
export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const COMPLAINT_FLOWS: Record<FlowId, ComplaintFlowConfig> = {
  // ── 1. FINANCIAL FRAUD FLOW ──────────────────────────────────────────────
  FINANCIAL_FRAUD: {
    id: 'FINANCIAL_FRAUD',
    title: 'Financial Fraud & Online Scams',
    description: 'UPI, Net Banking, Credit/Debit Card, OTP Theft, Investment or KYC frauds involving monetary loss.',
    ncrpCategory: 'Financial Fraud',
    subcategories: [
      'UPI / QR Code Fraud',
      'SIM Swap / OTP Theft',
      'Fake Investment / Crypto Trading Scam',
      'Telegram Task / Part-time Job Fraud',
      'Electricity Bill / KYC APK Fraud',
      'Loan App Extortion / Illegal Lending',
      'Credit / Debit Card Fraud / ATM Skimming',
      'E-Commerce / OLX / QR Code Advance Fee'
    ],
    evidenceTypes: [
      'Bank Account Statement (PDF/Image)',
      'UPI / Net Banking Transaction Screenshot',
      'SMS Alert with UTR / Reference Number',
      'WhatsApp / Telegram Chat Export',
      'Fraudulent APK / App Screenshot',
      'Payment Gateway / Merchant Receipt'
    ],
    workflowStages: [
      { id: 'submitted', label: 'Complaint Registered', description: 'NCRP Acknowledgement Number generated and logged in state cyber cell.', authority: 'CasePilot NCRP Engine', typicalDuration: 'Immediate' },
      { id: 'validated', label: 'Automated Audit', description: 'UTR verification and golden-hour transaction validity check.', authority: 'Cyber Crime Investigation Unit', typicalDuration: '10–30 mins' },
      { id: 'routed', label: 'Bank Routing (1930 / I4C)', description: 'Direct API dispatch to beneficiary bank nodal officer and payment gateway.', authority: 'Indian Cybercrime Coordination Centre (I4C)', typicalDuration: 'Golden Hour (< 2h)' },
      { id: 'freeze', label: 'Inter-Bank Account Freeze', description: 'Lien marker placed on suspect account balance to prevent cash withdrawal.', authority: 'Beneficiary Bank Nodal Desk', typicalDuration: '1–4 hours' },
      { id: 'investigation', label: 'Police Investigation', description: 'Investigating Officer (IO) assigned; notice under Sec 91 CrPC issued.', authority: 'State Cyber Crime Police Station', typicalDuration: '1–3 weeks' },
      { id: 'recovery', label: 'Court Order & Restitution', description: 'Magistrate order under Sec 457 CrPC for release of frozen funds.', authority: 'District Court / Judicial Magistrate', typicalDuration: '1–2 months' },
      { id: 'resolved', label: 'Case Concluded', description: 'Restitution processed or charge sheet filed.', authority: 'State Police / Cyber Cell', typicalDuration: 'Closure' }
    ],
    tabs: [
      {
        id: 'incident',
        label: 'Complaint & Incident',
        shortLabel: 'Incident',
        description: 'Where, when, and how the financial fraud occurred',
        isMandatory: true,
        sections: [
          {
            id: 'classification',
            title: 'Category & Subcategory',
            fields: [
              {
                id: 'subCategory',
                label: 'Fraud Pathway / Subcategory',
                type: 'select',
                required: true,
                options: [
                  { value: 'UPI / QR Code Fraud', label: 'UPI / QR Code Fraud' },
                  { value: 'Fake Investment / Crypto Trading Scam', label: 'Fake Investment / Crypto Trading Scam' },
                  { value: 'Telegram Task / Part-time Job Fraud', label: 'Telegram Task / Part-time Job Fraud' },
                  { value: 'Electricity Bill / KYC APK Fraud', label: 'Electricity Bill / KYC APK Fraud' },
                  { value: 'Credit / Debit Card Fraud', label: 'Credit / Debit Card Fraud' },
                  { value: 'SIM Swap / OTP Theft', label: 'SIM Swap / OTP Theft' }
                ]
              }
            ]
          },
          {
            id: 'time_place',
            title: 'Incident Occurrence Details',
            fields: [
              { id: 'incidentDate', label: 'Date of Incident', type: 'date', required: true },
              { id: 'incidentTime', label: 'Approximate Time', type: 'time', required: true },
              {
                id: 'stateUt',
                label: 'State / Union Territory',
                type: 'select',
                required: true,
                options: INDIAN_STATES.map(s => ({ value: s, label: s }))
              },
              { id: 'district', label: 'District', type: 'text', placeholder: 'e.g. Kamrup Metro / Bengaluru Urban', required: true },
              { id: 'policeStation', label: 'Nearest Police Station (Optional)', type: 'text', placeholder: 'e.g. Cyber Crime Police Station' }
            ]
          },
          {
            id: 'description_sec',
            title: 'Incident Description',
            fields: [
              {
                id: 'incidentDescription',
                label: 'Chronological Narrative of What Happened',
                type: 'textarea',
                placeholder: 'Describe step-by-step: who contacted you, what instructions they gave, how money was debited...',
                required: true,
                helperText: 'Be specific about bank names, phone numbers, apps downloaded, or links clicked.'
              }
            ]
          }
        ]
      },
      {
        id: 'financial',
        label: 'Financial Details',
        shortLabel: 'Financial',
        description: 'Crucial bank transaction details required for 1930 / I4C inter-bank freeze',
        isMandatory: true,
        sections: [
          {
            id: 'loss_summary',
            title: 'Fraud Amount & Mode',
            fields: [
              { id: 'fraudAmount', label: 'Total Defrauded Amount (INR ₹)', type: 'currency', placeholder: '52000', required: true },
              {
                id: 'paymentMode',
                label: 'Mode of Payment',
                type: 'select',
                required: true,
                options: [
                  { value: 'UPI', label: 'UPI (GPay, PhonePe, Paytm, BHIM)' },
                  { value: 'Net Banking / IMPS / NEFT', label: 'Net Banking (IMPS / NEFT / RTGS)' },
                  { value: 'Credit Card', label: 'Credit Card' },
                  { value: 'Debit Card / ATM', label: 'Debit Card / ATM' },
                  { value: 'Wallet', label: 'Digital Wallet' }
                ]
              },
              { id: 'bankName', label: 'Your Bank / Debited Account Institution', type: 'text', placeholder: 'e.g. State Bank of India', required: true }
            ]
          },
          {
            id: 'transaction_identifiers',
            title: 'Transaction Identifiers (Golden Hour Freeze)',
            fields: [
              {
                id: 'utrNumber',
                label: '12-Digit UTR / Transaction Reference Number',
                type: 'text',
                placeholder: 'e.g. 418293847291',
                required: true,
                helperText: 'Found on your SMS alert or bank statement. This allows beneficiary bank to locate and freeze stolen funds.'
              },
              { id: 'beneficiaryAccount', label: 'Suspect Recipient Account / UPI VPA', type: 'text', placeholder: 'e.g. fraudster@okhdfcbank or 982101928392' }
            ]
          }
        ]
      },
      {
        id: 'suspect',
        label: 'Suspect Details',
        shortLabel: 'Suspect',
        description: 'Known identifiers of the perpetrator (phone, UPI, website, Telegram)',
        isMandatory: false,
        sections: [
          {
            id: 'suspect_info',
            title: 'Suspect Contact & Accounts',
            fields: [
              { id: 'suspectName', label: 'Suspect Name / Alias (if known)', type: 'text', placeholder: 'e.g. Ramesh Kumar / SBI Customer Support' },
              { id: 'suspectIdentifiers', label: 'Suspect Phone, Email, Telegram or UPI IDs', type: 'identifiers_list' }
            ]
          }
        ]
      },
      {
        id: 'evidence',
        label: 'Evidence & Proof',
        shortLabel: 'Evidence',
        description: 'Upload transaction slips, bank statements, chat logs, or fake website screenshots',
        isMandatory: true,
        sections: [
          {
            id: 'evidence_upload_sec',
            title: 'Uploaded Evidence Files',
            fields: []
          }
        ]
      },
      {
        id: 'review',
        label: 'Review & Submit',
        shortLabel: 'Review',
        description: 'Verify all captured data and formal legal declaration before filing to NCRP',
        isMandatory: true,
        sections: []
      }
    ]
  },

  // ── 2. SOCIAL MEDIA / IMPERSONATION FLOW ─────────────────────────────────
  SOCIAL_MEDIA: {
    id: 'SOCIAL_MEDIA',
    title: 'Social Media Crimes & Impersonation',
    description: 'Fake profiles, identity theft on Instagram/Facebook/LinkedIn, cyber defamation, or unauthorized picture sharing.',
    ncrpCategory: 'Other Cyber Crime',
    subcategories: [
      'Fake Profile / Account Impersonation',
      'Morphed Pictures / Video Circulation',
      'Defamation / Trolling on Social Media',
      'Unauthorized Sharing of Private Media',
      'Account Clone / Identity Hijacking'
    ],
    evidenceTypes: [
      'Screenshot of Fake Profile / URL',
      'Screenshot of Impersonating Posts / Stories',
      'Direct Messages (DMs) / Chat Export',
      'Original Photo / Proof of True Identity',
      'Platform Reporting Reference / Ticket Number'
    ],
    workflowStages: [
      { id: 'submitted', label: 'Complaint Registered', description: 'Social media incident logged under Sec 66C/66D IT Act.', authority: 'CasePilot Legal Engine', typicalDuration: 'Immediate' },
      { id: 'validated', label: 'URL & Profile Archival', description: 'Timestamped digital verification and metadata preservation.', authority: 'Cyber Forensics Cell', typicalDuration: '2–6 hours' },
      { id: 'takedown', label: 'Intermediary Notice (Sec 79 IT Act)', description: 'Legal notice served to Meta/Google/X Grievance Officer for urgent content takedown.', authority: 'State Cyber Nodal Officer', typicalDuration: '24–36 hours' },
      { id: 'ip_log', label: 'IP & Login Data Request', description: 'Sec 91 CrPC notice to intermediary for suspect registration IP, IMEI, and email.', authority: 'Investigating Officer', typicalDuration: '7–14 days' },
      { id: 'action', label: 'Perpetrator Identified', description: 'Action initiated against perpetrator based on telecom and digital ISP logs.', authority: 'Local Police Station', typicalDuration: '2–4 weeks' },
      { id: 'resolved', label: 'Content Taken Down & Closed', description: 'Offending account disabled; final compliance report filed.', authority: 'Cyber Crime Police', typicalDuration: 'Closure' }
    ],
    tabs: [
      {
        id: 'incident',
        label: 'Complaint & Incident',
        shortLabel: 'Incident',
        description: 'Details of the social media offense',
        isMandatory: true,
        sections: [
          {
            id: 'social_classification',
            title: 'Social Media Crime Nature',
            fields: [
              {
                id: 'subCategory',
                label: 'Nature of Offense',
                type: 'select',
                required: true,
                options: [
                  { value: 'Fake Profile / Account Impersonation', label: 'Fake Profile / Account Impersonation' },
                  { value: 'Morphed Pictures / Video Circulation', label: 'Morphed Pictures / Video Circulation' },
                  { value: 'Defamation / Trolling on Social Media', label: 'Defamation / Trolling on Social Media' },
                  { value: 'Account Clone / Identity Hijacking', label: 'Account Clone / Identity Hijacking' }
                ]
              },
              { id: 'incidentDate', label: 'Date First Noticed', type: 'date', required: true },
              {
                id: 'stateUt',
                label: 'State / UT of Victim',
                type: 'select',
                required: true,
                options: INDIAN_STATES.map(s => ({ value: s, label: s }))
              },
              { id: 'district', label: 'District', type: 'text', placeholder: 'e.g. Pune / Hyderabad', required: true }
            ]
          },
          {
            id: 'desc_sec',
            title: 'Incident Narrative',
            fields: [
              {
                id: 'incidentDescription',
                label: 'Describe what the fake profile or offender is doing',
                type: 'textarea',
                placeholder: 'Describe how the impersonator is using your photos, who they are contacting, what messages they sent...',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'social_platform',
        label: 'Platform & Profile Details',
        shortLabel: 'Platform Details',
        description: 'Target platform and URLs required for Section 79 Intermediary Takedown Notice',
        isMandatory: true,
        sections: [
          {
            id: 'platform_details',
            title: 'Target Platform Information',
            fields: [
              {
                id: 'socialPlatform',
                label: 'Affected Platform',
                type: 'select',
                required: true,
                options: [
                  { value: 'Instagram', label: 'Instagram' },
                  { value: 'Facebook', label: 'Facebook' },
                  { value: 'WhatsApp', label: 'WhatsApp' },
                  { value: 'Telegram', label: 'Telegram' },
                  { value: 'X (Twitter)', label: 'X (Twitter)' },
                  { value: 'LinkedIn', label: 'LinkedIn' },
                  { value: 'YouTube', label: 'YouTube' },
                  { value: 'Other Social Platform', label: 'Other Social Platform' }
                ]
              },
              { id: 'offenderHandle', label: 'Offender Handle / Username', type: 'text', placeholder: 'e.g. @riya_cyber_xx', required: true },
              { id: 'profileUrl', label: 'Complete URL of Offending Profile', type: 'text', placeholder: 'https://instagram.com/riya_cyber_xx', required: true },
              { id: 'postUrl', label: 'Specific Offending Post / Reel URL (if any)', type: 'text', placeholder: 'https://instagram.com/p/...' },
              { id: 'impersonatedPerson', label: 'Person Being Impersonated', type: 'text', placeholder: 'e.g. Self, Family Member, Public Figure', required: true },
              {
                id: 'reportedToPlatform',
                label: 'Have you already reported this profile to the platform?',
                type: 'radio',
                options: [
                  { value: 'yes', label: 'Yes, reported inside app' },
                  { value: 'no', label: 'No, not reported yet' },
                  { value: 'pending', label: 'Reported, platform did not take action' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'suspect',
        label: 'Suspect & Origin',
        shortLabel: 'Suspect',
        description: 'Any known information about the person behind the account',
        isMandatory: false,
        sections: [
          {
            id: 'suspect_profile',
            title: 'Known Perpetrator Clues',
            fields: [
              { id: 'suspectName', label: 'Suspected Person (if known / suspected)', type: 'text', placeholder: 'Name or relationship (or Unknown)' },
              { id: 'suspectIdentifiers', label: 'Suspect Phone, Email or Associated Links', type: 'identifiers_list' }
            ]
          }
        ]
      },
      {
        id: 'evidence',
        label: 'Evidence Screenshots',
        shortLabel: 'Evidence',
        description: 'Upload screenshots of profile, offending posts, and chat logs before they are deleted',
        isMandatory: true,
        sections: [
          {
            id: 'social_evidence',
            title: 'Screenshots & Archival Files',
            fields: []
          }
        ]
      },
      {
        id: 'review',
        label: 'Review & Submit',
        shortLabel: 'Review',
        description: 'Generate verified Section 79 Intermediary Takedown & NCRP dossier',
        isMandatory: true,
        sections: []
      }
    ]
  },

  // ── 3. HACKING / ACCOUNT COMPROMISE FLOW ─────────────────────────────────
  HACKING: {
    id: 'HACKING',
    title: 'Hacking & Account Compromise',
    description: 'Unauthorized access to email, social media, server, cloud account, 2FA bypass, or credential hijacking.',
    ncrpCategory: 'Other Cyber Crime',
    subcategories: [
      'Email / Gmail / Outlook Hijacking',
      'Social Media Account Compromise',
      'Website Defacement / Server Intrusion',
      'Two-Factor Authentication (2FA) Bypass',
      'Session Cookie Hijacking / Trojan Theft'
    ],
    evidenceTypes: [
      'Security Alert / Unauthorized Login Email',
      'Password Reset / Phone Change Notification',
      'Suspicious IP / Location Login Screenshot',
      'Original Account Ownership Documents',
      'Device Antivirus / Security Audit Log'
    ],
    workflowStages: [
      { id: 'submitted', label: 'Breach Registered', description: 'Unauthorized access logged under Sec 43/66 IT Act.', authority: 'CasePilot Forensics', typicalDuration: 'Immediate' },
      { id: 'preservation', label: 'Session Invalidation Notice', description: 'Urgent notice dispatched to service provider to revoke all active tokens.', authority: 'Cyber Defense Cell', typicalDuration: '1–4 hours' },
      { id: 'forensics', label: 'IP & Session Audit', description: 'Audit of authentication logs, device fingerprints, and geographical hops.', authority: 'Digital Forensics Laboratory', typicalDuration: '3–7 days' },
      { id: 'recovery', label: 'Account Restoration', description: 'Assisted recovery with secondary hardware/government verified credentials.', authority: 'Platform Security Desk', typicalDuration: '1–2 weeks' },
      { id: 'resolved', label: 'Secure & Closed', description: 'Account recovered and post-incident security hardening verified.', authority: 'Cyber Police Station', typicalDuration: 'Closure' }
    ],
    tabs: [
      {
        id: 'incident',
        label: 'Incident & Compromise',
        shortLabel: 'Incident',
        description: 'Overview of the security breach and intrusion timing',
        isMandatory: true,
        sections: [
          {
            id: 'hack_type',
            title: 'Compromise Classification',
            fields: [
              {
                id: 'subCategory',
                label: 'Account / System Type Compromised',
                type: 'select',
                required: true,
                options: [
                  { value: 'Email / Gmail / Outlook Hijacking', label: 'Email / Gmail / Outlook Hijacking' },
                  { value: 'Social Media Account Compromise', label: 'Social Media Account Compromise' },
                  { value: 'Website Defacement / Server Intrusion', label: 'Website Defacement / Server Intrusion' },
                  { value: 'Two-Factor Authentication (2FA) Bypass', label: 'Two-Factor Authentication (2FA) Bypass' }
                ]
              },
              { id: 'incidentDate', label: 'Date of Compromise', type: 'date', required: true },
              { id: 'incidentTime', label: 'Time When Access Lost', type: 'time', required: true },
              {
                id: 'stateUt',
                label: 'State / UT',
                type: 'select',
                required: true,
                options: INDIAN_STATES.map(s => ({ value: s, label: s }))
              },
              { id: 'district', label: 'District', type: 'text', placeholder: 'e.g. Gurugram / Noida', required: true },
              {
                id: 'incidentDescription',
                label: 'How did you discover the compromise?',
                type: 'textarea',
                placeholder: 'e.g. Received an alert saying password was changed from Russia; logged out of all devices...',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'affected_account',
        label: 'Affected Account Details',
        shortLabel: 'Account Details',
        description: 'Security parameters changed by attacker (email, phone, 2FA, password)',
        isMandatory: true,
        sections: [
          {
            id: 'account_vectors',
            title: 'Account Security State',
            fields: [
              { id: 'compromisedUsername', label: 'Compromised Username / Email ID', type: 'text', placeholder: 'e.g. citizen.account@gmail.com', required: true },
              {
                id: 'passwordChanged',
                label: 'Was your password changed by the intruder?',
                type: 'radio',
                options: [
                  { value: 'yes', label: 'Yes, password changed, cannot log in' },
                  { value: 'no', label: 'No, but unauthorized activity detected' },
                  { value: 'unknown', label: 'Not sure' }
                ]
              },
              {
                id: 'recoveryChanged',
                label: 'Was recovery phone number or email modified?',
                type: 'radio',
                options: [
                  { value: 'yes', label: 'Yes, attacker replaced recovery contacts' },
                  { value: 'no', label: 'No, recovery contacts still intact' }
                ]
              },
              {
                id: 'twoFactorBypassed',
                label: 'Was Two-Factor Authentication (2FA) enabled?',
                type: 'radio',
                options: [
                  { value: 'yes_bypassed', label: 'Yes, but attacker bypassed / changed it' },
                  { value: 'not_enabled', label: 'No, 2FA was not enabled' }
                ]
              },
              {
                id: 'unauthorizedMessages',
                label: 'Has attacker sent unauthorized messages or posts from your account?',
                type: 'radio',
                options: [
                  { value: 'yes', label: 'Yes, asking friends for money / scam posts' },
                  { value: 'no', label: 'No messages seen yet' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'suspect',
        label: 'Intrusion Footprint',
        shortLabel: 'Suspect',
        description: 'Attacker IP address, country, device, or suspicious notifications',
        isMandatory: false,
        sections: [
          {
            id: 'intruder_sec',
            title: 'Intruder Clues',
            fields: [
              { id: 'suspectIp', label: 'Intruder IP Address / Location (if shown in security alert)', type: 'text', placeholder: 'e.g. IP 185.220.101.5 / Lagos, Nigeria' },
              { id: 'suspectIdentifiers', label: 'New Recovery Email / Phone Added by Attacker', type: 'identifiers_list' }
            ]
          }
        ]
      },
      {
        id: 'evidence',
        label: 'Security Logs & Evidence',
        shortLabel: 'Evidence',
        description: 'Upload security alert emails, login attempt logs, or device screenshots',
        isMandatory: true,
        sections: [
          {
            id: 'hack_evidence_sec',
            title: 'Forensic Files',
            fields: []
          }
        ]
      },
      {
        id: 'review',
        label: 'Review & Submit',
        shortLabel: 'Review',
        description: 'Submit formal digital intrusion complaint under IT Act',
        isMandatory: true,
        sections: []
      }
    ]
  },

  // ── 4. RANSOMWARE / MALWARE FLOW ──────────────────────────────────────────
  RANSOMWARE: {
    id: 'RANSOMWARE',
    title: 'Ransomware & Malware Attacks',
    description: 'Encrypted files, ransom notes, server locks, crypto extortion, spyware, or malicious trojans.',
    ncrpCategory: 'Other Cyber Crime',
    subcategories: [
      'Ransomware (Files Encrypted / .locked)',
      'Trojan / Remote Access Tool (RAT)',
      'Enterprise Server / Database Breach',
      'Spyware / Keylogger Detected'
    ],
    evidenceTypes: [
      'Ransom Note (TXT/HTML/Image file)',
      'Sample Encrypted File (.locked/.crypted)',
      'Ransom Demanded Screen Photo',
      'System Event Viewer / Antivirus Log',
      'Network Firewall / Router Traffic Export'
    ],
    workflowStages: [
      { id: 'submitted', label: 'Critical Incident Logged', description: 'Emergency CERT-In notification & NCRP registration.', authority: 'CERT-In / I4C Threat Desk', typicalDuration: 'Immediate' },
      { id: 'quarantine', label: 'Network Isolation Guidance', description: 'Air-gap recommendation & IOC (Indicator of Compromise) extraction.', authority: 'National Cyber Security Coordinator', typicalDuration: '1–3 hours' },
      { id: 'decryption', label: 'NoMoreRansom Database Match', description: 'Cryptographic key comparison against known ransomware strain decryptors.', authority: 'Forensics Threat Intelligence', typicalDuration: '12–24 hours' },
      { id: 'crypto_track', label: 'Cryptocurrency Wallet Trace', description: 'Blockchain ledger analytics on attacker ransom address.', authority: 'Cyber Financial Intelligence', typicalDuration: '3–7 days' },
      { id: 'resolved', label: 'Mitigation & Remediation', description: 'Decryption assistance or system rebuild audit completed.', authority: 'Cyber Defense Center', typicalDuration: 'Closure' }
    ],
    tabs: [
      {
        id: 'incident',
        label: 'Incident & Infection',
        shortLabel: 'Incident',
        description: 'When was the malware or encryption first detected?',
        isMandatory: true,
        sections: [
          {
            id: 'ransom_cat',
            title: 'Malware Incident Overview',
            fields: [
              {
                id: 'subCategory',
                label: 'Attack Type',
                type: 'select',
                required: true,
                options: [
                  { value: 'Ransomware (Files Encrypted / .locked)', label: 'Ransomware (Files Encrypted / .locked)' },
                  { value: 'Trojan / Remote Access Tool (RAT)', label: 'Trojan / Remote Access Tool (RAT)' },
                  { value: 'Enterprise Server / Database Breach', label: 'Enterprise Server / Database Breach' }
                ]
              },
              { id: 'incidentDate', label: 'Date Detected', type: 'date', required: true },
              { id: 'incidentTime', label: 'Time When Ransom Note Appeared', type: 'time', required: true },
              {
                id: 'stateUt',
                label: 'State / UT',
                type: 'select',
                required: true,
                options: INDIAN_STATES.map(s => ({ value: s, label: s }))
              },
              { id: 'district', label: 'District', type: 'text', placeholder: 'e.g. Ahmedabad / Chennai', required: true },
              {
                id: 'incidentDescription',
                label: 'Describe how infection occurred (email attachment, cracked software, remote desktop?)',
                type: 'textarea',
                required: true,
                placeholder: 'e.g. Employee opened email invoice attachment; within 15 minutes all office shared drives had extensions changed to .enc...'
              }
            ]
          }
        ]
      },
      {
        id: 'device_malware',
        label: 'Device & Ransom Details',
        shortLabel: 'Device & Ransom',
        description: 'Operating system, file extension, and ransom demand information',
        isMandatory: true,
        sections: [
          {
            id: 'device_specs',
            title: 'Affected Hardware & System',
            fields: [
              {
                id: 'affectedDevice',
                label: 'Device Type Affected',
                type: 'select',
                required: true,
                options: [
                  { value: 'Personal Computer / Laptop (Windows)', label: 'Personal Computer / Laptop (Windows)' },
                  { value: 'Mac / Apple OS', label: 'Mac / Apple OS' },
                  { value: 'Corporate Server (Windows Server / Linux)', label: 'Corporate Server (Windows Server / Linux)' },
                  { value: 'Android Smartphone', label: 'Android Smartphone' },
                  { value: 'Hospital / Critical Infrastructure Clinic PC', label: 'Hospital / Clinic System' }
                ]
              },
              { id: 'ransomExtension', label: 'Appended File Extension', type: 'text', placeholder: 'e.g. .locked, .blackcat, .enc, .phobos', required: true },
              {
                id: 'systemAccessible',
                label: 'Is the operating system still bootable / accessible?',
                type: 'radio',
                options: [
                  { value: 'bootable', label: 'Yes, boots up but files cannot open' },
                  { value: 'locked_out', label: 'No, completely locked out of Windows' }
                ]
              }
            ]
          },
          {
            id: 'ransom_demand_sec',
            title: 'Extortion & Demand',
            fields: [
              { id: 'ransomDemand', label: 'Ransom Demanded (e.g. 0.5 BTC / ₹2,50,000 in Monero)', type: 'text', placeholder: 'e.g. 0.08 Bitcoin (approx ₹4,00,000)' },
              { id: 'ransomAddress', label: 'Attacker Crypto Wallet Address (from note)', type: 'text', placeholder: 'e.g. bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
              { id: 'contactEmail', label: 'Attacker Contact Email / TOR link in Note', type: 'text', placeholder: 'e.g. decrypt_help@onionmail.org' }
            ]
          }
        ]
      },
      {
        id: 'evidence',
        label: 'Ransom Notes & Files',
        shortLabel: 'Evidence',
        description: 'Upload ransom note, screenshot of locked screen, or sample encrypted file',
        isMandatory: true,
        sections: [
          {
            id: 'malware_evidence_sec',
            title: 'Ransom Evidence',
            fields: []
          }
        ]
      },
      {
        id: 'review',
        label: 'Review & Submit',
        shortLabel: 'Review',
        description: 'CERT-In and NCRP priority dispatch validation',
        isMandatory: true,
        sections: []
      }
    ]
  },

  // ── 5. PHISHING / VISHING FLOW ────────────────────────────────────────────
  PHISHING: {
    id: 'PHISHING',
    title: 'Phishing, Vishing & Fake Links',
    description: 'Deceptive phone calls (vishing), SMS links (smishing), fake government or bank websites designed to steal data.',
    ncrpCategory: 'Other Cyber Crime',
    subcategories: [
      'Fake Bank / KYC Verification Link',
      'Vishing (Fraudulent Phone Call from Bank/Police/Customs)',
      'Smishing (SMS with Malicious URL)',
      'Digital Arrest / Police Impersonation Call',
      'Lottery / Reward Link Phishing'
    ],
    evidenceTypes: [
      'Screenshot of Phishing SMS or WhatsApp Message',
      'Call Log / Audio Recording of Vishing Call',
      'Screenshot of Fake Website / Landing Page',
      'Browser History / Full Phishing URL',
      'Bank Debit Alert (if funds were compromised)'
    ],
    workflowStages: [
      { id: 'submitted', label: 'Phishing Threat Logged', description: 'Malicious domain and caller number registered in I4C database.', authority: 'CasePilot Threat Intake', typicalDuration: 'Immediate' },
      { id: 'takedown', label: 'Emergency Domain Takedown', description: 'Notice to domain registrar and ISP for DNS sinkholing of phishing website.', authority: 'DoT / NIXI Nodal Authority', typicalDuration: '2–6 hours' },
      { id: 'telecom', label: 'Caller Number Blocklist', description: 'Telecom department directive under Sanchar Saathi for IMEI/SIM deactivation.', authority: 'Department of Telecommunications', typicalDuration: '12–24 hours' },
      { id: 'freeze', label: 'Financial Action (if loss occurred)', description: 'Secondary routing to 1930 inter-bank freeze system if monetary loss reported.', authority: 'National Cyber Fraud Helpline', typicalDuration: 'Golden Hour' },
      { id: 'resolved', label: 'Domain Suspended & Closed', description: 'Phishing portal disabled; telecom numbers blocked across all operators.', authority: 'Cyber Crime Investigation', typicalDuration: 'Closure' }
    ],
    tabs: [
      {
        id: 'incident',
        label: 'Incident & Channel',
        shortLabel: 'Incident',
        description: 'How you were targeted by the phishing or vishing attack',
        isMandatory: true,
        sections: [
          {
            id: 'phish_type',
            title: 'Phishing Category',
            fields: [
              {
                id: 'subCategory',
                label: 'Attack Channel',
                type: 'select',
                required: true,
                options: [
                  { value: 'Fake Bank / KYC Verification Link', label: 'Fake Bank / KYC Verification Link' },
                  { value: 'Vishing (Fraudulent Phone Call)', label: 'Vishing (Fraudulent Phone Call)' },
                  { value: 'Smishing (SMS with Malicious Link)', label: 'Smishing (SMS with Malicious Link)' },
                  { value: 'Digital Arrest / Police Impersonation Call', label: 'Digital Arrest / Fake Officer Call' }
                ]
              },
              { id: 'incidentDate', label: 'Date of Communication', type: 'date', required: true },
              { id: 'incidentTime', label: 'Approximate Time', type: 'time', required: true },
              {
                id: 'stateUt',
                label: 'Your State / UT',
                type: 'select',
                required: true,
                options: INDIAN_STATES.map(s => ({ value: s, label: s }))
              },
              { id: 'district', label: 'District', type: 'text', placeholder: 'e.g. Lucknow / Indore', required: true },
              {
                id: 'incidentDescription',
                label: 'What did the sender say or demand?',
                type: 'textarea',
                placeholder: 'Describe what the caller or message claimed (e.g. claimed your SIM card will be blocked in 2 hours unless KYC updated)...',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'communication',
        label: 'Communication & Sender Details',
        shortLabel: 'Communication',
        description: 'Phone numbers, links, and claimed organizations',
        isMandatory: true,
        sections: [
          {
            id: 'comm_intel',
            title: 'Phishing Vector Details',
            fields: [
              { id: 'senderPhone', label: 'Sender / Caller Phone Number', type: 'text', placeholder: 'e.g. +91 98765 43210', required: true },
              { id: 'senderEmail', label: 'Sender Email (if received via email)', type: 'text', placeholder: 'e.g. support@sbi-online-kyc.com' },
              { id: 'phishingUrl', label: 'Suspicious Phishing URL / Link', type: 'text', placeholder: 'e.g. http://sbi-kyc-update-portal.xyz', required: true },
              { id: 'claimedOrg', label: 'Claimed Organization', type: 'text', placeholder: 'e.g. State Bank of India, Mumbai Police, TRAI, FedEx' },
              {
                id: 'credentialsEntered',
                label: 'Did you enter your password, PIN, or OTP on the link?',
                type: 'radio',
                options: [
                  { value: 'entered', label: 'Yes, I entered password / OTP' },
                  { value: 'opened_only', label: 'Only opened the link, entered nothing' },
                  { value: 'not_opened', label: 'Did not open the link' }
                ]
              },
              {
                id: 'financialImpact',
                label: 'Was any money debited or stolen from your account as a result?',
                type: 'radio',
                options: [
                  { value: 'yes', label: 'Yes, money was lost (Activates Financial Details tab)' },
                  { value: 'no', label: 'No money lost' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'evidence',
        label: 'Evidence & Screenshots',
        shortLabel: 'Evidence',
        description: 'Upload screenshots of the SMS, call log, or fake landing page',
        isMandatory: true,
        sections: [
          {
            id: 'phish_evidence_sec',
            title: 'Evidence Files',
            fields: []
          }
        ]
      },
      {
        id: 'review',
        label: 'Review & Submit',
        shortLabel: 'Review',
        description: 'Submit verified phishing report for immediate domain takedown and caller blocking',
        isMandatory: true,
        sections: []
      }
    ]
  },

  // ── 6. HARASSMENT / CYBERSTALKING FLOW ────────────────────────────────────
  HARASSMENT: {
    id: 'HARASSMENT',
    title: 'Cyber Harassment & Cyberstalking',
    description: 'Threatening messages, continuous harassment, online stalking, abusive calls, or targeted digital intimidation.',
    ncrpCategory: 'Other Cyber Crime',
    subcategories: [
      'Persistent Cyberstalking / Tracking',
      'Threats to Life / Physical Harm Online',
      'Obscene & Abusive Messages / Calls',
      'Doxxing (Leaking Personal Info / Address)',
      'Blackmail / Cyber Extortion'
    ],
    evidenceTypes: [
      'WhatsApp / Messaging App Chat Screenshots',
      'Call Recording / Voicemail of Threats',
      'Email Headers of Harassing Emails',
      'Screenshot of Social Media DMs & Comments',
      'Call Log History Showing Frequency'
    ],
    workflowStages: [
      { id: 'submitted', label: 'Harassment Complaint Filed', description: 'Registered under Sec 354D IPC & Sec 66E/67 IT Act.', authority: 'CasePilot Sensitive Intake', typicalDuration: 'Immediate' },
      { id: 'safety', label: 'Immediate Safety Assessment', description: 'Automated threat level analysis for physical safety intervention.', authority: 'Cyber Cell Women & Citizen Safety Desk', typicalDuration: '1–2 hours' },
      { id: 'telecom', label: 'CDR & Location Trace', description: 'Call Detail Record (CDR) and cell tower triangulation of harassing numbers.', authority: 'Police Technical Surveillance Unit', typicalDuration: '24–48 hours' },
      { id: 'intervention', label: 'Police Intervention / Warning', description: 'Investigating Officer summons suspect or registers formal FIR.', authority: 'Jurisdictional Police Station', typicalDuration: '2–5 days' },
      { id: 'resolved', label: 'Restraining Action & Closed', description: 'Legal undertaking signed / FIR filed and victim safety verified.', authority: 'Police Cyber Cell', typicalDuration: 'Closure' }
    ],
    tabs: [
      {
        id: 'incident',
        label: 'Complaint & Incident',
        shortLabel: 'Incident',
        description: 'Details of the harassment and date range',
        isMandatory: true,
        sections: [
          {
            id: 'harass_type',
            title: 'Nature of Harassment',
            fields: [
              {
                id: 'subCategory',
                label: 'Offense Type',
                type: 'select',
                required: true,
                options: [
                  { value: 'Persistent Cyberstalking / Tracking', label: 'Persistent Cyberstalking / Tracking' },
                  { value: 'Threats to Life / Physical Harm Online', label: 'Threats to Life / Physical Harm Online' },
                  { value: 'Obscene & Abusive Messages / Calls', label: 'Obscene & Abusive Messages / Calls' },
                  { value: 'Doxxing (Leaking Personal Info)', label: 'Doxxing (Leaking Personal Info)' },
                  { value: 'Blackmail / Cyber Extortion', label: 'Blackmail / Cyber Extortion' }
                ]
              },
              { id: 'incidentDate', label: 'When Did Harassment Start?', type: 'date', required: true },
              {
                id: 'stateUt',
                label: 'State / UT of Victim',
                type: 'select',
                required: true,
                options: INDIAN_STATES.map(s => ({ value: s, label: s }))
              },
              { id: 'district', label: 'District', type: 'text', placeholder: 'e.g. Kochi / Kolkata', required: true },
              {
                id: 'incidentDescription',
                label: 'Describe the nature and frequency of harassment',
                type: 'textarea',
                placeholder: 'Describe what threats were made, how often messages arrive, whether personal info was leaked...',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'communication',
        label: 'Communication & Threats',
        shortLabel: 'Threat Details',
        description: 'Channels, platforms, frequency, and immediate safety assessment',
        isMandatory: true,
        sections: [
          {
            id: 'threat_matrix',
            title: 'Threat Assessment',
            fields: [
              {
                id: 'communicationChannel',
                label: 'Primary Communication Medium',
                type: 'select',
                required: true,
                options: [
                  { value: 'WhatsApp', label: 'WhatsApp' },
                  { value: 'Phone Calls / SMS', label: 'Direct Phone Calls / SMS' },
                  { value: 'Instagram / Facebook DMs', label: 'Instagram / Facebook DMs' },
                  { value: 'Email', label: 'Email' },
                  { value: 'Telegram', label: 'Telegram' }
                ]
              },
              {
                id: 'frequency',
                label: 'Frequency of Harassing Contacts',
                type: 'select',
                required: true,
                options: [
                  { value: 'Multiple times daily', label: 'Multiple times daily' },
                  { value: 'Once or twice a week', label: 'Once or twice a week' },
                  { value: 'Single intense episode', label: 'Single intense episode' }
                ]
              },
              {
                id: 'immediateSafetyConcern',
                label: 'Do you believe there is an immediate risk to your physical safety?',
                type: 'radio',
                required: true,
                options: [
                  { value: 'yes', label: 'Yes, perpetrator knows my address or threatened physical visit' },
                  { value: 'no', label: 'No immediate physical threat, digital harassment only' }
                ]
              },
              {
                id: 'suspectRelationship',
                label: 'Perpetrator Relationship to Victim',
                type: 'select',
                options: [
                  { value: 'Completely Unknown / Stranger', label: 'Completely Unknown / Stranger' },
                  { value: 'Former Friend / Colleague', label: 'Former Friend / Colleague' },
                  { value: 'Former Partner / Ex-Spouse', label: 'Former Partner / Ex-Spouse' },
                  { value: 'Online Acquaintance', label: 'Online Acquaintance' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'suspect',
        label: 'Suspect Identifiers',
        shortLabel: 'Suspect',
        description: 'Phone numbers, social handles, or email addresses used by the perpetrator',
        isMandatory: false,
        sections: [
          {
            id: 'suspect_harass',
            title: 'Suspect Info',
            fields: [
              { id: 'suspectName', label: 'Suspect Name (if known)', type: 'text', placeholder: 'Name or alias' },
              { id: 'suspectIdentifiers', label: 'Known Phone Numbers or Social Handles', type: 'identifiers_list' }
            ]
          }
        ]
      },
      {
        id: 'evidence',
        label: 'Evidence & Chat Logs',
        shortLabel: 'Evidence',
        description: 'Upload screenshots of threatening messages, call logs, or audio recordings',
        isMandatory: true,
        sections: [
          {
            id: 'harass_evidence_sec',
            title: 'Evidence Files',
            fields: []
          }
        ]
      },
      {
        id: 'review',
        label: 'Review & Submit',
        shortLabel: 'Review',
        description: 'Final review and police cyber safety cell routing',
        isMandatory: true,
        sections: []
      }
    ]
  },

  // ── 7. WOMEN & CHILDREN RELATED CRIME (SPECIALIZED SENSITIVE FLOW) ────────
  WOMEN_CHILDREN: {
    id: 'WOMEN_CHILDREN',
    title: 'Women & Children Related Crime (Confidential)',
    description: 'Confidential reporting under POCSO / IT Act Sec 67B. Supports Anonymous reporting and dedicated fast-track handling.',
    ncrpCategory: 'Women/Children Related Crime',
    subcategories: [
      'Child Sexual Abuse Material (CSAM) / Non-Consensual Imagery',
      'Cyber Blackmail / Sextortion Involving Women/Children',
      'Morphed / Obscene Pictures Circulated Online',
      'Cyber Stalking & Bullying of Minor / Woman',
      'Voyeurism / Recording Without Consent'
    ],
    evidenceTypes: [
      'URL / Link of Illegal Online Content',
      'Screenshot of Distribution Group / Channel',
      'Chat Log or Extortion Communication',
      'Profile Screenshot of Perpetrator'
    ],
    sensitiveRules: {
      isSensitive: true,
      allowAnonymous: true,
      anonymousNotice: 'Under NCRP guidelines, you may report Women/Children crimes completely anonymously. No name, email, or mobile number will be requested or stored.',
      stripIdentityFieldsInAnonymous: true
    },
    workflowStages: [
      { id: 'submitted', label: 'Priority Intake Registered', description: 'Flagged for highest urgency sensitive review under POCSO/IT Act.', authority: 'Special Cyber Crime Cell', typicalDuration: 'Immediate' },
      { id: 'takedown', label: 'Emergency Global Takedown', description: 'Urgent notice issued to Meta/Telegram/Cloudflare for immediate hash-blocking.', authority: 'Interpol / NCMEC / CBI Nodal Desk', typicalDuration: '< 1 hour' },
      { id: 'preservation', label: 'Evidence Hash Preservation', description: 'Content preserved cryptographically before deletion for court admissibility.', authority: 'Digital Forensics Lab', typicalDuration: '2–6 hours' },
      { id: 'investigation', label: 'Fast-Track Police Investigation', description: 'Dedicated Women & Child safety squad assigned under Sec 164 CrPC.', authority: 'Women Police Station / Special Cell', typicalDuration: '1–7 days' },
      { id: 'resolved', label: 'Content Neutralized & FIR Filed', description: 'Global hashes blacklisted on PhotoDNA; perpetrator arrested.', authority: 'Special Cyber Court', typicalDuration: 'Closure' }
    ],
    tabs: [
      {
        id: 'reporting_mode',
        label: 'Confidential Reporting Mode',
        shortLabel: 'Mode Selection',
        description: 'Choose between 100% Anonymous Filing or Report & Track',
        isMandatory: true,
        sections: [
          {
            id: 'mode_selection',
            title: 'NCRP Specialized Sensitive Reporting Pathway',
            fields: [
              {
                id: 'isAnonymous',
                label: 'Select Your Preferred Reporting Mode',
                type: 'radio',
                required: true,
                options: [
                  {
                    value: 'anonymous',
                    label: 'Report Anonymously (Zero Identity Required)',
                    subLabel: 'Recommended if you wish to remain 100% confidential. No contact info, name, or Aadhaar is requested.'
                  },
                  {
                    value: 'track',
                    label: 'Report & Track (Official Investigation)',
                    subLabel: 'Allows you to receive SMS updates, download police acknowledgement, and track case progress.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'incident',
        label: 'Incident & Content Details',
        shortLabel: 'Incident',
        description: 'Where is the non-consensual or abusive material located?',
        isMandatory: true,
        sections: [
          {
            id: 'sensitive_category',
            title: 'Crime Classification',
            fields: [
              {
                id: 'subCategory',
                label: 'Nature of Sensitive Offense',
                type: 'select',
                required: true,
                options: [
                  { value: 'Child Sexual Abuse Material (CSAM)', label: 'Child Sexual Abuse Material (CSAM) [Highest Priority]' },
                  { value: 'Cyber Blackmail / Sextortion', label: 'Cyber Blackmail / Sextortion Involving Women/Minor' },
                  { value: 'Morphed / Obscene Pictures Circulated Online', label: 'Morphed / Obscene Pictures Circulated Online' },
                  { value: 'Cyber Stalking & Bullying of Woman/Minor', label: 'Cyber Stalking & Bullying' }
                ]
              },
              { id: 'incidentDate', label: 'Date First Observed', type: 'date', required: true },
              {
                id: 'stateUt',
                label: 'State / UT of Occurrence',
                type: 'select',
                required: true,
                options: INDIAN_STATES.map(s => ({ value: s, label: s }))
              },
              { id: 'district', label: 'District', type: 'text', placeholder: 'e.g. New Delhi / Jaipur', required: true },
              {
                id: 'incidentDescription',
                label: 'Details of Offending Material & Circumstances',
                type: 'textarea',
                placeholder: 'State the nature of the material, which platform or group it is circulating in, and whether threats were made...',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'platform_content',
        label: 'Platform & Content URLs',
        shortLabel: 'Platform & URLs',
        description: 'Exact digital addresses needed for global intermediary takedown',
        isMandatory: true,
        sections: [
          {
            id: 'url_sec',
            title: 'Content Host Location',
            fields: [
              {
                id: 'socialPlatform',
                label: 'Hosting Platform / App',
                type: 'select',
                required: true,
                options: [
                  { value: 'Telegram Channel / Group', label: 'Telegram Channel / Group' },
                  { value: 'Instagram', label: 'Instagram' },
                  { value: 'WhatsApp Group / Chat', label: 'WhatsApp' },
                  { value: 'Web Forum / Website', label: 'Web Forum / Website' },
                  { value: 'Other Platform', label: 'Other Platform' }
                ]
              },
              { id: 'contentUrl', label: 'Direct URL to Offending Post / Channel', type: 'text', placeholder: 'e.g. https://t.me/... or https://instagram.com/...', required: true },
              {
                id: 'immediateSafetyConcern',
                label: 'Is the victim currently in immediate danger or facing live extortion?',
                type: 'radio',
                required: true,
                options: [
                  { value: 'yes', label: 'Yes, ongoing live extortion or threats of imminent physical harm' },
                  { value: 'no', label: 'No immediate physical threat, emergency digital takedown needed' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'evidence',
        label: 'Evidence & Verification',
        shortLabel: 'Evidence',
        description: 'Upload screenshots of the post, profile, or threatening messages',
        isMandatory: true,
        sections: [
          {
            id: 'sensitive_evidence_sec',
            title: 'Confidential Evidence Vault',
            fields: []
          }
        ]
      },
      {
        id: 'review',
        label: 'Review & Sensitive Submit',
        shortLabel: 'Review',
        description: 'Verify report details before immediate emergency dispatch to Special Cyber Unit',
        isMandatory: true,
        sections: []
      }
    ]
  },

  // ── 8. OTHER CYBER CRIME FLOW (WITH SUBTYPE ROUTING) ─────────────────────
  OTHER_CYBERCRIME: {
    id: 'OTHER_CYBERCRIME',
    title: 'Other Cyber Crime',
    description: 'Online job fraud, cryptocurrency theft, identity theft, unauthorized mobile access, or computer-related offenses.',
    ncrpCategory: 'Other Cyber Crime',
    subcategories: [
      'Identity Theft / Aadhaar / PAN Fraud',
      'Cryptocurrency Theft / Fake Wallet',
      'Online Job Scam / Placement Deposit',
      'Matrimonial / Romance Scam',
      'SIM Box / Unauthorized VoIP Gateway',
      'Data Theft / Corporate Espionage'
    ],
    evidenceTypes: [
      'Fake Offer Letter / Agreement',
      'Screenshots of Communication',
      'Transaction Slip (if any payment was made)',
      'Fake Identity Documents Used by Offender'
    ],
    workflowStages: [
      { id: 'submitted', label: 'Complaint Registered', description: 'Official NCRP registration under IT Act provisions.', authority: 'CasePilot System', typicalDuration: 'Immediate' },
      { id: 'validated', label: 'Preliminary Evidence Review', description: 'Investigator examination of digital artifacts.', authority: 'Cyber Police Station', typicalDuration: '1–2 days' },
      { id: 'investigation', label: 'Active Investigation', description: 'Notices issued to telecom, domain, or bank entities.', authority: 'Cyber Cell', typicalDuration: '2–4 weeks' },
      { id: 'resolved', label: 'Disposed / Charge Sheet', description: 'Action concluded according to CrPC statutory norms.', authority: 'Competent Court', typicalDuration: 'Closure' }
    ],
    tabs: [
      {
        id: 'incident',
        label: 'Complaint & Incident',
        shortLabel: 'Incident',
        description: 'Select subtype and describe the offense',
        isMandatory: true,
        sections: [
          {
            id: 'other_type_sec',
            title: 'Crime Subtype Selection',
            fields: [
              {
                id: 'subCategory',
                label: 'Specific Crime Subtype',
                type: 'select',
                required: true,
                options: [
                  { value: 'Identity Theft / Aadhaar / PAN Fraud', label: 'Identity Theft / Aadhaar / PAN Fraud' },
                  { value: 'Cryptocurrency Theft / Fake Wallet', label: 'Cryptocurrency Theft / Fake Wallet' },
                  { value: 'Online Job Scam / Placement Deposit', label: 'Online Job Scam / Placement Deposit' },
                  { value: 'Matrimonial / Romance Scam', label: 'Matrimonial / Romance Scam' },
                  { value: 'Data Theft / Corporate Espionage', label: 'Data Theft / Corporate Espionage' }
                ]
              },
              { id: 'incidentDate', label: 'Date of Occurrence', type: 'date', required: true },
              {
                id: 'stateUt',
                label: 'State / UT',
                type: 'select',
                required: true,
                options: INDIAN_STATES.map(s => ({ value: s, label: s }))
              },
              { id: 'district', label: 'District', type: 'text', placeholder: 'e.g. Surat / Bhopal', required: true },
              {
                id: 'incidentDescription',
                label: 'Comprehensive Incident Narrative',
                type: 'textarea',
                placeholder: 'Describe the complete background of how the crime occurred...',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'suspect',
        label: 'Suspect Information',
        shortLabel: 'Suspect',
        description: 'Phone numbers, websites, or emails of the perpetrators',
        isMandatory: false,
        sections: [
          {
            id: 'other_suspect_sec',
            title: 'Suspect Clues',
            fields: [
              { id: 'suspectName', label: 'Suspect Name / Entity Alias', type: 'text', placeholder: 'e.g. Apex Global Crypto / Priya HR' },
              { id: 'suspectIdentifiers', label: 'Associated Phone Numbers, Emails, or Links', type: 'identifiers_list' }
            ]
          }
        ]
      },
      {
        id: 'evidence',
        label: 'Evidence & Documents',
        shortLabel: 'Evidence',
        description: 'Upload relevant documents, letters, agreements, or screenshots',
        isMandatory: true,
        sections: [
          {
            id: 'other_evidence_sec',
            title: 'Evidence Documents',
            fields: []
          }
        ]
      },
      {
        id: 'review',
        label: 'Review & Submit',
        shortLabel: 'Review',
        description: 'Review and file complaint to state cyber jurisdiction',
        isMandatory: true,
        sections: []
      }
    ]
  }
};
