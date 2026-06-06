/**
 * Enums de reputación, confianza e inactividad.
 *
 * Terminología legal de Proxi (Nicaragua): trabajamos con Clientes y
 * Proveedores independientes. Nunca usamos términos laborales
 * (empleado, salario, jefe, nómina, jornada, despido).
 */

/**
 * Nivel del Cliente. Refleja su historial de Tareas y comportamiento de pago.
 */
export enum ClientLevel {
  CLIENT_0_NEW = 'CLIENT_0_NEW',
  CLIENT_1_VERIFIED = 'CLIENT_1_VERIFIED',
  CLIENT_2_TRUSTED = 'CLIENT_2_TRUSTED',
  CLIENT_3_GOLD = 'CLIENT_3_GOLD',
}

/**
 * Estado de confianza aplicable tanto a Clientes como a Proveedores.
 * Define restricciones operativas en la plataforma.
 */
export enum TrustStatus {
  NORMAL = 'NORMAL',
  WATCHLIST = 'WATCHLIST',
  RESTRICTED = 'RESTRICTED',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

/**
 * Estado de actividad/inactividad de un usuario.
 * No representa una relación laboral: el Proveedor independiente decide
 * libremente su disponibilidad.
 */
export enum InactivityStatus {
  ACTIVE = 'ACTIVE',
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  PAUSED_VOLUNTARILY = 'PAUSED_VOLUNTARILY',
  VACATION_OR_OUT_OF_SERVICE = 'VACATION_OR_OUT_OF_SERVICE',
  INACTIVE_SILENT = 'INACTIVE_SILENT',
  REACTIVATION_REQUIRED = 'REACTIVATION_REQUIRED',
}

/**
 * Tipos de evento que impactan la reputación de un usuario.
 */
export enum ReputationEventType {
  TASK_COMPLETED = 'TASK_COMPLETED',
  GOOD_REVIEW = 'GOOD_REVIEW',
  BAD_REVIEW = 'BAD_REVIEW',
  LATE_CANCELLATION = 'LATE_CANCELLATION',
  SAME_DAY_CANCELLATION = 'SAME_DAY_CANCELLATION',
  NO_SHOW = 'NO_SHOW',
  ABANDONED_TASK = 'ABANDONED_TASK',
  INCOMPLETE_TASK = 'INCOMPLETE_TASK',
  EXTERNAL_CONTACT_ATTEMPT = 'EXTERNAL_CONTACT_ATTEMPT',
  EXTERNAL_PAYMENT_ATTEMPT = 'EXTERNAL_PAYMENT_ATTEMPT',
  INACTIVITY_SILENT = 'INACTIVITY_SILENT',
  MANUAL_ADMIN_ADJUSTMENT = 'MANUAL_ADMIN_ADJUSTMENT',
}
