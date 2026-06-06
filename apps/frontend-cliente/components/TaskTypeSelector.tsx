'use client';

export type TaskTypeOption = 'QUICK_TASK' | 'STANDARD_TASK' | 'PACKAGE_PROJECT';

interface TaskTypeSelectorProps {
  value: TaskTypeOption;
  onChange: (value: TaskTypeOption) => void;
}

interface OptionMeta {
  value: TaskTypeOption;
  icon: string;
  title: string;
  description: string;
  disabled?: boolean;
  badge?: string;
}

const OPTIONS: OptionMeta[] = [
  {
    value: 'QUICK_TASK',
    icon: '⚡',
    title: 'Tarea rápida',
    description: 'Corta duración. Aceptación directa o subasta rápida con Proveedores cercanos.',
  },
  {
    value: 'STANDARD_TASK',
    icon: '🧰',
    title: 'Tarea estándar',
    description: 'Recibe varias ofertas. Para trabajos de hasta 1 día.',
  },
  {
    value: 'PACKAGE_PROJECT',
    icon: '📦',
    title: 'Proyecto por paquete',
    description: 'Trabajos de varios días por etapas.',
    disabled: true,
    badge: 'Próximamente',
  },
];

export function TaskTypeSelector({ value, onChange }: TaskTypeSelectorProps) {
  return (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
      {OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            onClick={() => !option.disabled && onChange(option.value)}
            style={{
              textAlign: 'left',
              borderRadius: 14,
              border: selected ? '2px solid #4338ca' : '1px solid #e2e8f0',
              background: option.disabled ? '#f8fafc' : selected ? '#eef2ff' : '#fff',
              padding: '0.9rem 1rem',
              cursor: option.disabled ? 'not-allowed' : 'pointer',
              opacity: option.disabled ? 0.7 : 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 22 }} aria-hidden>
                {option.icon}
              </span>
              {option.badge ? (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#6b21a8',
                    background: '#f3e8ff',
                    borderRadius: 999,
                    padding: '0.1rem 0.5rem',
                  }}
                >
                  {option.badge}
                </span>
              ) : null}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{option.title}</span>
            <span style={{ fontSize: 12, color: '#64748b' }}>{option.description}</span>
          </button>
        );
      })}
    </div>
  );
}
