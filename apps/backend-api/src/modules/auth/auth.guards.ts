import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { extractBearerToken, verifyToken } from '@proxi/auth';
import type { UserRole } from '@proxi/database';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthenticatedUser } from './auth.types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const token = extractBearerToken(request.headers.authorization);
    if (!token) throw new UnauthorizedException('Token Bearer requerido');

    try {
      const payload = verifyToken(token, this.config.get<string>('JWT_SECRET') ?? '');
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, role: true, status: true, displayName: true },
      });
      if (!user || user.status === 'BANNED' || user.status === 'SUSPENDED') {
        throw new UnauthorizedException('Cuenta Proxi no disponible');
      }
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const user = request.user;
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Rol no autorizado para esta acción');
    }
    return true;
  }
}
