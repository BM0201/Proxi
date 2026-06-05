import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import { ProviderCertificationDto, ProviderVerificationDto } from './identity.dto';

@Injectable()
export class IdentityService {
  constructor(private readonly prisma: PrismaService) {}

  async createProviderVerification(user: AuthenticatedUser, dto: ProviderVerificationDto) {
    const provider = await this.getProviderProfile(user);
    await this.assertOwnedMedia(user.id, [dto.identityDocumentFrontMediaId, dto.identityDocumentBackMediaId, dto.selfieMediaId]);

    const verification = await this.prisma.providerVerification.create({
      data: {
        providerId: provider.id,
        identityDocumentFrontMediaId: dto.identityDocumentFrontMediaId,
        identityDocumentBackMediaId: dto.identityDocumentBackMediaId,
        selfieMediaId: dto.selfieMediaId,
        notes: dto.notes,
        status: 'PENDING_REVIEW',
      },
    });

    await this.prisma.providerProfile.update({
      where: { id: provider.id },
      data: { verificationStatus: 'PENDING_REVIEW' },
    });

    return verification;
  }

  async getMyProviderVerification(user: AuthenticatedUser) {
    const provider = await this.getProviderProfile(user);
    return this.prisma.providerVerification.findFirst({
      where: { providerId: provider.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProviderCertification(user: AuthenticatedUser, dto: ProviderCertificationDto) {
    const provider = await this.getProviderProfile(user);
    await this.assertOwnedMedia(user.id, [dto.mediaId]);

    return this.prisma.providerCertification.create({
      data: {
        providerId: provider.id,
        title: dto.title,
        issuer: dto.issuer,
        mediaId: dto.mediaId,
        status: 'PENDING_REVIEW',
      },
    });
  }

  async getMyProviderCertifications(user: AuthenticatedUser) {
    const provider = await this.getProviderProfile(user);
    return this.prisma.providerCertification.findMany({
      where: { providerId: provider.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async getProviderProfile(user: AuthenticatedUser) {
    if (user.role !== 'PROVIDER') throw new ForbiddenException('Solo proveedores independientes');
    const provider = await this.prisma.providerProfile.findUnique({ where: { userId: user.id } });
    if (!provider) throw new NotFoundException('Perfil de proveedor no encontrado');
    return provider;
  }

  private async assertOwnedMedia(userId: string, ids: Array<string | undefined>) {
    const filtered = ids.filter((id): id is string => Boolean(id));
    if (filtered.length === 0) throw new BadRequestException('Debe adjuntar media válida');
    const count = await this.prisma.mediaFile.count({
      where: { id: { in: filtered }, ownerUserId: userId },
    });
    if (count !== filtered.length) throw new BadRequestException('Uno o más archivos no pertenecen a la cuenta Proxi');
  }
}
