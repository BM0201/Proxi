/**
 * Esquemas de validación (DTOs) compartidos basados en Zod.
 *
 * Permiten validar payloads tanto en el cliente (formularios) como en el
 * servidor. La API NestJS también define DTOs con class-validator para sus
 * controladores; estos esquemas Zod son el contrato de referencia.
 */
import { z } from 'zod';
import { UserRole, TaskStatus } from '../enums';

/** Esquema de registro de un nuevo usuario. */
export const registerSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: z.nativeEnum(UserRole).default(UserRole.CLIENT),
  displayName: z.string().min(2).max(80).optional(),
});
export type RegisterDto = z.infer<typeof registerSchema>;

/** Esquema de inicio de sesión. */
export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});
export type LoginDto = z.infer<typeof loginSchema>;

/** Esquema de creación de una tarea. */
export const createTaskSchema = z.object({
  categoryId: z.string().min(1, 'La categoría es requerida'),
  title: z.string().min(5).max(140),
  description: z.string().min(10).max(5000),
  budget: z.number().positive().optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.DRAFT),
});
export type CreateTaskDto = z.infer<typeof createTaskSchema>;

/** Esquema de creación de una oferta. */
export const createOfferSchema = z.object({
  taskId: z.string().min(1),
  price: z.number().positive('El precio debe ser mayor a cero'),
  message: z.string().max(2000).optional(),
});
export type CreateOfferDto = z.infer<typeof createOfferSchema>;

/** Esquema de paginación reutilizable. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationDto = z.infer<typeof paginationSchema>;
