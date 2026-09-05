import { z } from 'zod';
export declare const SendOtpSchema: z.ZodObject<{
    mobile: z.ZodString;
}, "strip", z.ZodTypeAny, {
    mobile: string;
}, {
    mobile: string;
}>;
export type SendOtpDTO = z.infer<typeof SendOtpSchema>;
export declare const VerifyOtpSchema: z.ZodObject<{
    mobile: z.ZodString;
    otp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    mobile: string;
    otp: string;
}, {
    mobile: string;
    otp: string;
}>;
export type VerifyOtpDTO = z.infer<typeof VerifyOtpSchema>;
export interface AuthUserDTO {
    id: string;
    mobile: string;
    name: string;
    email?: string;
}
export interface SessionPayload {
    sub: string;
    mobile: string;
    name: string;
    iat?: number;
    exp?: number;
}
export declare const CaseCategoryEnum: z.ZodEnum<["upi_fraud", "credit_debit_fraud", "investment_scam", "phishing", "job_fraud", "matrimonial_fraud", "otp_fraud", "identity_theft", "sextortion", "ransomware", "cyber_harassment", "impersonation", "account_compromise", "other"]>;
export type CaseCategory = z.infer<typeof CaseCategoryEnum>;
export declare const CaseStatusEnum: z.ZodEnum<["draft", "submitted", "acknowledged", "assigned", "under_investigation", "closed", "rejected", "escalated"]>;
export type CaseStatus = z.infer<typeof CaseStatusEnum>;
export declare const PaymentModeEnum: z.ZodEnum<["upi", "netbanking", "card", "cash", "crypto", "wallet", "other"]>;
export type PaymentMode = z.infer<typeof PaymentModeEnum>;
export declare const TransactionSchema: z.ZodObject<{
    amountLost: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodDefault<z.ZodString>;
    transactionId: z.ZodOptional<z.ZodString>;
    transactionDate: z.ZodOptional<z.ZodString>;
    upiRef: z.ZodOptional<z.ZodString>;
    bankName: z.ZodOptional<z.ZodString>;
    accountNumber: z.ZodOptional<z.ZodString>;
    ifscCode: z.ZodOptional<z.ZodString>;
    paymentMode: z.ZodOptional<z.ZodEnum<["upi", "netbanking", "card", "cash", "crypto", "wallet", "other"]>>;
    additionalNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    currency: string;
    amountLost?: number | undefined;
    transactionId?: string | undefined;
    transactionDate?: string | undefined;
    upiRef?: string | undefined;
    bankName?: string | undefined;
    accountNumber?: string | undefined;
    ifscCode?: string | undefined;
    paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
    additionalNotes?: string | undefined;
}, {
    amountLost?: number | undefined;
    currency?: string | undefined;
    transactionId?: string | undefined;
    transactionDate?: string | undefined;
    upiRef?: string | undefined;
    bankName?: string | undefined;
    accountNumber?: string | undefined;
    ifscCode?: string | undefined;
    paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
    additionalNotes?: string | undefined;
}>;
export type TransactionDTO = z.infer<typeof TransactionSchema>;
export declare const SuspectSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    mobile: z.ZodOptional<z.ZodString>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    bankAccount: z.ZodOptional<z.ZodString>;
    upiId: z.ZodOptional<z.ZodString>;
    socialHandle: z.ZodOptional<z.ZodString>;
    platform: z.ZodOptional<z.ZodString>;
    ipAddress: z.ZodOptional<z.ZodString>;
    websiteUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    additionalInfo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    mobile?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    bankAccount?: string | undefined;
    upiId?: string | undefined;
    socialHandle?: string | undefined;
    platform?: string | undefined;
    ipAddress?: string | undefined;
    websiteUrl?: string | undefined;
    additionalInfo?: string | undefined;
}, {
    mobile?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    bankAccount?: string | undefined;
    upiId?: string | undefined;
    socialHandle?: string | undefined;
    platform?: string | undefined;
    ipAddress?: string | undefined;
    websiteUrl?: string | undefined;
    additionalInfo?: string | undefined;
}>;
export type SuspectDTO = z.infer<typeof SuspectSchema>;
export declare const VictimSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    mobile: z.ZodOptional<z.ZodString>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    address: z.ZodOptional<z.ZodString>;
    aadhaarLast4: z.ZodOptional<z.ZodString>;
    panLast4: z.ZodOptional<z.ZodString>;
    occupation: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    mobile?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    address?: string | undefined;
    aadhaarLast4?: string | undefined;
    panLast4?: string | undefined;
    occupation?: string | undefined;
}, {
    mobile?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    address?: string | undefined;
    aadhaarLast4?: string | undefined;
    panLast4?: string | undefined;
    occupation?: string | undefined;
}>;
export type VictimDTO = z.infer<typeof VictimSchema>;
export declare const CreateCaseSchema: z.ZodObject<{
    category: z.ZodEnum<["upi_fraud", "credit_debit_fraud", "investment_scam", "phishing", "job_fraud", "matrimonial_fraud", "otp_fraud", "identity_theft", "sextortion", "ransomware", "cyber_harassment", "impersonation", "account_compromise", "other"]>;
    title: z.ZodString;
    description: z.ZodString;
    incidentDate: z.ZodOptional<z.ZodString>;
    incidentLocation: z.ZodOptional<z.ZodString>;
    platform: z.ZodOptional<z.ZodString>;
    transaction: z.ZodOptional<z.ZodObject<{
        amountLost: z.ZodOptional<z.ZodNumber>;
        currency: z.ZodDefault<z.ZodString>;
        transactionId: z.ZodOptional<z.ZodString>;
        transactionDate: z.ZodOptional<z.ZodString>;
        upiRef: z.ZodOptional<z.ZodString>;
        bankName: z.ZodOptional<z.ZodString>;
        accountNumber: z.ZodOptional<z.ZodString>;
        ifscCode: z.ZodOptional<z.ZodString>;
        paymentMode: z.ZodOptional<z.ZodEnum<["upi", "netbanking", "card", "cash", "crypto", "wallet", "other"]>>;
        additionalNotes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        amountLost?: number | undefined;
        transactionId?: string | undefined;
        transactionDate?: string | undefined;
        upiRef?: string | undefined;
        bankName?: string | undefined;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
        additionalNotes?: string | undefined;
    }, {
        amountLost?: number | undefined;
        currency?: string | undefined;
        transactionId?: string | undefined;
        transactionDate?: string | undefined;
        upiRef?: string | undefined;
        bankName?: string | undefined;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
        additionalNotes?: string | undefined;
    }>>;
    suspects: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        mobile: z.ZodOptional<z.ZodString>;
        email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        bankAccount: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        socialHandle: z.ZodOptional<z.ZodString>;
        platform: z.ZodOptional<z.ZodString>;
        ipAddress: z.ZodOptional<z.ZodString>;
        websiteUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        additionalInfo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        bankAccount?: string | undefined;
        upiId?: string | undefined;
        socialHandle?: string | undefined;
        platform?: string | undefined;
        ipAddress?: string | undefined;
        websiteUrl?: string | undefined;
        additionalInfo?: string | undefined;
    }, {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        bankAccount?: string | undefined;
        upiId?: string | undefined;
        socialHandle?: string | undefined;
        platform?: string | undefined;
        ipAddress?: string | undefined;
        websiteUrl?: string | undefined;
        additionalInfo?: string | undefined;
    }>, "many">>;
    victim: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        mobile: z.ZodOptional<z.ZodString>;
        email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        address: z.ZodOptional<z.ZodString>;
        aadhaarLast4: z.ZodOptional<z.ZodString>;
        panLast4: z.ZodOptional<z.ZodString>;
        occupation: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        address?: string | undefined;
        aadhaarLast4?: string | undefined;
        panLast4?: string | undefined;
        occupation?: string | undefined;
    }, {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        address?: string | undefined;
        aadhaarLast4?: string | undefined;
        panLast4?: string | undefined;
        occupation?: string | undefined;
    }>>;
    status: z.ZodDefault<z.ZodEnum<["draft", "submitted", "acknowledged", "assigned", "under_investigation", "closed", "rejected", "escalated"]>>;
}, "strip", z.ZodTypeAny, {
    status: "draft" | "submitted" | "acknowledged" | "assigned" | "under_investigation" | "closed" | "rejected" | "escalated";
    category: "upi_fraud" | "credit_debit_fraud" | "investment_scam" | "phishing" | "job_fraud" | "matrimonial_fraud" | "otp_fraud" | "identity_theft" | "sextortion" | "ransomware" | "cyber_harassment" | "impersonation" | "account_compromise" | "other";
    title: string;
    description: string;
    transaction?: {
        currency: string;
        amountLost?: number | undefined;
        transactionId?: string | undefined;
        transactionDate?: string | undefined;
        upiRef?: string | undefined;
        bankName?: string | undefined;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
        additionalNotes?: string | undefined;
    } | undefined;
    victim?: {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        address?: string | undefined;
        aadhaarLast4?: string | undefined;
        panLast4?: string | undefined;
        occupation?: string | undefined;
    } | undefined;
    platform?: string | undefined;
    incidentDate?: string | undefined;
    incidentLocation?: string | undefined;
    suspects?: {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        bankAccount?: string | undefined;
        upiId?: string | undefined;
        socialHandle?: string | undefined;
        platform?: string | undefined;
        ipAddress?: string | undefined;
        websiteUrl?: string | undefined;
        additionalInfo?: string | undefined;
    }[] | undefined;
}, {
    category: "upi_fraud" | "credit_debit_fraud" | "investment_scam" | "phishing" | "job_fraud" | "matrimonial_fraud" | "otp_fraud" | "identity_theft" | "sextortion" | "ransomware" | "cyber_harassment" | "impersonation" | "account_compromise" | "other";
    title: string;
    description: string;
    transaction?: {
        amountLost?: number | undefined;
        currency?: string | undefined;
        transactionId?: string | undefined;
        transactionDate?: string | undefined;
        upiRef?: string | undefined;
        bankName?: string | undefined;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
        additionalNotes?: string | undefined;
    } | undefined;
    victim?: {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        address?: string | undefined;
        aadhaarLast4?: string | undefined;
        panLast4?: string | undefined;
        occupation?: string | undefined;
    } | undefined;
    status?: "draft" | "submitted" | "acknowledged" | "assigned" | "under_investigation" | "closed" | "rejected" | "escalated" | undefined;
    platform?: string | undefined;
    incidentDate?: string | undefined;
    incidentLocation?: string | undefined;
    suspects?: {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        bankAccount?: string | undefined;
        upiId?: string | undefined;
        socialHandle?: string | undefined;
        platform?: string | undefined;
        ipAddress?: string | undefined;
        websiteUrl?: string | undefined;
        additionalInfo?: string | undefined;
    }[] | undefined;
}>;
export type CreateCaseDTO = z.infer<typeof CreateCaseSchema>;
export declare const UpdateCaseSchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodEnum<["upi_fraud", "credit_debit_fraud", "investment_scam", "phishing", "job_fraud", "matrimonial_fraud", "otp_fraud", "identity_theft", "sextortion", "ransomware", "cyber_harassment", "impersonation", "account_compromise", "other"]>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    incidentDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    incidentLocation: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    platform: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    transaction: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        amountLost: z.ZodOptional<z.ZodNumber>;
        currency: z.ZodDefault<z.ZodString>;
        transactionId: z.ZodOptional<z.ZodString>;
        transactionDate: z.ZodOptional<z.ZodString>;
        upiRef: z.ZodOptional<z.ZodString>;
        bankName: z.ZodOptional<z.ZodString>;
        accountNumber: z.ZodOptional<z.ZodString>;
        ifscCode: z.ZodOptional<z.ZodString>;
        paymentMode: z.ZodOptional<z.ZodEnum<["upi", "netbanking", "card", "cash", "crypto", "wallet", "other"]>>;
        additionalNotes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        amountLost?: number | undefined;
        transactionId?: string | undefined;
        transactionDate?: string | undefined;
        upiRef?: string | undefined;
        bankName?: string | undefined;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
        additionalNotes?: string | undefined;
    }, {
        amountLost?: number | undefined;
        currency?: string | undefined;
        transactionId?: string | undefined;
        transactionDate?: string | undefined;
        upiRef?: string | undefined;
        bankName?: string | undefined;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
        additionalNotes?: string | undefined;
    }>>>;
    suspects: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        mobile: z.ZodOptional<z.ZodString>;
        email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        bankAccount: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        socialHandle: z.ZodOptional<z.ZodString>;
        platform: z.ZodOptional<z.ZodString>;
        ipAddress: z.ZodOptional<z.ZodString>;
        websiteUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        additionalInfo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        bankAccount?: string | undefined;
        upiId?: string | undefined;
        socialHandle?: string | undefined;
        platform?: string | undefined;
        ipAddress?: string | undefined;
        websiteUrl?: string | undefined;
        additionalInfo?: string | undefined;
    }, {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        bankAccount?: string | undefined;
        upiId?: string | undefined;
        socialHandle?: string | undefined;
        platform?: string | undefined;
        ipAddress?: string | undefined;
        websiteUrl?: string | undefined;
        additionalInfo?: string | undefined;
    }>, "many">>>;
    victim: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        mobile: z.ZodOptional<z.ZodString>;
        email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        address: z.ZodOptional<z.ZodString>;
        aadhaarLast4: z.ZodOptional<z.ZodString>;
        panLast4: z.ZodOptional<z.ZodString>;
        occupation: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        address?: string | undefined;
        aadhaarLast4?: string | undefined;
        panLast4?: string | undefined;
        occupation?: string | undefined;
    }, {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        address?: string | undefined;
        aadhaarLast4?: string | undefined;
        panLast4?: string | undefined;
        occupation?: string | undefined;
    }>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["draft", "submitted", "acknowledged", "assigned", "under_investigation", "closed", "rejected", "escalated"]>>>;
}, "strip", z.ZodTypeAny, {
    transaction?: {
        currency: string;
        amountLost?: number | undefined;
        transactionId?: string | undefined;
        transactionDate?: string | undefined;
        upiRef?: string | undefined;
        bankName?: string | undefined;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
        additionalNotes?: string | undefined;
    } | undefined;
    victim?: {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        address?: string | undefined;
        aadhaarLast4?: string | undefined;
        panLast4?: string | undefined;
        occupation?: string | undefined;
    } | undefined;
    status?: "draft" | "submitted" | "acknowledged" | "assigned" | "under_investigation" | "closed" | "rejected" | "escalated" | undefined;
    platform?: string | undefined;
    category?: "upi_fraud" | "credit_debit_fraud" | "investment_scam" | "phishing" | "job_fraud" | "matrimonial_fraud" | "otp_fraud" | "identity_theft" | "sextortion" | "ransomware" | "cyber_harassment" | "impersonation" | "account_compromise" | "other" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    incidentDate?: string | undefined;
    incidentLocation?: string | undefined;
    suspects?: {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        bankAccount?: string | undefined;
        upiId?: string | undefined;
        socialHandle?: string | undefined;
        platform?: string | undefined;
        ipAddress?: string | undefined;
        websiteUrl?: string | undefined;
        additionalInfo?: string | undefined;
    }[] | undefined;
}, {
    transaction?: {
        amountLost?: number | undefined;
        currency?: string | undefined;
        transactionId?: string | undefined;
        transactionDate?: string | undefined;
        upiRef?: string | undefined;
        bankName?: string | undefined;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
        additionalNotes?: string | undefined;
    } | undefined;
    victim?: {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        address?: string | undefined;
        aadhaarLast4?: string | undefined;
        panLast4?: string | undefined;
        occupation?: string | undefined;
    } | undefined;
    status?: "draft" | "submitted" | "acknowledged" | "assigned" | "under_investigation" | "closed" | "rejected" | "escalated" | undefined;
    platform?: string | undefined;
    category?: "upi_fraud" | "credit_debit_fraud" | "investment_scam" | "phishing" | "job_fraud" | "matrimonial_fraud" | "otp_fraud" | "identity_theft" | "sextortion" | "ransomware" | "cyber_harassment" | "impersonation" | "account_compromise" | "other" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    incidentDate?: string | undefined;
    incidentLocation?: string | undefined;
    suspects?: {
        mobile?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        bankAccount?: string | undefined;
        upiId?: string | undefined;
        socialHandle?: string | undefined;
        platform?: string | undefined;
        ipAddress?: string | undefined;
        websiteUrl?: string | undefined;
        additionalInfo?: string | undefined;
    }[] | undefined;
}>;
export type UpdateCaseDTO = z.infer<typeof UpdateCaseSchema>;
export interface EvidenceFileDTO {
    id: string;
    caseId: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    malwareStatus: 'pending' | 'clean' | 'flagged';
    uploadedAt: string;
    description?: string;
    url: string;
}
export interface CaseEventDTO {
    id: string;
    eventType: string;
    note?: string;
    createdAt: string;
    actor?: string;
}
export interface EscalationDTO {
    id: string;
    reason: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_review' | 'resolved' | 'dismissed';
    requestedAt: string;
    resolvedAt?: string;
}
export interface CaseDTO {
    id: string;
    caseNumber: string;
    userId: string;
    category: CaseCategory;
    status: CaseStatus;
    title: string;
    description: string;
    incidentDate?: string;
    incidentLocation?: string;
    platform?: string;
    isDraft: boolean;
    submittedAt?: string;
    transaction?: TransactionDTO;
    suspects: SuspectDTO[];
    victim?: VictimDTO;
    evidence: EvidenceFileDTO[];
    events: CaseEventDTO[];
    escalations: EscalationDTO[];
    missingFieldsCount: number;
    conflictsCount: number;
    createdAt: string;
    updatedAt: string;
}
export interface CaseHealthDTO {
    score: number;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    completeness: number;
    missingFields: string[];
    nextActions: string[];
    estimatedProcessingDays: number;
    lastActivity: string;
    riskFlags: string[];
    canEscalate: boolean;
}
export declare const AIIntakeSchema: z.ZodObject<{
    message: z.ZodString;
    caseId: z.ZodOptional<z.ZodString>;
    existingData: z.ZodOptional<z.ZodObject<{
        category: z.ZodOptional<z.ZodEnum<["upi_fraud", "credit_debit_fraud", "investment_scam", "phishing", "job_fraud", "matrimonial_fraud", "otp_fraud", "identity_theft", "sextortion", "ransomware", "cyber_harassment", "impersonation", "account_compromise", "other"]>>;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        transaction: z.ZodOptional<z.ZodObject<{
            amountLost: z.ZodOptional<z.ZodNumber>;
            currency: z.ZodDefault<z.ZodString>;
            transactionId: z.ZodOptional<z.ZodString>;
            transactionDate: z.ZodOptional<z.ZodString>;
            upiRef: z.ZodOptional<z.ZodString>;
            bankName: z.ZodOptional<z.ZodString>;
            accountNumber: z.ZodOptional<z.ZodString>;
            ifscCode: z.ZodOptional<z.ZodString>;
            paymentMode: z.ZodOptional<z.ZodEnum<["upi", "netbanking", "card", "cash", "crypto", "wallet", "other"]>>;
            additionalNotes: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            currency: string;
            amountLost?: number | undefined;
            transactionId?: string | undefined;
            transactionDate?: string | undefined;
            upiRef?: string | undefined;
            bankName?: string | undefined;
            accountNumber?: string | undefined;
            ifscCode?: string | undefined;
            paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
            additionalNotes?: string | undefined;
        }, {
            amountLost?: number | undefined;
            currency?: string | undefined;
            transactionId?: string | undefined;
            transactionDate?: string | undefined;
            upiRef?: string | undefined;
            bankName?: string | undefined;
            accountNumber?: string | undefined;
            ifscCode?: string | undefined;
            paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
            additionalNotes?: string | undefined;
        }>>;
        suspects: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            mobile: z.ZodOptional<z.ZodString>;
            email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            bankAccount: z.ZodOptional<z.ZodString>;
            upiId: z.ZodOptional<z.ZodString>;
            socialHandle: z.ZodOptional<z.ZodString>;
            platform: z.ZodOptional<z.ZodString>;
            ipAddress: z.ZodOptional<z.ZodString>;
            websiteUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            additionalInfo: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            mobile?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            bankAccount?: string | undefined;
            upiId?: string | undefined;
            socialHandle?: string | undefined;
            platform?: string | undefined;
            ipAddress?: string | undefined;
            websiteUrl?: string | undefined;
            additionalInfo?: string | undefined;
        }, {
            mobile?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            bankAccount?: string | undefined;
            upiId?: string | undefined;
            socialHandle?: string | undefined;
            platform?: string | undefined;
            ipAddress?: string | undefined;
            websiteUrl?: string | undefined;
            additionalInfo?: string | undefined;
        }>, "many">>;
        victim: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            mobile: z.ZodOptional<z.ZodString>;
            email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            address: z.ZodOptional<z.ZodString>;
            aadhaarLast4: z.ZodOptional<z.ZodString>;
            panLast4: z.ZodOptional<z.ZodString>;
            occupation: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            mobile?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
            aadhaarLast4?: string | undefined;
            panLast4?: string | undefined;
            occupation?: string | undefined;
        }, {
            mobile?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
            aadhaarLast4?: string | undefined;
            panLast4?: string | undefined;
            occupation?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        transaction?: {
            currency: string;
            amountLost?: number | undefined;
            transactionId?: string | undefined;
            transactionDate?: string | undefined;
            upiRef?: string | undefined;
            bankName?: string | undefined;
            accountNumber?: string | undefined;
            ifscCode?: string | undefined;
            paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
            additionalNotes?: string | undefined;
        } | undefined;
        victim?: {
            mobile?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
            aadhaarLast4?: string | undefined;
            panLast4?: string | undefined;
            occupation?: string | undefined;
        } | undefined;
        category?: "upi_fraud" | "credit_debit_fraud" | "investment_scam" | "phishing" | "job_fraud" | "matrimonial_fraud" | "otp_fraud" | "identity_theft" | "sextortion" | "ransomware" | "cyber_harassment" | "impersonation" | "account_compromise" | "other" | undefined;
        title?: string | undefined;
        description?: string | undefined;
        suspects?: {
            mobile?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            bankAccount?: string | undefined;
            upiId?: string | undefined;
            socialHandle?: string | undefined;
            platform?: string | undefined;
            ipAddress?: string | undefined;
            websiteUrl?: string | undefined;
            additionalInfo?: string | undefined;
        }[] | undefined;
    }, {
        transaction?: {
            amountLost?: number | undefined;
            currency?: string | undefined;
            transactionId?: string | undefined;
            transactionDate?: string | undefined;
            upiRef?: string | undefined;
            bankName?: string | undefined;
            accountNumber?: string | undefined;
            ifscCode?: string | undefined;
            paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
            additionalNotes?: string | undefined;
        } | undefined;
        victim?: {
            mobile?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
            aadhaarLast4?: string | undefined;
            panLast4?: string | undefined;
            occupation?: string | undefined;
        } | undefined;
        category?: "upi_fraud" | "credit_debit_fraud" | "investment_scam" | "phishing" | "job_fraud" | "matrimonial_fraud" | "otp_fraud" | "identity_theft" | "sextortion" | "ransomware" | "cyber_harassment" | "impersonation" | "account_compromise" | "other" | undefined;
        title?: string | undefined;
        description?: string | undefined;
        suspects?: {
            mobile?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            bankAccount?: string | undefined;
            upiId?: string | undefined;
            socialHandle?: string | undefined;
            platform?: string | undefined;
            ipAddress?: string | undefined;
            websiteUrl?: string | undefined;
            additionalInfo?: string | undefined;
        }[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    caseId?: string | undefined;
    existingData?: {
        transaction?: {
            currency: string;
            amountLost?: number | undefined;
            transactionId?: string | undefined;
            transactionDate?: string | undefined;
            upiRef?: string | undefined;
            bankName?: string | undefined;
            accountNumber?: string | undefined;
            ifscCode?: string | undefined;
            paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
            additionalNotes?: string | undefined;
        } | undefined;
        victim?: {
            mobile?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
            aadhaarLast4?: string | undefined;
            panLast4?: string | undefined;
            occupation?: string | undefined;
        } | undefined;
        category?: "upi_fraud" | "credit_debit_fraud" | "investment_scam" | "phishing" | "job_fraud" | "matrimonial_fraud" | "otp_fraud" | "identity_theft" | "sextortion" | "ransomware" | "cyber_harassment" | "impersonation" | "account_compromise" | "other" | undefined;
        title?: string | undefined;
        description?: string | undefined;
        suspects?: {
            mobile?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            bankAccount?: string | undefined;
            upiId?: string | undefined;
            socialHandle?: string | undefined;
            platform?: string | undefined;
            ipAddress?: string | undefined;
            websiteUrl?: string | undefined;
            additionalInfo?: string | undefined;
        }[] | undefined;
    } | undefined;
}, {
    message: string;
    caseId?: string | undefined;
    existingData?: {
        transaction?: {
            amountLost?: number | undefined;
            currency?: string | undefined;
            transactionId?: string | undefined;
            transactionDate?: string | undefined;
            upiRef?: string | undefined;
            bankName?: string | undefined;
            accountNumber?: string | undefined;
            ifscCode?: string | undefined;
            paymentMode?: "other" | "upi" | "netbanking" | "card" | "cash" | "crypto" | "wallet" | undefined;
            additionalNotes?: string | undefined;
        } | undefined;
        victim?: {
            mobile?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
            aadhaarLast4?: string | undefined;
            panLast4?: string | undefined;
            occupation?: string | undefined;
        } | undefined;
        category?: "upi_fraud" | "credit_debit_fraud" | "investment_scam" | "phishing" | "job_fraud" | "matrimonial_fraud" | "otp_fraud" | "identity_theft" | "sextortion" | "ransomware" | "cyber_harassment" | "impersonation" | "account_compromise" | "other" | undefined;
        title?: string | undefined;
        description?: string | undefined;
        suspects?: {
            mobile?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            bankAccount?: string | undefined;
            upiId?: string | undefined;
            socialHandle?: string | undefined;
            platform?: string | undefined;
            ipAddress?: string | undefined;
            websiteUrl?: string | undefined;
            additionalInfo?: string | undefined;
        }[] | undefined;
    } | undefined;
}>;
export type AIIntakeDTO = z.infer<typeof AIIntakeSchema>;
export interface AIFieldExtraction {
    field: string;
    label: string;
    value: unknown;
    confidence: number;
    source: 'ai' | 'user' | 'system';
}
export interface AIStageResult {
    stage: string;
    success: boolean;
    data: unknown;
    tokensUsed?: number;
    durationMs?: number;
}
export interface AIIntakeResponse {
    message: string;
    extractedFields: AIFieldExtraction[];
    missingFields: Array<{
        field: string;
        label: string;
        required: boolean;
        promptText: string;
    }>;
    conflicts: Array<{
        field: string;
        existing: unknown;
        new: unknown;
    }>;
    suggestedEvidence: string[];
    followUpQuestion: string;
    updatedCase: Partial<CreateCaseDTO>;
    confidence: Record<string, number>;
    category?: CaseCategory;
    stages: AIStageResult[];
}
export interface NotificationDTO {
    id: string;
    userId: string;
    title: string;
    body: string;
    type: 'case_update' | 'evidence_requested' | 'system' | 'urgent' | 'escalation';
    read: boolean;
    caseId?: string;
    caseNumber?: string;
    createdAt: string;
}
export declare const EscalateSchema: z.ZodObject<{
    caseId: z.ZodString;
    reason: z.ZodString;
    urgency: z.ZodDefault<z.ZodEnum<["low", "medium", "high", "critical"]>>;
}, "strip", z.ZodTypeAny, {
    caseId: string;
    reason: string;
    urgency: "low" | "medium" | "high" | "critical";
}, {
    caseId: string;
    reason: string;
    urgency?: "low" | "medium" | "high" | "critical" | undefined;
}>;
export type EscalateDTO = z.infer<typeof EscalateSchema>;
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    total: number;
    page: number;
    limit: number;
}
export declare function maskMobile(mobile?: string | null): string;
export declare function maskAccount(account?: string | null): string;
export declare function maskEmail(email?: string | null): string;
export declare const CATEGORY_LABELS: Record<CaseCategory, string>;
export declare const STATUS_LABELS: Record<CaseStatus, string>;
