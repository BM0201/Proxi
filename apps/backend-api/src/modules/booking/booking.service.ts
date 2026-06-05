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

  /**
   * El proveedor inicia el trabajo. Requiere que el pago esté protegido
   * (Pago protegido = saldo retenido por Proxi). CONFIRMED -> IN_PROGRESS.
   */
  async start(user: AuthenticatedUser, id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Reserva no encontrada');
    if (booking.providerId !== user.id) {
      throw new ForbiddenException('Solo el proveedor asignado puede iniciar el trabajo');
    }
    if (booking.protectedPaymentStatus !== 'PROTECTED') {
      throw new BadRequestException('El trabajo solo inicia cuando el pago está protegido por Proxi');
    }
    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException('La reserva debe estar confirmada para iniciar');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.task.update({ where: { id: booking.taskId }, data: { status: 'IN_PROGRESS' } });
      return tx.booking.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
        include: this.bookingInclude(),
      });
    });
    return this.toBookingView(updated, user);
  }

  /**
   * El proveedor marca el trabajo como terminado de su lado.
   * IN_PROGRESS -> COMPLETED_BY_PROVIDER. El cliente debe confirmar luego.
   */
  async completeByProvider(user: AuthenticatedUser, id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Reserva no encontrada');
    if (booking.providerId !== user.id) {
      throw new ForbiddenException('Solo el proveedor asignado puede marcar el trabajo como terminado');
    }
    if (booking.status !== 'IN_PROGRESS') {
      throw new BadRequestException('El trabajo debe estar en progreso para marcarlo como terminado');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: 'COMPLETED_BY_PROVIDER' },
      include: this.bookingInclude(),
    });
    return this.toBookingView(updated, user);
  }

  /**
   * El cliente confirma la finalización. Esto libera el pago protegido hacia el
   * saldo aprobado del proveedor (Liquidación en sandbox vía libro mayor).
   * COMPLETED_BY_PROVIDER -> CONFIRMED_BY_CLIENT/COMPLETED + APPROVED_FOR_PAYOUT.
   *
   * SANDBOX: no se mueve dinero real; solo se registran movimientos en el
   * LedgerEntry/LedgerAccount como saldo aprobado para liquidación futura.
   * TODO: integrar pasarela de pago real y liquidación bancaria en producción.
   */
  async confirmByClient(user: AuthenticatedUser, id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Reserva no encontrada');
    if (booking.clientId !== user.id) {
      throw new ForbiddenException('Solo el cliente puede confirmar la finalización del trabajo');
    }
    if (booking.status !== 'COMPLETED_BY_PROVIDER') {
      throw new BadRequestException('El proveedor debe marcar el trabajo como terminado antes de confirmar');
    }

    const netForProvider = Number(booking.totalAmount) - Number(booking.platformFee);

    const updated = await this.prisma.$transaction(async (tx) => {
      // Marcar tarea y reserva como completadas + pago aprobado para liquidación.
      await tx.task.update({ where: { id: booking.taskId }, data: { status: 'COMPLETED' } });
      const result = await tx.booking.update({
        where: { id },
        data: { status: 'COMPLETED', protectedPaymentStatus: 'APPROVED_FOR_PAYOUT' },
        include: this.bookingInclude(),
      });

      // Asegurar cuenta de libro mayor del proveedor (Saldo aprobado).
      const account = await tx.ledgerAccount.upsert({
        where: { userId: booking.providerId },
        update: {},
        create: { userId: booking.providerId },
      });

      // Liberar el monto retenido y acreditar el saldo disponible (sandbox).
      await tx.ledgerEntry.create({
        data: {
          accountId: account.id,
          bookingId: booking.id,
          type: 'RELEASE',
          amount: booking.totalAmount,
          description: 'Liberación de pago protegido tras confirmación del cliente (sandbox)',
        },
      });
      await tx.ledgerEntry.create({
        data: {
          accountId: account.id,
          bookingId: booking.id,
          type: 'CREDIT',
          amount: netForProvider,
          description: 'Saldo aprobado para liquidación del proveedor (sandbox, neto de comisión Proxi)',
        },
      });
      await tx.ledgerAccount.update({
        where: { id: account.id },
        data: {
          availableBalance: { increment: netForProvider },
          balance: { increment: netForProvider },
        },
      });

      // Incrementar trabajos completados del proveedor.
      await tx.providerProfile.updateMany({
        where: { userId: booking.providerId },
        data: { completedJobs: { increment: 1 } },
      });

      return result;
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
