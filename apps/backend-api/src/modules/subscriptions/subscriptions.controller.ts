/**
 * Controlador del módulo subscriptions: Suscripciones y planes.
 * Endpoints pendientes de implementación.
 */
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}
}
