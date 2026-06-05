import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AdminVerificationDecisionDto } from './admin.dto';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
