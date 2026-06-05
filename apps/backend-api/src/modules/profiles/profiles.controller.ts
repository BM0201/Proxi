/**
 * Controlador del módulo profiles: Perfiles de clientes y proveedores.
 * Expone endpoints de portafolio del proveedor (asociar/listar archivos).
 */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AttachMediaDto } from '../media/media.dto';
import { MediaService } from '../media/media.service';
import { ProfilesService } from './profiles.service';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly mediaService: MediaService,
  ) {}

  /** Agrega un archivo (PROVIDER_PORTFOLIO) al portafolio del proveedor autenticado. */
  @Post('provider/portfolio-media')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  attachPortfolioMedia(@CurrentUser() user: AuthenticatedUser, @Body() dto: AttachMediaDto) {
    return this.mediaService.attachPortfolioMedia(user, dto.mediaId);
  }

  /**
   * Lista el portafolio de un proveedor (por id de ProviderProfile).
   * Visible públicamente solo si el proveedor está APROBADO; dueño/admin ven todo.
   */
  @Get('provider/:id/portfolio-media')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  listPortfolioMedia(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.mediaService.listPortfolioMedia(user, id);
  }
}
