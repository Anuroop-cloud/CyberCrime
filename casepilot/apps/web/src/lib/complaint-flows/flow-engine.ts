import { COMPLAINT_FLOWS } from './flows';
import { ComplaintFlowConfig, FlowId, FlowTabConfig, TabStatus } from './types';

// Standalone financial tab config for dynamic injection into any flow when money is lost
const DYNAMIC_FINANCIAL_TAB: FlowTabConfig = {
  id: 'financial',
  label: 'Financial Details',
  shortLabel: 'Financial',
  description: 'Transaction details required for inter-bank account freeze (1930 / I4C)',
  isMandatory: true,
  sections: [
    {
      id: 'dynamic_loss',
      title: 'Monetary Loss & Bank Information',
      fields: [
        { id: 'fraudAmount', label: 'Amount Debited / Stolen (INR ₹)', type: 'currency', placeholder: '50000', required: true },
        {
          id: 'paymentMode',
          label: 'Payment Method',
          type: 'select',
          required: true,
          options: [
            { value: 'UPI', label: 'UPI (GPay / PhonePe / Paytm / BHIM)' },
            { value: 'Net Banking / IMPS / NEFT', label: 'Net Banking (IMPS / NEFT)' },
            { value: 'Credit Card', label: 'Credit Card' },
            { value: 'Debit Card', label: 'Debit Card' }
          ]
        },
        { id: 'bankName', label: 'Your Bank Name', type: 'text', placeholder: 'e.g. HDFC Bank / SBI', required: true },
        { id: 'utrNumber', label: '12-Digit UTR / Transaction Reference', type: 'text', placeholder: 'e.g. 418293847291', required: true, helperText: 'Required for beneficiary bank to freeze funds immediately.' },
        { id: 'beneficiaryAccount', label: 'Suspect Account / UPI ID (if known)', type: 'text', placeholder: 'e.g. suspect@okhdfcbank' }
      ]
    }
  ]
};

export function getFlowConfig(flowId: FlowId): ComplaintFlowConfig {
  return COMPLAINT_FLOWS[flowId] || COMPLAINT_FLOWS.FINANCIAL_FRAUD;
}

/**
 * Returns the dynamic active tabs for a flow based on the current live caseState.
 * e.g., If user reported monetary loss in Phishing, dynamically injects Financial Details.
 */
export function getActiveTabsForFlow(flowId: FlowId, caseState: Record<string, any>): FlowTabConfig[] {
  const baseConfig = getFlowConfig(flowId);
  let tabs = [...baseConfig.tabs];

  // Dynamic Financial Details tab injection
  const hasFinancialLoss =
    caseState.financialImpact === 'yes' ||
    caseState.lostMoney === 'yes' ||
    (caseState.fraudAmount && parseFloat(caseState.fraudAmount) > 0);

  const alreadyHasFinancialTab = tabs.some(t => t.id === 'financial');

  if (hasFinancialLoss && !alreadyHasFinancialTab) {
    // Insert financial tab right before evidence and review
    const evidenceIdx = tabs.findIndex(t => t.id === 'evidence');
    if (evidenceIdx !== -1) {
      tabs.splice(evidenceIdx, 0, DYNAMIC_FINANCIAL_TAB);
    } else {
      tabs.push(DYNAMIC_FINANCIAL_TAB);
    }
  }

  // Filter out any conditional tabs whose condition returns false
  tabs = tabs.filter(tab => {
    if (tab.conditionalOn) {
      return tab.conditionalOn(caseState);
    }
    return true;
  });

  return tabs;
}

/**
 * Computes the real completion status for each tab.
 */
export function computeTabStatus(
  tab: FlowTabConfig,
  caseState: Record<string, any>,
  evidenceCount: number,
  allPreviousTabsComplete: boolean
): { status: TabStatus; missingRequiredFields: string[]; filledFieldsCount: number } {
  // Special handling for Evidence tab
  if (tab.id === 'evidence') {
    if (evidenceCount > 0) {
      return { status: 'complete', missingRequiredFields: [], filledFieldsCount: evidenceCount };
    }
    return { status: tab.isMandatory ? 'needs_attention' : 'optional', missingRequiredFields: ['At least 1 proof file recommended'], filledFieldsCount: 0 };
  }

  // Special handling for Review & Submit tab
  if (tab.id === 'review') {
    if (!allPreviousTabsComplete) {
      return { status: 'locked', missingRequiredFields: ['Complete all preceding required tabs'], filledFieldsCount: 0 };
    }
    if (caseState.declarationAccepted) {
      return { status: 'complete', missingRequiredFields: [], filledFieldsCount: 1 };
    }
    return { status: 'in_progress', missingRequiredFields: ['Accept legal declaration'], filledFieldsCount: 0 };
  }

  // Evaluate fields across all sections in this tab
  let requiredFieldsCount = 0;
  let missingRequiredFields: string[] = [];
  let filledFieldsCount = 0;
  let totalFieldsCount = 0;

  for (const section of tab.sections) {
    if (section.conditionalOn && !section.conditionalOn(caseState)) {
      continue;
    }

    for (const field of section.fields) {
      if (field.conditionalOn && !field.conditionalOn(caseState)) {
        continue;
      }

      totalFieldsCount++;
      const val = caseState[field.id];
      const isFilled = val !== undefined && val !== null && String(val).trim() !== '';

      if (isFilled) {
        filledFieldsCount++;
      }

      if (field.required) {
        requiredFieldsCount++;
        if (!isFilled) {
          missingRequiredFields.push(field.label);
        }
      }
    }
  }

  if (filledFieldsCount === 0) {
    return {
      status: tab.isMandatory ? 'empty' : 'optional',
      missingRequiredFields,
      filledFieldsCount: 0
    };
  }

  if (missingRequiredFields.length > 0) {
    return {
      status: 'needs_attention',
      missingRequiredFields,
      filledFieldsCount
    };
  }

  return {
    status: 'complete',
    missingRequiredFields: [],
    filledFieldsCount
  };
}
