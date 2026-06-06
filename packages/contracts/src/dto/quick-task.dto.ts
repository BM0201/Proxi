import { z } from 'zod';
import { PricingType, QuickTaskMode } from '../enums';

/**
 * Creación de una Tarea rápida (QUICK_TASK).
 * Las Tareas rápidas son de corta duración y se resuelven por aceptación
 * directa o por subasta rápida.
 */
export const createQuickTaskSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(140),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(5000),
  categoryId: z.string().optional(),
  categoryName: z.string().min(2).max(80).default('General'),
  quickTaskMode: z.nativeEnum(QuickTaskMode).default(QuickTaskMode.DIRECT_ACCEPT),
  /** Duración estimada en minutos. Una Tarea rápida no supera 1 día (1440 min). */
  estimatedDurationMinutes: z
    .number()
    .int()
    .positive('La duración debe ser mayor a cero')
    .max(1440, 'Una Tarea rápida no puede superar 1 día (1440 minutos)'),
  /** Radio de cobertura en kilómetros para notificar a Proveedores cercanos. */
  radiusKm: z.number().positive().max(100).default(5),
  locationId: z.string().optional(),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  pricingType: z.nativeEnum(PricingType).default(PricingType.FIXED),
  /** Filtros de elegibilidad de Proveedores. */
  minProviderRating: z.number().min(0).max(5).optional(),
  minProviderTrustScore: z.number().int().min(0).max(100).optional(),
});
export type CreateQuickTaskDto = z.infer<typeof createQuickTaskSchema>;
