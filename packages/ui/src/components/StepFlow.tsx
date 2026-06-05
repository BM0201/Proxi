export interface StepFlowItem {
  title: string;
  description: string;
}

export interface StepFlowProps {
  steps: StepFlowItem[];
}

export function StepFlow({ steps }: StepFlowProps) {
  return (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
      {steps.map((step, index) => (
        <div
          key={step.title}
          style={{
            border: '1px solid #ccfbf1',
            background: '#f0fdfa',
            borderRadius: 12,
            padding: '1rem',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 999,
              background: '#0f766e',
              color: '#fff',
              fontWeight: 800,
              marginBottom: 10,
            }}
          >
            {index + 1}
          </span>
          <h3 style={{ margin: 0, fontSize: 16 }}>{step.title}</h3>
          <p style={{ margin: '0.35rem 0 0', color: '#475569', lineHeight: 1.45, fontSize: 14 }}>{step.description}</p>
        </div>
      ))}
    </div>
  );
}
