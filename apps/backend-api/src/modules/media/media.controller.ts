import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { UploadMediaDto } from './media.dto';
import { MediaService } from './media.service';

@ApiTags('media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  upload(@Req() request: Request & { user: AuthenticatedUser }, @Body() dto: UploadMediaDto) {
    return this.mediaService.uploadMetadata(request.user, dto);
  }

  @Get(':id')
  findOne(@Req() request: Request & { user: AuthenticatedUser }, @Param('id') id: string) {
    return this.mediaService.findOne(request.user, id);
  }

  @Delete(':id')
  remove(@Req() request: Request & { user: AuthenticatedUser }, @Param('id') id: string) {
    return this.mediaService.remove(request.user, id);
  }
}
