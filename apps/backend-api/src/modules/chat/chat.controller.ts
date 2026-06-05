/**
 * Controlador del módulo chat: Mensajería entre clientes y proveedores.
 * Endpoints pendientes de implementación.
 */
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
}
