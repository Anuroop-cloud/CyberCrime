import { Injectable } from '@nestjs/common';
import { AIProvider } from './ai-provider.interface';
import {
  AIIntakeDTO,
  AIIntakeResponse,
  AIFieldExtraction,
  CaseDTO,
  CaseCategory,
  CreateCaseDTO,
} from '../../../shared';

// ─── Regex patterns for extraction ───────────────────────────
const PATTERNS = {
  amount: /(?:rs\.?|₹|inr)\s*([0-9,]+(?:\.[0-9]{1,2})?)/gi,
  utr12: /\b(\d{12})\b/g,
  upiRef: /(?:upi\s*ref(?:erence)?|txn\s*id|transaction\s*id|utr)[:\s#]*([A-Z0-9]{8,22})/gi,
  mobile: /(?:mob(?:ile)?|phone|number|whatsapp)[:\s]*([6-9]\d{9})/gi,
  upiId: /([a-z0-9.\-_]+@(?:oksbi|okaxis|okicici|okhdfcbank|ybl|upi|paytm|ibl|kkbk|axl|federal|airtel))/gi,
  date: /(?:on|dated?|date)[:\s]+(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})/gi,
  bankName: /(?:(?:hdfc|sbi|icici|axis|kotak|pnb|bob|canara|union|idbi|yes)\s*bank|state\s*bank\s*of\s*india)/gi,
  platform: /(?:whatsapp|telegram|instagram|facebook|twitter|linkedin|olx|quikr|google\s*pay|phonepe|paytm|apk|website|sms)/gi,
  telegramHandle: /(?:telegram|t\.me\/|@)([a-zA-Z0-9_]{5,32})/gi,
  instagramHandle: /(?:insta(?:gram)?|ig)[:\s@]*([a-zA-Z0-9._]{3,30})/gi,
  email: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
};

const CATEGORY_KEYWORDS: Array<[CaseCategory, string[]]> = [
  ['upi_fraud', ['upi', 'gpay', 'phonepe', 'paytm', 'bhim', 'transferred', 'scan qr', 'qr code', 'electricity bill apk', 'electricity bill']],
  ['investment_scam', ['investment', 'returns', 'profit', 'trading', 'crypto', 'stock', 'telegram group', 'roi', 'task scam', 'youtube like']],
  ['phishing', ['link', 'clicked', 'fake website', 'otp', 'credentials', 'login', 'bank site', 'fake apk']],
  ['job_fraud', ['job', 'offer letter', 'hr', 'recruitment', 'placement', 'deposit', 'work from home', 'typing work', 'part time job', 'daily task']],
  ['matrimonial_fraud', ['matrimony', 'shaadi', 'jeevansathi', 'marriage', 'bride', 'groom', 'customs fee']],
  ['sextortion', ['intimate', 'blackmail', 'video call', 'nude', 'screenshot', 'private images', 'threatening', 'morphed']],
  ['ransomware', ['ransomware', 'encrypted', 'ransom', '.locked', 'bitcoin', 'decrypt', 'exe', 'files locked']],
  ['cyber_harassment', ['harassment', 'abusive', 'threats', 'stalking', 'threatening messages', 'trolling']],
  ['impersonation', ['fake police', 'cbi', 'customs', 'irs', 'impersonat', 'claimed to be', 'fake profile', 'digital arrest']],
  ['account_compromise', ['hacked', 'compromised', 'unauthorized', 'access', 'password changed', 'instagram hacked']],
  ['otp_fraud', ['otp', 'one time password', 'verification code', 'shared otp']],
  ['credit_debit_fraud', ['credit card', 'debit card', 'atm', 'card fraud', 'cloned', 'pos machine']],
  ['identity_theft', ['aadhaar', 'pan', 'identity', 'documents', 'fake id', 'impersonating me', 'loan app']],
];

function classifyText(text: string): { category: CaseCategory; confidence: number } {
  const lower = text.toLowerCase();
  let bestCategory: CaseCategory = 'other';
  let bestScore = 0;

  for (const [category, keywords] of CATEGORY_KEYWORDS) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return {
    category: bestCategory,
    confidence: Math.min(0.96, 0.45 + bestScore * 0.16),
  };
}

