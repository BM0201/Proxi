/**
 * Servicio del módulo packages: paquetes/proyectos y bloques de servicio acordados.
 *
 * Un paquete/proyecto (PackageProject) agrupa varios bloques de servicio
 * acordados (ServiceBlock) a lo largo de varios días. Es la base del tipo de
 * Tarea PACKAGE_PROJECT. El check-in/check-out se implementa de forma básica
 * aquí y se completará en el Sprint 3.
 */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreatePackageProjectDto } from './dto/create-package-project.dto';
import { CreateServiceBlockDto } from './dto/create-service-block.dto';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crea un paquete/proyecto para una Tarea del Cliente autenticado. */
  async createPackage(user: AuthenticatedUser, dto: CreatePackageProjectDto) {
    const task = await this.prisma.task.findUnique({ where: { id: dto.taskId } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    if (user.role === 'CLIENT' && task.clientId !== user.id) {
      throw new ForbiddenException('No autorizado para esta Tarea');
    }

    const existing = await this.prisma.packageProject.findUnique({
      where: { taskId: dto.taskId },
    });
    if (existing) {
      throw new BadRequestException('Esta Tarea ya tiene un paquete/proyecto');
    }

    const client = await this.prisma.clientProfile.findUnique({
      where: { userId: task.clientId },
      select: { id: true },
    });
    if (!client) throw new NotFoundException('Perfil de Cliente no encontrado');

    const pkg = await this.prisma.packageProject.create({
      data: {
        taskId: dto.taskId,
        clientId: client.id,
        title: dto.title,
        description: dto.description,
        totalDays: dto.totalDays,
        estimatedStartDate: dto.estimatedStartDate ? new Date(dto.estimatedStartDate) : null,
        estimatedEndDate: dto.estimatedEndDate ? new Date(dto.estimatedEndDate) : null,
        totalPrice: dto.totalPrice != null ? dto.totalPrice : null,
        status: 'DRAFT',
      },
      include: { serviceBlocks: { orderBy: { date: 'asc' } } },
    });

    // Marca la Tarea como proyecto por paquete.
    await this.prisma.task.update({
      where: { id: dto.taskId },
      data: { taskType: 'PACKAGE_PROJECT' },
    });

    return this.toView(pkg);
  }

  /** Devuelve el detalle de un paquete/proyecto. */
  async getPackage(id: string) {
    const pkg = await this.prisma.packageProject.findUnique({
      where: { id },
      include: { serviceBlocks: { orderBy: { date: 'asc' } } },
    });
    if (!pkg) throw new NotFoundException('Paquete/proyecto no encontrado');
    return this.toView(pkg);
  }

  /** Agrega un bloque de servicio acordado a un paquete/proyecto. */
  async addServiceBlock(user: AuthenticatedUser, id: string, dto: CreateServiceBlockDto) {
    const pkg = await this.prisma.packageProject.findUnique({
      where: { id },
      include: { task: { select: { clientId: true } } },
    });
    if (!pkg) throw new NotFoundException('Paquete/proyecto no encontrado');
    if (user.role === 'CLIENT' && pkg.task.clientId !== user.id) {
      throw new ForbiddenException('No autorizado para este paquete/proyecto');
    }

    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
    }

    await this.prisma.serviceBlock.create({
      data: {
        packageProjectId: id,
        date: new Date(dto.date),
        startTime: dto.startTime,
        endTime: dto.endTime,
        notes: dto.notes,
        status: 'SCHEDULED',
      },
    });

    return this.getPackage(id);
  }

  private toView(pkg: any) {
    return {
      id: pkg.id,
      taskId: pkg.taskId,
      clientId: pkg.clientId,
      providerId: pkg.providerId ?? undefined,
      title: pkg.title,
      description: pkg.description,
      totalDays: pkg.totalDays,
      estimatedStartDate: pkg.estimatedStartDate ? pkg.estimatedStartDate.toISOString() : undefined,
      estimatedEndDate: pkg.estimatedEndDate ? pkg.estimatedEndDate.toISOString() : undefined,
      totalPrice: pkg.totalPrice === null ? undefined : Number(pkg.totalPrice),
      status: pkg.status,
      serviceBlocks: (pkg.serviceBlocks ?? []).map((b: any) => ({
        id: b.id,
        packageProjectId: b.packageProjectId,
        bookingId: b.bookingId ?? undefined,
        date: b.date.toISOString(),
        startTime: b.startTime,
        endTime: b.endTime,
        checkInAt: b.checkInAt ? b.checkInAt.toISOString() : undefined,
        checkOutAt: b.checkOutAt ? b.checkOutAt.toISOString() : undefined,
        status: b.status,
        providerPresenceStatus: b.providerPresenceStatus,
        clientConfirmationStatus: b.clientConfirmationStatus,
        notes: b.notes ?? undefined,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
      })),
      createdAt: pkg.createdAt.toISOString(),
      updatedAt: pkg.updatedAt.toISOString(),
    };
  }
}
