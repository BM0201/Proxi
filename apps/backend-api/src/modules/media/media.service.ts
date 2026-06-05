import { randomBytes } from 'node:crypto';
import { promises as fs, createReadStream, type ReadStream } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { MediaFile, MediaPurpose, MediaStatus } from '@proxi/database';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import type { MediaPurposeValue } from './media.dto';

const imageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const videoMimes = ['video/mp4', 'video/quicktime', 'video/webm'];
const documentMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

const MB = 1024 * 1024;
const IMAGE_MAX = 8 * MB;
const DOCUMENT_MAX = 10 * MB;
const VIDEO_MAX = 50 * MB;

/** Extensiones válidas por tipo MIME (defensa adicional contra spoofing de extensión). */
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

/** Carpeta por propósito dentro del storage local. */
const folderByPurpose: Record<MediaPurpose, string> = {
  AVATAR: 'avatars',
  PROVIDER_PORTFOLIO: 'portfolio',
  VERIFICATION_DOCUMENT: 'verification',
  VERIFICATION_SELFIE: 'verification',
  TASK_PHOTO: 'tasks',
  TASK_VIDEO: 'tasks',
  BOOKING_EVIDENCE: 'evidence',
  DISPUTE_EVIDENCE: 'evidence',
};

interface UploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class MediaService {
  private readonly storageRoot: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const configured = this.config.get<string>('LOCAL_STORAGE_PATH') ?? 'apps/backend-api/storage/local';
    this.storageRoot = isAbsolute(configured) ? configured : resolve(process.cwd(), configured);
  }

  /**
   * Sube un archivo real al almacenamiento local y registra su metadata.
   * Valida MIME, extensión, tamaño y reglas de privacidad por propósito.
   *
   * TODO: migrar a almacenamiento S3 (firmado) para producción.
   * TODO: ejecutar escaneo antivirus antes de marcar el archivo como disponible.
   */
  async uploadFile(user: AuthenticatedUser, file: UploadedFile | undefined, purpose: MediaPurposeValue) {
    if (!file) throw new BadRequestException('Debe adjuntar un archivo en el campo "file"');
    this.validateUpload(file, purpose);

    const safeName = this.sanitizeFileName(file.originalname);
    const unique = `${Date.now()}-${randomBytes(6).toString('hex')}-${safeName}`;
    const folder = folderByPurpose[purpose as MediaPurpose];
    // storageKey es una ruta RELATIVA interna; nunca se expone al cliente.
    const storageKey = `${folder}/${user.id}/${unique}`;
    const absolutePath = join(this.storageRoot, storageKey);

    // Crear carpeta si no existe y escribir el binario.
    await fs.mkdir(dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, file.buffer);

    const isPublic = this.isPublicPurpose(purpose as MediaPurpose);
    const created = await this.prisma.mediaFile.create({
      data: {
        ownerUserId: user.id,
        purpose: purpose as MediaPurpose,
        fileName: unique,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storageKey,
        // publicUrl solo se rellena para propósitos públicos (ej. avatar).
        // El portafolio es público solo si el proveedor está APPROVED (se evalúa al servir).
        publicUrl: isPublic ? `/api/media/public/${'__ID__'}` : null,
        privateUrl: null,
        status: purpose === 'PROVIDER_PORTFOLIO' ? 'PENDING_REVIEW' : 'UPLOADED',
      },
    });

    // Completar publicUrl con el id real (cuid generado).
    const finalized = isPublic
      ? await this.prisma.mediaFile.update({
          where: { id: created.id },
          data: { publicUrl: `/api/media/public/${created.id}` },
        })
      : created;

    return this.safeMedia(finalized, user);
  }

  /** Devuelve metadata segura de un archivo (protegido por permisos). */
  async findOne(user: AuthenticatedUser, id: string) {
    const file = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!file || file.status === 'DELETED') throw new NotFoundException('Archivo no encontrado');
    if (!(await this.canAccess(user, file))) {
      throw new ForbiddenException('No autorizado para ver este archivo');
    }
    return this.safeMedia(file, user);
  }

  /**
   * Resuelve un archivo público para servirlo por streaming.
   * Reglas:
   *  - AVATAR siempre público.
   *  - PROVIDER_PORTFOLIO público solo si el proveedor dueño está APPROVED.
   *  - Cualquier otro propósito NO es público (documentos/verificación/evidencia).
   */
  async getPublicFile(id: string): Promise<{ stream: ReadStream; mimeType: string; fileName: string }> {
    const file = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!file || file.status === 'DELETED') throw new NotFoundException('Archivo no encontrado');

    const isPublic = await this.isPubliclyServable(file);
    if (!isPublic) throw new ForbiddenException('Este archivo no es público');

    return this.openStream(file);
  }

  /**
   * Resuelve un archivo protegido para servirlo por streaming.
   * Solo el dueño o un administrador pueden acceder (ej. admin revisando verificación).
   */
  async getProtectedFile(
    user: AuthenticatedUser,
    id: string,
  ): Promise<{ stream: ReadStream; mimeType: string; fileName: string }> {
    const file = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!file || file.status === 'DELETED') throw new NotFoundException('Archivo no encontrado');
    if (!(await this.canAccess(user, file))) {
      throw new ForbiddenException('No autorizado para ver este archivo');
    }
    return this.openStream(file);
  }

  async remove(user: AuthenticatedUser, id: string) {
    const file = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('Archivo no encontrado');
    if (user.id !== file.ownerUserId && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('No autorizado para eliminar este archivo');
    }
    const updated = await this.prisma.mediaFile.update({
      where: { id },
      data: { status: 'DELETED' },
    });
    return this.safeMedia(updated, user);
  }

  // ---------------------------------------------------------------------------
  // Asociaciones de media (tareas y portafolio de proveedor)
  // ---------------------------------------------------------------------------

  /** Adjunta un archivo (TASK_PHOTO/TASK_VIDEO) a una tarea propia del cliente. */
  async attachTaskMedia(user: AuthenticatedUser, taskId: string, mediaId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    if (task.clientId !== user.id && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Solo el cliente dueño puede adjuntar archivos a esta tarea');
    }
    const media = await this.assertOwnedMedia(user, mediaId, ['TASK_PHOTO', 'TASK_VIDEO']);
    const link = await this.prisma.taskMedia.upsert({
      where: { taskId_mediaId: { taskId, mediaId } },
      update: {},
      create: { taskId, mediaId },
    });
    return { id: link.id, taskId, media: this.safeMedia(media, user) };
  }

  /** Lista los archivos adjuntos a una tarea (respeta permisos de lectura de la tarea). */
  async listTaskMedia(user: AuthenticatedUser, taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    const canRead =
      task.clientId === user.id ||
      user.role === 'ADMIN' ||
      user.role === 'SUPER_ADMIN' ||
      user.role === 'PROVIDER';
    if (!canRead) throw new ForbiddenException('No autorizado para ver esta tarea');

    const links = await this.prisma.taskMedia.findMany({
      where: { taskId, media: { status: { not: 'DELETED' } } },
      include: { media: true },
      orderBy: { createdAt: 'desc' },
    });
    return links.map((link) => ({ id: link.id, media: this.safeMedia(link.media, user) }));
  }

  /** Agrega un archivo de portafolio (PROVIDER_PORTFOLIO) al perfil del proveedor autenticado. */
  async attachPortfolioMedia(user: AuthenticatedUser, mediaId: string) {
    if (user.role !== 'PROVIDER') throw new ForbiddenException('Solo proveedores independientes');
    const provider = await this.prisma.providerProfile.findUnique({ where: { userId: user.id } });
    if (!provider) throw new NotFoundException('Perfil de proveedor no encontrado');
    const media = await this.assertOwnedMedia(user, mediaId, ['PROVIDER_PORTFOLIO']);
    const link = await this.prisma.providerPortfolioMedia.upsert({
      where: { providerId_mediaId: { providerId: provider.id, mediaId } },
      update: {},
      create: { providerId: provider.id, mediaId },
    });
    return { id: link.id, providerId: provider.id, media: this.safeMedia(media, user) };
  }

  /**
   * Lista el portafolio de un proveedor.
   *  - El dueño y los administradores ven todo.
   *  - El resto solo ve archivos APPROVED si el proveedor está verificado (APPROVED).
   */
  async listPortfolioMedia(user: AuthenticatedUser, providerProfileId: string) {
    const provider = await this.prisma.providerProfile.findUnique({ where: { id: providerProfileId } });
    if (!provider) throw new NotFoundException('Proveedor no encontrado');

    const isOwnerOrAdmin =
      provider.userId === user.id || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    const publicVisible = provider.verificationStatus === 'APPROVED';
    if (!isOwnerOrAdmin && !publicVisible) {
      return [];
    }

    const links = await this.prisma.providerPortfolioMedia.findMany({
      where: {
        providerId: providerProfileId,
        media: {
          status: isOwnerOrAdmin ? { not: 'DELETED' } : 'APPROVED',
        },
      },
      include: { media: true },
      orderBy: { createdAt: 'desc' },
    });
    return links.map((link) => ({ id: link.id, media: this.safeMedia(link.media, user) }));
  }

  /** Adjunta evidencia (BOOKING_EVIDENCE) a una reserva. El proveedor o el cliente de la reserva pueden hacerlo. */
  async attachBookingEvidence(user: AuthenticatedUser, bookingId: string, mediaId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Reserva no encontrada');
    const isParty =
      booking.providerId === user.id ||
      booking.clientId === user.id ||
      user.role === 'ADMIN' ||
      user.role === 'SUPER_ADMIN';
    if (!isParty) throw new ForbiddenException('Solo las partes de la reserva pueden adjuntar evidencia');
    const media = await this.assertOwnedMedia(user, mediaId, ['BOOKING_EVIDENCE', 'DISPUTE_EVIDENCE']);
    const link = await this.prisma.bookingEvidenceMedia.upsert({
      where: { bookingId_mediaId: { bookingId, mediaId } },
      update: {},
      create: { bookingId, mediaId },
    });
    return { id: link.id, bookingId, media: this.safeMedia(media, user) };
  }

  /** Lista la evidencia de una reserva (solo partes de la reserva o admin). */
  async listBookingEvidence(user: AuthenticatedUser, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Reserva no encontrada');
    const isParty =
      booking.providerId === user.id ||
      booking.clientId === user.id ||
      user.role === 'ADMIN' ||
      user.role === 'SUPER_ADMIN';
    if (!isParty) throw new ForbiddenException('No autorizado para ver la evidencia de esta reserva');
    const links = await this.prisma.bookingEvidenceMedia.findMany({
      where: { bookingId, media: { status: { not: 'DELETED' } } },
      include: { media: true },
      orderBy: { createdAt: 'desc' },
    });
    return links.map((link) => ({ id: link.id, media: this.safeMedia(link.media, user) }));
  }

  /** Verifica que la media exista, pertenezca al usuario y tenga un propósito permitido. */
  private async assertOwnedMedia(user: AuthenticatedUser, mediaId: string, allowed: MediaPurpose[]) {
    const media = await this.prisma.mediaFile.findUnique({ where: { id: mediaId } });
    if (!media || media.status === 'DELETED') throw new NotFoundException('Archivo no encontrado');
    if (media.ownerUserId !== user.id) {
      throw new ForbiddenException('El archivo no pertenece a tu cuenta Proxi');
    }
    if (!allowed.includes(media.purpose)) {
      throw new BadRequestException('El propósito del archivo no es válido para esta asociación');
    }
    return media;
  }

  // ---------------------------------------------------------------------------
  // Internos
  // ---------------------------------------------------------------------------

  private async openStream(file: MediaFile): Promise<{ stream: ReadStream; mimeType: string; fileName: string }> {
    const absolutePath = join(this.storageRoot, file.storageKey);
    try {
      await fs.access(absolutePath);
    } catch {
      throw new NotFoundException('Archivo no disponible en el almacenamiento local');
    }
    return {
      stream: createReadStream(absolutePath),
      mimeType: file.mimeType,
      fileName: file.originalName,
    };
  }

  private validateUpload(file: UploadedFile, purpose: MediaPurposeValue) {
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (!ext) throw new BadRequestException('El archivo debe tener extensión');

    const allowedExtensions = extensionByMime[file.mimetype] ?? [];
    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException('La extensión no coincide con el tipo de archivo o no está permitida');
    }

    if (purpose === 'TASK_VIDEO') {
      if (!videoMimes.includes(file.mimetype)) throw new BadRequestException('Tipo de video no permitido');
      if (file.size > VIDEO_MAX) throw new BadRequestException('El video supera el límite de 50MB');
      return;
    }

    if (['VERIFICATION_DOCUMENT', 'VERIFICATION_SELFIE', 'BOOKING_EVIDENCE', 'DISPUTE_EVIDENCE'].includes(purpose)) {
      if (!documentMimes.includes(file.mimetype)) throw new BadRequestException('Tipo de documento no permitido');
      if (file.size > DOCUMENT_MAX) throw new BadRequestException('El documento supera el límite de 10MB');
      return;
    }

    // AVATAR, PROVIDER_PORTFOLIO, TASK_PHOTO -> imágenes
    if (!imageMimes.includes(file.mimetype)) throw new BadRequestException('Tipo de imagen no permitido');
    if (file.size > IMAGE_MAX) throw new BadRequestException('La imagen supera el límite de 8MB');
  }

  private sanitizeFileName(name: string) {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
      .slice(0, 80) || 'archivo';
  }

  private isPublicPurpose(purpose: MediaPurpose) {
    return purpose === 'AVATAR';
  }

  /** Determina si un archivo puede servirse públicamente al momento de la petición. */
  private async isPubliclyServable(file: MediaFile): Promise<boolean> {
    if (file.purpose === 'AVATAR') return true;
    if (file.purpose === 'PROVIDER_PORTFOLIO') {
      const provider = await this.prisma.providerProfile.findUnique({
        where: { userId: file.ownerUserId },
        select: { verificationStatus: true },
      });
      return provider?.verificationStatus === 'APPROVED';
    }
    return false;
  }

  private async canAccess(user: AuthenticatedUser, file: MediaFile): Promise<boolean> {
    if (user.id === file.ownerUserId) return true;
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return true;
    return this.isPubliclyServable(file);
  }

  /** Metadata "segura": nunca expone storageKey ni rutas internas del sistema. */
  private safeMedia(file: MediaFile, user: AuthenticatedUser) {
    const maySeeOwner =
      user.id === file.ownerUserId || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    return {
      id: file.id,
      ownerUserId: maySeeOwner ? file.ownerUserId : undefined,
      purpose: file.purpose as MediaPurpose,
      originalName: file.originalName,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      status: file.status as MediaStatus,
      publicUrl: file.publicUrl,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }
}
