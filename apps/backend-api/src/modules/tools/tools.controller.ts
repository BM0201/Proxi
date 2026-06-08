/**
 * Controlador del módulo tools: herramientas del Proveedor independiente.
 */
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateProviderToolDto } from './dto/create-provider-tool.dto';
import { UpdateProviderToolDto } from './dto/update-provider-tool.dto';
import { ToolsService } from './tools.service';

@ApiTags('tools')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  /** El Proveedor registra una herramienta. */
  @Post()
  @Roles('PROVIDER')
  createTool(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateProviderToolDto) {
    return this.toolsService.createTool(user, dto);
  }

  /** El Proveedor consulta sus propias herramientas. */
  @Get('my-tools')
  @Roles('PROVIDER')
  getMyTools(@CurrentUser() user: AuthenticatedUser) {
    return this.toolsService.getMyTools(user);
  }

  /** Consulta pública de las herramientas de un Proveedor. */
  @Get('provider/:providerId')
  @Roles('CLIENT', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  getProviderTools(@Param('providerId') providerId: string) {
    return this.toolsService.getProviderTools(providerId);
  }

  /** El Proveedor actualiza una herramienta propia. */
  @Put(':id')
  @Roles('PROVIDER')
  updateTool(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateProviderToolDto,
  ) {
    return this.toolsService.updateTool(user, id, dto);
  }

  /** El Proveedor elimina una herramienta propia. */
  @Delete(':id')
  @Roles('PROVIDER')
  deleteTool(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.toolsService.deleteTool(user, id);
  }
}
