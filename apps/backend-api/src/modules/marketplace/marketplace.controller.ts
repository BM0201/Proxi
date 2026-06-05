import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateOfferDto, CreateTaskDto, UpdateTaskDto } from './marketplace.dto';
import { MarketplaceService } from './marketplace.service';

@ApiTags('tasks-offers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('tasks')
  @Roles('CLIENT')
  createTask(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTaskDto) {
    return this.marketplaceService.createTask(user, dto);
  }

  @Get('tasks/me')
  @Roles('CLIENT')
  myTasks(@CurrentUser() user: AuthenticatedUser) {
    return this.marketplaceService.myTasks(user);
  }

  @Get('tasks/available')
  @Roles('PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  availableTasks(@CurrentUser() user: AuthenticatedUser) {
    return this.marketplaceService.availableTasks(user);
  }

  @Get('tasks/:id')
  findTask(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.marketplaceService.findTask(user, id);
  }

  @Patch('tasks/:id')
  @Roles('CLIENT')
  updateTask(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.marketplaceService.updateTask(user, id, dto);
  }

  @Delete('tasks/:id')
  @Roles('CLIENT')
  removeTask(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.marketplaceService.removeTask(user, id);
  }

  @Post('offers')
  @Roles('PROVIDER')
  createOffer(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateOfferDto) {
    return this.marketplaceService.createOffer(user, dto);
  }

  @Get('offers/me')
  @Roles('PROVIDER')
  myOffers(@CurrentUser() user: AuthenticatedUser) {
    return this.marketplaceService.myOffers(user);
  }

  @Get('tasks/:taskId/offers')
  @Roles('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  taskOffers(@CurrentUser() user: AuthenticatedUser, @Param('taskId') taskId: string) {
    return this.marketplaceService.taskOffers(user, taskId);
  }

  @Get('offers/:id')
  findOffer(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.marketplaceService.findOffer(user, id);
  }

  @Post('offers/:id/accept')
  @Roles('CLIENT')
  acceptOffer(@Req() request: Request & { user: AuthenticatedUser }, @Param('id') id: string) {
    return this.marketplaceService.acceptOffer(request.user, id);
  }

  @Post('offers/:id/reject')
  @Roles('CLIENT')
  rejectOffer(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.marketplaceService.rejectOffer(user, id);
  }
}
