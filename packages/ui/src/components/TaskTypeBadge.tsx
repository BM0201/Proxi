/**
 * Insignia del tipo de Tarea (Tarea rápida, estándar o proyecto por paquete).
 */
export type TaskTypeValue = 'QUICK_TASK' | 'STANDARD_TASK' | 'PACKAGE_PROJECT' | string;

export interface TaskTypeBadgeProps {
  taskType: TaskTypeValue;
}

const TYPE_META: Record<string, { label: string; icon: string; background: string; color: string }> = {
  QUICK_TASK: { label: 'Tarea rápida', icon: '⚡', background: '#e0f2fe', color: '#075985' },
  STANDARD_TASK: { label: 'Tarea estándar', icon: '🧰', background: '#eef2ff', color: '#4338ca' },
  PACKAGE_PROJECT: { label: 'Proyecto por paquete', icon: '📦', background: '#f3e8ff', color: '#6b21a8' },
};

export function TaskTypeBadge({ taskType }: TaskTypeBadgeProps) {
  const meta = TYPE_META[taskType] ?? {
    label: taskType,
    icon: '🏷️',
    background: '#f3f4f6',
    color: '#374151',
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        borderRadius: 999,
        padding: '0.2rem 0.65rem',
        background: meta.background,
        color: meta.color,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <span aria-hidden>{meta.icon}</span>
      {meta.label}
    </span>
  );
}
