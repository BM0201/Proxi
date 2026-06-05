export interface LevelBadgeProps {
  level: 0 | 1 | 2 | 3 | 4 | 5;
}

const levelLabels: Record<LevelBadgeProps['level'], string> = {
  0: 'Nivel 0',
  1: 'Nivel 1',
  2: 'Nivel 2',
  3: 'Nivel 3',
  4: 'Nivel 4 Pro',
  5: 'Nivel 5 Premium',
};

export function LevelBadge({ level }: LevelBadgeProps) {
  const premium = level >= 4;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        padding: '0.25rem 0.7rem',
        background: premium ? '#0f172a' : '#ecfdf5',
        color: premium ? '#fff' : '#047857',
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      {levelLabels[level]}
    </span>
  );
}
