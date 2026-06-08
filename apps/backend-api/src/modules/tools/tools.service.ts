/**
 * Servicio del módulo tools: gestión de herramientas del Proveedor independiente.
 *
 * Las herramientas son del Proveedor (taladro, escalera, llaves, etc.) y NO son
 * lo mismo que los materiales. El Cliente compra los materiales; el Proveedor
 * aporta sus herramientas según el tipo de Tarea.
 */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateProviderToolDto } from './dto/create-provider-tool.dto';
import { UpdateProviderToolDto } from './dto/update-provider-tool.dto';

@Injectable()
export class ToolsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Resuelve el perfil de Proveedor del usuario autenticado. */
  private async requireProviderProfile(user: AuthenticatedUser) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (!provider) {
      throw new ForbiddenException('No tienes un perfil de Proveedor independiente');
    }
    return provider;
  }

  /** Crea una herramienta para el Proveedor autenticado. */
  async createTool(user: AuthenticatedUser, dto: CreateProviderToolDto) {
    const provider = await this.requireProviderProfile(user);
    const tool = await this.prisma.providerTool.create({
      data: {
        providerId: provider.id,
        name: dto.name,
        category: dto.category,
        description: dto.description,
      },
    });
    return this.toToolView(tool);
  }

  /** Lista las herramientas del Proveedor autenticado. */
  async getMyTools(user: AuthenticatedUser) {
    const provider = await this.requireProviderProfile(user);
    const tools = await this.prisma.providerTool.findMany({
      where: { providerId: provider.id },
      orderBy: { createdAt: 'desc' },
    });
    return tools.map((tool) => this.toToolView(tool));
  }

  /** Lista las herramientas declaradas por un Proveedor (vista pública). */
  async getProviderTools(providerId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerId },
      select: { id: true },
    });
    if (!provider) throw new NotFoundException('Proveedor no encontrado');

    const tools = await this.prisma.providerTool.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
    });
    return tools.map((tool) => this.toToolView(tool));
  }

  /** Actualiza una herramienta propia del Proveedor autenticado. */
  async updateTool(user: AuthenticatedUser, id: string, dto: UpdateProviderToolDto) {
    const provider = await this.requireProviderProfile(user);
    const existing = await this.prisma.providerTool.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Herramienta no encontrada');
    if (existing.providerId !== provider.id) {
      throw new ForbiddenException('No autorizado para modificar esta herramienta');
    }

    const tool = await this.prisma.providerTool.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        category: dto.category ?? undefined,
        description: dto.description ?? undefined,
      },
    });
    return this.toToolView(tool);
  }

  /** Elimina una herramienta propia del Proveedor autenticado. */
  async deleteTool(user: AuthenticatedUser, id: string) {
    const provider = await this.requireProviderProfile(user);
    const existing = await this.prisma.providerTool.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Herramienta no encontrada');
    if (existing.providerId !== provider.id) {
      throw new ForbiddenException('No autorizado para eliminar esta herramienta');
    }
    await this.prisma.providerTool.delete({ where: { id } });
    return { success: true };
  }

  private toToolView(tool: {
    id: string;
    providerId: string;
    name: string;
    category: string | null;
    description: string | null;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: tool.id,
      providerId: tool.providerId,
      name: tool.name,
      category: tool.category ?? undefined,
      description: tool.description ?? undefined,
      isVerified: tool.isVerified,
      createdAt: tool.createdAt.toISOString(),
      updatedAt: tool.updatedAt.toISOString(),
    };
  }
}
