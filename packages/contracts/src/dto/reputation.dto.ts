import { z } from 'zod';
import {
  ClientLevel,
  InactivityStatus,
  ProviderLevel,
  ReputationEventType,
  TrustStatus,
  UserRole,
} from '../enums';

/**
 * Resumen de reputación de un usuario (Cliente o Proveedor independiente).
 * Se entrega a los frontends para pintar insignias de nivel y confianza.
 */
export interface ReputationSummaryDto {
  userId: string;
  role: UserRole;
  /** Nivel: ProviderLevel para proveedores, ClientLevel para clientes. */
  level: ProviderLevel | ClientLevel | string;
  levelLabel: string;
  levelColor: string;
  /** Promedio de estrellas (0-5) o null si aún no hay valoraciones. */
  stars: number | null;
  ratingCount: number;
  trustScore: number;
  trustStatus: TrustStatus;
  trustLabel: string;
  completedTasks: number;
  cancelledTasks: number;
  inactivityStatus: InactivityStatus;
}

/**
 * Alta manual de un evento de reputación (uso administrativo).
 */
export const createReputationEventSchema = z.object({
  userId: z.string().min(1, 'El usuario es requerido'),
  role: z.nativeEnum(UserRole),
  eventType: z.nativeEnum(ReputationEventType),
  scoreImpact: z
    .number()
    .int()
    .min(-100, 'El impacto no puede ser menor a -100')
    .max(100, 'El impacto no puede ser mayor a 100'),
  reason: z.string().max(1000).optional(),
  relatedTaskId: z.string().optional(),
  relatedBookingId: z.string().optional(),
});
export type CreateReputationEventDto = z.infer<typeof createReputationEventSchema>;
