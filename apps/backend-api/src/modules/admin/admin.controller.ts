import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AdminModerationDecisionDto, AdminVerificationDecisionDto } from './admin.dto';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  overview() {
    return this.adminService.overview();
  }

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Get('providers')
  listProviders() {
    return this.adminService.listProviders();
  }

  @Get('tasks')
  listTasks() {
    return this.adminService.listTasks();
  }

  @Get('bookings')
  listBookings() {
    return this.adminService.listBookings();
  }

  @Get('protected-payments')
  listProtectedPayments() {
    return this.adminService.listProtectedPayments();
  }

  @Get('moderation-flags')
  listModerationFlags() {
    return this.adminService.listModerationFlags();
  }

  @Post('moderation-flags/:id/resolve')
  resolveModerationFlag(@Param('id') id: string, @Body() dto: AdminModerationDecisionDto) {
    return this.adminService.resolveModerationFlag(id, dto);
  }

  @Get('verifications')
  listVerifications() {
    return this.adminService.listVerifications();
  }

  @Get('verifications/:id')
  getVerification(@Param('id') id: string) {
    return this.adminService.getVerification(id);
  }

  @Post('verifications/:id/approve')
  approveVerification(@Req() request: Request & { user: AuthenticatedUser }, @Param('id') id: string) {
    return this.adminService.approveVerification(id, request.user);
  }

  @Post('verifications/:id/reject')
  rejectVerification(
    @Req() request: Request & { user: AuthenticatedUser },
    @Param('id') id: string,
    @Body() dto: AdminVerificationDecisionDto,
  ) {
    return this.adminService.rejectVerification(id, request.user, dto);
  }

  @Post('verifications/:id/request-correction')
  requestCorrection(
    @Req() request: Request & { user: AuthenticatedUser },
    @Param('id') id: string,
    @Body() dto: AdminVerificationDecisionDto,
  ) {
    return this.adminService.requestCorrection(id, request.user, dto);
  }
}
