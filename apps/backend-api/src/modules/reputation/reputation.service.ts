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
import { CreateReviewDto } from './reputation.dto';

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
}
