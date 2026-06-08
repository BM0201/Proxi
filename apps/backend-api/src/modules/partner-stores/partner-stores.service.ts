/**
 * Servicio del módulo partner-stores: tiendas/ferreterías sugeridas.
 *
 * Las tiendas son lugares donde el Cliente puede comprar los materiales de su
 * Lista Proxi. Algunas pueden ser patrocinadas (isSponsored). El cálculo de
 * cercanía usa una distancia aproximada (Haversine) sobre coordenadas mock.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePartnerStoreDto } from './dto/create-partner-store.dto';
import { UpdatePartnerStoreDto } from './dto/update-partner-store.dto';

@Injectable()
export class PartnerStoresService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crea una tienda sugerida (uso administrativo). */
  async create(dto: CreatePartnerStoreDto) {
    const store = await this.prisma.partnerStore.create({
      data: {
        name: dto.name,
        type: dto.type,
        description: dto.description,
        department: dto.department,
        city: dto.city,
        zone: dto.zone,
        addressLine: dto.addressLine,
        latitude: dto.latitude != null ? dto.latitude : null,
        longitude: dto.longitude != null ? dto.longitude : null,
        phoneInternal: dto.phoneInternal,
        websiteUrl: dto.websiteUrl,
        isSponsored: dto.isSponsored ?? false,
      },
    });
    return this.toView(store);
  }

  /** Lista las tiendas activas (patrocinadas primero). */
  async findActive() {
    const stores = await this.prisma.partnerStore.findMany({
      where: { isActive: true },
      orderBy: [{ isSponsored: 'desc' }, { name: 'asc' }],
    });
    return stores.map((s) => this.toView(s));
  }

  /**
   * Lista tiendas activas ordenadas por cercanía a una coordenada dada.
   * Si no se envían coordenadas, devuelve las activas (patrocinadas primero).
   */
  async findNearby(lat?: number, lng?: number, radiusKm = 25) {
    const stores = await this.prisma.partnerStore.findMany({
      where: { isActive: true },
    });

    if (lat == null || lng == null) {
      return stores
        .sort((a, b) => Number(b.isSponsored) - Number(a.isSponsored))
        .map((s) => this.toView(s));
    }

    const withDistance = stores
      .map((s) => {
        const sLat = s.latitude != null ? Number(s.latitude) : null;
        const sLng = s.longitude != null ? Number(s.longitude) : null;
        const distanceKm =
          sLat != null && sLng != null ? haversineKm(lat, lng, sLat, sLng) : null;
        return { store: s, distanceKm };
      })
      .filter((x) => x.distanceKm == null || x.distanceKm <= radiusKm)
      .sort((a, b) => {
        // Patrocinadas primero, luego por distancia ascendente.
        if (a.store.isSponsored !== b.store.isSponsored) {
          return Number(b.store.isSponsored) - Number(a.store.isSponsored);
        }
        const da = a.distanceKm ?? Number.MAX_SAFE_INTEGER;
        const db = b.distanceKm ?? Number.MAX_SAFE_INTEGER;
        return da - db;
      });

    return withDistance.map((x) => ({
      ...this.toView(x.store),
      distanceKm: x.distanceKm != null ? Math.round(x.distanceKm * 10) / 10 : undefined,
    }));
  }

  /** Actualiza una tienda sugerida (uso administrativo). */
  async update(id: string, dto: UpdatePartnerStoreDto) {
    const existing = await this.prisma.partnerStore.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Tienda no encontrada');

    const store = await this.prisma.partnerStore.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        type: dto.type ?? undefined,
        description: dto.description ?? undefined,
        department: dto.department ?? undefined,
        city: dto.city ?? undefined,
        zone: dto.zone ?? undefined,
        addressLine: dto.addressLine ?? undefined,
        latitude: dto.latitude != null ? dto.latitude : undefined,
        longitude: dto.longitude != null ? dto.longitude : undefined,
        phoneInternal: dto.phoneInternal ?? undefined,
        websiteUrl: dto.websiteUrl ?? undefined,
        isSponsored: dto.isSponsored ?? undefined,
        isActive: dto.isActive ?? undefined,
      },
    });
    return this.toView(store);
  }

  private toView(store: any) {
    return {
      id: store.id,
      name: store.name,
      type: store.type,
      description: store.description ?? undefined,
      country: store.country,
      department: store.department ?? undefined,
      city: store.city ?? undefined,
      zone: store.zone ?? undefined,
      addressLine: store.addressLine ?? undefined,
      latitude: store.latitude === null ? undefined : Number(store.latitude),
      longitude: store.longitude === null ? undefined : Number(store.longitude),
      phoneInternal: store.phoneInternal ?? undefined,
      websiteUrl: store.websiteUrl ?? undefined,
      isSponsored: store.isSponsored,
      isActive: store.isActive,
      createdAt: store.createdAt.toISOString(),
      updatedAt: store.updatedAt.toISOString(),
    };
  }
}

/** Distancia aproximada en kilómetros entre dos coordenadas (Haversine). */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
