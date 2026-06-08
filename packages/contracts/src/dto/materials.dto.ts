import { z } from 'zod';
import { MaterialItemPriority, MaterialStatus } from '../enums';
import type { PartnerStoreSuggestionDto } from './stores.dto';

/**
 * Creación de una Lista Proxi de materiales para una Tarea.
 */
export const createPurchaseListSchema = z.object({
  taskId: z.string().min(1, 'La tarea es requerida'),
  notes: z.string().max(1000).optional(),
});
export type CreatePurchaseListDto = z.infer<typeof createPurchaseListSchema>;

/**
 * Ítem individual de una Lista Proxi.
 */
export const createPurchaseListItemSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido').max(160),
  quantity: z.number().positive('La cantidad debe ser mayor a cero'),
  unit: z.string().min(1, 'La unidad es requerida').max(40),
  specification: z.string().max(500).optional(),
  priority: z.nativeEnum(MaterialItemPriority).default(MaterialItemPriority.REQUIRED),
  estimatedPriceMin: z.number().nonnegative().optional(),
  estimatedPriceMax: z.number().nonnegative().optional(),
  notes: z.string().max(500).optional(),
});
export type CreatePurchaseListItemDto = z.infer<typeof createPurchaseListItemSchema>;

export const updatePurchaseListItemSchema = createPurchaseListItemSchema.partial();
export type UpdatePurchaseListItemDto = z.infer<typeof updatePurchaseListItemSchema>;

/**
 * Actualización del estado de materiales de una Tarea / Lista Proxi.
 */
export const updateMaterialStatusSchema = z.object({
  status: z.nativeEnum(MaterialStatus),
});
export type UpdateMaterialStatusDto = z.infer<typeof updateMaterialStatusSchema>;

export interface PurchaseListItemDto {
  id: string;
  purchaseListId: string;
  name: string;
  quantity: number;
  unit: string;
  specification?: string;
  priority: MaterialItemPriority | string;
  estimatedPriceMin?: number;
  estimatedPriceMax?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseListDto {
  id: string;
  taskId: string;
  providerId?: string;
  status: MaterialStatus | string;
  notes?: string;
  items: PurchaseListItemDto[];
  storeSuggestions: PartnerStoreSuggestionDto[];
  createdAt: string;
  updatedAt: string;
}
