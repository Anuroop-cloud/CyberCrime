'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useToast } from '@/lib/toast-context';
import { PortalHeader } from './PortalHeader';
import { HomePortalView } from './HomePortalView';
import { ComplaintPathwaySelectorView } from './ComplaintPathwaySelectorView';
import { DynamicComplaintWorkspace } from './DynamicComplaintWorkspace';
import { TrackCasePortalView } from './TrackCasePortalView';
import { HelpPortalView } from './HelpPortalView';
import { Icons } from './Icons';
import { FlowId } from '@/lib/complaint-flows/types';
import { COMPLAINT_FLOWS } from '@/lib/complaint-flows/flows';
import { getActiveTabsForFlow } from '@/lib/complaint-flows/flow-engine';
import { getDefaultCaseStateForFlow } from '@/lib/complaint-flows/default-states';
import { CasesStore } from '@/lib/cases-store';
import { Case, EvidenceItem, FieldConflict } from '@/types/case-model';
import { speechService, ttsService } from '@/lib/speech-service';
import { processUploadedEvidence, detectEvidenceConflicts } from '@/lib/evidence-pipeline';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  subText?: string;
  timestamp: string;
  extractedPills?: string[];
  pathwayOptions?: string[];
  agentSteps?: { label: string; status: 'done' | 'pending' | 'warning' }[];
}

interface WorkspaceProps {
  initialTab?: 'home' | 'register' | 'track' | 'help';
}

