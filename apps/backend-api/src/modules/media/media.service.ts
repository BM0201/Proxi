import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { MediaPurpose, MediaStatus } from '@proxi/database';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import { UploadMediaDto } from './media.dto';

const imageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const videoMimes = ['video/mp4', 'video/quicktime', 'video/webm'];
const documentMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

const extensionByMime: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/jpg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'video/mp4': ['mp4'],
  'video/quicktime': ['mov'],
  'video/webm': ['webm'],
  'application/pdf': ['pdf'],
};

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadMetadata(user: AuthenticatedUser, dto: UploadMediaDto) {
    this.validateUpload(dto);
    const fileName = this.sanitizeFileName(dto.originalName);
    const isPublic = this.isPublicPurpose(dto.purpose);
    const storageKey = `local-dev/${user.id}/${Date.now()}-${fileName}`;

    const file = await this.prisma.mediaFile.create({
      data: {
        ownerUserId: user.id,
        purpose: dto.purpose,
        fileName,
        originalName: dto.originalName,
        mimeType: dto.mimeType,
        sizeBytes: dto.sizeBytes,
        storageKey,
        publicUrl: isPublic ? `/media/${storageKey}` : null,
        privateUrl: isPublic ? null : `private:${storageKey}`,
        status: dto.purpose === 'PROVIDER_PORTFOLIO' ? 'PENDING_REVIEW' : 'UPLOADED',
      },
    });

    // TODO: conectar escritura binaria local/S3 y escaneo antivirus antes de producción.
    return this.safeMedia(file, user);
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const file = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!file || file.status === 'DELETED') throw new NotFoundException('Archivo no encontrado');
    if (!this.canAccess(user, file.ownerUserId, file.publicUrl !== null)) {
      throw new ForbiddenException('No autorizado para ver este archivo');
    }
    return this.safeMedia(file, user);
  }

  async remove(user: AuthenticatedUser, id: string) {
    const file = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('Archivo no encontrado');
    if (!this.canAccess(user, file.ownerUserId, false)) {
      throw new ForbiddenException('No autorizado para eliminar este archivo');
    }
    const updated = await this.prisma.mediaFile.update({
      where: { id },
      data: { status: 'DELETED' },
    });
    return this.safeMedia(updated, user);
  }

  private validateUpload(dto: UploadMediaDto) {
    const ext = dto.originalName.split('.').pop()?.toLowerCase();
    if (!ext) throw new BadRequestException('Extensión requerida');

    const allowedExtensions = extensionByMime[dto.mimeType] ?? [];
    if (!allowedExtensions.includes(ext)) throw new BadRequestException('Extensión y MIME no coinciden o no están permitidos');

    const purpose = dto.purpose;
    if (purpose === 'TASK_VIDEO') {
      if (!videoMimes.includes(dto.mimeType) || dto.sizeBytes > 50 * 1024 * 1024) throw new BadRequestException('Video no permitido');
      return;
    }
    if (
      ['VERIFICATION_DOCUMENT', 'VERIFICATION_SELFIE', 'BOOKING_EVIDENCE', 'DISPUTE_EVIDENCE'].includes(purpose)
    ) {
      if (!documentMimes.includes(dto.mimeType) || dto.sizeBytes > 10 * 1024 * 1024) throw new BadRequestException('Documento no permitido');
      return;
    }
    if (!imageMimes.includes(dto.mimeType) || dto.sizeBytes > 8 * 1024 * 1024) {
      throw new BadRequestException('Imagen no permitida');
    }
  }

  private sanitizeFileName(name: string) {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();
  }

  private isPublicPurpose(purpose: MediaPurpose) {
    return purpose === 'AVATAR';
  }

  private canAccess(user: AuthenticatedUser, ownerUserId: string, isPublic: boolean) {
    return isPublic || user.id === ownerUserId || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
  }

  private safeMedia(file: {
    id: string;
    ownerUserId: string;
    purpose: MediaPurpose;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    status: MediaStatus;
    publicUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }, user: AuthenticatedUser) {
    const maySeeOwner = user.id === file.ownerUserId || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    return {
      id: file.id,
      ownerUserId: maySeeOwner ? file.ownerUserId : undefined,
      purpose: file.purpose,
      originalName: file.originalName,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      status: file.status,
      publicUrl: file.publicUrl,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }
}
