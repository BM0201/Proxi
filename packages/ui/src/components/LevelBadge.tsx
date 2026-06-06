/**
 * Insignia de nivel de reputación.
 *
 * Soporta dos modos:
 * 1. Numérico (compatibilidad): level 0-5.
 * 2. Por enum/etiqueta: se pasa `label` y opcionalmente `color` (proveniente
 *    del resumen de reputación del backend: levelLabel + levelColor).
 */
export interface LevelBadgeProps {
  /** Nivel numérico (0-5) o cadena del enum (ej. "LEVEL_3_GOLD", "CLIENT_1_VERIFIED"). */
  level?: 0 | 1 | 2 | 3 | 4 | 5 | string;
  /** Etiqueta legible. Si se entrega, tiene prioridad sobre el mapeo numérico. */
  label?: string;
  /** Color hex de la insignia (ej. levelColor del backend). */
  color?: string;
}

const numericLabels: Record<number, string> = {
  0: 'Nivel 0',
  1: 'Nivel 1',
  2: 'Nivel 2',
  3: 'Nivel 3',
  4: 'Nivel 4 Pro',
  5: 'Nivel 5 Premium',
};

export function LevelBadge({ level, label, color }: LevelBadgeProps) {
  const resolvedLabel =
    label ?? (typeof level === 'number' ? numericLabels[level] : (level ?? 'Sin nivel'));
  const isNumericPremium = typeof level === 'number' && level >= 4;

  const background = color ? `${color}22` : isNumericPremium ? '#0f172a' : '#ecfdf5';
  const textColor = color ? color : isNumericPremium ? '#fff' : '#047857';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        padding: '0.25rem 0.7rem',
        background,
        color: textColor,
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      {resolvedLabel}
    </span>
  );
}
