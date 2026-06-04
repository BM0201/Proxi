/**
 * Controlador del módulo identity: Gestión de identidad y usuarios.
 * Endpoints pendientes de implementación.
 */
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdentityService } from './identity.service';

@ApiTags('identity')
@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}
}
