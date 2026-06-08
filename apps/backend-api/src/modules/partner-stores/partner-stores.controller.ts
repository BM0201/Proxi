/**
 * Controlador del módulo partner-stores: tiendas/ferreterías sugeridas.
 */
import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import { CreatePartnerStoreDto } from './dto/create-partner-store.dto';
import { UpdatePartnerStoreDto } from './dto/update-partner-store.dto';
import { PartnerStoresService } from './partner-stores.service';

@ApiTags('partner-stores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('partner-stores')
export class PartnerStoresController {
  constructor(private readonly partnerStoresService: PartnerStoresService) {}

  /** El administrador registra una tienda sugerida. */
  @Post()
  @Roles('ADMIN', 'SUPER_ADMIN')
  create(@Body() dto: CreatePartnerStoreDto) {
    return this.partnerStoresService.create(dto);
  }

  /** Lista las tiendas activas. */
  @Get()
  @Roles('CLIENT', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  findActive() {
    return this.partnerStoresService.findActive();
  }

  /** Lista las tiendas cercanas a una ubicación (coordenadas opcionales). */
  @Get('nearby')
  @Roles('CLIENT', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  findNearby(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radiusKm') radiusKm?: string,
  ) {
    return this.partnerStoresService.findNearby(
      lat != null ? Number(lat) : undefined,
      lng != null ? Number(lng) : undefined,
      radiusKm != null ? Number(radiusKm) : undefined,
    );
  }

  /** El administrador actualiza una tienda sugerida. */
  @Put(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdatePartnerStoreDto) {
    return this.partnerStoresService.update(id, dto);
  }
}
