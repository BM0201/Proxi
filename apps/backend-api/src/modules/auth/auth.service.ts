import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hashPassword, signToken, verifyPassword } from '@proxi/auth';
import { UserRole as ContractUserRole } from '@proxi/contracts';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';
import type { AuthenticatedUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    if (!['CLIENT', 'PROVIDER'].includes(dto.role)) {
      throw new BadRequestException('El registro público solo permite CLIENT o PROVIDER');
    }

    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Ya existe una cuenta Proxi con ese correo');

    const passwordHash = await hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        role: dto.role,
        status: 'ACTIVE',
        displayName: dto.displayName,
        clientProfile:
          dto.role === 'CLIENT'
            ? { create: { displayName: dto.displayName } }
            : undefined,
        providerProfile:
          dto.role === 'PROVIDER'
            ? { create: { displayName: dto.displayName } }
            : undefined,
      },
      select: { id: true, email: true, role: true, status: true, displayName: true },
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true, status: true, displayName: true, passwordHash: true },
    });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await verifyPassword(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');
    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Cuenta Proxi no disponible');
    }

    return this.buildAuthResponse(user);
  }

  me(user: AuthenticatedUser) {
    return { user };
  }

  logout() {
    return { ok: true };
  }

  private buildAuthResponse(user: AuthenticatedUser) {
    const accessToken = signToken(
      { sub: user.id, email: user.email, role: user.role as ContractUserRole },
      {
        secret: this.config.get<string>('JWT_SECRET') ?? '',
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN') ?? '1d',
      },
    );

    return { accessToken, user };
  }
}
