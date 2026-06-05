import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { LocationVisibility } from '@proxi/database';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateLocationDto } from './locations.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateLocationDto) {
    const location = await this.prisma.location.create({
      data: {
        ownerUserId: user.id,
        label: dto.label,
        country: dto.country ?? 'Nicaragua',
        department: dto.department,
        city: dto.city,
        zone: dto.zone,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        latitude: dto.latitude,
        longitude: dto.longitude,
        accuracyMeters: dto.accuracyMeters,
        isExact: dto.isExact ?? false,
        visibility: dto.visibility ?? 'APPROXIMATE',
      },
    });
    return this.toPrivateView(location);
  }

  async mine(user: AuthenticatedUser) {
    const locations = await this.prisma.location.findMany({
      where: { ownerUserId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return locations.map((location) => this.toPrivateView(location));
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location) throw new NotFoundException('Ubicación no encontrada');
    const canSeeExact = this.canSeeExact(user, location.ownerUserId);
    return canSeeExact ? this.toPrivateView(location) : this.toApproximateView(location);
  }

  async update(user: AuthenticatedUser, id: string, dto: CreateLocationDto) {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location) throw new NotFoundException('Ubicación no encontrada');
    if (!this.canSeeExact(user, location.ownerUserId)) throw new ForbiddenException('No autorizado para modificar esta ubicación');
    const updated = await this.prisma.location.update({
      where: { id },
      data: dto,
    });
    return this.toPrivateView(updated);
  }

  async remove(user: AuthenticatedUser, id: string) {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location) throw new NotFoundException('Ubicación no encontrada');
    if (!this.canSeeExact(user, location.ownerUserId)) throw new ForbiddenException('No autorizado para eliminar esta ubicación');
    await this.prisma.location.delete({ where: { id } });
    return { ok: true };
  }

  private canSeeExact(user: AuthenticatedUser, ownerUserId: string | null) {
    return user.id === ownerUserId || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
  }

  private toApproximateView(location: {
    id: string;
    label: string | null;
    country: string;
    department: string;
    city: string;
    zone: string;
    visibility: LocationVisibility;
  }) {
    return {
      id: location.id,
      label: location.label,
      country: location.country,
      department: location.department,
      city: location.city,
      zone: location.zone,
      visibility: location.visibility,
      exactAddressProtected: true,
    };
  }

  private toPrivateView(location: {
    id: string;
    label: string | null;
    country: string;
    department: string;
    city: string;
    zone: string;
    addressLine1: string;
    addressLine2: string | null;
    latitude: number | null;
    longitude: number | null;
    accuracyMeters: number | null;
    isExact: boolean;
    visibility: LocationVisibility;
  }) {
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
    };
  }
}
