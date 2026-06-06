/**
 * Servicio del módulo reputation: Reseñas y reputación.
 *
 * Una reseña solo es válida sobre una reserva completada y entre las partes de
 * esa reserva (cliente <-> proveedor). Al crear/recalcular reseñas, se actualiza
 * el promedio (ratingAverage) y el conteo (ratingCount) del perfil del proveedor.
 */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { detectExternalContact } from '../../common/moderation/detect-external-contact';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateReputationEventDto, CreateReviewDto } from './reputation.dto';
import {
  ClientLevel,
  InactivityStatus,
  ProviderLevel,
  ReputationSummaryDto,
  TrustStatus,
  UserRole,
} from '@proxi/contracts';
import {
  calculateClientLevel,
  calculateProviderLevel,
  getLevelColor,
  getLevelLabel,
} from './helpers/level-calculator';
import {
  calculateTrustStatus,
  clampTrustScore,
  getTrustLabel,
} from './helpers/trust-score-calculator';

@Injectable()
export class ReputationService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(user: AuthenticatedUser, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
    if (!booking) throw new NotFoundException('Reserva no encontrada');

    const isParty = booking.clientId === user.id || booking.providerId === user.id;
    if (!isParty) throw new ForbiddenException('Solo las partes de la reserva pueden dejar reseña');

    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Solo se puede reseñar una reserva completada');
    }

    // El destinatario de la reseña es la contraparte de la reserva.
    const revieweeId = booking.clientId === user.id ? booking.providerId : booking.clientId;

    const existing = await this.prisma.review.findUnique({
      where: { bookingId_reviewerId: { bookingId: dto.bookingId, reviewerId: user.id } },
    });
    if (existing) throw new BadRequestException('Ya dejaste una reseña para esta reserva');

    const review = await this.prisma.review.create({
      data: {
        bookingId: dto.bookingId,
        reviewerId: user.id,
        revieweeId,
        rating: dto.rating,
        comment: dto.comment ?? null,
      },
    });

    // Anti-fuga: si el comentario sugiere contacto externo, lo marcamos para moderación.
    const leak = detectExternalContact(dto.comment);
    if (leak.detected) {
      await this.prisma.moderationFlag.create({
        data: {
          entityType: 'REVIEW',
          entityId: review.id,
          reporterId: user.id,
          reason: `Detección automática anti-fuga en reseña: ${leak.reasons.join('; ')}`,
          status: 'OPEN',
        },
      });
    }

    // Si la reseña es para un proveedor, recalculamos su reputación.
    await this.recalculateProviderRating(revieweeId);

    return this.toReviewView(review);
  }

  /** Lista las reseñas recibidas por un proveedor (por userId del proveedor). */
  async listForProvider(providerUserId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { revieweeId: providerUserId },
      include: { reviewer: { select: { id: true, displayName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return reviews.map((review) => ({
      id: review.id,
      bookingId: review.bookingId,
      rating: review.rating,
      comment: review.comment,
      reviewerName: review.reviewer?.displayName ?? 'Usuario Proxi',
      createdAt: review.createdAt,
    }));
  }

  /** Recalcula promedio y conteo de reseñas del perfil del proveedor (si existe). */
  private async recalculateProviderRating(revieweeUserId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId: revieweeUserId },
      select: { id: true },
    });
    if (!provider) return; // El destinatario era un cliente; no hay perfil de proveedor que actualizar.

    const agg = await this.prisma.review.aggregate({
      where: { revieweeId: revieweeUserId },
      _avg: { rating: true },
      _count: { _all: true },
    });

    await this.prisma.providerProfile.update({
      where: { userId: revieweeUserId },
      data: {
        ratingAverage: agg._avg.rating ?? 0,
        ratingCount: agg._count._all,
      },
    });
  }

  private toReviewView(review: { id: string; bookingId: string; rating: number; comment: string | null; revieweeId: string; createdAt: Date }) {
    return {
      id: review.id,
      bookingId: review.bookingId,
      revieweeId: review.revieweeId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    };
  }

  // ---------------------------------------------------------------------------
  // Resúmenes de reputación (niveles + confianza)
  // ---------------------------------------------------------------------------

  /**
   * Resumen de reputación de un usuario. Resuelve automáticamente si es
   * Proveedor independiente o Cliente según su perfil; si tiene ambos,
   * se prioriza el rol indicado (o el de Proveedor).
   */
  async getReputationSummary(userId: string, preferRole?: UserRole): Promise<ReputationSummaryDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { providerProfile: true, clientProfile: true },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const wantsClient = preferRole === UserRole.CLIENT;
    if (user.providerProfile && !wantsClient) {
      return this.buildProviderSummary(userId, user.providerProfile);
    }
    if (user.clientProfile) {
      return this.buildClientSummary(userId, user.clientProfile);
    }
    if (user.providerProfile) {
      return this.buildProviderSummary(userId, user.providerProfile);
    }
    throw new NotFoundException('El usuario no tiene perfil de reputación');
  }

  /** Resumen de reputación a partir del id del perfil de Proveedor. */
  async getProviderReputation(providerId: string): Promise<ReputationSummaryDto> {
    const profile = await this.prisma.providerProfile.findUnique({ where: { id: providerId } });
    if (!profile) throw new NotFoundException('Perfil de proveedor no encontrado');
    return this.buildProviderSummary(profile.userId, profile);
  }

  /** Resumen de reputación a partir del id del perfil de Cliente. */
  async getClientReputation(clientId: string): Promise<ReputationSummaryDto> {
    const profile = await this.prisma.clientProfile.findUnique({ where: { id: clientId } });
    if (!profile) throw new NotFoundException('Perfil de cliente no encontrado');
    return this.buildClientSummary(profile.userId, profile);
  }

  private buildProviderSummary(
    userId: string,
    profile: {
      level: string;
      trustScore: number;
      trustStatus: string;
      ratingAverage: number | null;
      ratingCount: number;
      completedJobs: number;
      inactivityStatus: string;
    },
  ): ReputationSummaryDto {
    const level = profile.level as ProviderLevel;
    const trustStatus = profile.trustStatus as TrustStatus;
    return {
      userId,
      role: UserRole.PROVIDER,
      level,
      levelLabel: getLevelLabel(level),
      levelColor: getLevelColor(level),
      stars: profile.ratingAverage ?? null,
      ratingCount: profile.ratingCount,
      trustScore: profile.trustScore,
      trustStatus,
      trustLabel: getTrustLabel(trustStatus),
      completedTasks: profile.completedJobs,
      cancelledTasks: 0,
      inactivityStatus: profile.inactivityStatus as InactivityStatus,
    };
  }

  private buildClientSummary(
    userId: string,
    profile: {
      level: string;
      trustScore: number;
      trustStatus: string;
      ratingAverage: unknown;
      ratingCount: number;
      completedTasksAsClient: number;
      cancelledTasksCount: number;
      inactivityStatus: string;
    },
  ): ReputationSummaryDto {
    const level = profile.level as ClientLevel;
    const trustStatus = profile.trustStatus as TrustStatus;
    const stars = profile.ratingAverage != null ? Number(profile.ratingAverage) : null;
    return {
      userId,
      role: UserRole.CLIENT,
      level,
      levelLabel: getLevelLabel(level),
      levelColor: getLevelColor(level),
      stars,
      ratingCount: profile.ratingCount,
      trustScore: profile.trustScore,
      trustStatus,
      trustLabel: getTrustLabel(trustStatus),
      completedTasks: profile.completedTasksAsClient,
      cancelledTasks: profile.cancelledTasksCount,
      inactivityStatus: profile.inactivityStatus as InactivityStatus,
    };
  }

  // ---------------------------------------------------------------------------
  // Eventos de reputación
  // ---------------------------------------------------------------------------

  /**
   * Registra un evento de reputación y aplica su impacto al trustScore del
   * usuario, recalculando estado de confianza y nivel.
   */
  async createReputationEvent(dto: CreateReputationEventDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      include: { providerProfile: true, clientProfile: true },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const event = await this.prisma.reputationEvent.create({
      data: {
        userId: dto.userId,
        role: dto.role,
        eventType: dto.eventType,
        scoreImpact: dto.scoreImpact,
        reason: dto.reason ?? null,
        relatedTaskId: dto.relatedTaskId ?? null,
        relatedBookingId: dto.relatedBookingId ?? null,
      },
    });

    await this.applyEventImpact(dto.userId, dto.role, dto.scoreImpact);

    return {
      id: event.id,
      userId: event.userId,
      role: event.role,
      eventType: event.eventType,
      scoreImpact: event.scoreImpact,
      reason: event.reason,
      createdAt: event.createdAt,
    };
  }

  /** Aplica el impacto del evento al perfil correspondiente y recalcula nivel. */
  private async applyEventImpact(userId: string, role: UserRole, scoreImpact: number) {
    if (role === UserRole.PROVIDER) {
      const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
      if (!profile) return;
      const trustScore = clampTrustScore(profile.trustScore + scoreImpact);
      const trustStatus = calculateTrustStatus(trustScore);
      const level = calculateProviderLevel({
        isVerified: profile.verificationStatus === 'APPROVED',
        completedJobs: profile.completedJobs,
        ratingAverage: profile.ratingAverage ?? null,
      });
      await this.prisma.providerProfile.update({
        where: { userId },
        data: { trustScore, trustStatus, level },
      });
      return;
    }

    if (role === UserRole.CLIENT) {
      const profile = await this.prisma.clientProfile.findUnique({ where: { userId } });
      if (!profile) return;
      const trustScore = clampTrustScore(profile.trustScore + scoreImpact);
      const trustStatus = calculateTrustStatus(trustScore);
      const level = calculateClientLevel({
        isVerified: profile.level !== ClientLevel.CLIENT_0_NEW,
        completedTasksAsClient: profile.completedTasksAsClient,
        cancelledTasksCount: profile.cancelledTasksCount,
      });
      await this.prisma.clientProfile.update({
        where: { userId },
        data: { trustScore, trustStatus, level },
      });
    }
  }

  /** Lista los eventos de reputación de un usuario (más recientes primero). */
  async listEvents(userId: string) {
    const events = await this.prisma.reputationEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return events.map((event) => ({
      id: event.id,
      role: event.role,
      eventType: event.eventType,
      scoreImpact: event.scoreImpact,
      reason: event.reason,
      relatedTaskId: event.relatedTaskId,
      relatedBookingId: event.relatedBookingId,
      createdAt: event.createdAt,
    }));
  }
}
