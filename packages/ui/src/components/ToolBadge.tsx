/**
 * Insignia que muestra una herramienta del Proveedor independiente.
 * Las herramientas son del Proveedor (taladro, escalera, llaves, etc.) y NO
 * son materiales (los materiales los compra el Cliente).
 */
export interface ToolBadgeProps {
  name: string;
  category?: string;
  /** Indica si la herramienta fue verificada por Proxi. */
  isVerified?: boolean;
}

export function ToolBadge({ name, category, isVerified = false }: ToolBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        borderRadius: 999,
        padding: '0.2rem 0.65rem',
        background: '#eef2ff',
        color: '#3730a3',
        fontSize: 12,
        fontWeight: 700,
      }}
      title={category ? `${name} · ${category}` : name}
    >
      <span aria-hidden>🛠️</span>
      {name}
      {category ? (
        <span style={{ fontWeight: 500, color: '#6366f1' }}>· {category}</span>
      ) : null}
      {isVerified ? <span aria-hidden title="Verificada">✅</span> : null}
    </span>
  );
}
