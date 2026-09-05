'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import { PortalHeader } from './PortalHeader';
import { SecondaryPortalNav } from './SecondaryPortalNav';
import { HomePortalView } from './HomePortalView';
import { ComplaintWorkspaceView } from './ComplaintWorkspaceView';
import { TrackCasePortalView } from './TrackCasePortalView';
import { HelpPortalView } from './HelpPortalView';
/* ── Modern SVG Icons (Zero Emojis) ────────────────────────────── */
const Icons = {
  Home: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  FilePlus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
  SearchActivity: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <polyline points="11 8 11 12 13 14" />
    </svg>
  ),
  HelpCircle: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Info: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Attach: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Edit: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Trash: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ShieldAlert: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  CreditCard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  Smartphone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  HeartHandshake: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  Lock: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  PhoneCall: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
};

/* ── Indian Cybercrime Taxonomy & Reference Lists ──────────────── */
const CATEGORIES: Record<string, string[]> = {
  'Online Financial Fraud': [
    'UPI Related Fraud',
    'Bank Impersonation Fraud',
    'Credit Card / Debit Card Fraud',
    'Internet Banking Fraud',
    'SIM Swap / Cloning Fraud',
    'Aadhaar Enabled Payment System (AePS) Fraud',
    'E-Wallet Related Fraud',
    'Demat / Online Trading Account Fraud',
  ],
  'Women & Children Related Crime': [
    'Cyber Blackmail / Sextortion',
    'Non-Consensual Image Sharing',
    'Cyber Stalking of Female / Minor',
    'Online Bullying / Harassment of Minor',
    'Child Sexual Abuse Material (CSAM)',
  ],
  'Online and Social Media Related Crime': [
    'Impersonation / Fake Social Profile',
    'Cyber Stalking',
    'Defamation / Cyber Trolling',
    'Cheating through Social Media',
    'Unauthorized Access to Account',
  ],
  'Hacking / Defacement / Virus / Ransomware': [
    'Ransomware Attack',
    'Website Defacement',
    'Malware / Trojan / Virus Attack',
    'Unauthorized Computer System Access',
    'Denial of Service (DoS/DDoS)',
  ],
  'Job Fraud / Matrimonial Fraud': [
    'Fake Part-Time Job / Telegram Task Scam',
    'Work From Home Offer Fraud',
    'Fake Overseas Employment',
    'Matrimonial Website Cheating / Grooming Fraud',
  ],
  'Data Theft / Identity Theft': [
    'Identity Theft / Impersonation',
    'Corporate Data Breach',
    'Personal PII Leak / Sale',
    'Unauthorized KYC Document Misuse',
  ],
};

const CRIME_LOCATIONS = [
  'Phone Call + Suspicious Link',
  'WhatsApp',
  'Telegram',
  'Instagram',
  'Email',
  'Facebook',
  'SMS',
  'Website',
  'Mobile App/APK',
  'UPI / Banking Portal',
  'Other',
];

const INDIAN_STATES = [
  'Delhi NCR', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh',
  'Gujarat', 'West Bengal', 'Rajasthan', 'Haryana', 'Punjab', 'Kerala', 'Madhya Pradesh',
  'Bihar', 'Andhra Pradesh', 'Odisha', 'Assam', 'Goa', 'Chandigarh', 'Jharkhand',
  'Chhattisgarh', 'Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir', 'Puducherry',
];

type FieldStatus = 'empty' | 'ai-captured' | 'confirmed' | 'user-edited' | 'needs-review';

interface SuspectIdentifier {
  id: string;
  type: 'mobile' | 'email' | 'handle' | 'bank' | 'url';
  value: string;
}

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  subText?: string;
  timestamp: string;
  extractedPills?: string[];
  conflictNotice?: { field: string; message: string };
  pathwayOptions?: string[];
  agentSteps?: { label: string; status: 'done' | 'pending' | 'warning' }[];
}

interface EvidenceItem {
  id: string;
  fileName: string;
  fileSize: string;
  type: string;
  extractedText: string;
  detectedAmount?: string;
  detectedUtr?: string;
  detectedUpi?: string;
}

