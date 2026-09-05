import { Injectable, Logger } from '@nestjs/common';
import { AIProvider } from './ai-provider.interface';
import { MockAiProvider } from './mock.provider';
import { AIIntakeDTO, AIIntakeResponse, CaseDTO } from '../../../shared';

/**
 * OpenAI adapter – uses GPT-4o-mini with structured JSON output.
 * Falls back to mock provider if OPENAI_API_KEY is missing or on error.
 */
@Injectable()
export class OpenAiProvider implements AIProvider {
  private readonly logger = new Logger(OpenAiProvider.name);
  private client: any = null;
  private readonly mock: MockAiProvider;

  constructor() {
    this.mock = new MockAiProvider();
    this.init();
  }

  private init() {
    if (!process.env.OPENAI_API_KEY) {
      this.logger.warn('OPENAI_API_KEY not set – OpenAI provider will fall back to mock');
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const openaiModule = require('openai');
      const OpenAI = openaiModule.OpenAI ?? openaiModule.default;
      this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      this.logger.log('OpenAI client initialized');
    } catch (e) {
      this.logger.error('Failed to initialize OpenAI client – install openai package to enable', e);
    }

  }

  private get systemPrompt(): string {
    return `You are CasePilot AI, an expert cybercrime complaint assistant for India.
Your role is to extract structured information from victims' free-text descriptions.
Always respond in JSON format exactly matching the schema provided.
Be precise, compassionate, and neutral. Never speculate about legal outcomes.
Focus on: amounts, dates, UPI IDs, transaction IDs, platform names, suspect info.
Mask sensitive data in your explanations but keep raw values in the JSON.`;
  }

  async runFullPipeline(dto: AIIntakeDTO, existing?: Partial<CaseDTO>): Promise<AIIntakeResponse> {
    if (!this.client) return this.mock.runFullPipeline(dto, existing);

    try {
      const t0 = Date.now();
      const schema = {
        category: 'string (one of: upi_fraud|investment_scam|phishing|job_fraud|sextortion|ransomware|cyber_harassment|impersonation|account_compromise|otp_fraud|credit_debit_fraud|identity_theft|other)',
        extractedFields: 'array of {field: string, label: string, value: any, confidence: number 0-1}',
        missingFields: 'array of {field: string, label: string, required: boolean, promptText: string}',
        conflicts: 'array of {field: string, existing: any, new: any}',
        suggestedEvidence: 'array of strings',
        followUpQuestion: 'string – next most important question for the victim',
        message: 'string – friendly assistant message acknowledging extracted fields',
        updatedCase: 'partial case object with extracted data',
        confidence: 'object mapping field paths to confidence scores',
      };

      const response = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: this.systemPrompt },
          {
            role: 'user',
            content: `Victim message: "${dto.message}"\n\nExisting case data: ${JSON.stringify(existing ?? {}, null, 2)}\n\nExtract and return JSON matching this schema:\n${JSON.stringify(schema, null, 2)}`,
          },
        ],
        temperature: 0.2,
      });

      const parsed = JSON.parse(response.choices[0].message.content ?? '{}');

      return {
        ...parsed,
        stages: [
          { stage: 'full_pipeline_openai', success: true, data: parsed, durationMs: Date.now() - t0, tokensUsed: response.usage?.total_tokens ?? 0 },
        ],
      } as AIIntakeResponse;
    } catch (e) {
      this.logger.error('OpenAI pipeline failed, falling back to mock', e);
      return this.mock.runFullPipeline(dto, existing);
    }
  }

  async classify(text: string) {
    if (!this.client) return this.mock.classify(text);
    try {
      const res = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: `Classify this cybercrime report: "${text}". Return JSON: {category: string, confidence: number}` },
        ],
        temperature: 0.1,
      });
      return JSON.parse(res.choices[0].message.content ?? '{}');
    } catch {
      return this.mock.classify(text);
    }
  }

  async assessCaseHealth(caseData: Partial<CaseDTO>) {
    return this.mock.assessCaseHealth(caseData);
  }

  async escalationGuidance(caseData: Partial<CaseDTO>) {
    return this.mock.escalationGuidance(caseData);
  }
}
