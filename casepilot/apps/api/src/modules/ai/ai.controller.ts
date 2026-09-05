import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { IsString, IsOptional } from 'class-validator';

class IntakeDto {
  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  caseId?: string;
}

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('intake')
  intake(@Body() dto: IntakeDto, @CurrentUser() user: CurrentUserPayload) {
    return this.aiService.processIntake(dto, user.id);
  }

  @Get('cases/:id/health')
  health(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.aiService.getCaseHealth(id, user.id);
  }

  @Get('cases/:id/escalation-guidance')
  escalation(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.aiService.getEscalationGuidance(id, user.id);
  }
}
