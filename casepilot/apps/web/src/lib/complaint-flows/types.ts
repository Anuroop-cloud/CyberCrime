export type FlowId =
  | 'FINANCIAL_FRAUD'
  | 'SOCIAL_MEDIA'
  | 'HACKING'
  | 'RANSOMWARE'
  | 'PHISHING'
  | 'HARASSMENT'
  | 'WOMEN_CHILDREN'
  | 'OTHER_CYBERCRIME';

export type TabStatus = 'empty' | 'in_progress' | 'needs_attention' | 'complete' | 'optional' | 'locked';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'currency'
  | 'select'
  | 'date'
  | 'time'
  | 'radio'
  | 'checkbox'
  | 'pills'
  | 'identifiers_list';

export interface FlowFieldOption {
  value: string;
  label: string;
  subLabel?: string;
}

export interface FlowFieldConfig {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FlowFieldOption[];
  helperText?: string;
  required?: boolean;
  sensitive?: boolean;
  conditionalOn?: (caseState: any) => boolean;
  defaultValue?: any;
  validationRule?: (value: any, caseState: any) => string | null;
}

export interface FlowSectionConfig {
  id: string;
  title: string;
  description?: string;
  sensitiveNotice?: string;
  fields: FlowFieldConfig[];
  conditionalOn?: (caseState: any) => boolean;
}

export interface FlowTabConfig {
  id: string;
  label: string;
  shortLabel?: string;
  description?: string;
  iconName?: string;
  sections: FlowSectionConfig[];
  conditionalOn?: (caseState: any) => boolean;
  isMandatory?: boolean;
}

export interface SensitiveHandlingRule {
  isSensitive: boolean;
  allowAnonymous: boolean;
  anonymousNotice?: string;
  stripIdentityFieldsInAnonymous: boolean;
}

export interface WorkflowStageConfig {
  id: string;
  label: string;
  description: string;
  authority: string;
  typicalDuration: string;
}

export interface ComplaintFlowConfig {
  id: FlowId;
  title: string;
  description: string;
  ncrpCategory: string;
  subcategories: string[];
  evidenceTypes: string[];
  sensitiveRules?: SensitiveHandlingRule;
  workflowStages: WorkflowStageConfig[];
  tabs: FlowTabConfig[];
}
