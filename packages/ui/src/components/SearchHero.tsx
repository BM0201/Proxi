import * as React from 'react';

export interface SearchHeroProps {
  title: string;
  subtitle: string;
  placeholder: string;
  action?: React.ReactNode;
}

export function SearchHero({ title, subtitle, placeholder, action }: SearchHeroProps) {
  return (
    <section
      style={{
        borderRadius: 18,
        background: 'linear-gradient(135deg, #ecfdf5 0%, #f8fafc 55%, #ffffff 100%)',
        border: '1px solid #ccfbf1',
        padding: 'clamp(1.4rem, 4vw, 3rem)',
        display: 'grid',
        gap: 20,
      }}
    >
      <div>
        <span style={{ color: '#0f766e', fontWeight: 800 }}>Proxi</span>
        <h1 style={{ margin: '0.4rem 0 0', fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: 0 }}>
          {title}
        </h1>
        <p style={{ margin: '0.8rem 0 0', color: '#334155', fontSize: 20, lineHeight: 1.4 }}>{subtitle}</p>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          background: '#fff',
          border: '1px solid #99f6e4',
          borderRadius: 14,
          padding: 10,
          boxShadow: '0 18px 40px rgba(15, 118, 110, 0.12)',
        }}
      >
        <input
          aria-label={placeholder}
          placeholder={placeholder}
          style={{
            flex: '1 1 260px',
            border: 0,
            outline: 'none',
            padding: '0.9rem 1rem',
            fontSize: 17,
            minWidth: 0,
          }}
        />
        {action}
      </div>
    </section>
  );
}
