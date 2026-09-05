import { AIIntakeDTO, AIIntakeResponse, CaseDTO } from '../../../shared';

export interface AIProvider {
  /**
   * Full pipeline: runs all 11 stages sequentially and returns a unified response.
   * Stages: classify → schema_select → extract → confidence → missing_fields
   *         → contradictions → evidence_plan → review_packet → submission_packet
   *         → case_health → escalation_guide
   */
  runFullPipeline(dto: AIIntakeDTO, existingCase?: Partial<CaseDTO>): Promise<AIIntakeResponse>;

  /** Stage 1: Classify the crime category from free text */
  classify(text: string): Promise<{ category: string; subcategory?: string; confidence: number }>;

  /** Stage 10: Assess case health from complete case data */
  assessCaseHealth(caseData: Partial<CaseDTO>): Promise<{
    score: number;
    urgency: string;
    completeness: number;
    missingFields: string[];
    nextActions: string[];
    estimatedProcessingDays: number;
    riskFlags: string[];
    canEscalate: boolean;
  }>;

  /** Stage 11: Provide escalation guidance */
  escalationGuidance(caseData: Partial<CaseDTO>): Promise<{
    shouldEscalate: boolean;
    reason: string;
    urgency: string;
    steps: string[];
  }>;
}
