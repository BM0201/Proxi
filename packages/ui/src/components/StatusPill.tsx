export interface StatusPillProps {
  status: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  label: string;
}

const statusStyles: Record<StatusPillProps['status'], { background: string; color: string; border: string }> = {
  default: { background: '#eef2ff', color: '#4f46e5', border: '#c7d2fe' },
  success: { background: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  warning: { background: '#fffbeb', color: '#92400e', border: '#fde68a' },
  danger: { background: '#fef2f2', color: '#991b1b', border: '#fecaca' },
  info: { background: '#f0f9ff', color: '#075985', border: '#bae6fd' },
  neutral: { background: '#f9fafb', color: '#374151', border: '#e5e7eb' },
};

export function StatusPill({ status, label }: StatusPillProps) {
  const style = statusStyles[status];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: `1px solid ${style.border}`,
        borderRadius: 999,
        background: style.background,
        color: style.color,
        padding: '0.25rem 0.65rem',
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}
