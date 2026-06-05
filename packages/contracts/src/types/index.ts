/**
 * Tipos compartidos de la plataforma Proxi.
 *
 * Estos tipos describen las formas de datos intercambiadas entre el backend
 * y las aplicaciones web. No dependen de ningún framework.
 */
import type {
  UserRole,
  UserStatus,
  ProviderLevel,
  ProviderVerificationStatus,
  TaskStatus,
  OfferStatus,
  BookingStatus,
  PaymentStatus,
  LocationVisibility,
  ProtectedPaymentStatus,
  PricingType,
  VerificationStatus,
} from '../enums';

/** Identificador único (CUID/UUID) usado en toda la plataforma. */
export type Id = string;

/** Respuesta paginada genérica. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Respuesta del endpoint de healthcheck. */
export interface HealthCheckResponse {
  status: 'ok';
  timestamp: string;
  uptime: number;
}

/** Respuesta del endpoint de versión. */
export interface VersionResponse {
  name: string;
  version: string;
  environment: string;
}

/** Vista pública resumida de un usuario. */
export interface PublicUser {
  id: Id;
  email: string;
  role: UserRole;
  status: UserStatus;
  displayName: string | null;
  createdAt: string;
}

/** Vista pública de un perfil de proveedor. */
export interface PublicProviderProfile {
  id: Id;
  userId: Id;
  verificationStatus: ProviderVerificationStatus;
  level: ProviderLevel;
  bio: string | null;
  ratingAverage: number | null;
  completedJobs: number;
}

/** Vista de una tarea publicada. */
export interface TaskView {
  id: Id;
  clientId: Id;
  categoryId: Id;
  title: string;
  description: string;
  status: TaskStatus;
  budget: number | null;
  createdAt: string;
}

/** Vista de una oferta enviada a una tarea. */
export interface OfferView {
  id: Id;
  taskId: Id;
  providerId: Id;
  price: number;
  status: OfferStatus;
  message: string | null;
  createdAt: string;
}

/** Vista de una reserva (pago protegido). */
export interface BookingView {
  id: Id;
  taskId: Id;
  offerId: Id;
  clientId: Id;
  providerId: Id;
  status: BookingStatus;
  totalAmount: number;
  platformFee: number;
  createdAt: string;
}

/** Vista de un pago. */
export interface PaymentView {
  id: Id;
  bookingId: Id;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId: string | null;
}

/** Payload del token JWT emitido por la plataforma. */
export interface JwtPayload {
  /** Subject: identificador del usuario. */
  sub: Id;
  email: string;
  role: UserRole;
}

export interface CurrentUserDto {
  id: Id;
  email: string;
  role: UserRole;
  status: UserStatus;
  displayName: string | null;
}

export interface LocationView {
  id: Id;
  label: string;
  country: string;
  department: string;
  city: string;
  zone: string;
  addressLine1?: string;
  addressLine2?: string | null;
  latitude?: number;
  longitude?: number;
  visibility: LocationVisibility;
  isExact: boolean;
}

export interface MockLocation {
  department: string;
  city: string;
  zone: string;
  reference: string;
  latitude: number;
  longitude: number;
  visibility: LocationVisibility;
}

export interface MockReview {
  id: Id;
  providerId: Id;
  authorName: string;
  rating: number;
  comment: string;
  taskTitle: string;
  createdAt: string;
}

export interface MockProvider {
  id: Id;
  name: string;
  avatarUrl: string;
  trade: string;
  level: ProviderLevel;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  punctuality: string;
  verificationStatus: VerificationStatus;
  certifications: string[];
  services: string[];
  baseRate: string;
  minimumVisit: string;
  tools: string[];
  vehicle: string;
  portfolioPhotos: string[];
}

export interface MockTask {
  id: Id;
  clientName: string;
  title: string;
  category: string;
  description: string;
  shortDescription: string;
  status: TaskStatus;
  budgetMin: number;
  budgetMax: number;
  pricingType: PricingType;
  offerCount: number;
  dateLabel: string;
  location: MockLocation;
  photos: string[];
  createdAt: string;
}

export interface MockOffer {
  id: Id;
  taskId: Id;
  providerId: Id;
  status: OfferStatus;
  price: number;
  estimatedTime: string;
  availability: string;
  message: string;
  includesMaterials: boolean;
  requiresTechnicalVisit: boolean;
  conditions: string;
  createdAt: string;
}

export interface MockBooking {
  id: Id;
  taskId: Id;
  offerId: Id;
  clientName: string;
  providerId: Id;
  status: BookingStatus;
  protectedPaymentStatus: ProtectedPaymentStatus;
  dateLabel: string;
  zone: string;
}

export interface MockProtectedPayment {
  id: Id;
  bookingId: Id;
  taskId: Id;
  offerId: Id;
  amount: number;
  proxiFeePercent: number;
  proxiFeeAmount: number;
  totalAmount: number;
  status: ProtectedPaymentStatus;
  createdAt: string;
}
