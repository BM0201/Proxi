import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { detectExternalContact } from '../../common/moderation/detect-external-contact';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateOfferDto, CreateTaskDto, UpdateTaskDto } from './marketplace.dto';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  /** Límite de duración de una Tarea estándar: 1 día = 1440 minutos. */
  private static readonly STANDARD_TASK_MAX_MINUTES = 1440;

  async createTask(user: AuthenticatedUser, dto: CreateTaskDto) {
    if (dto.locationId) await this.assertLocationOwner(user.id, dto.locationId);

    // Los proyectos por paquete (varios días) llegarán en el Sprint 2.
    if (dto.taskType === 'PACKAGE_PROJECT') {
      throw new BadRequestException(
        'Los proyectos por paquete estarán disponibles próximamente. Por ahora crea una Tarea estándar o rápida.',
      );
    }

    // Una Tarea estándar no puede superar 1 día. Si la duración estimada lo
    // supera, se debe usar un proyecto por paquete (Próximamente).
    if (
      dto.estimatedDurationMinutes != null &&
      dto.estimatedDurationMinutes > MarketplaceService.STANDARD_TASK_MAX_MINUTES
    ) {
      throw new BadRequestException(
        'La duración estimada supera 1 día. Este trabajo corresponde a un proyecto por paquete (Próximamente).',
      );
    }

    const taskType = dto.taskType ?? 'STANDARD_TASK';

    const task = await this.prisma.task.create({
      data: {
        clientId: user.id,
        categoryId: dto.categoryId,
        categoryName: dto.categoryName,
        locationId: dto.locationId,
        title: dto.title,
        description: dto.description,
        status: 'RECEIVING_OFFERS',
        taskType,
        estimatedDurationMinutes: dto.estimatedDurationMinutes,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        budget: dto.budgetMax ?? dto.budgetMin,
        pricingType: dto.pricingType ?? 'OPEN_TO_OFFERS',
        city: undefined,
      },
      include: this.taskInclude(),
    });

    return this.toTaskView(task, user);
  }

  async myTasks(user: AuthenticatedUser) {
    const tasks = await this.prisma.task.findMany({
      where: { clientId: user.id },
      include: this.taskInclude(),
      orderBy: { createdAt: 'desc' },
    });
    return tasks.map((task) => this.toTaskView(task, user));
  }

  async availableTasks(user: AuthenticatedUser) {
    const tasks = await this.prisma.task.findMany({
      where: { status: { in: ['PUBLISHED', 'RECEIVING_OFFERS'] } },
      include: this.taskInclude(),
      orderBy: { createdAt: 'desc' },
    });
    return tasks.map((task) => this.toTaskView(task, user, false));
  }

  async findTask(user: AuthenticatedUser, id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: this.taskInclude(),
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    const canRead =
      task.clientId === user.id ||
      user.role === 'ADMIN' ||
      user.role === 'SUPER_ADMIN' ||
      (user.role === 'PROVIDER' && ['PUBLISHED', 'RECEIVING_OFFERS', 'OFFER_ACCEPTED', 'PROTECTED_PAYMENT_CONFIRMED'].includes(task.status));
    if (!canRead) throw new ForbiddenException('No autorizado para ver esta tarea');
    return this.toTaskView(task, user, await this.canSeeExactTaskLocation(user, task.id, task.clientId));
  }

  async updateTask(user: AuthenticatedUser, id: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    if (task.clientId !== user.id) throw new ForbiddenException('No autorizado para modificar esta tarea');
    if (dto.locationId) await this.assertLocationOwner(user.id, dto.locationId);

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        categoryName: dto.categoryName,
        locationId: dto.locationId,
        title: dto.title,
        description: dto.description,
        status: dto.status,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        budget: dto.budgetMax ?? dto.budgetMin,
      },
      include: this.taskInclude(),
    });

    return this.toTaskView(updated, user);
  }

  async removeTask(user: AuthenticatedUser, id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    if (task.clientId !== user.id) throw new ForbiddenException('No autorizado para eliminar esta tarea');
    await this.prisma.task.delete({ where: { id } });
    return { ok: true };
  }

  async createOffer(user: AuthenticatedUser, dto: CreateOfferDto) {
    const task = await this.prisma.task.findUnique({ where: { id: dto.taskId } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    if (task.clientId === user.id) throw new BadRequestException('No podés ofertar en tu propia tarea');
    if (!['PUBLISHED', 'RECEIVING_OFFERS'].includes(task.status)) {
      throw new BadRequestException('Esta tarea ya no recibe ofertas');
    }

    const message = [dto.message, dto.conditions].filter(Boolean).join('\n\nCondiciones: ');
    // Anti-fuga: detectamos posibles intentos de contacto externo en el mensaje de la oferta.
    const leak = detectExternalContact(message);
    const contactWarning = leak.detected;

    const offer = await this.prisma.offer.create({
      data: {
        taskId: dto.taskId,
        providerId: user.id,
        price: dto.amount,
        amount: dto.amount,
        estimatedDuration: dto.estimatedDuration,
        message,
        includesMaterials: dto.includesMaterials,
        requiresTechnicalVisit: dto.requiresTechnicalVisit,
        contactWarning,
        status: 'SENT',
      },
      include: this.offerInclude(),
    });

    await this.prisma.task.update({
      where: { id: task.id },
      data: { status: 'RECEIVING_OFFERS' },
    });

    // Si se detectó posible contacto externo, generamos un flag de moderación (estado OPEN).
    // Nota: ModerationFlag.reporterId es un FK obligatorio a User. Como Proxi no tiene un
    // "usuario sistema", usamos al autor del mensaje (el proveedor) como reporterId; el motivo
    // documenta que la detección es automática. El equipo de moderación revisa estos flags.
    if (leak.detected) {
      await this.prisma.moderationFlag.create({
        data: {
          entityType: 'OFFER',
          entityId: offer.id,
          reporterId: user.id,
          reason: `Detección automática anti-fuga: ${leak.reasons.join('; ')}`,
          status: 'OPEN',
        },
      });
    }

    return this.toOfferView(offer, user);
  }

  async myOffers(user: AuthenticatedUser) {
    const offers = await this.prisma.offer.findMany({
      where: { providerId: user.id },
      include: this.offerInclude(),
      orderBy: { createdAt: 'desc' },
    });
    return offers.map((offer) => this.toOfferView(offer, user));
  }

  async taskOffers(user: AuthenticatedUser, taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    if (task.clientId !== user.id && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Solo el cliente dueño puede ver ofertas de esta tarea');
    }

    const offers = await this.prisma.offer.findMany({
      where: { taskId },
      include: this.offerInclude(),
      orderBy: { createdAt: 'desc' },
    });
    return offers.map((offer) => this.toOfferView(offer, user));
  }

  async findOffer(user: AuthenticatedUser, id: string) {
    const offer = await this.prisma.offer.findUnique({ where: { id }, include: this.offerInclude() });
    if (!offer) throw new NotFoundException('Oferta no encontrada');
    if (
      offer.providerId !== user.id &&
      offer.task.clientId !== user.id &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    ) {
      throw new ForbiddenException('No autorizado para ver esta oferta');
    }
    return this.toOfferView(offer, user);
  }

  async acceptOffer(user: AuthenticatedUser, id: string) {
    const offer = await this.prisma.offer.findUnique({ where: { id }, include: { task: true } });
    if (!offer) throw new NotFoundException('Oferta no encontrada');
    if (offer.task.clientId !== user.id) throw new ForbiddenException('Solo el cliente dueño puede aceptar esta oferta');
    if (!['SENT', 'VIEWED', 'PENDING'].includes(offer.status)) throw new BadRequestException('Esta oferta no se puede aceptar');

    const booking = await this.prisma.$transaction(async (tx) => {
      await tx.offer.update({
        where: { id },
        data: { status: 'ACCEPTED' },
      });
      await tx.offer.updateMany({
        where: { taskId: offer.taskId, id: { not: id }, status: { in: ['SENT', 'VIEWED', 'PENDING'] } },
        data: { status: 'REJECTED' },
      });
      await tx.task.update({
        where: { id: offer.taskId },
        data: { status: 'OFFER_ACCEPTED' },
      });

      const existing = await tx.booking.findUnique({ where: { offerId: id } });
      if (existing) return existing;

      const platformFee = Number(offer.amount) * 0.08;
      return tx.booking.create({
        data: {
          taskId: offer.taskId,
          offerId: id,
          clientId: user.id,
          providerId: offer.providerId,
          status: 'CONFIRMED',
          protectedPaymentStatus: 'NOT_STARTED',
          agreedPrice: offer.amount,
          totalAmount: offer.amount,
          platformFee,
        },
      });
    });

    return { bookingId: booking.id, status: booking.status, protectedPaymentStatus: booking.protectedPaymentStatus };
  }

  async rejectOffer(user: AuthenticatedUser, id: string) {
    const offer = await this.prisma.offer.findUnique({ where: { id }, include: { task: true } });
    if (!offer) throw new NotFoundException('Oferta no encontrada');
    if (offer.task.clientId !== user.id) throw new ForbiddenException('Solo el cliente dueño puede rechazar esta oferta');
    const updated = await this.prisma.offer.update({
      where: { id },
      data: { status: 'REJECTED' },
      include: this.offerInclude(),
    });
    return this.toOfferView(updated, user);
  }

  private async assertLocationOwner(userId: string, locationId: string) {
    const location = await this.prisma.location.findUnique({ where: { id: locationId } });
    if (!location) throw new NotFoundException('Ubicación no encontrada');
    if (location.ownerUserId !== userId) throw new ForbiddenException('No autorizado para usar esta ubicación');
  }

  private async canSeeExactTaskLocation(user: AuthenticatedUser, taskId: string, clientId: string) {
    if (user.id === clientId || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return true;
    if (user.role !== 'PROVIDER') return false;
    const booking = await this.prisma.booking.findFirst({
      where: {
        taskId,
        providerId: user.id,
        protectedPaymentStatus: 'PROTECTED',
      },
      select: { id: true },
    });
    return Boolean(booking);
  }

  private taskInclude() {
    return {
      location: true,
      client: { select: { id: true, displayName: true } },
      _count: { select: { offers: true } },
    };
  }

  private offerInclude() {
    return {
      task: {
        include: {
          location: true,
          client: { select: { id: true, displayName: true } },
        },
      },
      provider: {
        select: {
          id: true,
          displayName: true,
          providerProfile: {
            select: {
              displayName: true,
              level: true,
              ratingAverage: true,
              ratingCount: true,
              completedJobs: true,
              verificationStatus: true,
            },
          },
        },
      },
    };
  }

  private toTaskView(task: any, user: AuthenticatedUser, canSeeExact = true) {
    return {
      id: task.id,
      clientId: task.clientId,
      clientName: task.client?.displayName ?? 'Cliente Proxi',
      categoryId: task.categoryId,
      categoryName: task.categoryName,
      title: task.title,
      description: task.description,
      status: task.status,
      taskType: task.taskType,
      estimatedDurationMinutes: task.estimatedDurationMinutes ?? null,
      budgetMin: task.budgetMin === null ? null : Number(task.budgetMin),
      budgetMax: task.budgetMax === null ? null : Number(task.budgetMax),
      pricingType: task.pricingType,
      offerCount: task._count?.offers ?? 0,
      location: task.location ? this.toLocationView(task.location, canSeeExact) : null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      viewerRole: user.role,
    };
  }

  private toOfferView(offer: any, user: AuthenticatedUser) {
    const providerProfile = offer.provider?.providerProfile;
    return {
      id: offer.id,
      taskId: offer.taskId,
      providerId: offer.providerId,
      provider: {
        id: offer.providerId,
        displayName: providerProfile?.displayName ?? offer.provider?.displayName ?? 'Proveedor independiente',
        level: providerProfile?.level ?? 'LEVEL_0_NEW',
        ratingAverage: providerProfile?.ratingAverage ?? 0,
        ratingCount: providerProfile?.ratingCount ?? 0,
        completedJobs: providerProfile?.completedJobs ?? 0,
        verificationStatus: providerProfile?.verificationStatus ?? 'NOT_STARTED',
      },
      amount: Number(offer.amount),
      estimatedDuration: offer.estimatedDuration,
      message: offer.message,
      includesMaterials: offer.includesMaterials,
      requiresTechnicalVisit: offer.requiresTechnicalVisit,
      contactWarning: offer.contactWarning,
      status: offer.status,
      task: offer.task ? this.toTaskView(offer.task, user, offer.task.clientId === user.id) : undefined,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
    };
  }

  private toLocationView(location: any, canSeeExact: boolean) {
    if (!canSeeExact) {
      return {
        id: location.id,
        country: location.country,
        department: location.department,
        city: location.city,
        zone: location.zone,
        exactAddressProtected: true,
      };
    }

    return {
      id: location.id,
      label: location.label,
      country: location.country,
      department: location.department,
      city: location.city,
      zone: location.zone,
      addressLine1: location.addressLine1,
      addressLine2: location.addressLine2,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracyMeters: location.accuracyMeters,
      isExact: location.isExact,
      visibility: location.visibility,
      exactAddressProtected: false,
    };
  }
}
