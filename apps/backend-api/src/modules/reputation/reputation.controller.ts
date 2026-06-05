/**
 * Controlador del módulo reputation: Reseñas y reputación.
 */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateReviewDto } from './reputation.dto';
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
}
