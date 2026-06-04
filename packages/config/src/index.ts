/**
 * @proxi/config
 *
 * Configuraciones compartidas y constantes globales de la plataforma Proxi.
 * Aquí se centralizan valores de negocio reutilizables entre la API y las apps web.
 */

/** Comisión de la plataforma sobre cada reserva (pago protegido). Ej: 0.10 = 10%. */
export const PLATFORM_FEE_RATE = 0.1;

/** Moneda por defecto de la plataforma. */
export const DEFAULT_CURRENCY = 'USD';

/** Número máximo de archivos multimedia por tarea. */
export const MAX_MEDIA_FILES_PER_TASK = 10;

/** Tamaño máximo de archivo multimedia en bytes (10 MB). */
export const MAX_MEDIA_FILE_SIZE = 10 * 1024 * 1024;

/** Configuración de paginación por defecto. */
export const PAGINATION = {
  defaultPage: 1,
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

/**
 * Lee una variable de entorno requerida y lanza un error si no existe.
 * Útil para validar configuración crítica al arranque.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Variable de entorno requerida no definida: ${name}`);
  }
  return value;
}

/**
 * Lee una variable de entorno opcional con un valor por defecto.
 */
export function getEnv(name: string, fallback: string): string {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}
