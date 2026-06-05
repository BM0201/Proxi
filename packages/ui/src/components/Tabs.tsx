export interface TabItem {
  label: string;
  value: string;
}

export interface TabsProps {
  items: TabItem[];
  activeValue: string;
}

export function Tabs({ items, activeValue }: TabsProps) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e5e7eb', overflowX: 'auto' }}>
      {items.map((item) => {
        const active = item.value === activeValue;

        return (
          <button
            key={item.value}
            type="button"
            style={{
              border: 0,
              borderBottom: `2px solid ${active ? '#4f46e5' : 'transparent'}`,
              background: 'transparent',
              color: active ? '#4f46e5' : '#6b7280',
              padding: '0.75rem 0.9rem',
              fontWeight: 700,
              cursor: 'default',
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
