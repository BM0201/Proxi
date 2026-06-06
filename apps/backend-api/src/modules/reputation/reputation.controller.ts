/**
 * Controlador del módulo reputation: Reseñas y reputación.
 */
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { UserRole } from '@proxi/contracts';
import { CreateReputationEventDto, CreateReviewDto } from './reputation.dto';
import { ReputationService } from './reputation.service';

@ApiTags('reputation')
@Controller()
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  /** Crea una reseña sobre una reserva completada. */
  @Post('reviews')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  createReview(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateReviewDto) {
    return this.reputationService.createReview(user, dto);
  }

  /** Lista las reseñas recibidas por un proveedor (por userId del proveedor). Público. */
  @Get('reviews/provider/:userId')
  listForProvider(@Param('userId') userId: string) {
    return this.reputationService.listForProvider(userId);
  }

  /** Resumen de reputación de un usuario (nivel + confianza). Público. */
  @Get('reputation/user/:userId')
  getUserReputation(@Param('userId') userId: string, @Query('role') role?: UserRole) {
    return this.reputationService.getReputationSummary(userId, role);
  }

  /** Resumen de reputación a partir del id del perfil de Proveedor. Público. */
  @Get('reputation/provider/:providerId')
  getProviderReputation(@Param('providerId') providerId: string) {
    return this.reputationService.getProviderReputation(providerId);
  }

  /** Resumen de reputación a partir del id del perfil de Cliente. Público. */
  @Get('reputation/client/:clientId')
  getClientReputation(@Param('clientId') clientId: string) {
    return this.reputationService.getClientReputation(clientId);
  }

  /** Lista los eventos de reputación de un usuario (uso administrativo). */
  @Get('reputation/events/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  listEvents(@Param('userId') userId: string) {
    return this.reputationService.listEvents(userId);
  }

  /** Registra manualmente un evento de reputación (uso administrativo). */
  @Post('reputation/events')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  createEvent(@Body() dto: CreateReputationEventDto) {
    return this.reputationService.createReputationEvent(dto);
  }
}