function extractAmount(text: string): number | undefined {
  const matches = [...text.matchAll(/(?:rs\.?|₹|inr)\s*([0-9,]+(?:\.[0-9]{1,2})?)/gi)];
  if (!matches.length) return undefined;
  const amounts = matches.map((m) => parseFloat(m[1].replace(/,/g, '')));
  return Math.max(...amounts);
}

function extractUpi(text: string): string | undefined {
  const m = text.match(/([a-z0-9.\-_]+@(?:oksbi|okaxis|okicici|okhdfcbank|ybl|upi|paytm|ibl|kkbk|axl|federal|airtel))/i);
  return m?.[1];
}

function extractUtr(text: string): string | undefined {
  // First try 12-digit exact UTR
  const twelveDigits = text.match(/\b(\d{12})\b/);
  if (twelveDigits) return twelveDigits[1];

  // Next try general UTR or Txn ID pattern
  const m = text.match(/(?:upi\s*ref(?:erence)?|txn\s*id|transaction\s*id|utr)[:\s#]*([A-Z0-9]{8,22})/i);
  return m?.[1];
}

function extractPlatform(text: string): string | undefined {
  const m = text.match(/(whatsapp|telegram|instagram|facebook|twitter|linkedin|olx|quikr|google\s*pay|phonepe|paytm|groww|zerodha|upstox|binance|coinbase)/i);
  return m?.[1];
}

function extractBank(text: string): string | undefined {
  const m = text.match(/(hdfc|sbi|icici|axis|kotak|pnb|bob|canara|union|idbi|yes|state\s*bank)/i);
  if (!m) return undefined;
  const banks: Record<string, string> = {
    hdfc: 'HDFC Bank',
    sbi: 'State Bank of India',
    icici: 'ICICI Bank',
    axis: 'Axis Bank',
    kotak: 'Kotak Mahindra Bank',
    pnb: 'Punjab National Bank',
    bob: 'Bank of Baroda',
    state: 'State Bank of India',
  };
  return banks[m[1].toLowerCase()] ?? m[1].toUpperCase();
}

function extractPhone(text: string): string | undefined {
  const m = text.match(/(?:[^\d]|^)([6-9]\d{9})(?:[^\d]|$)/);
  return m?.[1];
}

function extractSuspectHandle(text: string): string | undefined {
  const tg = text.match(/(?:telegram|t\.me\/|@)([a-zA-Z0-9_]{5,32})/i);
  if (tg) return '@' + tg[1].replace('@', '');
  const ig = text.match(/(?:insta(?:gram)?|ig)[:\s@]*([a-zA-Z0-9._]{3,30})/i);
  if (ig) return '@' + ig[1].replace('@', '');
  return undefined;
}

@Injectable()
export class MockAiProvider implements AIProvider {
  async classify(text: string) {
    const { category, confidence } = classifyText(text);
    return { category, confidence };
  }

  async runFullPipeline(
    dto: AIIntakeDTO,
    existingCase?: Partial<CaseDTO>,
  ): Promise<AIIntakeResponse> {
    const text = dto.message;
    const { category, confidence: catConfidence } = classifyText(text);

    // Entity extraction
    const amount = extractAmount(text);
    const upiId = extractUpi(text);
    const utr = extractUtr(text);
    const platform = extractPlatform(text);
    const bank = extractBank(text);
    const phone = extractPhone(text);
    const suspectHandle = extractSuspectHandle(text);

    const extractedFields: AIFieldExtraction[] = [];
    const confidenceMap: Record<string, number> = { category: catConfidence };

    if (category) {
      extractedFields.push({
        field: 'category',
        label: 'Complaint Category',
        value: category,
        confidence: catConfidence,
        source: 'ai',
      });
    }

    if (amount !== undefined) {
      extractedFields.push({
        field: 'transaction.amountLost',
        label: 'Amount Lost (INR)',
        value: amount,
        confidence: 0.95,
        source: 'ai',
      });
      confidenceMap['transaction.amountLost'] = 0.95;
    }

    if (utr) {
      extractedFields.push({
        field: 'transaction.upiRef',
        label: '12-Digit UTR / Ref Number',
        value: utr,
        confidence: 0.93,
        source: 'ai',
      });
      confidenceMap['transaction.upiRef'] = 0.93;
    }

    if (bank) {
      extractedFields.push({
        field: 'transaction.bankName',
        label: 'Complainant Bank',
        value: bank,
        confidence: 0.9,
        source: 'ai',
      });
      confidenceMap['transaction.bankName'] = 0.9;
    }

    if (platform) {
      extractedFields.push({
        field: 'platform',
        label: 'Medium of Crime',
        value: platform,
        confidence: 0.92,
        source: 'ai',
      });
      confidenceMap['platform'] = 0.92;
    }

    if (upiId) {
      extractedFields.push({
        field: 'suspect.upiId',
        label: "Scammer's UPI ID / VPA",
        value: upiId,
        confidence: 0.94,
        source: 'ai',
      });
      confidenceMap['suspect.upiId'] = 0.94;
    }

    if (phone) {
      extractedFields.push({
        field: 'suspect.mobile',
        label: 'Suspect Contact Number',
        value: phone,
        confidence: 0.88,
        source: 'ai',
      });
      confidenceMap['suspect.mobile'] = 0.88;
    }

    if (suspectHandle) {
      extractedFields.push({
        field: 'suspect.socialHandle',
        label: 'Suspect Digital Handle',
        value: suspectHandle,
        confidence: 0.85,
        source: 'ai',
      });
      confidenceMap['suspect.socialHandle'] = 0.85;
    }

    // Determine missing required fields for Indian Cybercrime reporting
    const missingFields: AIIntakeResponse['missingFields'] = [];

    const hasLostMoney = amount !== undefined || category === 'upi_fraud' || category === 'investment_scam';
    if (hasLostMoney && !utr) {
      missingFields.push({
        field: 'transaction.upiRef',
        label: '12-digit UTR or Bank Reference ID',
        required: true,
        promptText: 'Please share the 12-digit UTR number or Bank Reference ID from your debit SMS/receipt.',
      });
    }
    if (hasLostMoney && !bank) {
      missingFields.push({
        field: 'transaction.bankName',
        label: 'Your Bank Name',
        required: true,
        promptText: 'Which bank or wallet was the money deducted from?',
      });
    }
    if (!upiId && !phone && !suspectHandle) {
      missingFields.push({
        field: 'suspect.identifier',
        label: 'Suspect UPI, Phone, or Handle',
        required: false,
        promptText: "Do you have the scammer's phone number, UPI ID, or Telegram/Instagram handle?",
      });
    }
    if (!platform) {
      missingFields.push({
        field: 'platform',
        label: 'Medium of Crime Occurrence',
        required: true,
        promptText: 'Where did the incident originate (WhatsApp, Telegram, Phone call, Website)?',
      });
    }

    // Build updated case object
    const updatedCase: Partial<CreateCaseDTO> = {
      category,
      title: `${category.replace(/_/g, ' ').toUpperCase()} - ₹${amount || 'Amount Pending'}`,
      description: text,
      platform: platform || 'Telegram/WhatsApp',
      transaction: {
        amountLost: amount,
        upiRef: utr,
        bankName: bank,
        currency: 'INR',
        transactionDate: new Date().toISOString(),
      },
      suspects: [
        {
          upiId,
          mobile: phone,
          socialHandle: suspectHandle,
          platform,
        },
      ],
      victim: {
        mobile: '9989284448',
        name: 'Anuroop Phukan',
      },
    };

    // Jiva 2.0-style Empathetic, Human Conversational Response
    let assistantMessage = '';
    const capturedItems: string[] = [];
    if (amount) capturedItems.push(`₹${amount.toLocaleString('en-IN')} loss`);
    if (utr) capturedItems.push(`UTR: ${utr}`);
    if (upiId) capturedItems.push(`Scammer UPI: ${upiId}`);
    if (bank) capturedItems.push(`Bank: ${bank}`);
    if (platform) capturedItems.push(`Platform: ${platform}`);

    const capturedText = capturedItems.length > 0 ? capturedItems.join(', ') : 'incident description';

    if (category === 'upi_fraud' || category === 'investment_scam') {
      assistantMessage = `I'm really sorry this happened to you. Cyber fraud can happen to anyone, and we are going to report this immediately to safeguard your funds.\n\nI have auto-filled your complaint form with the **${capturedText}**.\n\n${
        missingFields.length > 0
          ? `To make your petition watertight for police and bank lien, could you please provide: **${missingFields[0].label}**?`
          : 'All essential details are recorded. You can review the form on the left and proceed to submit!'
      }`;
    } else if (category === 'sextortion' || category === 'cyber_harassment') {
      assistantMessage = `Please take a deep breath. You are safe, and do not pay any ransom or money to the perpetrator. CasePilot has recorded your harassment complaint.\n\nI have saved your statement and initiated evidence preservation.\n\n${
        missingFields.length > 0
          ? `Could you provide **${missingFields[0].label}** to help cyber police trace their IP and profile?`
          : 'I have prepared your formal complaint under Bharatiya Nyaya Sanhita (BNS). Please review the form on the left.'
      }`;
    } else {
      assistantMessage = `I understand what happened and have recorded your report under **${category.replace(/_/g, ' ').toUpperCase()}**.\n\nI have populated your complaint form on the left with ${capturedText}.\n\n${
        missingFields.length > 0
          ? `To complete the official requirements, please let me know: **${missingFields[0].label}**.`
          : 'Your details look complete. You can inspect the tabs on the left and submit when ready.'
      }`;
    }

    const followUp = missingFields.length > 0 ? missingFields[0].promptText : 'Would you like to review and submit your complaint now?';

    return {
      message: assistantMessage,
      extractedFields,
      missingFields,
      conflicts: [],
      suggestedEvidence: [
        'Screenshot of payment debit transaction or SMS',
        'Chat export or screenshots of messages with the scammer',
        'Scammer profile URL or phone number call log',
      ],
      followUpQuestion: followUp,
      updatedCase,
      confidence: confidenceMap,
      category,
      stages: [
        { stage: 'intent_and_classification', success: true, data: { category, confidence: catConfidence } },
        { stage: 'entity_extraction', success: true, data: { extractedCount: extractedFields.length } },
        { stage: 'portal_validation', success: true, data: { valid: true } },
        { stage: 'missing_fields_check', success: true, data: { missingCount: missingFields.length } },
        { stage: 'empathetic_response', success: true, data: { generated: true } },
      ],
    };
  }

  async assessCaseHealth(caseData: Partial<CaseDTO>) {
    const hasTx = !!caseData.transaction?.amountLost;
    const hasUtr = !!caseData.transaction?.upiRef;
    const hasSuspect = (caseData.suspects?.length ?? 0) > 0;
    const hasDesc = (caseData.description?.length ?? 0) > 100;

    let score = 40;
    if (hasTx) score += 20;
    if (hasUtr) score += 20;
    if (hasSuspect) score += 10;
    if (hasDesc) score += 10;

    return {
      score: Math.min(100, score),
      urgency: score < 60 ? 'high' : 'medium',
      completeness: score,
      missingFields: !hasUtr ? ['12-digit UTR Number'] : [],
      nextActions: [
        'Call 1930 Cyber Helpline to initiate immediate bank lien',
        'Submit the formal complaint to generate 14-digit acknowledgment number',
      ],
      estimatedProcessingDays: 7,
      riskFlags: !hasUtr ? ['Missing UTR may delay beneficiary account freeze'] : [],
      canEscalate: (caseData.status as string) === 'acknowledged' || (caseData.status as string) === 'under_investigation',
    };
  }

  async escalationGuidance(caseData: Partial<CaseDTO>) {
    return {
      shouldEscalate: true,
      reason: 'No updates from assigned nodal officer for over 15 days',
      urgency: 'high',
      steps: [
        'File formal escalation to State Cyber Crime Nodal Officer',
        'Attach RBI Ombudsman reference for inter-bank transaction freeze',
      ],
    };
  }
}
