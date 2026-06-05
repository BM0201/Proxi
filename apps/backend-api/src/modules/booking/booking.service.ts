import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/auth.types';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async mine(user: AuthenticatedUser) {
    const where =
      user.role === 'CLIENT'
        ? { clientId: user.id }
        : user.role === 'PROVIDER'
          ? { providerId: user.id }
          : {};

    const bookings = await this.prisma.booking.findMany({
      where,
      include: this.bookingInclude(),
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((booking) => this.toBookingView(booking, user));
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: this.bookingInclude(),
    });
    if (!booking) throw new NotFoundException('Reserva no encontrada');
    this.assertCanRead(user, booking);
    return this.toBookingView(booking, user);
  }

  async fromOffer(user: AuthenticatedUser, offerId: string) {
    const offer = await this.prisma.offer.findUnique({ where: { id: offerId }, include: { task: true } });
    if (!offer) throw new NotFoundException('Oferta no encontrada');
    if (offer.task.clientId !== user.id) throw new ForbiddenException('Solo el cliente dueño puede crear la reserva');
    if (offer.status !== 'ACCEPTED') throw new BadRequestException('La oferta debe estar aceptada antes de crear reserva');

    const existing = await this.prisma.booking.findUnique({
      where: { offerId },
      include: this.bookingInclude(),
    });
    if (existing) return this.toBookingView(existing, user);

    const booking = await this.prisma.booking.create({
      data: {
        taskId: offer.taskId,
        offerId,
        clientId: user.id,
        providerId: offer.providerId,
        agreedPrice: offer.amount,
        totalAmount: offer.amount,
        platformFee: Number(offer.amount) * 0.08,
        status: 'CONFIRMED',
        protectedPaymentStatus: 'NOT_STARTED',
      },
      include: this.bookingInclude(),
    });
    return this.toBookingView(booking, user);
  }

  async confirmProtectedPayment(user: AuthenticatedUser, id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id }, include: { task: true } });
    if (!booking) throw new NotFoundException('Reserva no encontrada');
    if (booking.clientId !== user.id) throw new ForbiddenException('Solo el cliente puede confirmar pago protegido');

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id: booking.taskId },
        data: { status: 'PROTECTED_PAYMENT_CONFIRMED' },
      });
      return tx.booking.update({
        where: { id },
        data: { protectedPaymentStatus: 'PROTECTED', status: 'CONFIRMED' },
        include: this.bookingInclude(),
      });
    });

    return this.toBookingView(updated, user);
  }

  private assertCanRead(user: AuthenticatedUser, booking: { clientId: string; providerId: string }) {
    if (
      booking.clientId !== user.id &&
      booking.providerId !== user.id &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    ) {
      throw new ForbiddenException('No autorizado para ver esta reserva');
    }
  }

  private bookingInclude() {
    return {
      task: { include: { location: true } },
      offer: true,
      client: { select: { id: true, displayName: true } },
      provider: { select: { id: true, displayName: true, providerProfile: true } },
    };
  }

  private toBookingView(booking: any, user: AuthenticatedUser) {
    this.assertCanRead(user, booking);
    const canSeeExact =
      booking.clientId === user.id ||
      user.role === 'ADMIN' ||
      user.role === 'SUPER_ADMIN' ||
      booking.protectedPaymentStatus === 'PROTECTED';

    return {
      id: booking.id,
      taskId: booking.taskId,
      offerId: booking.offerId,
      clientId: booking.clientId,
      providerId: booking.providerId,
      status: booking.status,
      protectedPaymentStatus: booking.protectedPaymentStatus,
      agreedPrice: Number(booking.agreedPrice),
      totalAmount: Number(booking.totalAmount),
      platformFee: Number(booking.platformFee),
      task: {
        id: booking.task.id,
        title: booking.task.title,
        categoryName: booking.task.categoryName,
        location: booking.task.location ? this.toLocationView(booking.task.location, canSeeExact) : null,
      },
      clientName: booking.client?.displayName ?? 'Cliente Proxi',
      providerName: booking.provider?.providerProfile?.displayName ?? booking.provider?.displayName ?? 'Proveedor independiente',
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }

  private toLocationView(location: any, canSeeExact: boolean) {
    if (!canSeeExact) {
      return {
        country: location.country,
        department: location.department,
        city: location.city,
        zone: location.zone,
        exactAddressProtected: true,
      };
    }

    return {
      country: location.country,
      department: location.department,
      city: location.city,
      zone: location.zone,
      addressLine1: location.addressLine1,
      addressLine2: location.addressLine2,
      latitude: location.latitude,
      longitude: location.longitude,
      exactAddressProtected: false,
    };
  }
}
