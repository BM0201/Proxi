/**
 * Controlador del módulo quick-tasks: Tareas rápidas.
 */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateQuickTaskDto } from './quick-tasks.dto';
import { QuickTasksService } from './quick-tasks.service';

@ApiTags('quick-tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quick-tasks')
export class QuickTasksController {
  constructor(private readonly quickTasksService: QuickTasksService) {}

  /** Crea una Tarea rápida (solo Clientes). */
  @Post()
  @Roles('CLIENT')
  createQuickTask(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateQuickTaskDto) {
    return this.quickTasksService.createQuickTask(user, dto);
  }

  /** Lista las Tareas rápidas disponibles y elegibles para el Proveedor. */
  @Get('available')
  @Roles('PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  getAvailableQuickTasks(@CurrentUser() user: AuthenticatedUser) {
    return this.quickTasksService.getAvailableQuickTasks(user);
  }

  /** Detalle de una Tarea rápida. */
  @Get(':id')
  @Roles('CLIENT', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  getQuickTask(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.quickTasksService.getQuickTask(user, id);
  }
}
