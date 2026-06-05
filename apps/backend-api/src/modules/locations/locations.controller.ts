import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateLocationDto } from './locations.dto';
import { LocationsService } from './locations.service';

@ApiTags('locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Req() request: Request & { user: AuthenticatedUser }, @Body() dto: CreateLocationDto) {
    return this.locationsService.create(request.user, dto);
  }

  @Get('me')
  mine(@Req() request: Request & { user: AuthenticatedUser }) {
    return this.locationsService.mine(request.user);
  }

  @Get(':id')
  findOne(@Req() request: Request & { user: AuthenticatedUser }, @Param('id') id: string) {
    return this.locationsService.findOne(request.user, id);
  }

  @Patch(':id')
  update(@Req() request: Request & { user: AuthenticatedUser }, @Param('id') id: string, @Body() dto: CreateLocationDto) {
    return this.locationsService.update(request.user, id, dto);
  }

  @Delete(':id')
  remove(@Req() request: Request & { user: AuthenticatedUser }, @Param('id') id: string) {
    return this.locationsService.remove(request.user, id);
  }
}
