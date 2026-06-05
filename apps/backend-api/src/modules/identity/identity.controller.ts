import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { ProviderCertificationDto, ProviderVerificationDto } from './identity.dto';
import { IdentityService } from './identity.service';

@ApiTags('identity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post('provider-verification')
  @Roles('PROVIDER')
  createProviderVerification(@Req() request: Request & { user: AuthenticatedUser }, @Body() dto: ProviderVerificationDto) {
    return this.identityService.createProviderVerification(request.user, dto);
  }

  @Get('provider-verification/me')
  @Roles('PROVIDER')
  getMyProviderVerification(@Req() request: Request & { user: AuthenticatedUser }) {
    return this.identityService.getMyProviderVerification(request.user);
  }

  @Post('provider-certifications')
  @Roles('PROVIDER')
  createProviderCertification(@Req() request: Request & { user: AuthenticatedUser }, @Body() dto: ProviderCertificationDto) {
    return this.identityService.createProviderCertification(request.user, dto);
  }

  @Get('provider-certifications/me')
  @Roles('PROVIDER')
  getMyProviderCertifications(@Req() request: Request & { user: AuthenticatedUser }) {
    return this.identityService.getMyProviderCertifications(request.user);
  }
}
