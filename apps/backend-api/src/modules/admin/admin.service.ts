import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AdminModerationDecisionDto, AdminVerificationDecisionDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // Panel de administración: vistas de solo lectura
  // ---------------------------------------------------------------------------

  /** Resumen de métricas para el dashboard del administrador. */
  async overview() {
    const [users, providers, tasks, bookings, openFlags, pendingVerifications, protectedPayments] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.providerProfile.count(),
        this.prisma.task.count(),
        this.prisma.booking.count(),
        this.prisma.moderationFlag.count({ where: { status: 'OPEN' } }),
        this.prisma.providerVerification.count({ where: { status: 'PENDING_REVIEW' } }),
        this.prisma.booking.count({ where: { protectedPaymentStatus: 'PROTECTED' } }),
      ]);
    return { users, providers, tasks, bookings, openFlags, pendingVerifications, protectedPayments };
  }

  /** Lista de usuarios (datos no sensibles). */
  listUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  /** Lista de proveedores con su perfil y nivel de verificación. */
  listProviders() {
    return this.prisma.providerProfile.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, displayName: true, status: true } },
      },
    });
  }

  /** Lista de tareas publicadas. */
  listTasks() {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, displayName: true } },
        _count: { select: { offers: true } },
      },
    });
  }

  /** Lista de reservas. */
  listBookings() {
    return this.prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        task: { select: { id: true, title: true } },
        client: { select: { id: true, displayName: true } },
        provider: { select: { id: true, displayName: true } },
      },
    });
  }

  /** Lista de pagos protegidos (reservas con estado de pago protegido). */
  listProtectedPayments() {
    return this.prisma.booking.findMany({
      where: { protectedPaymentStatus: { in: ['PROTECTED', 'APPROVED_FOR_PAYOUT', 'DISPUTED', 'REFUNDED'] } },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        status: true,
        protectedPaymentStatus: true,
        totalAmount: true,
        platformFee: true,
        agreedPrice: true,
        clientId: true,
        providerId: true,
        taskId: true,
        updatedAt: true,
      },
    });
  }

  /** Lista de flags de moderación (anti-fuga, reportes). */
  listModerationFlags() {
    return this.prisma.moderationFlag.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { id: true, displayName: true, role: true } },
      },
    });
  }

  /** Resuelve un flag de moderación (REVIEWED/ACTIONED/DISMISSED). */
  async resolveModerationFlag(id: string, dto: AdminModerationDecisionDto) {
    const flag = await this.prisma.moderationFlag.findUnique({ where: { id } });
    if (!flag) throw new NotFoundException('Flag de moderación no encontrado');
    return this.prisma.moderationFlag.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  listVerifications() {
    return this.prisma.providerVerification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        provider: {
          include: {
            user: { select: { id: true, email: true, displayName: true, role: true, status: true, createdAt: true } },
          },
        },
      },
    });
  }

  async getVerification(id: string) {
    const verification = await this.prisma.providerVerification.findUnique({
      where: { id },
      include: {
        identityDocumentFrontMedia: true,
        identityDocumentBackMedia: true,
        selfieMedia: true,
        provider: {
          include: {
            user: { select: { id: true, email: true, displayName: true, role: true, status: true, createdAt: true } },
            certifications: true,
          },
        },
      },
    });
    if (!verification) throw new NotFoundException('Verificación no encontrada');
    return verification;
  }

  approveVerification(id: string, admin: AuthenticatedUser) {
    return this.decideVerification(id, admin, { status: 'APPROVED' });
  }

  rejectVerification(id: string, admin: AuthenticatedUser, dto: AdminVerificationDecisionDto) {
    return this.decideVerification(id, admin, {
      status: 'REJECTED',
      rejectionReason: dto.rejectionReason,
    });
  }

  requestCorrection(id: string, admin: AuthenticatedUser, dto: AdminVerificationDecisionDto) {
    return this.decideVerification(id, admin, {
      status: 'NEEDS_CORRECTION',
      rejectionReason: dto.rejectionReason,
    });
  }

  private async decideVerification(
    id: string,
    admin: AuthenticatedUser,
    dto: Pick<AdminVerificationDecisionDto, 'status' | 'rejectionReason'>,
  ) {
    const verification = await this.prisma.providerVerification.findUnique({ where: { id } });
    if (!verification) throw new NotFoundException('Verificación no encontrada');
    if (dto.status === 'REJECTED' && !dto.rejectionReason) {
      throw new BadRequestException('Debe indicar razón de rechazo');
    }

    const updated = await this.prisma.providerVerification.update({
      where: { id },
      data: {
        status: dto.status,
        reviewedByAdminId: admin.id,
        reviewedAt: new Date(),
        rejectionReason: dto.rejectionReason,
      },
    });

    await this.prisma.providerProfile.update({
      where: { id: verification.providerId },
      data: {
        verificationStatus: dto.status,
        level: dto.status === 'APPROVED' ? 'LEVEL_1' : undefined,
      },
    });

    return updated;
  }
}
