import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';

@Controller('escalations')
@UseGuards(AuthGuard('jwt'))
export class EscalationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list(@CurrentUser() user: CurrentUserPayload) {
    return this.prisma.escalation.findMany({
      where: { case: { userId: user.id } },
      include: { case: { select: { caseNumber: true, title: true, category: true } } },
      orderBy: { requestedAt: 'desc' },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.prisma.escalation.findFirst({
      where: { id, case: { userId: user.id } },
      include: { case: true },
    });
  }
}
