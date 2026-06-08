import { z } from 'zod';
import { StoreType } from '../enums';

/**
 * Alta de una tienda/ferretería sugerida (uso administrativo).
 */
export const createPartnerStoreSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido').max(160),
  type: z.nativeEnum(StoreType),
  description: z.string().max(500).optional(),
  department: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  zone: z.string().max(120).optional(),
  addressLine: z.string().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phoneInternal: z.string().max(40).optional(),
  websiteUrl: z.string().max(300).optional(),
  isSponsored: z.boolean().optional(),
});
export type CreatePartnerStoreDto = z.infer<typeof createPartnerStoreSchema>;

export const updatePartnerStoreSchema = createPartnerStoreSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type UpdatePartnerStoreDto = z.infer<typeof updatePartnerStoreSchema>;

export interface PartnerStoreDto {
  id: string;
  name: string;
  type: StoreType | string;
  description?: string;
  country: string;
  department?: string;
  city?: string;
  zone?: string;
  addressLine?: string;
  latitude?: number;
  longitude?: number;
  phoneInternal?: string;
  websiteUrl?: string;
  isSponsored: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Sugerencia de tienda asociada a una Lista Proxi.
 */
export interface PartnerStoreSuggestionDto {
  id: string;
  storeId: string;
  store: PartnerStoreDto;
  reason?: string;
  isSponsored: boolean;
  priority: number;
  createdAt: string;
}
