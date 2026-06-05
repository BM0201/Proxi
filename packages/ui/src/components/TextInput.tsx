import * as React from 'react';

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ style, ...props }: TextInputProps) {
  return (
    <input
      style={{
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #d1d5db',
        borderRadius: 8,
        padding: '0.65rem 0.75rem',
        fontSize: 14,
        ...style,
      }}
      {...props}
    />
  );
}
