import { z } from 'zod';

/**
 * Alta de una herramienta del Proveedor independiente.
 */
export const createProviderToolSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido').max(120),
  category: z.string().max(80).optional(),
  description: z.string().max(500).optional(),
});
export type CreateProviderToolDto = z.infer<typeof createProviderToolSchema>;

export const updateProviderToolSchema = createProviderToolSchema.partial();
export type UpdateProviderToolDto = z.infer<typeof updateProviderToolSchema>;

/**
 * Herramienta declarada por un Proveedor independiente.
 */
export interface ProviderToolDto {
  id: string;
  providerId: string;
  name: string;
  category?: string;
  description?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