export function CyberCrimePortalWorkspace() {
  const router = useRouter();
  const { toast } = useToast();

  // ════════════════════════════════════════════════════════════════
  // 1. PRIMARY MIDDLE NAVIGATION SYSTEM (HealthSutra Style)
  // [ Home ] | [ Register a Complaint ] | [ Track & Take Action ] | [ Help ]
  // ════════════════════════════════════════════════════════════════
  const [primaryTab, setPrimaryTab] = useState<'home' | 'register' | 'track' | 'help'>('home');

  // Secondary Nested Tabs within Modules
  const [registerSubTab, setRegisterSubTab] = useState(0); // 0: Incident, 1: Suspect, 2: Specific, 3: Evidence, 4: Review
  const [trackSubTab, setTrackSubTab] = useState<'all' | 'attention' | 'timeline' | 'escalation'>('all');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CYB-2026-001294');
  const [helpSubTab, setHelpSubTab] = useState<'faq' | 'immediate' | 'safety' | 'numbers' | 'workflow'>('faq');

  // Anonymous reporting toggle
  const [isAnonymous, setIsAnonymous] = useState(false);

  // ── Field States & Conflict Tracking ───────────────────────────
  const [fieldStates, setFieldStates] = useState<Record<string, FieldStatus>>({
    category: 'empty',
    subCategory: 'empty',
    incidentDate: 'empty',
    whereOccurred: 'empty',
    incidentDescription: 'empty',
    fraudAmount: 'empty',
    bankName: 'empty',
    utrNumber: 'empty',
    beneficiaryAccount: 'empty',
    suspectName: 'empty',
    suspectMobile: 'empty',
    suspectHandle: 'empty',
  });

  const [fieldConflicts, setFieldConflicts] = useState<Record<string, { evidenceVal: string; statedVal: string; note: string }>>({});

  // ── Module 1: Incident Details ─────────────────────────────────
  const [category, setCategory] = useState('Online Financial Fraud');
  const [subCategory, setSubCategory] = useState('Bank Impersonation Fraud');
  const [incidentDate, setIncidentDate] = useState('2026-09-04');
  const [incidentHour, setIncidentHour] = useState('14');
  const [incidentMin, setIncidentMin] = useState('30');
  const [incidentAmPm, setIncidentAmPm] = useState('PM');
  const [reasonForDelay, setReasonForDelay] = useState('');
  const [stateUt, setStateUt] = useState('Delhi NCR');
  const [district, setDistrict] = useState('Central Delhi');
  const [policeStation, setPoliceStation] = useState('Cyber Crime PS, Mandir Marg');
  const [whereOccurred, setWhereOccurred] = useState('Phone Call + Suspicious Link');
  const [incidentDescription, setIncidentDescription] = useState('');

  // ── Module 2: Suspect Details with Clean "+ Add" Pattern ─────────
  const [suspectName, setSuspectName] = useState('');
  const [suspectIdentifiers, setSuspectIdentifiers] = useState<SuspectIdentifier[]>([
    { id: '1', type: 'mobile', value: '+91 9876543210' },
  ]);
  const [newIdType, setNewIdType] = useState<'mobile' | 'email' | 'handle' | 'bank' | 'url'>('handle');
  const [newIdVal, setNewIdVal] = useState('');

  // ── Module 3: Adaptive Financial Details ────────────────────────
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNumber, setAccountNumber] = useState('389201948201');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [utrNumber, setUtrNumber] = useState('');
  const [fraudAmount, setFraudAmount] = useState('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');

  // ── Module 3: Adaptive Hacking / Ransomware Details ─────────────
  const [affectedDevice, setAffectedDevice] = useState('Windows Workstation');
  const [ransomExtension, setRansomExtension] = useState('.locked');
  const [ransomDemand, setRansomDemand] = useState('0.5 BTC (~₹28,00,000)');
  const [ransomAddress, setRansomAddress] = useState('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');

  // ── Module 3: Adaptive Social Media / Harassment Details ────────
  const [socialPlatform, setSocialPlatform] = useState('Instagram');
  const [offenderHandle, setOffenderHandle] = useState('@riya_cyber_xx');
  const [harassmentNature, setHarassmentNature] = useState('Extortion with morphed private photos');

  // ── Module 4: Evidence ─────────────────────────────────────────
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Review & Submit State ──────────────────────────────────────
  const [collapsedReviewSections, setCollapsedReviewSections] = useState<Record<string, boolean>>({});
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [submittedCaseNumber, setSubmittedCaseNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Active Cases Mock Store for Track & Take Action ────────────
  const [cases, setCases] = useState([
    {
      id: 'CYB-2026-001294',
      category: 'Online Financial Fraud',
      subCategory: 'Bank Impersonation Fraud',
      amount: '₹75,000',
      status: 'Investigation in progress',
      health: 'On Track',
      needsAttention: false,
      nextAction: 'Nothing required right now. Financial unit coordinating with nodal bank officer.',
      timeline: [
        { date: '04 Sep', title: 'Complaint Submitted', desc: 'Registered under BNS & Section 66D IT Act.' },
        { date: '04 Sep', title: 'Information Verified', desc: 'Citizen identity and bank transaction authenticated.' },
        { date: '05 Sep', title: 'Complaint Routed', desc: 'Assigned to Cyber Crime Unit Central Delhi.' },
        { date: '06 Sep', title: 'Financial Freeze Notice Issued', desc: 'Notice sent to Axis Bank for beneficiary VPA.' },
        { date: '08 Sep', title: 'Investigation Started', desc: 'Investigating Officer SI Rajesh Kumar assigned.' },
      ],
    },
    {
      id: 'CYB-2026-001295',
      category: 'Hacking / Account Compromise',
      subCategory: 'Unauthorized Instagram Account Takeover',
      amount: '-',
      status: 'Waiting for Information',
      health: 'Attention Needed',
      needsAttention: true,
      nextAction: 'ATTENTION REQUIRED: Please upload original account creation email or recovery screenshot to verify ownership.',
      timeline: [
        { date: '01 Sep', title: 'Complaint Lodged', desc: 'Reported unauthorized password change.' },
        { date: '02 Sep', title: 'Meta Platform Notice Sent', desc: 'Formal intermediary request submitted to Meta Law Enforcement Portal.' },
        { date: '04 Sep', title: 'Proof Requested', desc: 'Investigating officer requested original registration proof.' },
      ],
    },
    {
      id: 'CYB-2026-001289',
      category: 'Job Fraud / Telegram Task Scam',
      subCategory: 'Fake Part-Time Job Rating Scam',
      amount: '₹45,000',
      status: 'Escalation Review',
      health: 'Stuck (8 Days Inactive)',
      needsAttention: true,
      nextAction: 'No update recorded for 8 days. Citizen eligible to file legitimate grievance escalation.',
      timeline: [
        { date: '26 Aug', title: 'Complaint Registered', desc: 'Lodged with UTR and Telegram handle.' },
        { date: '28 Aug', title: 'Bank Accounts Flagged', desc: 'Recipient account identified at HDFC Bank.' },
      ],
    },
  ]);

  // ── Right AI Assistant State ───────────────────────────────────
  const [aiOpen, setAiOpen] = useState(false);  // false = dashboard only, true = AI workspace open
  const [chatInput, setChatInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiProcessing]);

  // Description character counters
  const descLength = incidentDescription.length;
  const charsLeft = Math.max(0, 1500 - descLength);

  // Helper to mark manual edits
  const handleUserEdit = (fieldName: string, setter: (val: any) => void, val: any) => {
    setter(val);
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: 'user-edited',
    }));

    if (fieldConflicts[fieldName]) {
      setFieldConflicts(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // Add suspect identifier cleanly
  const addSuspectIdentifier = () => {
    if (!newIdVal.trim()) return;
    setSuspectIdentifiers(prev => [
      ...prev,
      { id: String(Date.now()), type: newIdType, value: newIdVal.trim() },
    ]);
    setNewIdVal('');
  };

  const removeSuspectIdentifier = (id: string) => {
    setSuspectIdentifiers(prev => prev.filter(i => i.id !== id));
  };

  // Conflict resolution helper
  const resolveConflict = (fieldName: string, chosenValue: string) => {
    if (fieldName === 'fraudAmount') setFraudAmount(chosenValue);
    setFieldStates(prev => ({ ...prev, [fieldName]: 'confirmed' }));
    setFieldConflicts(prev => {
      const copy = { ...prev };
      delete copy[fieldName];
      return copy;
    });
    toast({ type: 'success', title: 'Conflict Resolved', body: `Value confirmed as ₹${chosenValue}` });
  };

  // ── AI Message Sender & Entity Extraction ──────────────────────
  const sendChatMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const newMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsAiProcessing(true);

    const lower = userText.toLowerCase();
    let detectedCat = category;
    let detectedSub = subCategory;
    const extractedSummary: string[] = [];

    // Ensure we switch to Register tab when user describes a crime!
    if (primaryTab === 'home') {
      setPrimaryTab('register');
    }

    if (lower.includes('bank') || lower.includes('kyc') || lower.includes('sbi') || lower.includes('hdfc') || lower.includes('transfer') || lower.includes('rupees') || lower.includes('₹') || lower.includes('lost') || lower.includes('debit')) {
      detectedCat = 'Online Financial Fraud';
      detectedSub = lower.includes('kyc') || lower.includes('called') ? 'Bank Impersonation Fraud' : 'UPI Related Fraud';
      extractedSummary.push(`Category: Online Financial Fraud`);
      extractedSummary.push(`Sub-category: ${detectedSub}`);
    } else if (lower.includes('telegram') || lower.includes('task') || lower.includes('rating') || lower.includes('work from home')) {
      detectedCat = 'Job Fraud / Matrimonial Fraud';
      detectedSub = 'Fake Part-Time Job / Telegram Task Scam';
      extractedSummary.push(`Category: Job Fraud`);
      extractedSummary.push(`Sub-category: Task Scam`);
    } else if (lower.includes('instagram') || lower.includes('blackmail') || lower.includes('nude') || lower.includes('morphed') || lower.includes('sextortion')) {
      detectedCat = 'Women & Children Related Crime';
      detectedSub = 'Cyber Blackmail / Sextortion';
      extractedSummary.push(`Category: Cyber Blackmail / Sextortion`);
    } else if (lower.includes('ransomware') || lower.includes('.locked') || lower.includes('encrypted') || lower.includes('bitcoin')) {
      detectedCat = 'Hacking / Defacement / Virus / Ransomware';
      detectedSub = 'Ransomware Attack';
      extractedSummary.push(`Category: Ransomware Attack`);
    }

    // Extract amount
    const amtMatch = userText.match(/(?:rs\.?|₹|inr)\s*([0-9,]+)|([0-9,]+)\s*(?:rupees|rs|inr)/i);
    let detectedAmt: string | null = null;
    if (amtMatch) {
      detectedAmt = (amtMatch[1] || amtMatch[2]).replace(/,/g, '');
      extractedSummary.push(`Amount: ₹${Number(detectedAmt).toLocaleString('en-IN')}`);
    }

    // Extract bank
    let detectedBank: string | null = null;
    if (lower.includes('sbi') || lower.includes('state bank')) detectedBank = 'State Bank of India';
    else if (lower.includes('hdfc')) detectedBank = 'HDFC Bank';
    else if (lower.includes('icici')) detectedBank = 'ICICI Bank';
    else if (lower.includes('axis')) detectedBank = 'Axis Bank';
    if (detectedBank) extractedSummary.push(`Bank: ${detectedBank}`);

    // Extract channel / platform
    let detectedWhere: string | null = null;
    if (lower.includes('link') && (lower.includes('call') || lower.includes('called'))) detectedWhere = 'Phone Call + Suspicious Link';
    else if (lower.includes('telegram')) detectedWhere = 'Telegram';
    else if (lower.includes('whatsapp')) detectedWhere = 'WhatsApp';
    else if (lower.includes('instagram')) detectedWhere = 'Instagram';
    if (detectedWhere) extractedSummary.push(`Platform: ${detectedWhere}`);

    // Extract UTR / Txn
    const utrMatch = userText.match(/\b(\d{12})\b/);
    let detectedUtr: string | null = null;
    if (utrMatch) {
      detectedUtr = utrMatch[1];
      extractedSummary.push(`UTR: ${detectedUtr}`);
    }

    // Extract UPI ID
    const upiMatch = userText.match(/([a-zA-Z0-9.\-_]+@(?:oksbi|okaxis|okicici|okhdfcbank|ybl|upi|paytm))/i);
    let detectedUpi: string | null = null;
    if (upiMatch) {
      detectedUpi = upiMatch[1];
      extractedSummary.push(`Scammer UPI: ${detectedUpi}`);
    }

    // Extract handle
    const handleMatch = userText.match(/@([a-zA-Z0-9._]{3,30})/);
    let detectedHandle: string | null = null;
    if (handleMatch) {
      detectedHandle = '@' + handleMatch[1];
      extractedSummary.push(`Suspect: ${detectedHandle}`);
    }

    // Switch left view to complaint workspace
    setPrimaryTab('register');

    // Apply updates to Central Form
    setFieldStates(prev => {
      const next = { ...prev };
      if (prev.category !== 'user-edited') {
        setCategory(detectedCat);
        setSubCategory(detectedSub);
        next.category = 'ai-captured';
        next.subCategory = 'ai-captured';
      }
      if (detectedWhere && prev.whereOccurred !== 'user-edited') {
        setWhereOccurred(detectedWhere);
        next.whereOccurred = 'ai-captured';
      }
      if (detectedAmt && prev.fraudAmount !== 'user-edited') {
        setFraudAmount(detectedAmt);
        next.fraudAmount = 'ai-captured';
      }
      if (detectedBank && prev.bankName !== 'user-edited') {
        setBankName(detectedBank);
        next.bankName = 'ai-captured';
      }
      if (detectedUtr && prev.utrNumber !== 'user-edited') {
        setUtrNumber(detectedUtr);
        next.utrNumber = 'ai-captured';
      }
      if (detectedUpi && prev.beneficiaryAccount !== 'user-edited') {
        setBeneficiaryAccount(detectedUpi);
        next.beneficiaryAccount = 'ai-captured';
      }
      if (detectedHandle && prev.suspectHandle !== 'user-edited') {
        setSuspectIdentifiers(ids => [
          ...ids,
          { id: String(Date.now()), type: 'handle', value: detectedHandle! },
        ]);
        next.suspectHandle = 'ai-captured';
      }
      if (prev.incidentDescription !== 'user-edited') {
        setIncidentDescription(userText);
        next.incidentDescription = 'ai-captured';
      }
      return next;
    });

    // Build Agentic Steps
    const agentSteps: { label: string; status: 'done' | 'pending' | 'warning' }[] = [
      { label: `Identified Crime: ${detectedCat} → ${detectedSub}`, status: 'done' },
    ];
    if (detectedAmt) {
      agentSteps.push({ label: `Extracted loss amount: ₹${Number(detectedAmt).toLocaleString('en-IN')}`, status: 'done' });
    }
    if (detectedBank) {
      agentSteps.push({ label: `Identified claimed bank: ${detectedBank}`, status: 'done' });
    }
    if (detectedWhere) {
      agentSteps.push({ label: `Incident Channel: ${detectedWhere}`, status: 'done' });
    }
    if (detectedUtr) {
      agentSteps.push({ label: `Verified 12-digit UTR reference: ${detectedUtr}`, status: 'done' });
    } else {
      agentSteps.push({ label: `Transaction ID / UTR required for 1930 freeze`, status: 'warning' });
    }
    agentSteps.push({ label: `Central NCRP complaint record updated live in portal`, status: 'done' });

    setTimeout(() => {
      let aiResponseText = '';
      if (detectedCat === 'Online Financial Fraud') {
        aiResponseText = `I understand. This sounds like a bank impersonation / phishing-related financial fraud.\n\nI have automatically updated the Category, Sub-Category, Method, and Amount on your official complaint record. You can watch these values appear on the central form on the left.\n\nWhich bank account was affected, and do you have the 12-digit UTR or transaction ID so we can issue an immediate 1930 freeze notice?`;
      } else if (detectedCat === 'Job Fraud / Matrimonial Fraud') {
        aiResponseText = `I have logged this as a Telegram Part-Time Task scam. The details have been placed into your official complaint form.\n\nDo you possess the scammer's UPI ID or the transaction UTR number? You can also upload screenshots directly using the 📎 button.`;
      } else {
        aiResponseText = `I have recorded your statement and updated your official complaint form in real time. Please verify the pre-filled fields in the central portal.`;
      }

      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extractedPills: extractedSummary.length > 0 ? extractedSummary : undefined,
        agentSteps,
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsAiProcessing(false);
    }, 500);
  };

  // Start AI Intake Conversational Flow
  const startAiIntake = (initialQuery?: string) => {
    setAiOpen(true);  // open the right AI panel
    if (initialQuery) {
      sendChatMessage(initialQuery);
      return;
    }
    const initialAiMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'assistant',
      text: "What kind of complaint are you trying to make?",
      subText: "You can choose a reporting pathway, or simply tell me what happened.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pathwayOptions: [
        'Financial Fraud',
        'Other Cyber Crime',
        'Women & Children Related Crime',
        "I'm not sure",
      ],
    };
    setChatMessages([initialAiMsg]);
  };

  // Handle Interactive Pathway Selection
  const handlePathwaySelect = (pathway: string) => {
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      text: pathway === "I'm not sure" ? "I'm not really sure." : pathway,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAiProcessing(true);

    setTimeout(() => {
      let aiText = '';
      if (pathway === "I'm not sure") {
        aiText = "No problem. Tell me what happened in your own words. You can mention who contacted you, any links or messages received, or any money debited.";
      } else if (pathway === 'Financial Fraud') {
        setPrimaryTab('register');
        setCategory('Online Financial Fraud');
        setSubCategory('Bank Impersonation Fraud');
        aiText = "I have initialized your complaint under Online Financial Fraud.\n\nTell me what occurred in your own words, including the bank name, mode of payment (UPI, Netbanking, Card), and the amount lost.";
      } else if (pathway === 'Other Cyber Crime') {
        setPrimaryTab('register');
        setCategory('Hacking / Defacement / Virus / Ransomware');
        setSubCategory('Ransomware Attack');
        aiText = "I have initialized your complaint under Other Cyber Crime (Hacking, Malware, Ransomware, Unauthorized Access).\n\nPlease describe what happened to your computer, account, or systems.";
      } else if (pathway === 'Women & Children Related Crime') {
        setPrimaryTab('register');
        setCategory('Women & Children Related Crime');
        setSubCategory('Cyber Blackmail / Sextortion');
        aiText = "Understood. Complaints in this category are treated with high priority and strict confidentiality. You also have the option to file anonymously.\n\nPlease describe the incident or perpetrator's handles.";
      }

      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsAiProcessing(false);
    }, 400);
  };

  // Evidence upload & conflict detection
  const handleEvidenceUpload = (fileName: string, simulatedAmt?: string, simulatedUtr?: string) => {
    const newItem: EvidenceItem = {
      id: String(Date.now()),
      fileName,
      fileSize: '1.4 MB',
      type: 'image/png',
      extractedText: `DEBIT ALERT: INR ${simulatedAmt || '52,000'} debited from A/C ...9482 on 04-SEP-26. UTR: ${simulatedUtr || '418293847291'}.`,
      detectedAmount: simulatedAmt || '52000',
      detectedUtr: simulatedUtr || '418293847291',
      detectedUpi: 'scammer@okaxis',
    };

    setEvidenceList(prev => [newItem, ...prev]);

    if (fraudAmount && fraudAmount !== newItem.detectedAmount) {
      setFieldConflicts(prev => ({
        ...prev,
        fraudAmount: {
          evidenceVal: newItem.detectedAmount!,
          statedVal: fraudAmount,
          note: `Uploaded ${fileName} shows ₹${newItem.detectedAmount}`,
        },
      }));
      setFieldStates(prev => ({ ...prev, fraudAmount: 'needs-review' }));

      const conflictAiMsg: ChatMessage = {
        id: String(Date.now() + 2),
        role: 'assistant',
        text: `I analyzed your uploaded evidence (${fileName}).\n\n⚠️ Something doesn't match: You mentioned ₹${Number(fraudAmount).toLocaleString('en-IN')}, but the uploaded screenshot appears to show an exact transfer of ₹${Number(newItem.detectedAmount).toLocaleString('en-IN')}.\n\nI have flagged the Amount field as "Needs Review" on your form so you can confirm the exact figure.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extractedPills: [`OCR Amount: ₹${newItem.detectedAmount}`, `Txn ID: ${newItem.detectedUtr}`],
      };
      setChatMessages(prev => [...prev, conflictAiMsg]);
      toast({ type: 'warning', title: 'Evidence Discrepancy', body: `Evidence shows ₹${newItem.detectedAmount} vs stated ₹${fraudAmount}` });
    } else {
      if (newItem.detectedAmount) {
        setFraudAmount(newItem.detectedAmount);
        setFieldStates(prev => ({ ...prev, fraudAmount: 'confirmed' }));
      }
      if (newItem.detectedUtr) {
        setUtrNumber(newItem.detectedUtr);
        setFieldStates(prev => ({ ...prev, utrNumber: 'confirmed' }));
      }
      toast({ type: 'success', title: 'Evidence Verified', body: 'OCR successfully extracted transaction details' });
    }
  };

  // Final complaint submission
  const handleFinalSubmit = async () => {
    if (!declarationAccepted) {
      toast({ type: 'error', title: 'Declaration Required', body: 'Please accept the mandatory legal undertaking before submission' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        category: 'upi_fraud',
        title: `${category} - ${subCategory} (₹${fraudAmount || '0'})`,
        description: incidentDescription || 'Official cybercrime complaint lodged via CasePilot portal.',
        incidentDate: incidentDate || new Date().toISOString(),
        incidentLocation: `${district}, ${stateUt}`,
        platform: whereOccurred,
        transaction: {
          amountLost: parseFloat(fraudAmount) || 0,
          bankName,
          upiRef: utrNumber || undefined,
          paymentMode,
        },
        suspects: suspectIdentifiers.map(i => ({ [i.type]: i.value })),
        victim: {
          name: isAnonymous ? 'ANONYMOUS CITIZEN' : 'Anuroop Demo',
          mobile: isAnonymous ? 'HIDDEN' : '9989284448',
          email: isAnonymous ? 'HIDDEN' : 'anuroop@casepilot.in',
        },
      };

      const res = await api.cases.create(payload).catch(() => null);
      if (res?.id) await api.cases.submit(res.id).catch(() => null);

      const caseNo = `CYB-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
      setSubmittedCaseNumber(caseNo);
      toast({ type: 'success', title: 'Complaint Registered', body: 'Official cybercrime acknowledgment generated!' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Field badge rendering
  const renderFieldStateBadge = (fieldKey: string) => {
    const status = fieldStates[fieldKey] || 'empty';
    if (status === 'ai-captured') {
      return (
        <span style={{ fontSize: 10, background: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD', padding: '2px 7px', borderRadius: 4, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icons.Sparkles /> AI Captured
        </span>
      );
    }
    if (status === 'user-edited') {
      return (
        <span style={{ fontSize: 10, background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', padding: '2px 7px', borderRadius: 4, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icons.Edit /> User Edited
        </span>
      );
    }
    if (status === 'confirmed') {
      return (
        <span style={{ fontSize: 10, background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', padding: '2px 7px', borderRadius: 4, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icons.Check /> Confirmed
        </span>
      );
    }
    if (status === 'needs-review') {
      return (
        <span style={{ fontSize: 10, background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', padding: '2px 7px', borderRadius: 4, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icons.AlertTriangle /> Needs Review
        </span>
      );
    }
    return null;
  };

  // Field styling
  const getFieldInputStyle = (fieldKey: string) => {
    const status = fieldStates[fieldKey] || 'empty';
    let borderColor = '#CBD5E1';
    let background = '#FFFFFF';
    if (status === 'ai-captured') { borderColor = '#38BDF8'; background = '#F0F9FF'; }
    else if (status === 'user-edited') { borderColor = '#FBBF24'; background = '#FFFBEB'; }
    else if (status === 'confirmed') { borderColor = '#4ADE80'; background = '#F0FDF4'; }
    else if (status === 'needs-review') { borderColor = '#F87171'; background = '#FEF2F2'; }

    return {
      border: `1px solid ${borderColor}`,
      background,
      transition: 'border-color 150ms ease, background-color 150ms ease',
    };
  };

  // Adaptive tabs within Register
  const isFinancial = category === 'Online Financial Fraud' || category === 'Job Fraud / Matrimonial Fraud';
  const isHacking = category === 'Hacking / Defacement / Virus / Ransomware';
  const isSocial = category === 'Online and Social Media Related Crime';
  const isSensitiveWomen = category === 'Women & Children Related Crime';

  const registerTabs = [
    { id: 0, label: 'Complaint & Incident Details' },
    { id: 1, label: 'Suspect Details' },
    ...(isFinancial ? [{ id: 2, label: 'Financial Details' }] :
       isHacking ? [{ id: 2, label: 'System & Attack Details' }] :
       isSocial ? [{ id: 2, label: 'Platform & Impersonation' }] :
       isSensitiveWomen ? [{ id: 2, label: 'Sensitive Incident Pathway' }] :
       [{ id: 2, label: 'Specific Details' }]),
    { id: 3, label: `Evidence (${evidenceList.length})` },
    { id: 4, label: 'Review & Submit' },
  ];

  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  return (
    <div
      id="three-zone-workspace"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#F8FAFC',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── TOP HEADER: Extends completely across full workspace width ── */}
      <PortalHeader activeTab={primaryTab} onTabChange={setPrimaryTab} />

      {/* ── Main Dual-Zone Split: Middle Web Portal + Right AI Assistant ── */}
      <div
        id="portal-and-ai-container"
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          minWidth: 0,
          background: '#F8FAFC',
        }}
      >
        {/* ════════════════════════════════════════════════════════════════
            ZONE 2 (MIDDLE): THE COMPREHENSIVE WEB PORTAL WORKSPACE
            Framed with clean left and right borders
           ════════════════════════════════════════════════════════════════ */}
        <div
          id="middle-web-portal"
          style={{
            flex: aiOpen ? '1 1 58%' : '1 1 100%',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #E2E8F0',
            borderRight: '1px solid #E2E8F0',
            background: '#FFFFFF',
            overflow: 'hidden',
            minWidth: 0,
            transition: 'flex 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >

          {/* ════════════════════════════════════════════════════════════
              MODULE 1: HOME TAB WORKSPACE (HealthSutra Style)
             ════════════════════════════════════════════════════════════ */}
          {primaryTab === 'home' && (
            <HomePortalView
              cases={cases}
              userName="Anuroop"
              onSelectCategory={(cat, sub) => {
                setCategory(cat);
                if (sub) setSubCategory(sub);
              }}
              onNavigateToRegister={(cat, sub, mode) => {
                if (cat) setCategory(cat);
                if (sub) setSubCategory(sub);
                if (mode === 'ai') {
                  startAiIntake();
                } else {
                  setPrimaryTab('register');
                }
              }}
              onNavigateToTrack={(caseId) => {
                if (caseId) setSelectedCaseId(caseId);
                setPrimaryTab('track');
              }}
              onStartAiIntake={startAiIntake}
            />
          )}

          {/* ════════════════════════════════════════════════════════════
              MODULE 2: REGISTER A COMPLAINT WORKSPACE (Contained Portal)
             ════════════════════════════════════════════════════════════ */}
          {primaryTab === 'register' && (
            <ComplaintWorkspaceView
              registerSubTab={registerSubTab}
              onSubTabChange={setRegisterSubTab}
              registerTabs={registerTabs}
              category={category}
              setCategory={setCategory}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
              CATEGORIES={CATEGORIES}
              incidentDate={incidentDate}
              setIncidentDate={setIncidentDate}
              incidentHour={incidentHour}
              setIncidentHour={setIncidentHour}
              incidentMin={incidentMin}
              setIncidentMin={setIncidentMin}
              incidentAmPm={incidentAmPm}
              setIncidentAmPm={setIncidentAmPm}
              stateUt={stateUt}
              setStateUt={setStateUt}
              district={district}
              setDistrict={setDistrict}
              INDIAN_STATES={INDIAN_STATES}
              whereOccurred={whereOccurred}
              setWhereOccurred={setWhereOccurred}
              CRIME_LOCATIONS={CRIME_LOCATIONS}
              policeStation={policeStation}
              setPoliceStation={setPoliceStation}
              incidentDescription={incidentDescription}
              setIncidentDescription={setIncidentDescription}
              suspectName={suspectName}
              setSuspectName={setSuspectName}
              suspectIdentifiers={suspectIdentifiers}
              newIdType={newIdType}
              setNewIdType={setNewIdType}
              newIdVal={newIdVal}
              setNewIdVal={setNewIdVal}
              onAddSuspectIdentifier={addSuspectIdentifier}
              onRemoveSuspectIdentifier={removeSuspectIdentifier}
              isFinancial={isFinancial}
              bankName={bankName}
              setBankName={setBankName}
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              utrNumber={utrNumber}
              setUtrNumber={setUtrNumber}
              fraudAmount={fraudAmount}
              setFraudAmount={setFraudAmount}
              beneficiaryAccount={beneficiaryAccount}
              setBeneficiaryAccount={setBeneficiaryAccount}
              isHacking={isHacking}
              affectedDevice={affectedDevice}
              setAffectedDevice={setAffectedDevice}
              ransomExtension={ransomExtension}
              setRansomExtension={setRansomExtension}
              ransomDemand={ransomDemand}
              setRansomDemand={setRansomDemand}
              ransomAddress={ransomAddress}
              setRansomAddress={setRansomAddress}
              isSocial={isSocial}
              socialPlatform={socialPlatform}
              setSocialPlatform={setSocialPlatform}
              offenderHandle={offenderHandle}
              setOffenderHandle={setOffenderHandle}
              harassmentNature={harassmentNature}
              setHarassmentNature={setHarassmentNature}
              evidenceList={evidenceList}
              onEvidenceUpload={handleEvidenceUpload}
              onEvidenceRemove={(id) => setEvidenceList(prev => prev.filter(item => item.id !== id))}
              collapsedReviewSections={collapsedReviewSections}
              onToggleReviewSection={(sec) => setCollapsedReviewSections(prev => ({ ...prev, [sec]: !prev[sec] }))}
              declarationAccepted={declarationAccepted}
              setDeclarationAccepted={setDeclarationAccepted}
              isSubmitting={isSubmitting}
              onSubmit={handleFinalSubmit}
              onSaveDraft={() => toast({ type: 'info', title: 'Draft Saved', body: 'Draft saved to your account.' })}
              fieldStates={fieldStates}
              fieldConflicts={fieldConflicts}
              onResolveConflict={resolveConflict}
              onUserEdit={handleUserEdit}
            />
          )}

          {/* ════════════════════════════════════════════════════════════
              MODULE 3: TRACK & TAKE ACTION WORKSPACE (Table + Timeline)
             ════════════════════════════════════════════════════════════ */}
          {primaryTab === 'track' && (
            <TrackCasePortalView
              cases={cases}
              selectedCaseId={selectedCaseId}
              onSelectCaseId={setSelectedCaseId}
              onGrievanceEscalate={() => toast({ type: 'success', title: 'Grievance Submitted', body: 'Escalation sent to State Nodal Cybercrime Officer.' })}
            />
          )}

          {/* ════════════════════════════════════════════════════════════
              MODULE 4: HELP & CITIZEN GUIDANCE WORKSPACE
             ════════════════════════════════════════════════════════════ */}
          {primaryTab === 'help' && (
            <HelpPortalView />
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            ZONE 3 (RIGHT): DEDICATED CASEPILOT AI ASSISTANT
            Embedded intake driver operating alongside the Middle Portal
           ════════════════════════════════════════════════════════════════ */}
        {/* ════════════════════════════════════════════════════════════════
            ZONE 3 (RIGHT): THE CASEPILOT AI ASSISTANT PANEL
            Rendered ONLY when aiOpen is true (after user clicks "Start")
           ════════════════════════════════════════════════════════════════ */}
        {/* ════════════════════════════════════════════════════════════════
            ZONE 3 (RIGHT): FLOATING AI CARD (ChatGPT Style)
            Rendered ONLY when aiOpen is true (after user clicks "Start")
           ════════════════════════════════════════════════════════════════ */}
        {aiOpen && (
          <div
            id="right-ai-container"
            style={{
              width: 440,
              maxWidth: '35vw',
              minWidth: 380,
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 20px 20px 16px',
              background: 'transparent',
              borderLeft: 'none',
              boxSizing: 'border-box',
              flexShrink: 0,
            }}
          >
            {/* THE BIG CARD */}
            <div
              id="ai-chat-card"
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              {/* Card Header: CasePilot + Close */}
              <div
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                    }}
                  >
                    <Icons.Sparkles />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', fontFamily: "'Manrope', Helvetica, sans-serif" }}>
                    CasePilot
                  </div>
                </div>

                <button
                  type="button"
                  id="close-ai-card-btn"
                  onClick={() => setAiOpen(false)}
                  title="Close CasePilot AI"
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748B',
                    fontSize: 13,
                    fontWeight: 600,
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#F1F5F9';
                    e.currentTarget.style.color = '#0F172A';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Conversation Stream inside Card */}
              <div
                id="ai-messages-container"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  background: '#FFFFFF',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
            {/* Empty State Hero — dark background edition */}
            {chatMessages.length === 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  margin: 'auto 0',
                  padding: '0 16px',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Manrope', Helvetica, sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#F8FAFC',
                    margin: '0 0 6px',
                  }}
                >
                  What happened?
                </h2>
                <p
                  style={{
                    fontSize: 12.5,
                    color: '#94A3B8',
                    maxWidth: 380,
                    margin: '0 0 16px',
                    lineHeight: 1.5,
                  }}
                >
                  Tell me what occurred in plain words. I will populate the official cybercrime record in the central portal as you speak.
                </p>

                {/* Prompt Starters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 380, textAlign: 'left' }}>
                  {[
                    {
                      label: 'Bank Impersonation KYC Call (₹75,000)',
                      prompt: 'Someone called me saying they were from SBI. They told me my KYC was expiring and sent me a link. I clicked it and 75,000 rupees was transferred from my account.',
                    },
                    {
                      label: 'Telegram Task Job Scam (₹45,000)',
                      prompt: 'I lost ₹45,000 to a fake Telegram job task scam. Scammer UPI is taskpay@okhdfcbank and UTR is 418293847291 from HDFC Bank.',
                    },
                    {
                      label: 'Instagram Blackmail / Extortion',
                      prompt: 'Someone on Instagram with handle @riya_cyber_xx is blackmailing me with morphed private photos and demanding ₹15,000.',
                    },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendChatMessage(p.prompt)}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 8,
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: 12.5,
                        color: '#CBD5E1',
                        lineHeight: 1.4,
                        fontFamily: "'Manrope', Helvetica, sans-serif",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#14B8A6')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Active Messages Stream */}
            {chatMessages.map(msg => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '11px 15px',
                      borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      background: isUser ? '#135D66' : '#FFFFFF',
                      color: isUser ? '#FFFFFF' : '#0F172A',
                      fontSize: 12.5,
                      lineHeight: 1.5,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      border: isUser ? 'none' : '1px solid #E2E8F0',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: msg.subText ? 4 : 0 }}>{msg.text}</div>
                    {msg.subText && (
                      <div style={{ fontSize: 12, color: '#475569', marginBottom: 8, lineHeight: 1.4 }}>{msg.subText}</div>
                    )}

                    {/* Pathway Options Interactive Buttons */}
                    {msg.pathwayOptions && msg.pathwayOptions.length > 0 && (
                      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                        {msg.pathwayOptions.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handlePathwaySelect(opt)}
                            style={{
                              padding: '8px 12px',
                              background: opt === "I'm not sure" ? '#F8FAFC' : '#FFFFFF',
                              border: opt === "I'm not sure" ? '1.5px dashed #0F766E' : '1px solid #14B8A6',
                              color: '#0F766E',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'left',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 150ms ease',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#F0FDFA';
                              e.currentTarget.style.borderColor = '#0F766E';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = opt === "I'm not sure" ? '#F8FAFC' : '#FFFFFF';
                              e.currentTarget.style.borderColor = opt === "I'm not sure" ? '#0F766E' : '#14B8A6';
                            }}
                          >
                            <span>{opt}</span>
                            <Icons.ArrowRight />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Agentic Live Steps */}
                    {msg.agentSteps && msg.agentSteps.length > 0 && (
                      <div
                        style={{
                          marginTop: 10,
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: 8,
                          padding: '10px 12px',
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Icons.Sparkles /> Live Agent Updates
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {msg.agentSteps.map((step, sIdx) => (
                            <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: step.status === 'warning' ? '#B45309' : '#334155' }}>
                              {step.status === 'done' ? (
                                <span style={{ color: '#16A34A', fontWeight: 700 }}>✓</span>
                              ) : (
                                <span style={{ color: '#D97706', fontWeight: 700 }}>⚠</span>
                              )}
                              <span>{step.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.extractedPills && msg.extractedPills.length > 0 && (
                      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {msg.extractedPills.map((pill, pIdx) => (
                          <span
                            key={pIdx}
                            style={{
                              fontSize: 10.5,
                              background: '#F0FDF4',
                              color: '#166534',
                              border: '1px solid #BBF7D0',
                              padding: '2px 7px',
                              borderRadius: 4,
                              fontWeight: 600,
                            }}
                          >
                            ✓ {pill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 4, padding: '0 4px' }}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isAiProcessing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: '#FFFFFF', borderRadius: 6, width: 'fit-content', border: '1px solid #E2E8F0' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#135D66', animation: 'pulse 1s infinite' }} />
                <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500 }}>
                  CasePilot AI is updating middle portal record...
                </span>
              </div>
            )}

            <div ref={chatScrollRef} />
          </div>

          {/* Fixed Bottom Input Composer */}
          <div
            id="ai-fixed-composer"
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #E2E8F0',
              background: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: 8,
                padding: '6px 10px',
              }}
            >
              <button
                type="button"
                onClick={() => handleEvidenceUpload('sbi_debit_alert.png', '52000', '418293847291')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Attach Bank Screenshot or Proof"
              >
                <Icons.Attach />
              </button>

              <textarea
                rows={1}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage(chatInput);
                  }
                }}
                placeholder="Describe incident or answer AI follow-ups..."
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 12.5,
                  resize: 'none',
                  fontFamily: 'inherit',
                  lineHeight: 1.4,
                  maxHeight: 80,
                }}
              />

              <button
                type="button"
                disabled={!chatInput.trim() || isAiProcessing}
                onClick={() => sendChatMessage(chatInput)}
                style={{
                  background: chatInput.trim() && !isAiProcessing ? '#135D66' : '#E2E8F0',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  padding: 6,
                  cursor: chatInput.trim() && !isAiProcessing ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 150ms ease',
                }}
                title="Send Message"
              >
                <Icons.Send />
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>

      {/* ── Submission Acknowledgment Modal ── */}
      {submittedCaseNumber && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 12,
              padding: 28,
              maxWidth: 480,
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <Icons.Check />
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
              Complaint Registered Successfully!
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748B' }}>
              Your cybercrime complaint has been officially lodged and assigned to the State Cyber Crime Cell.
            </p>

            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Complaint Acknowledgment Number
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#135D66', letterSpacing: '0.04em', marginTop: 4, fontFamily: 'monospace' }}>
                {submittedCaseNumber}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(submittedCaseNumber);
                  toast({ type: 'info', title: 'Copied', body: 'Case number copied to clipboard' });
                }}
                style={{ flex: 1, padding: '9px 14px', borderRadius: 6, border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
              >
                Copy Case No
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmittedCaseNumber(null);
                  setSelectedCaseId(submittedCaseNumber);
                  setPrimaryTab('track');
                }}
                style={{ flex: 1.2, padding: '9px 14px', borderRadius: 6, border: 'none', background: '#0284C7', color: '#FFFFFF', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
              >
                Track Status & Actions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
