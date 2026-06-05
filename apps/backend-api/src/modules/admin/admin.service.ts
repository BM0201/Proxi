import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AdminVerificationDecisionDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

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
