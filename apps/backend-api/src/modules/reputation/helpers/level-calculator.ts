/**
 * Cálculo de niveles de reputación para Proveedores independientes y Clientes.
 *
 * Reglas declarativas y deterministas (Sprint 1). No representan ninguna
 * relación laboral: el nivel refleja únicamente el historial dentro de Proxi.
 */
import { ClientLevel, ProviderLevel } from '@proxi/contracts';

export interface ProviderLevelInput {
  isVerified: boolean;
  completedJobs: number;
  ratingAverage: number | null;
}

export interface ClientLevelInput {
  isVerified: boolean;
  completedTasksAsClient: number;
  cancelledTasksCount: number;
}

/**
 * Determina el nivel del Proveedor independiente según verificación,
 * Tareas completadas y promedio de valoraciones.
 */
export function calculateProviderLevel(input: ProviderLevelInput): ProviderLevel {
  const { isVerified, completedJobs } = input;
  const rating = input.ratingAverage ?? 0;

  if (!isVerified || completedJobs <= 0) {
    return ProviderLevel.LEVEL_0_NEW;
  }
  if (completedJobs >= 300 && rating >= 4.9) {
    return ProviderLevel.LEVEL_5_DIAMOND;
  }
  if (completedJobs >= 150 && rating >= 4.8) {
    return ProviderLevel.LEVEL_4_PLATINUM;
  }
  if (completedJobs >= 50 && rating >= 4.7) {
    return ProviderLevel.LEVEL_3_GOLD;
  }
  if (completedJobs >= 10 && rating >= 4.3) {
    return ProviderLevel.LEVEL_2_TRUSTED;
  }
  return ProviderLevel.LEVEL_1_VERIFIED;
}

/**
 * Determina el nivel del Cliente según verificación, Tareas completadas
 * y cancelaciones acumuladas.
 */
export function calculateClientLevel(input: ClientLevelInput): ClientLevel {
  const { isVerified, completedTasksAsClient, cancelledTasksCount } = input;

  if (completedTasksAsClient >= 30 && cancelledTasksCount <= 3) {
    return ClientLevel.CLIENT_3_GOLD;
  }
  if (completedTasksAsClient >= 10 && cancelledTasksCount <= 5) {
    return ClientLevel.CLIENT_2_TRUSTED;
  }
  if (isVerified || completedTasksAsClient >= 3) {
    return ClientLevel.CLIENT_1_VERIFIED;
  }
  return ClientLevel.CLIENT_0_NEW;
}

const PROVIDER_LEVEL_LABELS: Record<ProviderLevel, string> = {
  [ProviderLevel.LEVEL_0_NEW]: 'Nuevo',
  [ProviderLevel.LEVEL_1_VERIFIED]: 'Verificado',
  [ProviderLevel.LEVEL_2_TRUSTED]: 'De confianza',
  [ProviderLevel.LEVEL_3_GOLD]: 'Oro',
  [ProviderLevel.LEVEL_4_PLATINUM]: 'Platino',
  [ProviderLevel.LEVEL_5_DIAMOND]: 'Diamante',
};

const PROVIDER_LEVEL_COLORS: Record<ProviderLevel, string> = {
  [ProviderLevel.LEVEL_0_NEW]: '#94a3b8',
  [ProviderLevel.LEVEL_1_VERIFIED]: '#0ea5e9',
  [ProviderLevel.LEVEL_2_TRUSTED]: '#22c55e',
  [ProviderLevel.LEVEL_3_GOLD]: '#f59e0b',
  [ProviderLevel.LEVEL_4_PLATINUM]: '#8b5cf6',
  [ProviderLevel.LEVEL_5_DIAMOND]: '#06b6d4',
};

const CLIENT_LEVEL_LABELS: Record<ClientLevel, string> = {
  [ClientLevel.CLIENT_0_NEW]: 'Nuevo',
  [ClientLevel.CLIENT_1_VERIFIED]: 'Verificado',
  [ClientLevel.CLIENT_2_TRUSTED]: 'De confianza',
  [ClientLevel.CLIENT_3_GOLD]: 'Oro',
};

const CLIENT_LEVEL_COLORS: Record<ClientLevel, string> = {
  [ClientLevel.CLIENT_0_NEW]: '#94a3b8',
  [ClientLevel.CLIENT_1_VERIFIED]: '#0ea5e9',
  [ClientLevel.CLIENT_2_TRUSTED]: '#22c55e',
  [ClientLevel.CLIENT_3_GOLD]: '#f59e0b',
};

/** Etiqueta legible (es-NI) del nivel, sea de Proveedor o de Cliente. */
export function getLevelLabel(level: ProviderLevel | ClientLevel | string): string {
  if (level in PROVIDER_LEVEL_LABELS) {
    return PROVIDER_LEVEL_LABELS[level as ProviderLevel];
  }
  if (level in CLIENT_LEVEL_LABELS) {
    return CLIENT_LEVEL_LABELS[level as ClientLevel];
  }
  return 'Desconocido';
}

/** Color hex asociado al nivel para insignias en los frontends. */
export function getLevelColor(level: ProviderLevel | ClientLevel | string): string {
  if (level in PROVIDER_LEVEL_COLORS) {
    return PROVIDER_LEVEL_COLORS[level as ProviderLevel];
  }
  if (level in CLIENT_LEVEL_COLORS) {
    return CLIENT_LEVEL_COLORS[level as ClientLevel];
  }
  return '#94a3b8';
}
