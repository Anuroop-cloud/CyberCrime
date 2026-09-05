import { PrismaClient, CaseStatus, CaseCategory, PaymentMode } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function caseNumber(n: number) {
  return `CP2024${String(n).padStart(6, '0')}`;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

async function main() {
  console.log('🌱 Seeding CasePilot database...');

  // ── Demo User ─────────────────────────────────────────────
  const user = await prisma.user.upsert({
    where: { mobile: '9989284448' },
    update: {},
    create: {
      mobile: '9989284448',
      name: 'Anuroop Demo',
      email: 'demo@casepilot.in',
    },
  });
  console.log(`✓ User created: ${user.mobile}`);

  // Clean up any existing demo cases and notifications for idempotency
  await prisma.notification.deleteMany({ where: { userId: user.id } });
  await prisma.case.deleteMany({ where: { userId: user.id } });
  console.log('✓ Cleaned up previous seed data');

  // ── Helper: create a case with full relations ─────────────
  async function createCase(opts: {
    num: number;
    category: CaseCategory;
    status: CaseStatus;
    title: string;
    description: string;
    incidentDaysAgo: number;
    platform?: string;
    amount?: number;
    paymentMode?: PaymentMode;
    upiRef?: string;
    transactionId?: string;
    bankName?: string;
    suspectName?: string;
    suspectMobile?: string;
    suspectUpi?: string;
    suspectPlatform?: string;
    escalated?: boolean;
    notifications?: Array<{ title: string; body: string; type: string }>;
    missingFields?: Array<{ fieldPath: string; label: string; required: boolean }>;
  }) {
    const c = await prisma.case.create({
      data: {
        caseNumber: caseNumber(opts.num),
        userId: user.id,
        status: opts.status,
        category: opts.category,
        title: opts.title,
        description: opts.description,
        incidentDate: daysAgo(opts.incidentDaysAgo),
        platform: opts.platform,
        isDraft: opts.status === 'draft',
        submittedAt: opts.status !== 'draft' ? daysAgo(opts.incidentDaysAgo - 1) : null,
        acknowledgedAt:
          ['acknowledged', 'assigned', 'under_investigation', 'closed', 'escalated'].includes(
            opts.status,
          )
            ? daysAgo(opts.incidentDaysAgo - 2)
            : null,
      },
    });

    // Transaction
    if (opts.amount !== undefined) {
      await prisma.transaction.create({
        data: {
          caseId: c.id,
          amountLost: opts.amount,
          currency: 'INR',
          transactionId: opts.transactionId,
          upiRef: opts.upiRef,
          bankName: opts.bankName,
          paymentMode: opts.paymentMode,
          transactionDate: daysAgo(opts.incidentDaysAgo),
        },
      });
    }

    // Suspect
    if (opts.suspectName || opts.suspectMobile || opts.suspectUpi) {
      await prisma.suspect.create({
        data: {
          caseId: c.id,
          name: opts.suspectName,
          mobile: opts.suspectMobile,
          upiId: opts.suspectUpi,
          platform: opts.suspectPlatform,
        },
      });
    }

    // Victim (always the demo user)
    await prisma.victim.create({
      data: {
        caseId: c.id,
        name: user.name,
        mobile: user.mobile,
        email: user.email ?? undefined,
        occupation: 'Software Engineer',
      },
    });

    // Timeline events
    const eventsToCreate: Array<{ eventType: string; note: string; daysBack: number }> = [];
    eventsToCreate.push({ eventType: 'case_created', note: 'Complaint filed online', daysBack: opts.incidentDaysAgo - 1 });
    if (opts.status !== 'draft') {
      eventsToCreate.push({ eventType: 'status_change', note: 'Complaint submitted for review', daysBack: opts.incidentDaysAgo - 1 });
    }
    if (['acknowledged', 'assigned', 'under_investigation', 'closed', 'escalated'].includes(opts.status)) {
      eventsToCreate.push({ eventType: 'status_change', note: 'Complaint acknowledged by cybercrime cell', daysBack: opts.incidentDaysAgo - 3 });
    }
    if (['assigned', 'under_investigation', 'closed', 'escalated'].includes(opts.status)) {
      eventsToCreate.push({ eventType: 'status_change', note: 'Case assigned to investigating officer', daysBack: opts.incidentDaysAgo - 5 });
    }
    if (opts.status === 'under_investigation') {
      eventsToCreate.push({ eventType: 'status_change', note: 'Investigation initiated, bank put on notice', daysBack: opts.incidentDaysAgo - 8 });
    }
    if (opts.status === 'closed') {
      eventsToCreate.push({ eventType: 'status_change', note: 'Case closed – victim received partial refund', daysBack: opts.incidentDaysAgo - 15 });
    }
    if (opts.escalated || opts.status === 'escalated') {
      eventsToCreate.push({ eventType: 'escalation', note: 'Case escalated due to inactivity >30 days', daysBack: 2 });
      await prisma.escalation.create({
        data: {
          caseId: c.id,
          reason: 'No status update in over 30 days. Victim has suffered significant financial loss.',
          urgency: 'high',
          status: 'open',
          requestedAt: daysAgo(2),
        },
      });
    }

    for (const ev of eventsToCreate) {
      await prisma.caseEvent.create({
        data: {
          caseId: c.id,
          userId: user.id,
          eventType: ev.eventType,
          note: ev.note,
          createdAt: daysAgo(ev.daysBack),
        },
      });
    }

    // Missing fields
    if (opts.missingFields) {
      for (const mf of opts.missingFields) {
        await prisma.missingField.create({
          data: { caseId: c.id, ...mf, promptText: `Please provide the ${mf.label} to strengthen your complaint.` },
        });
      }
    }

    // Notifications
    if (opts.notifications) {
      for (const n of opts.notifications) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            caseId: c.id,
            caseNumber: c.caseNumber,
            title: n.title,
            body: n.body,
            type: n.type as any,
            read: false,
            createdAt: daysAgo(1),
          },
        });
      }
    }

    console.log(`  ✓ Case ${c.caseNumber}: ${opts.title}`);
    return c;
  }

  // ─────────────────────────────────────────────────────────
  // CASE 1 – UPI Fraud (acknowledged)
  // ─────────────────────────────────────────────────────────
  await createCase({
    num: 1,
    category: 'upi_fraud',
    status: 'acknowledged',
    title: 'Fraudulent UPI transfer to unknown account',
    description:
      'I received a call from someone claiming to be from my bank HDFC, saying my account was compromised. They asked me to verify by sending ₹1 to a UPI ID. The amount of ₹45,000 was debited immediately instead. The UPI ID was paytm.frauder12@okaxis. I have the transaction screenshot and call recording.',
    incidentDaysAgo: 12,
    platform: 'UPI / Phone',
    amount: 45000,
    paymentMode: 'upi',
    upiRef: 'UPI123456789012',
    bankName: 'HDFC Bank',
    suspectMobile: '9XXXXXX789',
    suspectUpi: 'paytm.frauder12@okaxis',
    suspectPlatform: 'Phone + UPI',
    notifications: [
      { title: 'Complaint Acknowledged', body: 'Your complaint CP202400001 has been acknowledged. Reference number saved.', type: 'case_update' },
    ],
  });

  // ─────────────────────────────────────────────────────────
  // CASE 2 – Investment Scam (assigned)
  // ─────────────────────────────────────────────────────────
  await createCase({
    num: 2,
    category: 'investment_scam',
    status: 'assigned',
    title: 'Fake trading app promised 40% monthly returns',
    description:
      'A contact on Telegram named "StockGuru_Official" added me to a group promising 40% monthly returns through a proprietary trading app called "ProfitMax Pro". I invested ₹50,000 initially, saw fake profits in the dashboard, and invested ₹1,60,000 more. When I tried to withdraw, they demanded a 20% "tax clearance" fee. The app is now inaccessible and the Telegram group is deleted.',
    incidentDaysAgo: 28,
    platform: 'Telegram + Fake App',
    amount: 210000,
    paymentMode: 'netbanking',
    transactionId: 'NEFT20241234567',
    bankName: 'SBI',
    suspectName: 'StockGuru_Official',
    suspectPlatform: 'Telegram',
    notifications: [
      { title: 'Case Assigned', body: 'CP202400002 has been assigned to an investigating officer. You will be contacted within 3 working days.', type: 'case_update' },
      { title: 'Evidence Requested', body: 'Please upload the Telegram chat screenshots and transaction receipts for CP202400002.', type: 'evidence_requested' },
    ],
  });

  // ─────────────────────────────────────────────────────────
  // CASE 3 – Account Compromise (under_investigation)
  // ─────────────────────────────────────────────────────────
  await createCase({
    num: 3,
    category: 'account_compromise',
    status: 'under_investigation',
    title: 'Email and bank account compromised via phishing',
    description:
      'I clicked a link in an email appearing to be from SBI that said "Your account will be suspended. Verify now." After entering my credentials on what I thought was the bank website, I received SMS alerts of ₹12,500 being transferred. My Gmail was also compromised. I have changed all passwords and enabled 2FA now.',
    incidentDaysAgo: 20,
    platform: 'Email + SBI NetBanking',
    amount: 12500,
    paymentMode: 'netbanking',
    bankName: 'State Bank of India',
    suspectPlatform: 'Phishing email / fake website',
    notifications: [
      { title: 'Investigation Ongoing', body: 'Cyber cell has put the destination bank account on freeze notice. Updates will follow.', type: 'case_update' },
    ],
  });

  // ─────────────────────────────────────────────────────────
  // CASE 4 – Ransomware (submitted)
  // ─────────────────────────────────────────────────────────
  await createCase({
    num: 4,
    category: 'ransomware',
    status: 'submitted',
    title: 'Ransomware encrypted all files on company laptop',
    description:
      'My office laptop was infected with ransomware after opening an attachment from an unknown email titled "Invoice_Q3_2024.exe". All files were encrypted with extension .locked. A ransom note appeared demanding 0.5 BTC (~₹3,00,000). I disconnected from the network immediately and reported to IT. The laptop is isolated and preserved as evidence.',
    incidentDaysAgo: 6,
    platform: 'Email attachment / Windows',
    suspectPlatform: 'Email',
    notifications: [
      { title: 'Complaint Received', body: 'Your ransomware complaint CP202400004 has been received and is under review.', type: 'system' },
    ],
  });

  // ─────────────────────────────────────────────────────────
  // CASE 5 – Impersonation (acknowledged)
  // ─────────────────────────────────────────────────────────
  await createCase({
    num: 5,
    category: 'impersonation',
    status: 'acknowledged',
    title: 'Caller impersonated police officer demanding bribe',
    description:
      'I received a WhatsApp video call from a person in a fake police uniform who said I was implicated in a money laundering case. They demanded ₹8,000 to "close the case". Under duress I transferred the amount via UPI before realising it was a scam. The caller used a spoofed number. I have the call recording and UPI receipt.',
    incidentDaysAgo: 9,
    platform: 'WhatsApp',
    amount: 8000,
    paymentMode: 'upi',
    upiRef: 'UPI987654321098',
    suspectPlatform: 'WhatsApp video call',
  });

  // ─────────────────────────────────────────────────────────
  // CASE 6 – Cyber Harassment (draft)
  // ─────────────────────────────────────────────────────────
  await createCase({
    num: 6,
    category: 'cyber_harassment',
    status: 'draft',
    title: 'Persistent harassment and threats on Instagram',
    description:
      'An unknown Instagram account has been sending abusive and threatening messages for the past 3 weeks. They also tagged my workplace colleagues. I have blocked the account but new accounts keep appearing. I have taken screenshots of all messages.',
    incidentDaysAgo: 21,
    platform: 'Instagram',
    suspectPlatform: 'Instagram',
    missingFields: [
      { fieldPath: 'suspect.socialHandle', label: 'Suspect Instagram Handle', required: true },
      { fieldPath: 'transaction.amountLost', label: 'Amount Lost (if any)', required: false },
      { fieldPath: 'case.incidentLocation', label: 'Your City / Location', required: true },
    ],
  });

  // ─────────────────────────────────────────────────────────
  // CASE 7 – Job Fraud (submitted)
  // ─────────────────────────────────────────────────────────
  await createCase({
    num: 7,
    category: 'job_fraud',
    status: 'submitted',
    title: 'Fake HR from TCS collected security deposit for job offer',
    description:
      'I was contacted via LinkedIn by someone claiming to be an HR from TCS. They sent a fake offer letter and asked for a ₹75,000 security deposit for "equipment and background verification". After paying, all contact was cut off. The email domain was tcs-hr-official.com (not tcs.com). I have the offer letter, email chain, and transfer receipt.',
    incidentDaysAgo: 15,
    platform: 'LinkedIn + Email',
    amount: 75000,
    paymentMode: 'netbanking',
    transactionId: 'NEFT20245678901',
    bankName: 'Axis Bank',
    suspectName: 'Priya Sharma (fake HR)',
    suspectPlatform: 'LinkedIn',
    notifications: [
      { title: 'Action Required', body: 'Please upload the offer letter PDF and email screenshots for CP202400007.', type: 'evidence_requested' },
    ],
  });

  // ─────────────────────────────────────────────────────────
  // CASE 8 – Sextortion (assigned) – SENSITIVE
  // ─────────────────────────────────────────────────────────
  await createCase({
    num: 8,
    category: 'sextortion',
    status: 'assigned',
    title: 'Blackmail with intimate images from fake dating profile',
    description:
      'I was befriended by a fake profile on a dating app. After private image exchange, they revealed they had recorded the video call and threatened to share it with my contacts unless I paid. I paid ₹15,000 but demands continued. I have cut all contact. Screenshots preserved.',
    incidentDaysAgo: 18,
    platform: 'Dating App + WhatsApp',
    amount: 15000,
    paymentMode: 'upi',
    upiRef: 'UPI111222333444',
    suspectPlatform: 'Dating App',
    notifications: [
      { title: 'Urgent: Case Assigned', body: 'Your sensitive case CP202400008 has been fast-tracked and assigned. Do not pay any further demands.', type: 'urgent' },
    ],
  });

  // ─────────────────────────────────────────────────────────
  // CASE 9 – Stuck / Escalated (escalated)
  // ─────────────────────────────────────────────────────────
  await createCase({
    num: 9,
    category: 'upi_fraud',
    status: 'escalated',
    title: 'No update in 35 days – UPI fraud case stuck',
    description:
      'I filed this complaint 35 days ago for a UPI fraud of ₹90,000. The money was sent to a fraudster who posed as a buyer for my second-hand laptop on OLX. After acknowledging the complaint, there has been no update despite multiple follow-ups. The bank account used by the fraudster is still active.',
    incidentDaysAgo: 40,
    platform: 'OLX + UPI',
    amount: 90000,
    paymentMode: 'upi',
    upiRef: 'UPI555666777888',
    bankName: 'Kotak Mahindra Bank',
    suspectPlatform: 'OLX + Phone',
    escalated: true,
    notifications: [
      { title: 'Case Escalated', body: 'CP202400009 has been escalated due to inactivity. A senior officer will review within 48 hours.', type: 'escalation' },
    ],
  });

  // ─────────────────────────────────────────────────────────
  // CASE 10 – Draft with missing info
  // ─────────────────────────────────────────────────────────
  await createCase({
    num: 10,
    category: 'credit_debit_fraud',
    status: 'draft',
    title: 'Credit card used without my knowledge',
    description:
      'Received an SMS that my credit card was charged for an online purchase I did not make.',
    incidentDaysAgo: 3,
    platform: 'Unknown',
    amount: undefined,
    missingFields: [
      { fieldPath: 'transaction.amountLost', label: 'Transaction Amount', required: true },
      { fieldPath: 'transaction.transactionId', label: 'Transaction Reference / Merchant', required: true },
      { fieldPath: 'transaction.transactionDate', label: 'Exact Transaction Date & Time', required: true },
      { fieldPath: 'suspect.platform', label: 'Merchant / Website Name', required: false },
      { fieldPath: 'case.incidentLocation', label: 'Your Location at Time of Fraud', required: false },
    ],
    notifications: [
      { title: 'Draft Incomplete', body: 'Your draft complaint CP202400010 is missing key information. Complete it to submit.', type: 'system' },
    ],
  });

  console.log('\n✅ Seeding complete!');
  console.log('   Demo login: 9989284448  |  OTP: 123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
