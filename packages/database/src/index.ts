/**
 * @proxi/database
 *
 * Cliente de Prisma compartido para toda la plataforma Proxi.
 * Reexporta el cliente generado y expone una instancia singleton.
 */
import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

/**
 * Patrón singleton para evitar múltiples instancias de PrismaClient
 * durante el hot-reload en desarrollo.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
