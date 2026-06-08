/**
 * Servicio del módulo materials: Lista Proxi de materiales.
 *
 * REGLA OFICIAL DE PROXI: el Proveedor independiente NO compra materiales por
 * defecto. El Cliente compra los materiales. El Proveedor puede crear una
 * "Lista Proxi" (PurchaseList) con los materiales que el Cliente debe comprar
 * antes del servicio, indicando cantidades, especificaciones y precios estimados.
 */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreatePurchaseListDto } from './dto/create-purchase-list.dto';
import { CreatePurchaseListItemDto } from './dto/create-purchase-list-item.dto';
import { UpdateMaterialStatusDto } from './dto/update-material-status.dto';

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crea una Lista Proxi para una Tarea (acción del Proveedor). */
  async createPurchaseList(user: AuthenticatedUser, dto: CreatePurchaseListDto) {
    const task = await this.prisma.task.findUnique({ where: { id: dto.taskId } });
    if (!task) throw new NotFoundException('Tarea no encontrada');

    const existing = await this.prisma.purchaseList.findUnique({
      where: { taskId: dto.taskId },
    });
    if (existing) {
      throw new BadRequestException('Esta Tarea ya tiene una Lista Proxi');
    }

    let providerId: string | undefined;
    if (user.role === 'PROVIDER') {
      const provider = await this.prisma.providerProfile.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      providerId = provider?.id;
    }

    const list = await this.prisma.purchaseList.create({
      data: {
        taskId: dto.taskId,
        providerId,
        notes: dto.notes,
        status: 'PURCHASE_LIST_PENDING_PROVIDER',
      },
      include: this.listInclude(),
    });

    await this.prisma.task.update({
      where: { id: dto.taskId },
      data: { materialStatus: 'PURCHASE_LIST_PENDING_PROVIDER' },
    });

    return this.toListView(list);
  }

  /** Devuelve la Lista Proxi de una Tarea. */
  async getPurchaseListByTask(taskId: string) {
    const list = await this.prisma.purchaseList.findUnique({
      where: { taskId },
      include: this.listInclude(),
    });
    if (!list) throw new NotFoundException('Esta Tarea no tiene una Lista Proxi');
    return this.toListView(list);
  }

  /** Agrega un ítem a la Lista Proxi (acción del Proveedor). */
  async addItem(user: AuthenticatedUser, listId: string, dto: CreatePurchaseListItemDto) {
    await this.requireOwnedList(user, listId);

    if (
      dto.estimatedPriceMin != null &&
      dto.estimatedPriceMax != null &&
      dto.estimatedPriceMin > dto.estimatedPriceMax
    ) {
      throw new BadRequestException('El precio mínimo no puede ser mayor al máximo');
    }

    await this.prisma.purchaseListItem.create({
      data: {
        purchaseListId: listId,
        name: dto.name,
        quantity: dto.quantity,
        unit: dto.unit,
        specification: dto.specification,
        priority: dto.priority ?? 'REQUIRED',
        estimatedPriceMin:
          dto.estimatedPriceMin != null ? dto.estimatedPriceMin : null,
        estimatedPriceMax:
          dto.estimatedPriceMax != null ? dto.estimatedPriceMax : null,
        notes: dto.notes,
      },
    });

    return this.reloadList(listId);
  }

  /** Actualiza un ítem de la Lista Proxi (acción del Proveedor). */
  async updateItem(
    user: AuthenticatedUser,
    listId: string,
    itemId: string,
    dto: CreatePurchaseListItemDto,
  ) {
    await this.requireOwnedList(user, listId);
    const item = await this.prisma.purchaseListItem.findUnique({ where: { id: itemId } });
    if (!item || item.purchaseListId !== listId) {
      throw new NotFoundException('Ítem no encontrado en esta Lista Proxi');
    }

    await this.prisma.purchaseListItem.update({
      where: { id: itemId },
      data: {
        name: dto.name ?? undefined,
        quantity: dto.quantity != null ? dto.quantity : undefined,
        unit: dto.unit ?? undefined,
        specification: dto.specification ?? undefined,
        priority: dto.priority ?? undefined,
        estimatedPriceMin:
          dto.estimatedPriceMin != null ? dto.estimatedPriceMin : undefined,
        estimatedPriceMax:
          dto.estimatedPriceMax != null ? dto.estimatedPriceMax : undefined,
        notes: dto.notes ?? undefined,
      },
    });

    return this.reloadList(listId);
  }

  /** Elimina un ítem de la Lista Proxi (acción del Proveedor). */
  async deleteItem(user: AuthenticatedUser, listId: string, itemId: string) {
    await this.requireOwnedList(user, listId);
    const item = await this.prisma.purchaseListItem.findUnique({ where: { id: itemId } });
    if (!item || item.purchaseListId !== listId) {
      throw new NotFoundException('Ítem no encontrado en esta Lista Proxi');
    }
    await this.prisma.purchaseListItem.delete({ where: { id: itemId } });
    return this.reloadList(listId);
  }

  /**
   * El Cliente actualiza el estado de materiales de su Tarea (materiales listos,
   * incorrectos o faltantes). Sincroniza el estado en la Tarea y en la Lista Proxi.
   */
  async updateMaterialStatus(
    user: AuthenticatedUser,
    taskId: string,
    dto: UpdateMaterialStatusDto,
  ) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    if (user.role === 'CLIENT' && task.clientId !== user.id) {
      throw new ForbiddenException('No autorizado para esta Tarea');
    }

    await this.prisma.task.update({
      where: { id: taskId },
      data: { materialStatus: dto.status },
    });

    const list = await this.prisma.purchaseList.findUnique({ where: { taskId } });
    if (list) {
      await this.prisma.purchaseList.update({
        where: { taskId },
        data: { status: dto.status },
      });
    }

    return { taskId, materialStatus: dto.status };
  }

  /** Lista las tiendas sugeridas para una Lista Proxi. */
  async getStoreSuggestions(listId: string) {
    const list = await this.prisma.purchaseList.findUnique({
      where: { id: listId },
      include: {
        storeSuggestions: {
          include: { store: true },
          orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
        },
      },
    });
    if (!list) throw new NotFoundException('Lista Proxi no encontrada');
    return list.storeSuggestions.map((s) => this.toSuggestionView(s));
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private async requireOwnedList(user: AuthenticatedUser, listId: string) {
    const list = await this.prisma.purchaseList.findUnique({
      where: { id: listId },
      select: { id: true, providerId: true },
    });
    if (!list) throw new NotFoundException('Lista Proxi no encontrada');

    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return list;

    if (user.role === 'PROVIDER') {
      const provider = await this.prisma.providerProfile.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      if (list.providerId && provider && list.providerId === provider.id) {
        return list;
      }
    }
    throw new ForbiddenException('No autorizado para modificar esta Lista Proxi');
  }

  private async reloadList(listId: string) {
    const list = await this.prisma.purchaseList.findUnique({
      where: { id: listId },
      include: this.listInclude(),
    });
    return this.toListView(list!);
  }

  private listInclude() {
    return {
      items: { orderBy: { createdAt: 'asc' as const } },
      storeSuggestions: {
        include: { store: true },
        orderBy: [{ priority: 'desc' as const }, { createdAt: 'asc' as const }],
      },
    };
  }

  private toListView(list: any) {
    return {
      id: list.id,
      taskId: list.taskId,
      providerId: list.providerId ?? undefined,
      status: list.status,
      notes: list.notes ?? undefined,
      items: (list.items ?? []).map((item: any) => ({
        id: item.id,
        purchaseListId: item.purchaseListId,
        name: item.name,
        quantity: Number(item.quantity),
        unit: item.unit,
        specification: item.specification ?? undefined,
        priority: item.priority,
        estimatedPriceMin:
          item.estimatedPriceMin === null ? undefined : Number(item.estimatedPriceMin),
        estimatedPriceMax:
          item.estimatedPriceMax === null ? undefined : Number(item.estimatedPriceMax),
        notes: item.notes ?? undefined,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
      storeSuggestions: (list.storeSuggestions ?? []).map((s: any) => this.toSuggestionView(s)),
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
    };
  }

  private toSuggestionView(s: any) {
    return {
      id: s.id,
      storeId: s.storeId,
      store: {
        id: s.store.id,
        name: s.store.name,
        type: s.store.type,
        description: s.store.description ?? undefined,
        country: s.store.country,
        department: s.store.department ?? undefined,
        city: s.store.city ?? undefined,
        zone: s.store.zone ?? undefined,
        addressLine: s.store.addressLine ?? undefined,
        latitude: s.store.latitude === null ? undefined : Number(s.store.latitude),
        longitude: s.store.longitude === null ? undefined : Number(s.store.longitude),
        phoneInternal: s.store.phoneInternal ?? undefined,
        websiteUrl: s.store.websiteUrl ?? undefined,
        isSponsored: s.store.isSponsored,
        isActive: s.store.isActive,
        createdAt: s.store.createdAt.toISOString(),
        updatedAt: s.store.updatedAt.toISOString(),
      },
      reason: s.reason ?? undefined,
      isSponsored: s.isSponsored,
      priority: s.priority,
      createdAt: s.createdAt.toISOString(),
    };
  }
}
