/**
 * Cálculo del puntaje de confianza (trustScore) y su estado asociado.
 *
 * El trustScore inicia en 70 y se mueve en el rango 0-100 según los eventos
 * de reputación acumulados. El estado de confianza (TrustStatus) se deriva
 * del puntaje y define restricciones operativas.
 */
import { ReputationEventType, TrustStatus } from '@proxi/contracts';

export const DEFAULT_TRUST_SCORE = 70;
export const MIN_TRUST_SCORE = 0;
export const MAX_TRUST_SCORE = 100;

/**
 * Impacto por defecto de cada tipo de evento sobre el trustScore.
 * Valores positivos suben la confianza; negativos la bajan.
 */
export const TRUST_EVENT_IMPACT: Record<ReputationEventType, number> = {
  [ReputationEventType.TASK_COMPLETED]: 2,
  [ReputationEventType.GOOD_REVIEW]: 3,
  [ReputationEventType.BAD_REVIEW]: -5,
  [ReputationEventType.LATE_CANCELLATION]: -4,
  [ReputationEventType.SAME_DAY_CANCELLATION]: -8,
  [ReputationEventType.NO_SHOW]: -15,
  [ReputationEventType.ABANDONED_TASK]: -20,
  [ReputationEventType.INCOMPLETE_TASK]: -10,
  [ReputationEventType.EXTERNAL_CONTACT_ATTEMPT]: -15,
  [ReputationEventType.EXTERNAL_PAYMENT_ATTEMPT]: -25,
  [ReputationEventType.INACTIVITY_SILENT]: -3,
  [ReputationEventType.MANUAL_ADMIN_ADJUSTMENT]: 0,
};

/** Limita el puntaje al rango permitido [0, 100]. */
export function clampTrustScore(score: number): number {
  return Math.max(MIN_TRUST_SCORE, Math.min(MAX_TRUST_SCORE, Math.round(score)));
}

/**
 * Deriva el estado de confianza a partir del puntaje.
 * - 60-100: NORMAL
 * - 40-59:  WATCHLIST (en observación)
 * - 20-39:  RESTRICTED (operación restringida)
 * - 1-19:   SUSPENDED (suspendido)
 * - 0:      BANNED (bloqueado)
 */
export function calculateTrustStatus(trustScore: number): TrustStatus {
  const score = clampTrustScore(trustScore);
  if (score <= 0) return TrustStatus.BANNED;
  if (score < 20) return TrustStatus.SUSPENDED;
  if (score < 40) return TrustStatus.RESTRICTED;
  if (score < 60) return TrustStatus.WATCHLIST;
  return TrustStatus.NORMAL;
}

const TRUST_STATUS_LABELS: Record<TrustStatus, string> = {
  [TrustStatus.NORMAL]: 'Normal',
  [TrustStatus.WATCHLIST]: 'En observación',
  [TrustStatus.RESTRICTED]: 'Restringido',
  [TrustStatus.SUSPENDED]: 'Suspendido',
  [TrustStatus.BANNED]: 'Bloqueado',
};

/** Etiqueta legible (es-NI) del estado de confianza. */
export function getTrustLabel(status: TrustStatus): string {
  return TRUST_STATUS_LABELS[status] ?? 'Desconocido';
}
