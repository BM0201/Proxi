/**
 * Controlador del módulo materials: Lista Proxi de materiales.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreatePurchaseListDto } from './dto/create-purchase-list.dto';
import { CreatePurchaseListItemDto } from './dto/create-purchase-list-item.dto';
import { UpdateMaterialStatusDto } from './dto/update-material-status.dto';
import { MaterialsService } from './materials.service';

@ApiTags('materials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  /** El Proveedor crea una Lista Proxi para una Tarea. */
  @Post('purchase-lists')
  @Roles('PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  createPurchaseList(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreatePurchaseListDto) {
    return this.materialsService.createPurchaseList(user, dto);
  }

  /** Consulta la Lista Proxi de una Tarea. */
  @Get('purchase-lists/task/:taskId')
  @Roles('CLIENT', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  getByTask(@Param('taskId') taskId: string) {
    return this.materialsService.getPurchaseListByTask(taskId);
  }

  /** El Proveedor agrega un ítem a la Lista Proxi. */
  @Post('purchase-lists/:id/items')
  @Roles('PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  addItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreatePurchaseListItemDto,
  ) {
    return this.materialsService.addItem(user, id, dto);
  }

  /** El Proveedor actualiza un ítem de la Lista Proxi. */
  @Put('purchase-lists/:id/items/:itemId')
  @Roles('PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  updateItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: CreatePurchaseListItemDto,
  ) {
    return this.materialsService.updateItem(user, id, itemId, dto);
  }

  /** El Proveedor elimina un ítem de la Lista Proxi. */
  @Delete('purchase-lists/:id/items/:itemId')
  @Roles('PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  deleteItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.materialsService.deleteItem(user, id, itemId);
  }

  /** El Cliente actualiza el estado de materiales de su Tarea. */
  @Patch('tasks/:taskId/status')
  @Roles('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  updateMaterialStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateMaterialStatusDto,
  ) {
    return this.materialsService.updateMaterialStatus(user, taskId, dto);
  }

  /** Consulta las tiendas sugeridas para una Lista Proxi. */
  @Get('purchase-lists/:id/stores')
  @Roles('CLIENT', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN')
  getStores(@Param('id') id: string) {
    return this.materialsService.getStoreSuggestions(id);
  }
}
