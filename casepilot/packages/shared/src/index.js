"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_LABELS = exports.CATEGORY_LABELS = exports.EscalateSchema = exports.AIIntakeSchema = exports.UpdateCaseSchema = exports.CreateCaseSchema = exports.VictimSchema = exports.SuspectSchema = exports.TransactionSchema = exports.PaymentModeEnum = exports.CaseStatusEnum = exports.CaseCategoryEnum = exports.VerifyOtpSchema = exports.SendOtpSchema = void 0;
exports.maskMobile = maskMobile;
exports.maskAccount = maskAccount;
exports.maskEmail = maskEmail;
const zod_1 = require("zod");
exports.SendOtpSchema = zod_1.z.object({
    mobile: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
});
exports.VerifyOtpSchema = zod_1.z.object({
    mobile: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    otp: zod_1.z.string().length(6, 'OTP must be exactly 6 digits'),
});
exports.CaseCategoryEnum = zod_1.z.enum([
    'upi_fraud',
    'credit_debit_fraud',
    'investment_scam',
    'phishing',
    'job_fraud',
    'matrimonial_fraud',
    'otp_fraud',
    'identity_theft',
    'sextortion',
    'ransomware',
    'cyber_harassment',
    'impersonation',
    'account_compromise',
    'other',
]);
exports.CaseStatusEnum = zod_1.z.enum([
    'draft',
    'submitted',
    'acknowledged',
    'assigned',
    'under_investigation',
    'closed',
    'rejected',
    'escalated',
]);
exports.PaymentModeEnum = zod_1.z.enum([
    'upi', 'netbanking', 'card', 'cash', 'crypto', 'wallet', 'other',
]);
exports.TransactionSchema = zod_1.z.object({
    amountLost: zod_1.z.number().min(0).optional(),
    currency: zod_1.z.string().default('INR'),
    transactionId: zod_1.z.string().optional(),
    transactionDate: zod_1.z.string().optional(),
    upiRef: zod_1.z.string().optional(),
    bankName: zod_1.z.string().optional(),
    accountNumber: zod_1.z.string().optional(),
    ifscCode: zod_1.z.string().optional(),
    paymentMode: exports.PaymentModeEnum.optional(),
    additionalNotes: zod_1.z.string().optional(),
});
exports.SuspectSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    mobile: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    bankAccount: zod_1.z.string().optional(),
    upiId: zod_1.z.string().optional(),
    socialHandle: zod_1.z.string().optional(),
    platform: zod_1.z.string().optional(),
    ipAddress: zod_1.z.string().optional(),
    websiteUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    additionalInfo: zod_1.z.string().optional(),
});
exports.VictimSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    mobile: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    address: zod_1.z.string().optional(),
    aadhaarLast4: zod_1.z.string().max(4).optional(),
    panLast4: zod_1.z.string().max(4).optional(),
    occupation: zod_1.z.string().optional(),
});
exports.CreateCaseSchema = zod_1.z.object({
    category: exports.CaseCategoryEnum,
    title: zod_1.z.string().min(5, 'Title is too short').max(200),
    description: zod_1.z.string().min(10, 'Please provide more details'),
    incidentDate: zod_1.z.string().optional(),
    incidentLocation: zod_1.z.string().optional(),
    platform: zod_1.z.string().optional(),
    transaction: exports.TransactionSchema.optional(),
    suspects: zod_1.z.array(exports.SuspectSchema).optional(),
    victim: exports.VictimSchema.optional(),
    status: exports.CaseStatusEnum.default('draft'),
});
exports.UpdateCaseSchema = exports.CreateCaseSchema.partial();
exports.AIIntakeSchema = zod_1.z.object({
    message: zod_1.z.string().min(1, 'Message cannot be empty'),
    caseId: zod_1.z.string().optional(),
    existingData: zod_1.z
        .object({
        category: exports.CaseCategoryEnum.optional(),
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        transaction: exports.TransactionSchema.optional(),
        suspects: zod_1.z.array(exports.SuspectSchema).optional(),
        victim: exports.VictimSchema.optional(),
    })
        .optional(),
});
exports.EscalateSchema = zod_1.z.object({
    caseId: zod_1.z.string(),
    reason: zod_1.z.string().min(10, 'Please provide a reason'),
    urgency: zod_1.z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
});
function maskMobile(mobile) {
    if (!mobile)
        return '';
    return mobile.replace(/^(\d{2})\d{6}(\d{2})$/, '$1XXXXXX$2');
}
function maskAccount(account) {
    if (!account)
        return '';
    return 'XXXX XXXX ' + account.slice(-4);
}
function maskEmail(email) {
    if (!email)
        return '';
    const [local, domain] = email.split('@');
    return local.slice(0, 2) + '***@' + domain;
}
exports.CATEGORY_LABELS = {
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
exports.STATUS_LABELS = {
    draft: 'Draft',
    submitted: 'Submitted',
    acknowledged: 'Acknowledged',
    assigned: 'Assigned',
    under_investigation: 'Under Investigation',
    closed: 'Closed',
    rejected: 'Rejected',
    escalated: 'Escalated',
};
//# sourceMappingURL=index.js.map