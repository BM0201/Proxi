/**
 * Controlador del módulo packages: paquetes/proyectos y bloques de servicio.
 */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreatePackageProjectDto } from './dto/create-package-project.dto';
import { CreateServiceBlockDto } from './dto/create-service-block.dto';
import { PackagesService } from './packages.service';

@ApiTags('packages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  /** Crea un paquete/proyecto a partir de una Tarea. */
  @Post()
  @Roles('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  createPackage(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreatePackageProjectDto) {
    return this.packagesService.createPackage(user, dto);
  }

  /** Detalle de un paquete/proyecto. */
  @Get(':id')
  @Roles('CLIENT', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  getPackage(@Param('id') id: string) {
    return this.packagesService.getPackage(id);
  }

  /** Agrega un bloque de servicio acordado a un paquete/proyecto. */
  @Post(':id/blocks')
  @Roles('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  addBlock(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateServiceBlockDto,
  ) {
    return this.packagesService.addServiceBlock(user, id, dto);
  }
}
