import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CaseStatus, CaseCategory, maskMobile, maskAccount } from '../../shared';
import { v4 as uuidv4 } from 'uuid';

function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CP${year}${random}`;
}

function maskCase(c: any) {
  if (c.victim?.mobile) c.victim.mobile = maskMobile(c.victim.mobile);
  if (c.transaction?.accountNumber) c.transaction.accountNumber = maskAccount(c.transaction.accountNumber);
  for (const s of c.suspects ?? []) {
    if (s.mobile) s.mobile = maskMobile(s.mobile);
    if (s.bankAccount) s.bankAccount = maskAccount(s.bankAccount);
  }
  return c;
}

const INCLUDE_FULL = {
  transaction: true,
  suspects: true,
  victim: true,
  evidence: { where: { isDeleted: false } },
  events: { orderBy: { createdAt: 'desc' as const }, take: 20 },
  escalations: { orderBy: { requestedAt: 'desc' as const } },
  _count: { select: { missingFields: true, conflicts: true } },
};

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertOwner(caseId: string, userId: string) {
    const c = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!c) throw new NotFoundException('Case not found');
    if (c.userId !== userId) throw new ForbiddenException('Access denied');
    return c;
  }

  async list(userId: string, status?: string, page = 1, limit = 20) {
    const where: any = { userId };
    if (status) where.status = status;

    const [cases, total] = await Promise.all([
      this.prisma.case.findMany({
        where,
        include: {
          transaction: { select: { amountLost: true, currency: true } },
          _count: { select: { evidence: true, suspects: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.case.count({ where }),
    ]);

    return { data: cases, total, page, limit };
  }

  async findOne(id: string, userId: string) {
    await this.assertOwner(id, userId);
    const c = await this.prisma.case.findUnique({
      where: { id },
      include: {
        ...INCLUDE_FULL,
      },
    });
    if (!c) throw new NotFoundException();
    const result = {
      ...c,
      missingFieldsCount: (c as any)._count.missingFields,
      conflictsCount: (c as any)._count.conflicts,
    };
    return maskCase(result);
  }

  async findByCaseNumber(caseNumber: string, userId: string) {
    const c = await this.prisma.case.findUnique({
      where: { caseNumber },
      include: INCLUDE_FULL,
    });
    if (!c) throw new NotFoundException('Case not found');
    if (c.userId !== userId) throw new ForbiddenException('Access denied');
    const result = {
      ...c,
      missingFieldsCount: (c as any)._count.missingFields,
      conflictsCount: (c as any)._count.conflicts,
    };
    return maskCase(result);
  }

  async create(userId: string, data: any) {
    const caseNumber = generateCaseNumber();

    const c = await this.prisma.case.create({
      data: {
        caseNumber,
        userId,
        category: data.category ?? 'other',
        status: 'draft',
        title: data.title ?? 'New Complaint',
        description: data.description ?? '',
        incidentDate: data.incidentDate ? new Date(data.incidentDate) : undefined,
        incidentLocation: data.incidentLocation,
        platform: data.platform,
        isDraft: true,
      },
    });

    // Parallel create relations if provided
    await Promise.all([
      data.transaction
        ? this.prisma.transaction.create({ data: { caseId: c.id, ...data.transaction } })
        : Promise.resolve(),
      data.suspects?.length
        ? this.prisma.suspect.createMany({ data: data.suspects.map((s: any) => ({ caseId: c.id, ...s })) })
        : Promise.resolve(),
      data.victim
        ? this.prisma.victim.create({ data: { caseId: c.id, ...data.victim } })
        : Promise.resolve(),
    ]);

    // Audit
    await this.prisma.caseEvent.create({
      data: { caseId: c.id, userId, eventType: 'case_created', note: 'Complaint created' },
    });

    return c;
  }

  async update(id: string, userId: string, data: any) {
    await this.assertOwner(id, userId);

    const updates: any = {};
    if (data.category) updates.category = data.category;
    if (data.title) updates.title = data.title;
    if (data.description) updates.description = data.description;
    if (data.incidentDate) updates.incidentDate = new Date(data.incidentDate);
    if (data.incidentLocation) updates.incidentLocation = data.incidentLocation;
    if (data.platform) updates.platform = data.platform;

    const c = await this.prisma.case.update({ where: { id }, data: updates });

    // Update relations
    if (data.transaction) {
      await this.prisma.transaction.upsert({
        where: { caseId: id },
        create: { caseId: id, ...data.transaction },
        update: data.transaction,
      });
    }

    if (data.suspects) {
      // Delete old suspects and recreate
      await this.prisma.suspect.deleteMany({ where: { caseId: id } });
      if (data.suspects.length > 0) {
        await this.prisma.suspect.createMany({
          data: data.suspects.map((s: any) => ({ caseId: id, ...s })),
        });
      }
    }

    if (data.victim) {
      await this.prisma.victim.upsert({
        where: { caseId: id },
        create: { caseId: id, ...data.victim },
        update: data.victim,
      });
    }

    await this.prisma.caseEvent.create({
      data: { caseId: id, userId, eventType: 'fields_updated', note: 'Case details updated' },
    });

    return c;
  }

  async submit(id: string, userId: string) {
    const c = await this.assertOwner(id, userId);
    if (c.status !== 'draft') throw new BadRequestException('Only draft cases can be submitted');

    // Check minimum required fields
    const t = await this.prisma.transaction.findUnique({ where: { caseId: id } });
    if (!c.description || c.description.length < 20) {
      throw new BadRequestException('Please provide a more detailed description before submitting');
    }

    const updated = await this.prisma.case.update({
      where: { id },
      data: { status: 'submitted', isDraft: false, submittedAt: new Date() },
    });

    await this.prisma.caseEvent.create({
      data: { caseId: id, userId, eventType: 'status_change', note: 'Complaint submitted for review' },
    });

    // Auto-acknowledge (demo)
    setTimeout(async () => {
      await this.prisma.case.update({ where: { id }, data: { status: 'acknowledged', acknowledgedAt: new Date() } });
      await this.prisma.caseEvent.create({
        data: { caseId: id, userId, eventType: 'status_change', note: 'Complaint acknowledged by cybercrime cell', metadata: { actor: 'System' } },
      });
      await this.prisma.notification.create({
        data: {
          userId,
          caseId: id,
          caseNumber: c.caseNumber,
          title: 'Complaint Acknowledged',
          body: `Your complaint ${c.caseNumber} has been acknowledged. Keep this number for future reference.`,
          type: 'case_update',
        },
      });
    }, 3000);

    return updated;
  }

  async escalate(id: string, userId: string, body: { reason: string; urgency?: string }) {
    await this.assertOwner(id, userId);

    const esc = await this.prisma.escalation.create({
      data: {
        caseId: id,
        reason: body.reason,
        urgency: (body.urgency as any) ?? 'medium',
        status: 'open',
      },
    });

    await this.prisma.case.update({ where: { id }, data: { status: 'escalated' } });
    await this.prisma.caseEvent.create({
      data: { caseId: id, userId, eventType: 'escalation', note: 'Case escalated: ' + body.reason },
    });

    return esc;
  }

  async getStats(userId: string) {
    const [total, draft, submitted, acknowledged, assigned, underInv, closed, escalated] =
      await Promise.all([
        this.prisma.case.count({ where: { userId } }),
        this.prisma.case.count({ where: { userId, status: 'draft' } }),
        this.prisma.case.count({ where: { userId, status: 'submitted' } }),
        this.prisma.case.count({ where: { userId, status: 'acknowledged' } }),
        this.prisma.case.count({ where: { userId, status: 'assigned' } }),
        this.prisma.case.count({ where: { userId, status: 'under_investigation' } }),
        this.prisma.case.count({ where: { userId, status: 'closed' } }),
        this.prisma.case.count({ where: { userId, status: 'escalated' } }),
      ]);

    const totalLost = await this.prisma.transaction.aggregate({
      where: { case: { userId } },
      _sum: { amountLost: true },
    });

    return { total, draft, submitted, acknowledged, assigned, underInv, closed, escalated, totalAmountLost: totalLost._sum.amountLost ?? 0 };
  }
}
