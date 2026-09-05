import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CasesModule } from './modules/cases/cases.module';
import { AiModule } from './modules/ai/ai.module';
import { EvidenceModule } from './modules/evidence/evidence.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { EscalationsModule } from './modules/escalations/escalations.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env', '../../.env', '.env.local'] }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CasesModule,
    AiModule,
    EvidenceModule,
    NotificationsModule,
    EscalationsModule,
  ],
})
export class AppModule {}
