import {
  Controller, Post, Get, Delete, Param, Body,
  UseGuards, UseInterceptors, UploadedFile, Res, Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { EvidenceService } from './evidence.service';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';

@Controller('evidence')
@UseGuards(AuthGuard('jwt'))
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Post('cases/:caseId/upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  upload(
    @Param('caseId') caseId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: CurrentUserPayload,
    @Body('description') description?: string,
  ) {
    return this.evidenceService.upload(caseId, user.id, file, description);
  }

  @Get('cases/:caseId')
  list(@Param('caseId') caseId: string, @CurrentUser() user: CurrentUserPayload) {
    return this.evidenceService.list(caseId, user.id);
  }

  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
    @Res() res: Response,
  ) {
    const { buffer, mimeType, fileName } = await this.evidenceService.serveFile(id, user.id);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.evidenceService.delete(id, user.id);
  }
}
