import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { BookingService } from './booking.service';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

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
}
