import { FlowId } from './types';
import { COMPLAINT_FLOWS } from './flows';

export function getDefaultCaseStateForFlow(flowId: FlowId, promptNarrative?: string): Record<string, any> {
  const today = new Date().toISOString().split('T')[0];
  const baseState = {
    incidentDate: today,
    incidentTime: '12:00',
    stateUt: 'Maharashtra',
    district: 'Mumbai Suburban',
    incidentDescription: promptNarrative || '',
    declarationAccepted: false,
  };

  switch (flowId) {
    case 'FINANCIAL_FRAUD':
      return {
        ...baseState,
        primaryCrimeType: 'FINANCIAL_FRAUD',
        subCategory: 'UPI / QR Code Fraud',
        fraudAmount: '',
        paymentMode: 'UPI',
        bankName: '',
        utrNumber: '',
        beneficiaryAccount: '',
        lostMoney: 'yes',
        financialImpact: 'yes',
      };

    case 'SOCIAL_MEDIA':
      return {
        ...baseState,
        primaryCrimeType: 'SOCIAL_MEDIA',
        subCategory: 'Fake Profile / Account Impersonation',
        socialPlatform: 'Instagram',
        offenderHandle: '',
        profileUrl: '',
        postUrl: '',
        impersonatedPerson: 'Self',
        reportedToPlatform: 'no',
        suspectName: '',
        suspectIdentifiers: [],
        // Explicitly clear any financial data
        fraudAmount: undefined,
        bankName: undefined,
        utrNumber: undefined,
        paymentMode: undefined,
        beneficiaryAccount: undefined,
        lostMoney: 'no',
        financialImpact: 'no',
      };

    case 'HACKING':
      return {
        ...baseState,
        stateUt: 'Delhi',
        district: 'New Delhi',
        primaryCrimeType: 'HACKING',
        subCategory: 'Email / Gmail / Outlook Hijacking',
        compromisedUsername: '',
        passwordChanged: 'yes',
        recoveryChanged: 'yes',
        twoFactorBypassed: 'yes_bypassed',
        unauthorizedMessages: 'no',
        suspectIp: '',
        suspectIdentifiers: [],
        fraudAmount: undefined,
        bankName: undefined,
        utrNumber: undefined,
        paymentMode: undefined,
        beneficiaryAccount: undefined,
        lostMoney: 'no',
        financialImpact: 'no',
      };

    case 'RANSOMWARE':
      return {
        ...baseState,
        stateUt: 'Gujarat',
        district: 'Ahmedabad',
        primaryCrimeType: 'RANSOMWARE',
        subCategory: 'Ransomware (Files Encrypted / .locked)',
        affectedDevice: 'Windows Laptop / PC',
        ransomExtension: '.locked',
        ransomDemand: '',
        ransomAddress: '',
        systemAccessible: 'bootable',
        suspectName: 'Unknown Threat Group',
        suspectIdentifiers: [],
        fraudAmount: undefined,
        bankName: undefined,
        utrNumber: undefined,
        paymentMode: undefined,
        beneficiaryAccount: undefined,
        lostMoney: 'no',
        financialImpact: 'no',
      };

    case 'PHISHING':
      return {
        ...baseState,
        stateUt: 'Karnataka',
        district: 'Bengaluru Urban',
        primaryCrimeType: 'PHISHING',
        subCategory: 'Fake Bank / KYC Phishing Link',
        communicationMedium: 'SMS',
        phishingUrl: '',
        callerNumber: '',
        claimedEntity: 'Bank / Electricity Department',
        suspectIdentifiers: [],
        lostMoney: 'no',
        financialImpact: 'no',
      };

    case 'HARASSMENT':
      return {
        ...baseState,
        stateUt: 'Kerala',
        district: 'Ernakulam',
        primaryCrimeType: 'HARASSMENT',
        subCategory: 'Persistent Cyberstalking / Tracking',
        communicationMedium: 'WhatsApp',
        harassmentType: 'Abusive Messages & Threatening Calls',
        safetyThreat: 'no',
        offenderKnown: 'unknown',
        suspectName: '',
        suspectIdentifiers: [],
        fraudAmount: undefined,
        bankName: undefined,
        utrNumber: undefined,
        paymentMode: undefined,
        beneficiaryAccount: undefined,
        lostMoney: 'no',
        financialImpact: 'no',
      };

    case 'WOMEN_CHILDREN':
      return {
        ...baseState,
        stateUt: 'Delhi',
        district: 'Central',
        primaryCrimeType: 'WOMEN_CHILDREN',
        subCategory: 'Obscene Content / Non-Consensual Media',
        reportingMode: 'anonymous',
        victimAgeGroup: 'Adult (18+)',
        socialPlatform: 'Telegram',
        profileUrl: '',
        isAnonymous: 'anonymous',
        suspectName: '',
        suspectIdentifiers: [],
        fraudAmount: undefined,
        bankName: undefined,
        utrNumber: undefined,
        paymentMode: undefined,
        beneficiaryAccount: undefined,
        lostMoney: 'no',
        financialImpact: 'no',
      };

    case 'OTHER_CYBERCRIME':
    default:
      return {
        ...baseState,
        primaryCrimeType: 'OTHER_CYBERCRIME',
        subCategory: COMPLAINT_FLOWS[flowId]?.subcategories[0] || 'General Cyber Incident',
        suspectName: '',
        suspectIdentifiers: [],
        lostMoney: 'no',
        financialImpact: 'no',
      };
  }
}
