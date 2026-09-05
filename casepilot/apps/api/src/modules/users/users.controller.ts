import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  async me(@CurrentUser() user: CurrentUserPayload) {
    return this.prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, mobile: true, name: true, email: true, createdAt: true },
    });
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: { name?: string; email?: string },
  ) {
    return this.prisma.user.update({
      where: { id: user.id },
      data: { name: body.name, email: body.email },
      select: { id: true, mobile: true, name: true, email: true },
    });
  }
}
