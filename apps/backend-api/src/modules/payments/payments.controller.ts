/**
 * Controlador del módulo payments: Pagos y movimientos del libro mayor.
 * Endpoints pendientes de implementación.
 */
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
}
