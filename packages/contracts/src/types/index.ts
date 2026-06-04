/**
 * Tipos compartidos de la plataforma Proxi.
 *
 * Estos tipos describen las formas de datos intercambiadas entre el backend
 * y las aplicaciones web. No dependen de ningún framework.
 */
import type {
  UserRole,
  ProviderStatus,
  TaskStatus,
  OfferStatus,
  BookingStatus,
  PaymentStatus,
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
  displayName: string | null;
  createdAt: string;
}

/** Vista pública de un perfil de proveedor. */
export interface PublicProviderProfile {
  id: Id;
  userId: Id;
  status: ProviderStatus;
  bio: string | null;
  hourlyRate: number | null;
  ratingAverage: number | null;
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
