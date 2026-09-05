import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MockAiProvider } from './providers/mock.provider';
import { OpenAiProvider } from './providers/openai.provider';
import { AIProvider } from './providers/ai-provider.interface';
import { AIIntakeDTO, AIIntakeResponse, CaseDTO } from '../../shared';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly provider: AIProvider;

  constructor(private readonly prisma: PrismaService) {
    const providerType = process.env.AI_PROVIDER ?? 'mock';
    this.provider = providerType === 'openai' ? new OpenAiProvider() : new MockAiProvider();
    this.logger.log(`AI provider: ${providerType}`);
  }

  async processIntake(
    dto: AIIntakeDTO,
    userId: string,
  ): Promise<AIIntakeResponse> {
    const t0 = Date.now();

    // Load existing case if provided
    let existingCase: Partial<CaseDTO> | undefined;
    if (dto.caseId) {
      const c = await this.prisma.case.findFirst({
        where: { id: dto.caseId, userId },
        include: { transaction: true, suspects: true, victim: true },
      });
      existingCase = c as any;
    }

    const result = await this.provider.runFullPipeline(dto, existingCase);
    const duration = Date.now() - t0;

    // Persist AI run record
    if (dto.caseId) {
      await this.prisma.aiRun.create({
        data: {
          caseId: dto.caseId,
          stage: 'field_extraction',
          provider: (process.env.AI_PROVIDER as any) ?? 'mock',
          inputText: dto.message,
          outputJson: result as any,
          durationMs: duration,
        },
      });

      // Persist field extractions
      for (const ext of result.extractedFields) {
        await this.prisma.fieldExtraction.create({
          data: {
            caseId: dto.caseId,
            fieldPath: ext.field,
            label: ext.label,
            value: ext.value as any,
            confidence: ext.confidence,
            source: 'ai',
          },
        });
      }

      // Upsert missing fields
      for (const mf of result.missingFields) {
        await this.prisma.missingField.upsert({
          where: { id: `${dto.caseId}-${mf.field}`.slice(0, 25) },
          create: {
            caseId: dto.caseId,
            fieldPath: mf.field,
            label: mf.label,
            required: mf.required,
            promptText: mf.promptText,
          },
          update: {},
        }).catch(() => {}); // ignore if upsert fails (bad id format)
      }
    }

    return result;
  }

  async getCaseHealth(caseId: string, userId: string) {
    const c = await this.prisma.case.findFirstOrThrow({
      where: { id: caseId, userId },
      include: { transaction: true, suspects: true, victim: true, evidence: true },
    });
    return this.provider.assessCaseHealth(c as any);
  }

  async getEscalationGuidance(caseId: string, userId: string) {
    const c = await this.prisma.case.findFirstOrThrow({
      where: { id: caseId, userId },
      include: { transaction: true, suspects: true, victim: true },
    });
    return this.provider.escalationGuidance(c as any);
  }
}
