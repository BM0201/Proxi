/**
 * @proxi/logger
 *
 * Logger compartido basado en Pino para toda la plataforma Proxi.
 * Proporciona logs estructurados (JSON) en producción y legibles en desarrollo.
 */
import pino, { type Logger, type LoggerOptions } from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const baseOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL ?? (isProduction ? 'info' : 'debug'),
  // En desarrollo usamos pino-pretty para una salida legible.
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
};

/** Logger raíz de la plataforma. */
export const logger: Logger = pino(baseOptions);

/**
 * Crea un logger hijo con contexto adicional (ej. nombre de módulo).
 * @param context Nombre del contexto/módulo que emite los logs.
 */
export function createLogger(context: string): Logger {
  return logger.child({ context });
}

export type { Logger };
