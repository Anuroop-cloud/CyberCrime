import {
  Controller, Get, Post, Patch, Param, Body,
  Query, UseGuards, HttpCode
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CasesService } from './cases.service';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';

@Controller('cases')
@UseGuards(AuthGuard('jwt'))
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  list(
    @CurrentUser() user: CurrentUserPayload,
    @Query('status') status?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.casesService.list(user.id, status, +page, +limit);
  }

  @Get('stats')
  stats(@CurrentUser() user: CurrentUserPayload) {
    return this.casesService.getStats(user.id);
  }

  @Get('track/:caseNumber')
  track(
    @Param('caseNumber') caseNumber: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.casesService.findByCaseNumber(caseNumber, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.casesService.findOne(id, user.id);
  }

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() body: any) {
    return this.casesService.create(user.id, body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: any,
  ) {
    return this.casesService.update(id, user.id, body);
  }

  @Post(':id/submit')
  @HttpCode(200)
  submit(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.casesService.submit(id, user.id);
  }

  @Post(':id/escalate')
  @HttpCode(200)
  escalate(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: { reason: string; urgency?: string },
  ) {
    return this.casesService.escalate(id, user.id, body);
  }
}
