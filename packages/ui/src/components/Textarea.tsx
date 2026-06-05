import * as React from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ style, ...props }: TextareaProps) {
  return (
    <textarea
      style={{
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #d1d5db',
        borderRadius: 8,
        padding: '0.65rem 0.75rem',
        fontSize: 14,
        minHeight: 110,
        resize: 'vertical',
        ...style,
      }}
      {...props}
    />
  );
}
