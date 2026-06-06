import { z } from 'zod';
import {
  LocationVisibility,
  MediaPurpose,
  ProviderVerificationStatus,
  PricingType,
  TaskStatus,
  UserRole,
} from '../enums';

const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[a-z]/, 'La contraseña debe incluir una minúscula')
  .regex(/[A-Z]/, 'La contraseña debe incluir una mayúscula')
  .regex(/[0-9]/, 'La contraseña debe incluir un número')
  .regex(/[^A-Za-z0-9]/, 'La contraseña debe incluir un símbolo');

export const registerSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: passwordSchema,
  role: z
    .nativeEnum(UserRole)
    .refine((role) => [UserRole.CLIENT, UserRole.PROVIDER].includes(role), 'El registro público solo permite CLIENT o PROVIDER'),
  displayName: z.string().min(2).max(80),
});
export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});
export type LoginDto = z.infer<typeof loginSchema>;

export interface AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    status?: string;
    displayName: string | null;
  };
}

export const uploadMediaSchema = z.object({
  purpose: z.nativeEnum(MediaPurpose),
  originalName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(120),
  sizeBytes: z.number().int().positive(),
});
export type UploadMediaDto = z.infer<typeof uploadMediaSchema>;

export interface UploadMediaResponseDto {
  id: string;
  purpose: MediaPurpose;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  publicUrl: string | null;
}

export const createLocationSchema = z.object({
  label: z.string().min(2).max(80),
  country: z.string().default('Nicaragua'),
  department: z.string().min(2).max(80),
  city: z.string().min(2).max(80),
  zone: z.string().min(1).max(120),
  addressLine1: z.string().min(2).max(200),
  addressLine2: z.string().max(200).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracyMeters: z.number().int().positive().optional(),
  isExact: z.boolean().default(false),
  visibility: z.nativeEnum(LocationVisibility).default(LocationVisibility.APPROXIMATE),
});
export type CreateLocationDto = z.infer<typeof createLocationSchema>;

export const providerVerificationSchema = z.object({
  identityDocumentFrontMediaId: z.string().min(1),
  identityDocumentBackMediaId: z.string().optional(),
  selfieMediaId: z.string().optional(),
  notes: z.string().max(1000).optional(),
});
export type ProviderVerificationDto = z.infer<typeof providerVerificationSchema>;

export const adminVerificationDecisionSchema = z.object({
  status: z.enum([
    ProviderVerificationStatus.APPROVED,
    ProviderVerificationStatus.REJECTED,
    ProviderVerificationStatus.NEEDS_CORRECTION,
  ]),
  rejectionReason: z.string().max(1000).optional(),
});
export type AdminVerificationDecisionDto = z.infer<typeof adminVerificationDecisionSchema>;

export const createTaskSchema = z.object({
  categoryId: z.string().optional(),
  categoryName: z.string().min(2).max(80).default('General'),
  title: z.string().min(5).max(140),
  description: z.string().min(10).max(5000),
  locationId: z.string().optional(),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  pricingType: z.nativeEnum(PricingType).default(PricingType.OPEN_TO_OFFERS),
  budget: z.number().positive().optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.PUBLISHED),
});
export type CreateTaskDto = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;

export const createOfferSchema = z.object({
  taskId: z.string().min(1),
  amount: z.number().positive('El precio debe ser mayor a cero'),
  estimatedDuration: z.string().min(1).max(120),
  message: z.string().max(2000).optional(),
  includesMaterials: z.boolean().default(false),
  requiresTechnicalVisit: z.boolean().default(false),
  conditions: z.string().max(1000).optional(),
});
export type CreateOfferDto = z.infer<typeof createOfferSchema>;

export const createBookingFromOfferSchema = z.object({
  offerId: z.string().min(1),
});
export type CreateBookingFromOfferDto = z.infer<typeof createBookingFromOfferSchema>;

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationDto = z.infer<typeof paginationSchema>;

export * from './reputation.dto';
export * from './quick-task.dto';
