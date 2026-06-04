/**
 * Enums compartidos de la plataforma Proxi.
 *
 * Estos valores deben mantenerse sincronizados con los enums definidos en
 * el schema de Prisma (`@proxi/database`). Se usan como contrato único entre
 * el backend (NestJS) y las aplicaciones web (Next.js).
 */

/** Rol del usuario dentro de la plataforma. */
export enum UserRole {
  /** Cliente que publica tareas y contrata servicios. */
  CLIENT = 'CLIENT',
  /** Proveedor independiente que ofrece servicios. */
  PROVIDER = 'PROVIDER',
  /** Administrador de la plataforma. */
  ADMIN = 'ADMIN',
}

/** Estado de verificación de un proveedor independiente. */
export enum ProviderStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

/** Estado del ciclo de vida de una tarea publicada por un cliente. */
export enum TaskStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  RECEIVING_OFFERS = 'RECEIVING_OFFERS',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/** Estado de una oferta enviada por un proveedor a una tarea. */
export enum OfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

/** Estado de una reserva (pago protegido) entre cliente y proveedor. */
export enum BookingStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
}

/** Estado de un pago realizado por el cliente. */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

/** Estado de una liquidación (payout) hacia el proveedor. */
export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/** Estado de una disputa abierta sobre una reserva. */
export enum DisputeStatus {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

/** Tipo de movimiento en el libro mayor (ledger) de saldos. */
export enum LedgerEntryType {
  /** Crédito: ingreso de saldo a la cuenta. */
  CREDIT = 'CREDIT',
  /** Débito: salida de saldo de la cuenta. */
  DEBIT = 'DEBIT',
  /** Reserva de saldo (pago protegido pendiente de liquidación). */
  HOLD = 'HOLD',
  /** Liberación de saldo reservado hacia saldo aprobado. */
  RELEASE = 'RELEASE',
}

/** Tipo de entidad reportada en una marca de moderación. */
export enum ModerationEntityType {
  TASK = 'TASK',
  OFFER = 'OFFER',
  REVIEW = 'REVIEW',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  PROVIDER_PROFILE = 'PROVIDER_PROFILE',
}

/** Estado de una marca de moderación. */
export enum ModerationStatus {
  OPEN = 'OPEN',
  REVIEWED = 'REVIEWED',
  ACTIONED = 'ACTIONED',
  DISMISSED = 'DISMISSED',
}

/** Tipo de archivo multimedia. */
export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

/** Tipo de notificación enviada a un usuario. */
export enum NotificationType {
  TASK_UPDATE = 'TASK_UPDATE',
  OFFER_RECEIVED = 'OFFER_RECEIVED',
  BOOKING_UPDATE = 'BOOKING_UPDATE',
  PAYMENT_UPDATE = 'PAYMENT_UPDATE',
  PAYOUT_UPDATE = 'PAYOUT_UPDATE',
  DISPUTE_UPDATE = 'DISPUTE_UPDATE',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  SYSTEM = 'SYSTEM',
}
