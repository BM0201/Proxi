import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { UploadMediaDto } from './media.dto';
import { MediaService } from './media.service';

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50MB (límite duro; validación fina por propósito en el servicio)

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /** Subida real de archivo (multipart/form-data: campos `file` y `purpose`). */
  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        purpose: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_UPLOAD_BYTES } }))
  upload(
    @Req() request: Request & { user: AuthenticatedUser },
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
  ) {
    return this.mediaService.uploadFile(request.user, file, dto.purpose);
  }

  /** Sirve un archivo público (avatar, o portafolio si el proveedor está APPROVED). Sin auth. */
  @Get('public/:id')
  async public(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const { stream, mimeType, fileName } = await this.mediaService.getPublicFile(id);
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${encodeURIComponent(fileName)}"`,
      'Cache-Control': 'public, max-age=300',
    });
    return new StreamableFile(stream);
  }

  /** Sirve el binario de un archivo protegido (dueño o admin). Útil para revisión de verificación. */
  @Get(':id/raw')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async raw(
    @Req() request: Request & { user: AuthenticatedUser },
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { stream, mimeType, fileName } = await this.mediaService.getProtectedFile(request.user, id);
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${encodeURIComponent(fileName)}"`,
      'Cache-Control': 'private, no-store',
    });
    return new StreamableFile(stream);
  }

  /** Metadata segura del archivo (protegido). */
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(@Req() request: Request & { user: AuthenticatedUser }, @Param('id') id: string) {
    return this.mediaService.findOne(request.user, id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Req() request: Request & { user: AuthenticatedUser }, @Param('id') id: string) {
    return this.mediaService.remove(request.user, id);
  }
}
