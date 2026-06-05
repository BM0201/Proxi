/**
 * Controlador de endpoints de salud y versión de la API.
 */
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { HealthCheckResponse, VersionResponse } from '@proxi/contracts';

@ApiTags('system')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Verifica que la API esté operativa' })
  health(): HealthCheckResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('version')
  @ApiOperation({ summary: 'Devuelve la versión y entorno de la API' })
  version(): VersionResponse {
    return {
      name: 'proxi-api',
      version: process.env.npm_package_version ?? '0.1.0',
      environment: process.env.NODE_ENV ?? 'development',
    };
  }
}