export function CyberCrimePortalWorkspace({ initialTab }: WorkspaceProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { toast } = useToast();

  const getStartingTab = (): 'home' | 'register' | 'track' | 'help' => {
    if (initialTab) return initialTab;
    const tabParam = searchParams?.get('tab');
    if (tabParam === 'home' || tabParam === 'register' || tabParam === 'track' || tabParam === 'help') {
      return tabParam;
    }
    if (pathname === '/complaints/new') return 'register';
    if (pathname === '/track') return 'track';
    return 'home';
  };

  // ── Navigation State ──────────────────────────────────────────
  const [primaryTab, setPrimaryTab] = useState<'home' | 'register' | 'track' | 'help'>(getStartingTab);
  const [registerSubTab, setRegisterSubTab] = useState(0);
  const [intakeMode, setIntakeMode] = useState<'manual' | 'ai'>('ai');

  // Synchronize tab with sidebar custom events
  useEffect(() => {
    const handlePortalTab = (e: Event) => {
      const customEvent = e as CustomEvent<'home' | 'register' | 'track' | 'help'>;
      if (customEvent.detail && ['home', 'register', 'track', 'help'].includes(customEvent.detail)) {
        setPrimaryTab(customEvent.detail);
      }
    };
    window.addEventListener('portalTabChange', handlePortalTab);
    return () => window.removeEventListener('portalTabChange', handlePortalTab);
  }, []);

  // Synchronize tab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams?.get('tab') as 'home' | 'register' | 'track' | 'help' | null;
    if (tabParam && ['home', 'register', 'track', 'help'].includes(tabParam)) {
      setPrimaryTab(tabParam);
    }
  }, [searchParams]);

  // ── Canonical Cases Store ──────────────────────────────────────
  const [cases, setCases] = useState<Case[]>(() => CasesStore.getAllCases());
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CC-2026-88192');

  // ── Dynamic Complaint Flow State ──────────────────────────────
  const [selectedPathway, setSelectedPathway] = useState<FlowId | null>(null);
  const [flowId, setFlowId] = useState<FlowId>('FINANCIAL_FRAUD');
  const [caseState, setCaseState] = useState<Record<string, any>>(() =>
    getDefaultCaseStateForFlow('FINANCIAL_FRAUD')
  );

  const [fieldStatuses, setFieldStatuses] = useState<Record<string, 'empty' | 'ai-captured' | 'user-edited' | 'confirmed'>>({});
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [conflicts, setConflicts] = useState<FieldConflict[]>([]);

  // Compute dynamic active tabs for current flow & case state
  const activeTabs = getActiveTabsForFlow(flowId, caseState);
  const currentFlowConfig = COMPLAINT_FLOWS[flowId] || COMPLAINT_FLOWS.FINANCIAL_FRAUD;

  // ── AI Panel & Multimodal Composer State ────────────────────────
  const [aiOpen, setAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      text: 'What kind of complaint are you trying to make?',
      subText: 'You can choose a reporting pathway below, speak using the mic, upload proof, or simply tell me what happened in your own words.',
      timestamp: '08:41 PM',
      pathwayOptions: [
        'Financial Fraud (UPI / Netbanking / Cards)',
        'Social Media / Fake Profile Impersonation',
        'Hacking & Account Compromise',
        'Ransomware & Encrypted Files',
        'Women & Children Related Crime (Confidential)',
        "I'm not sure"
      ]
    }
  ]);

  // Keep cases in sync with storage
  useEffect(() => {
    setCases(CasesStore.getAllCases());
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiProcessing]);

  // Handle Field Updates
  const handleFieldChange = (fieldId: string, value: any, isUserEdit: boolean = true) => {
    setCaseState(prev => ({ ...prev, [fieldId]: value }));
    setFieldStatuses(prev => ({
      ...prev,
      [fieldId]: isUserEdit ? 'user-edited' : 'ai-captured'
    }));
  };

  // Handle Evidence Addition & Live Conflict Check
  const handleAddEvidence = (item: EvidenceItem) => {
    setEvidenceList(prev => [item, ...prev]);

    // Check for conflicting amounts or data
    const conflict = detectEvidenceConflicts(item, caseState);
    if (conflict) {
      setConflicts(prev => [conflict, ...prev]);
      // Also notify in chat
      setChatMessages(prev => [
        ...prev,
        {
          id: 'conf-notice-' + Date.now(),
          role: 'assistant',
          text: `⚠️ Evidence Discrepancy Found in "${item.name}"`,
          subText: `You reported ${conflict.reportedValue}, but the uploaded file indicates ${conflict.evidenceValue}. You can resolve this discrepancy in the complaint form review.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }

    toast({
      type: 'success',
      title: 'Evidence Verified',
      body: `${item.name} uploaded and hashed via SHA-256.`
    });
  };

  const handleRemoveEvidence = (id: string) => {
    setEvidenceList(prev => prev.filter(e => e.id !== id));
    toast({ type: 'info', title: 'File Removed', body: 'Evidence item removed from complaint.' });
  };

  const handleResolveConflict = (conflictId: string, resolvedValue: string) => {
    setConflicts(prev => prev.map(c => c.id === conflictId ? { ...c, resolved: true, resolvedValue } : c));
    handleFieldChange('fraudAmount', resolvedValue, true);
    toast({ type: 'success', title: 'Discrepancy Resolved', body: `Amount updated to ₹${Number(resolvedValue).toLocaleString('en-IN')}` });
  };

  // ── Voice Input (Speech Recognition) ──────────────────────────
  const toggleVoiceRecording = () => {
    if (isListeningVoice) {
      speechService.stop();
      setIsListeningVoice(false);
    } else {
      const started = speechService.start(
        (transcript, isFinal) => {
          setChatInput(transcript);
        },
        error => {
          toast({ type: 'error', title: 'Microphone Error', body: error });
          setIsListeningVoice(false);
        },
        () => {
          setIsListeningVoice(false);
        }
      );
      if (started) {
        setIsListeningVoice(true);
      }
    }
  };

  // ── Text To Speech ────────────────────────────────────────────
  const playSpeech = (msgId: string, text: string) => {
    if (activeSpeakingMsgId === msgId) {
      ttsService.stop();
      setActiveSpeakingMsgId(null);
    } else {
      ttsService.speak(
        text,
        () => setActiveSpeakingMsgId(msgId),
        () => setActiveSpeakingMsgId(null)
      );
    }
  };

  // ── Real Chat Attachment Handler ──────────────────────────────
  const handleChatFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const item = await processUploadedEvidence(file);
      handleAddEvidence(item);

      setChatMessages(prev => [
        ...prev,
        {
          id: 'user-ev-' + Date.now(),
          role: 'user',
          text: `Attached file: ${file.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'ai-ev-resp-' + Date.now(),
          role: 'assistant',
          text: `✓ Received and hashed "${file.name}"`,
          subText: `SHA-256: ${item.sha256.substring(0, 20)}... Metadata logged in Evidence tab.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          extractedPills: item.extractedMetadata?.amount ? [`Amount: ₹${item.extractedMetadata.amount}`, `UTR: ${item.extractedMetadata.utr || 'Auto-matched'}`] : undefined
        }
      ]);
    }
    if (chatFileInputRef.current) chatFileInputRef.current.value = '';
  };

  // ── AI Message Processing & Intent Classification ────────────
  const sendChatMessage = (userQuery: string) => {
    if (!userQuery.trim() || isAiProcessing) return;

    const query = userQuery.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => [
      ...prev,
      { id: 'usr-' + Date.now(), role: 'user', text: query, timestamp: nowTime }
    ]);
    setChatInput('');
    setIsAiProcessing(true);

    setTimeout(() => {
      processAiIntent(query);
      setIsAiProcessing(false);
    }, 700);
  };

  const processAiIntent = (text: string) => {
    const lower = text.toLowerCase();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let detectedFlow: FlowId = flowId;
    let extractedPills: string[] = [];
    let responseText = '';
    let responseSub = '';

    // 1. Classification & Dynamic State Segregation
    if (lower.includes('telegram') || lower.includes('task') || lower.includes('lost') || lower.includes('stolen') || lower.includes('upi') || lower.includes('45000') || lower.includes('52000') || lower.includes('75000')) {
      detectedFlow = 'FINANCIAL_FRAUD';
      setFlowId('FINANCIAL_FRAUD');
      const freshState = getDefaultCaseStateForFlow('FINANCIAL_FRAUD', text);

      // Extract amount
      const amtMatch = text.match(/(?:rs\.?|₹|inr)?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i);
      const utrMatch = text.match(/\b(\d{12})\b/);
      const upiMatch = text.match(/([a-z0-9.\-_]+@(?:oksbi|okaxis|okicici|okhdfcbank|ybl|upi|paytm))/i);

      if (amtMatch && parseFloat(amtMatch[1].replace(/,/g, '')) > 500) {
        const amt = amtMatch[1].replace(/,/g, '');
        freshState.fraudAmount = amt;
        extractedPills.push(`Defrauded: ₹${amt}`);
      }
      if (utrMatch) {
        freshState.utrNumber = utrMatch[1];
        extractedPills.push(`UTR: ${utrMatch[1]}`);
      }
      if (upiMatch) {
        freshState.beneficiaryAccount = upiMatch[1];
        extractedPills.push(`Beneficiary: ${upiMatch[1]}`);
      }

      setCaseState(freshState);
      setFieldStatuses({
        ...(freshState.fraudAmount ? { fraudAmount: 'ai-captured' } : {}),
        ...(freshState.utrNumber ? { utrNumber: 'ai-captured' } : {}),
      });

      responseText = 'I have classified your incident as Online Financial Fraud.';
      responseSub = 'I have extracted your transaction details and updated the portal. The Golden Hour 1930 inter-bank freeze sequence is active.';
    } else if (lower.includes('instagram') || lower.includes('fake profile') || lower.includes('impersonat') || lower.includes('@') || lower.includes('defam')) {
      detectedFlow = 'SOCIAL_MEDIA';
      setFlowId('SOCIAL_MEDIA');
      const freshState = getDefaultCaseStateForFlow('SOCIAL_MEDIA', text);

      const handleMatch = text.match(/@([a-zA-Z0-9._]{3,30})/);
      if (handleMatch) {
        freshState.offenderHandle = `@${handleMatch[1]}`;
        freshState.profileUrl = `https://instagram.com/${handleMatch[1]}`;
        extractedPills.push(`Handle: @${handleMatch[1]}`);
      }
      freshState.socialPlatform = 'Instagram';
      setCaseState(freshState);
      setFieldStatuses({
        socialPlatform: 'ai-captured',
        ...(freshState.offenderHandle ? { offenderHandle: 'ai-captured', profileUrl: 'ai-captured' } : {}),
      });

      responseText = 'I have switched the portal to Social Media & Impersonation.';
      responseSub = 'Notice that Financial Details has been completely removed. Platform Details is now active to generate a Section 79 Intermediary Takedown Notice.';
    } else if (lower.includes('hack') || lower.includes('gmail') || lower.includes('2fa') || lower.includes('password changed')) {
      detectedFlow = 'HACKING';
      setFlowId('HACKING');
      const freshState = getDefaultCaseStateForFlow('HACKING', text);
      setCaseState(freshState);
      setFieldStatuses({});
      responseText = 'I have loaded the Hacking & Account Compromise pathway.';
      responseSub = 'I am tracking unauthorized logins, recovery phone alterations, and 2FA bypass events.';
    } else if (lower.includes('ransom') || lower.includes('.locked') || lower.includes('encrypted') || lower.includes('bitcoin')) {
      detectedFlow = 'RANSOMWARE';
      setFlowId('RANSOMWARE');
      const freshState = getDefaultCaseStateForFlow('RANSOMWARE', text);
      setCaseState(freshState);
      setFieldStatuses({});
      responseText = 'Emergency: Ransomware Infection Pathway Active.';
      responseSub = 'CERT-In protocol loaded. Please do not pay extortion demands without forensic coordination.';
    } else if (lower.includes('minor') || lower.includes('blackmail') || lower.includes('csam') || lower.includes('morphed private')) {
      detectedFlow = 'WOMEN_CHILDREN';
      setFlowId('WOMEN_CHILDREN');
      const freshState = getDefaultCaseStateForFlow('WOMEN_CHILDREN', text);
      setCaseState(freshState);
      setFieldStatuses({});
      responseText = 'Confidential Women & Children Protective Pathway Initialized.';
      responseSub = 'Under NCRP provisions, you may choose to submit 100% Anonymously. Emergency takedown has been staged.';
    } else {
      responseText = 'Understood. I have recorded your statement in your incident narrative.';
      responseSub = 'Please answer the next prompt or review the active fields on the left.';
      handleFieldChange('incidentDescription', text, false);
    }

    setSelectedPathway(detectedFlow);
    setPrimaryTab('register');

    const newMsg: ChatMessage = {
      id: 'ai-' + Date.now(),
      role: 'assistant',
      text: responseText,
      subText: responseSub,
      timestamp: nowTime,
      extractedPills: extractedPills.length > 0 ? extractedPills : undefined,
      agentSteps: [
        { label: `Pathway routed to ${COMPLAINT_FLOWS[detectedFlow].title}`, status: 'done' },
        { label: 'Middle portal fields synced dynamically', status: 'done' },
        { label: 'Evidence verification listener running', status: 'done' }
      ]
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Auto-speak if voice mode enabled
    if (voiceModeActive) {
      ttsService.speak(responseText);
    }
  };

  const handlePathwaySelect = (pathwayLabel: string) => {
    let targetFlow: FlowId = 'FINANCIAL_FRAUD';
    if (pathwayLabel.includes('Financial')) targetFlow = 'FINANCIAL_FRAUD';
    else if (pathwayLabel.includes('Social')) targetFlow = 'SOCIAL_MEDIA';
    else if (pathwayLabel.includes('Hacking')) targetFlow = 'HACKING';
    else if (pathwayLabel.includes('Ransomware')) targetFlow = 'RANSOMWARE';
    else if (pathwayLabel.includes('Women')) targetFlow = 'WOMEN_CHILDREN';

    setFlowId(targetFlow);
    setSelectedPathway(targetFlow);
    setPrimaryTab('register');
    setRegisterSubTab(0);

    setChatMessages(prev => [
      ...prev,
      {
        id: 'usr-sel-' + Date.now(),
        role: 'user',
        text: pathwayLabel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'ai-sel-' + Date.now(),
        role: 'assistant',
        text: `Switched to ${COMPLAINT_FLOWS[targetFlow].title}`,
        subText: 'The complaint tabs and fields have adapted to match this specific cybercrime classification.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // ── Draft & Submission Handlers ────────────────────────────────
  const handleSaveDraft = () => {
    const draftId = `DRAFT-${Date.now().toString().slice(-6)}`;
    const newDraft: Case = {
      id: draftId,
      status: 'draft',
      primaryCrimeType: flowId,
      subtype: caseState.subCategory || 'In Progress',
      intakeMode,
      isAnonymous: Boolean(caseState.isAnonymous === 'anonymous'),
      health: 'On Track',
      needsAttention: false,
      incident: {
        date: caseState.incidentDate || '2026-09-05',
        state: caseState.stateUt || 'Delhi',
        district: caseState.district || 'Central',
        description: caseState.incidentDescription || ''
      },
      financial: flowId === 'FINANCIAL_FRAUD' ? {
        lostMoney: true,
        amount: caseState.fraudAmount,
        utr: caseState.utrNumber,
        bank: caseState.bankName,
        paymentMode: caseState.paymentMode
      } : undefined,
      suspect: {
        name: caseState.suspectName,
        identifiers: caseState.suspectIdentifiers || []
      },
      evidence: evidenceList,
      fieldStatuses,
      conflicts,
      workflow: COMPLAINT_FLOWS[flowId].workflowStages.map((s, i) => ({
        stageId: s.id,
        label: s.label,
        description: s.description,
        status: i === 0 ? 'completed' : i === 1 ? 'current' : 'upcoming'
      })),
      events: [
        { id: '1', timestamp: 'Just now', title: 'Draft Saved Locally', desc: 'Case draft saved to your browser session.', source: 'user_reported', type: 'citizen' }
      ],
      nextActions: [
        { id: '1', title: 'Complete Missing Fields', description: 'Review and complete remaining required sections.', type: 'upload_evidence', actionLabel: 'Resume Draft' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    CasesStore.saveCase(newDraft);
    setCases(CasesStore.getAllCases());
    toast({
      type: 'success',
      title: 'Draft Saved',
      body: `Case draft ${draftId} successfully persisted.`
    });
  };

  const handleSubmitComplaint = () => {
    const compId = `CC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const ackNo = `NCRP-2026-${caseState.stateUt?.substring(0, 2).toUpperCase() || 'IN'}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCase: Case = {
      id: compId,
      ackNumber: ackNo,
      status: 'submitted',
      primaryCrimeType: flowId,
      subtype: caseState.subCategory || 'General Incident',
      intakeMode,
      isAnonymous: Boolean(caseState.isAnonymous === 'anonymous'),
      health: flowId === 'FINANCIAL_FRAUD' ? 'Urgent' : 'On Track',
      needsAttention: flowId === 'FINANCIAL_FRAUD',
      incident: {
        date: caseState.incidentDate || new Date().toISOString().split('T')[0],
        state: caseState.stateUt || 'Delhi',
        district: caseState.district || 'Central',
        description: caseState.incidentDescription || ''
      },
      financial: flowId === 'FINANCIAL_FRAUD' ? {
        lostMoney: true,
        amount: caseState.fraudAmount,
        utr: caseState.utrNumber,
        bank: caseState.bankName,
        paymentMode: caseState.paymentMode,
        beneficiaryAccount: caseState.beneficiaryAccount
      } : undefined,
      social: flowId === 'SOCIAL_MEDIA' ? {
        platform: caseState.socialPlatform,
        offenderHandle: caseState.offenderHandle,
        profileUrl: caseState.profileUrl
      } : undefined,
      device: flowId === 'RANSOMWARE' ? {
        deviceType: caseState.affectedDevice,
        ransomExtension: caseState.ransomExtension,
        ransomDemand: caseState.ransomDemand
      } : undefined,
      suspect: {
        name: caseState.suspectName,
        identifiers: caseState.suspectIdentifiers || []
      },
      evidence: evidenceList,
      fieldStatuses,
      conflicts,
      workflow: COMPLAINT_FLOWS[flowId].workflowStages.map((s, i) => ({
        stageId: s.id,
        label: s.label,
        description: s.description,
        status: i === 0 ? 'completed' : i === 1 ? 'current' : 'upcoming',
        date: i === 0 ? 'Just now' : undefined
      })),
      events: [
        { id: '1', timestamp: 'Just now', title: 'Formal NCRP Acknowledgment Generated', desc: `Complaint registered under ${ackNo}.`, source: 'official', type: 'system' },
        { id: '2', timestamp: 'Just now', title: 'State Cyber Cell Dispatched', desc: `Jurisdiction allocated to ${caseState.stateUt || 'National Desk'}.`, source: 'official', type: 'officer' }
      ],
      nextActions: flowId === 'FINANCIAL_FRAUD' ? [
        { id: '1', title: 'Call 1930 Helpline', description: 'Provide token to initiate inter-bank account freeze.', type: 'urgent_call', actionLabel: 'Call 1930 Helpline' }
      ] : [
        { id: '1', title: 'Download Acknowledgment PDF', description: 'Keep digital receipt for your records.', type: 'download_receipt', actionLabel: 'Download Receipt' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    CasesStore.saveCase(newCase);
    setCases(CasesStore.getAllCases());
    setSelectedCaseId(compId);
    setPrimaryTab('track');

    toast({
      type: 'success',
      title: 'Complaint Registered!',
      body: `NCRP Acknowledgement Number: ${ackNo}`
    });
  };

  const handleAddEvidenceToExistingCase = async (caseId: string, file: File) => {
    const item = await processUploadedEvidence(file);
    const existing = CasesStore.getCaseById(caseId);
    if (existing) {
      existing.evidence.push(item);
      existing.events.push({
        id: Date.now().toString(),
        timestamp: 'Just now',
        title: 'Additional Evidence Appended',
        desc: `Citizen uploaded "${file.name}" (SHA-256: ${item.sha256.slice(0, 16)}...).`,
        source: 'user_reported',
        type: 'citizen'
      });
      CasesStore.saveCase(existing);
      setCases(CasesStore.getAllCases());
      toast({ type: 'success', title: 'Evidence Attached', body: `${file.name} added to case ${caseId}.` });
    }
  };

  const handleEscalateGrievance = (caseId: string) => {
    const existing = CasesStore.getCaseById(caseId);
    if (existing) {
      existing.events.push({
        id: Date.now().toString(),
        timestamp: 'Just now',
        title: 'Grievance Escalation Filed',
        desc: 'Escalation sent directly to State Cyber Crime Nodal Officer.',
        source: 'user_reported',
        type: 'citizen'
      });
      existing.needsAttention = false;
      CasesStore.saveCase(existing);
      setCases(CasesStore.getAllCases());
      toast({ type: 'success', title: 'Escalation Registered', body: `Supervisory notice issued for ${caseId}.` });
    }
  };

  return (
    <div
      id="cybercrime-workspace-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#FFFFFF',
        overflow: 'hidden',
        fontFamily: "'Manrope', -apple-system, sans-serif",
      }}
    >
      {/* Hidden File Input for AI composer */}
      <input
        ref={chatFileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.txt,.mp3"
        onChange={handleChatFileSelected}
        style={{ display: 'none' }}
      />

      {/* ── TOP HEADER (Clean, single-row, spacious) ── */}
      <PortalHeader />

      {/* ── Main Dual-Zone Split: Web Portal + Right AI Assistant ── */}
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
            CENTRAL WEB PORTAL CANVAS
           ════════════════════════════════════════════════════════════════ */}
        <div
          id="middle-web-portal"
          style={{
            flex: aiOpen ? '1 1 58%' : '1 1 100%',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #E2E8F0',
            background: '#FFFFFF',
            overflow: 'hidden',
            minWidth: 0,
            transition: 'flex 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* MODULE 1: HOME OVERVIEW */}
          {primaryTab === 'home' && (
            <HomePortalView
              cases={cases as any}
              userName="Anuroop"
              onSelectCategory={(catId) => {
                const targetFlow = (catId as FlowId) || 'FINANCIAL_FRAUD';
                if (COMPLAINT_FLOWS[targetFlow]) {
                  setFlowId(targetFlow);
                  setSelectedPathway(targetFlow);
                  setRegisterSubTab(0);
                  setCaseState(getDefaultCaseStateForFlow(targetFlow));
                  setFieldStatuses({});
                  setConflicts([]);
                  setEvidenceList([]);
                }
                setPrimaryTab('register');
              }}
              onNavigateToRegister={(catId) => {
                if (catId && COMPLAINT_FLOWS[catId as FlowId]) {
                  const targetFlow = catId as FlowId;
                  setFlowId(targetFlow);
                  setSelectedPathway(targetFlow);
                  setRegisterSubTab(0);
                  setCaseState(getDefaultCaseStateForFlow(targetFlow));
                  setFieldStatuses({});
                  setConflicts([]);
                  setEvidenceList([]);
                } else {
                  setSelectedPathway(null);
                }
                setPrimaryTab('register');
              }}
              onNavigateToTrack={(caseId) => {
                if (caseId) setSelectedCaseId(caseId);
                setPrimaryTab('track');
              }}
              onStartAiIntake={() => {
                setAiOpen(true);
              }}
            />
          )}

          {/* MODULE 2: COMPLAINT WORKSPACE (Category Hub or Dynamic Form) */}
          {primaryTab === 'register' && (
            selectedPathway === null ? (
              <ComplaintPathwaySelectorView
                onSelectPathway={(chosenFlow) => {
                  setSelectedPathway(chosenFlow);
                  setFlowId(chosenFlow);
                  setRegisterSubTab(0);
                  setCaseState(getDefaultCaseStateForFlow(chosenFlow));
                  setFieldStatuses({});
                  setConflicts([]);
                  setEvidenceList([]);
                }}
                onStartAiIntake={(initialPrompt) => {
                  setAiOpen(true);
                  if (initialPrompt) {
                    setChatInput(initialPrompt);
                  }
                }}
              />
            ) : (
              <DynamicComplaintWorkspace
                flowConfig={currentFlowConfig}
                activeTabs={activeTabs}
                activeTabIndex={registerSubTab}
                onTabChange={setRegisterSubTab}
                caseState={caseState}
                onFieldChange={handleFieldChange}
                fieldStatuses={fieldStatuses}
                conflicts={conflicts}
                onResolveConflict={handleResolveConflict}
                evidenceList={evidenceList}
                onAddEvidence={handleAddEvidence}
                onRemoveEvidence={handleRemoveEvidence}
                intakeMode={intakeMode}
                onToggleIntakeMode={setIntakeMode}
                onSaveDraft={handleSaveDraft}
                onSubmitComplaint={handleSubmitComplaint}
                onBackToCategories={() => setSelectedPathway(null)}
              />
            )
          )}

          {/* MODULE 3: TRACK & TAKE ACTION */}
          {primaryTab === 'track' && (
            <TrackCasePortalView
              cases={cases}
              selectedCaseId={selectedCaseId}
              onSelectCaseId={setSelectedCaseId}
              onGrievanceEscalate={handleEscalateGrievance}
              onAddEvidenceToCase={handleAddEvidenceToExistingCase}
            />
          )}

          {/* MODULE 4: HELP & GUIDES */}
          {primaryTab === 'help' && (
            <HelpPortalView />
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            ZONE 3 (RIGHT): FLOATING AI CARD (ChatGPT Style)
           ════════════════════════════════════════════════════════════════ */}
        {aiOpen && (
          <div
            id="right-ai-container"
            style={{
              width: 440,
              maxWidth: '36vw',
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
            {/* FLOATING CARD */}
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
              {/* Card Header */}
              <div
                style={{
                  padding: '12px 18px',
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
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                      CasePilot AI Intake
                    </div>
                    <div style={{ fontSize: 10.5, color: '#64748B' }}>
                      Active: {currentFlowConfig.title}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Voice Mode Toggle */}
                  <button
                    type="button"
                    onClick={() => setVoiceModeActive(!voiceModeActive)}
                    title={voiceModeActive ? 'Voice Readout: ON' : 'Voice Readout: OFF'}
                    style={{
                      background: voiceModeActive ? '#DCFCE7' : '#F1F5F9',
                      color: voiceModeActive ? '#15803D' : '#64748B',
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    🔊 {voiceModeActive ? 'Voice ON' : 'Voice OFF'}
                  </button>

                  {/* Minimize Button */}
                  <button
                    type="button"
                    onClick={() => setAiOpen(false)}
                    title="Minimize into Bot Icon"
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '50%',
                      width: 26,
                      height: 26,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#64748B',
                      transition: 'all 150ms ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#E2E8F0';
                      e.currentTarget.style.color = '#0F172A';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.color = '#64748B';
                    }}
                  >
                    <Icons.Minimize />
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiOpen(false)}
                    title="Close AI Panel"
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '50%',
                      width: 26,
                      height: 26,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#64748B',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Chat Stream */}
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
                {chatMessages.map(msg => {
                  const isUser = msg.role === 'user';
                  const isSpeaking = activeSpeakingMsgId === msg.id;

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
                          maxWidth: '88%',
                          padding: '11px 15px',
                          borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          background: isUser ? '#135D66' : '#F8FAFC',
                          color: isUser ? '#FFFFFF' : '#0F172A',
                          fontSize: 12.5,
                          lineHeight: 1.5,
                          border: isUser ? 'none' : '1px solid #E2E8F0',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: msg.subText ? 4 : 0 }}>
                            {msg.text}
                          </div>

                          {/* Listen Button on AI Messages */}
                          {!isUser && (
                            <button
                              type="button"
                              onClick={() => playSpeech(msg.id, msg.text)}
                              title={isSpeaking ? 'Stop speaking' : 'Listen aloud'}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: isSpeaking ? '#0F766E' : '#94A3B8',
                                cursor: 'pointer',
                                padding: 2,
                                fontSize: 13,
                              }}
                            >
                              {isSpeaking ? '⏹' : '🔊'}
                            </button>
                          )}
                        </div>

                        {msg.subText && (
                          <div style={{ fontSize: 12, color: isUser ? '#E0F2FE' : '#475569', marginBottom: 8, lineHeight: 1.4 }}>
                            {msg.subText}
                          </div>
                        )}

                        {/* Interactive Pathway Buttons */}
                        {msg.pathwayOptions && msg.pathwayOptions.length > 0 && (
                          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                            {msg.pathwayOptions.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => handlePathwaySelect(opt)}
                                style={{
                                  padding: '7px 11px',
                                  background: '#FFFFFF',
                                  border: '1px solid #14B8A6',
                                  color: '#0F766E',
                                  borderRadius: 6,
                                  fontSize: 11.5,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  transition: 'all 120ms',
                                }}
                              >
                                <span>{opt}</span>
                                <Icons.ArrowRight />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Extracted Field Pills */}
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
                                  fontWeight: 700,
                                }}
                              >
                                ✓ {pill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 3, padding: '0 4px' }}>
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {isAiProcessing && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: '#F8FAFC', borderRadius: 6, width: 'fit-content', border: '1px solid #E2E8F0' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F766E', animation: 'pulse 1s infinite' }} />
                    <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500 }}>
                      AI is classifying and mapping fields...
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
                {isListeningVoice && (
                  <div style={{ padding: '6px 10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#DC2626', fontSize: 11.5, fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626', animation: 'pulse 0.8s infinite' }} />
                      <span>Listening... Speak your complaint clearly</span>
                    </div>
                    <button type="button" onClick={toggleVoiceRecording} style={{ border: 'none', background: 'none', color: '#991B1B', cursor: 'pointer', fontWeight: 700 }}>
                      Stop
                    </button>
                  </div>
                )}

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
                  {/* Real Attachment Button */}
                  <button
                    type="button"
                    onClick={() => chatFileInputRef.current?.click()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Attach Proof / Screenshot / PDF"
                  >
                    <Icons.Attach />
                  </button>

                  {/* Real Voice Input (Microphone) Button */}
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    style={{
                      background: isListeningVoice ? '#FEF2F2' : 'none',
                      border: isListeningVoice ? '1px solid #FCA5A5' : 'none',
                      borderRadius: 4,
                      color: isListeningVoice ? '#DC2626' : '#64748B',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Voice Input (Speech-to-Text)"
                  >
                    🎤
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
                    placeholder={isListeningVoice ? 'Listening...' : 'Describe incident or answer AI follow-ups...'}
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
                      background: chatInput.trim() && !isAiProcessing ? '#0F766E' : '#E2E8F0',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 6,
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: chatInput.trim() && !isAiProcessing ? 'pointer' : 'not-allowed',
                      flexShrink: 0,
                    }}
                  >
                    <Icons.Send />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            MINIMIZED FLOATING AI BOT ICON
            Always present whenever AI window is minimized
           ════════════════════════════════════════════════════════════════ */}
        {!aiOpen && (
          <div
            id="minimized-ai-bot-icon"
            style={{
              position: 'fixed',
              bottom: 24,
              right: 28,
              zIndex: 99,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={() => setAiOpen(true)}
              title="Open CasePilot AI Assistant"
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0F766E 0%, #0F172A 100%)',
                color: '#FFFFFF',
                border: '2px solid #14B8A6',
                boxShadow: '0 8px 24px -2px rgba(15, 23, 42, 0.35), 0 0 16px rgba(20, 184, 166, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
                e.currentTarget.style.boxShadow = '0 12px 30px -2px rgba(15, 118, 110, 0.5), 0 0 22px rgba(20, 184, 166, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px -2px rgba(15, 23, 42, 0.35), 0 0 16px rgba(20, 184, 166, 0.25)';
              }}
            >
              <Icons.Bot size={26} />

              {/* Glowing Active Online Status Dot */}
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#22C55E',
                  border: '2px solid #0F172A',
                  boxShadow: '0 0 8px #22C55E',
                }}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
