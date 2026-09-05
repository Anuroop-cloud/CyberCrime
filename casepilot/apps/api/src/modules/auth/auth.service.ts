import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { SendOtpSchema, VerifyOtpSchema } from '../../shared';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(mobile: string): Promise<{ message: string; demo?: boolean }> {
    // Validate
    try { SendOtpSchema.parse({ mobile }); }
    catch (e: any) { throw new BadRequestException(e.message); }

    // Invalidate old OTPs
    await this.prisma.otpSession.updateMany({
      where: { mobile, used: false },
      data: { used: true },
    });

    const code = process.env.DEMO_OTP ?? Math.floor(100000 + Math.random() * 900000).toString();
    const expirySeconds = parseInt(process.env.OTP_EXPIRY_SECONDS ?? '300');
    const expiresAt = new Date(Date.now() + expirySeconds * 1000);

    await this.prisma.otpSession.create({
      data: { mobile, code, expiresAt },
    });

    // In production: send SMS. In demo, return hint.
    const isDemo = mobile === '9989284448';
    console.log(`[OTP] ${mobile} → ${code}`);

    return {
      message: `OTP sent to ${mobile.slice(0, 2)}XXXXXXXX${mobile.slice(-2)}`,
      ...(isDemo ? { demo: true } : {}),
    };
  }

  async verifyOtp(mobile: string, otp: string): Promise<{ token: string; user: object }> {
    try { VerifyOtpSchema.parse({ mobile, otp }); }
    catch (e: any) { throw new BadRequestException(e.message); }

    const session = await this.prisma.otpSession.findFirst({
      where: { mobile, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!session || session.code !== otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark used
    await this.prisma.otpSession.update({
      where: { id: session.id },
      data: { used: true },
    });

    // Upsert user
    const user = await this.prisma.user.upsert({
      where: { mobile },
      update: {},
      create: { mobile, name: 'User' },
    });

    const payload = { sub: user.id, mobile: user.mobile, name: user.name };
    const token = this.jwtService.sign(payload);

    // Persist session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      token,
      user: { id: user.id, mobile: user.mobile, name: user.name, email: user.email },
    };
  }

  async logout(token: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { token } });
  }
}
