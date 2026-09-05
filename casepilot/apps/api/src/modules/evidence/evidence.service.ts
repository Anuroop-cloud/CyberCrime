import {
  Injectable, BadRequestException, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';

const ALLOWED_MIME_TYPES = (process.env.ALLOWED_MIME_TYPES ?? 'image/jpeg,image/png,application/pdf,video/mp4').split(',');
const MAX_SIZE_BYTES = parseInt(process.env.MAX_FILE_SIZE_MB ?? '10') * 1024 * 1024;

@Injectable()
export class EvidenceService {
  private readonly uploadDir: string;

  constructor(private readonly prisma: PrismaService) {
    this.uploadDir = path.resolve(process.env.UPLOAD_DIR ?? './uploads');
    fs.mkdirSync(this.uploadDir, { recursive: true });
  }

  async upload(caseId: string, userId: string, file: Express.Multer.File, description?: string) {
    // Authorization
    const c = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!c) throw new NotFoundException('Case not found');
    if (c.userId !== userId) throw new ForbiddenException('Access denied');

    // Validation
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} not allowed`);
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException(`File too large. Max ${process.env.MAX_FILE_SIZE_MB}MB`);
    }

    // Store outside public dir
    const safeFileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`;
    const storagePath = path.join(this.uploadDir, caseId, safeFileName);
    fs.mkdirSync(path.dirname(storagePath), { recursive: true });
    fs.writeFileSync(storagePath, file.buffer);

    const evidence = await this.prisma.evidence.create({
      data: {
        caseId,
        fileName: safeFileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storagePath,
        description,
        malwareStatus: 'pending', // placeholder – would call AV service in production
      },
    });

    // Simulate async malware scan (always clean in demo)
    setTimeout(async () => {
      await this.prisma.evidence.update({
        where: { id: evidence.id },
        data: { malwareStatus: 'clean' },
      });
    }, 2000);

    await this.prisma.caseEvent.create({
      data: {
        caseId,
        userId,
        eventType: 'evidence_uploaded',
        note: `Evidence uploaded: ${file.originalname}`,
        metadata: { fileName: file.originalname, mimeType: file.mimetype, sizeBytes: file.size },
      },
    });

    return evidence;
  }

  async list(caseId: string, userId: string) {
    const c = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!c) throw new NotFoundException();
    if (c.userId !== userId) throw new ForbiddenException();

    return this.prisma.evidence.findMany({
      where: { caseId, isDeleted: false },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async delete(evidenceId: string, userId: string) {
    const ev = await this.prisma.evidence.findUnique({ where: { id: evidenceId }, include: { case: true } });
    if (!ev) throw new NotFoundException();
    if (ev.case.userId !== userId) throw new ForbiddenException();

    // Soft delete
    await this.prisma.evidence.update({ where: { id: evidenceId }, data: { isDeleted: true } });

    // Remove file
    try { fs.unlinkSync(ev.storagePath); } catch {}

    return { success: true };
  }

  /** Serve evidence file with auth check (returns Buffer + mime) */
  async serveFile(evidenceId: string, userId: string): Promise<{ buffer: Buffer; mimeType: string; fileName: string }> {
    const ev = await this.prisma.evidence.findUnique({ where: { id: evidenceId }, include: { case: true } });
    if (!ev || ev.isDeleted) throw new NotFoundException();
    if (ev.case.userId !== userId) throw new ForbiddenException();

    const buffer = fs.readFileSync(ev.storagePath);
    return { buffer, mimeType: ev.mimeType, fileName: ev.originalName };
  }
}
