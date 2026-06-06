/**
 * Servicio del módulo quick-tasks: Tareas rápidas.
 *
 * Una Tarea rápida (QUICK_TASK) es de corta duración (máximo 1 día) y se
 * resuelve por aceptación directa (DIRECT_ACCEPT) o por subasta rápida
 * (QUICK_AUCTION). Solo los Clientes crean Tareas rápidas; los Proveedores
 * independientes elegibles las ven en su radio de cobertura.
 */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateQuickTaskDto } from './quick-tasks.dto';

/** Límite de duración de una Tarea rápida: 1 día = 1440 minutos. */
const QUICK_TASK_MAX_MINUTES = 1440;

@Injectable()
export class QuickTasksService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crea una Tarea rápida para el Cliente autenticado. */
  async createQuickTask(user: AuthenticatedUser, dto: CreateQuickTaskDto) {
    if (dto.estimatedDurationMinutes > QUICK_TASK_MAX_MINUTES) {
      throw new BadRequestException(
        'Una Tarea rápida no puede superar 1 día (1440 minutos). Usa una Tarea estándar.',
      );
    }

    if (dto.locationId) {
      const location = await this.prisma.location.findUnique({ where: { id: dto.locationId } });
      if (!location) throw new NotFoundException('Ubicación no encontrada');
      if (location.ownerUserId !== user.id) {
        throw new ForbiddenException('No autorizado para usar esta ubicación');
      }
    }

    const task = await this.prisma.task.create({
      data: {
        clientId: user.id,
        categoryId: dto.categoryId,
        categoryName: dto.categoryName,
        locationId: dto.locationId,
        title: dto.title,
        description: dto.description,
        status: 'RECEIVING_OFFERS',
        taskType: 'QUICK_TASK',
        quickTaskMode: dto.quickTaskMode,
        estimatedDurationMinutes: dto.estimatedDurationMinutes,
        radiusKm: dto.radiusKm,
        minProviderRating: dto.minProviderRating,
        minProviderTrustScore: dto.minProviderTrustScore,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        budget: dto.budgetMax ?? dto.budgetMin,
        pricingType: dto.pricingType ?? 'FIXED',
      },
      include: this.quickTaskInclude(),
    });

    return this.toQuickTaskView(task);
  }

  /**
   * Lista las Tareas rápidas disponibles para un Proveedor independiente,
   * aplicando los filtros de elegibilidad (rating y trustScore mínimos).
   */
  async getAvailableQuickTasks(user: AuthenticatedUser) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId: user.id },
      select: { ratingAverage: true, trustScore: true, trustStatus: true },
    });

    const tasks = await this.prisma.task.findMany({
      where: {
        taskType: 'QUICK_TASK',
        status: { in: ['PUBLISHED', 'RECEIVING_OFFERS'] },
      },
      include: this.quickTaskInclude(),
      orderBy: { createdAt: 'desc' },
    });

    const eligible = tasks.filter((task) => {
      const eligibility = this.checkEligibility(task, provider);
      return eligibility.eligible;
    });

    return eligible.map((task) => this.toQuickTaskView(task));
  }

  /** Devuelve el detalle de una Tarea rápida e indica si el Proveedor es elegible. */
  async getQuickTask(user: AuthenticatedUser, id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: this.quickTaskInclude(),
    });
    if (!task || task.taskType !== 'QUICK_TASK') {
      throw new NotFoundException('Tarea rápida no encontrada');
    }

    let eligibility: { eligible: boolean; reasons: string[] } | undefined;
    if (user.role === 'PROVIDER') {
      const provider = await this.prisma.providerProfile.findUnique({
        where: { userId: user.id },
        select: { ratingAverage: true, trustScore: true, trustStatus: true },
      });
      eligibility = this.checkEligibility(task, provider);
    }

    return { ...this.toQuickTaskView(task), eligibility };
  }

  /**
   * Valida si un Proveedor cumple los requisitos de elegibilidad de la Tarea.
   * Reglas: estado de confianza operativo + rating y trustScore mínimos.
   */
  private checkEligibility(
    task: { minProviderRating: unknown; minProviderTrustScore: number | null },
    provider: { ratingAverage: number | null; trustScore: number; trustStatus: string } | null,
  ): { eligible: boolean; reasons: string[] } {
    const reasons: string[] = [];
    if (!provider) {
      return { eligible: false, reasons: ['No tienes un perfil de Proveedor independiente'] };
    }
    if (['SUSPENDED', 'BANNED', 'RESTRICTED'].includes(provider.trustStatus)) {
      reasons.push('Tu estado de confianza no permite tomar Tareas rápidas');
    }
    const minRating = task.minProviderRating != null ? Number(task.minProviderRating) : null;
    if (minRating != null && (provider.ratingAverage ?? 0) < minRating) {
      reasons.push(`Se requiere una valoración mínima de ${minRating.toFixed(1)} estrellas`);
    }
    if (
      task.minProviderTrustScore != null &&
      provider.trustScore < task.minProviderTrustScore
    ) {
      reasons.push(`Se requiere un puntaje de confianza mínimo de ${task.minProviderTrustScore}`);
    }
    return { eligible: reasons.length === 0, reasons };
  }

  private quickTaskInclude() {
    return {
      location: true,
      client: { select: { id: true, displayName: true } },
      _count: { select: { offers: true } },
    };
  }

  private toQuickTaskView(task: any) {
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
      quickTaskMode: task.quickTaskMode,
      estimatedDurationMinutes: task.estimatedDurationMinutes,
      radiusKm: task.radiusKm === null ? null : Number(task.radiusKm),
      minProviderRating: task.minProviderRating === null ? null : Number(task.minProviderRating),
      minProviderTrustScore: task.minProviderTrustScore,
      budgetMin: task.budgetMin === null ? null : Number(task.budgetMin),
      budgetMax: task.budgetMax === null ? null : Number(task.budgetMax),
      pricingType: task.pricingType,
      offerCount: task._count?.offers ?? 0,
      location: task.location
        ? {
            id: task.location.id,
            label: task.location.label,
            department: task.location.department,
            city: task.location.city,
            zone: task.location.zone,
          }
        : null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
