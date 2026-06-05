import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AttachMediaDto } from '../media/media.dto';
import { MediaService } from '../media/media.service';
import { BookingService } from './booking.service';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly mediaService: MediaService,
  ) {}

  @Get('me')
  mine(@CurrentUser() user: AuthenticatedUser) {
    return this.bookingService.mine(user);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.bookingService.findOne(user, id);
  }

  @Post('from-offer/:offerId')
  fromOffer(@CurrentUser() user: AuthenticatedUser, @Param('offerId') offerId: string) {
    return this.bookingService.fromOffer(user, offerId);
  }

  @Post(':id/confirm-protected-payment')
  confirmProtectedPayment(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.bookingService.confirmProtectedPayment(user, id);
  }

  /** El proveedor inicia el trabajo (requiere pago protegido). */
  @Post(':id/start')
  @Roles('PROVIDER')
  start(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.bookingService.start(user, id);
  }

  /** El proveedor marca el trabajo como terminado de su lado. */
  @Post(':id/complete-by-provider')
  @Roles('PROVIDER')
  completeByProvider(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.bookingService.completeByProvider(user, id);
  }

  /** El cliente confirma la finalización (libera saldo aprobado en sandbox). */
  @Post(':id/confirm-by-client')
  @Roles('CLIENT')
  confirmByClient(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.bookingService.confirmByClient(user, id);
  }

  /** Adjunta evidencia (foto/documento) a la reserva. */
  @Post(':id/evidence')
  attachEvidence(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: AttachMediaDto,
  ) {
    return this.mediaService.attachBookingEvidence(user, id, dto.mediaId);
  }

  /** Lista la evidencia adjunta a la reserva. */
  @Get(':id/evidence')
  listEvidence(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.mediaService.listBookingEvidence(user, id);
  }
}
