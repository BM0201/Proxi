import * as React from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export function Select({ options, style, ...props }: SelectProps) {
  return (
    <select
      style={{
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #d1d5db',
        borderRadius: 8,
        padding: '0.65rem 0.75rem',
        fontSize: 14,
        background: '#fff',
        ...style,
      }}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
