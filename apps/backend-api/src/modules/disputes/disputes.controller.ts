/**
 * Controlador del módulo disputes: Gestión de disputas.
 * Endpoints pendientes de implementación.
 */
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DisputesService } from './disputes.service';

@ApiTags('disputes')
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}
}
