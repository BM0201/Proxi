'use client';

import * as React from 'react';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';

export interface FileUploadCardProps {
  title: string;
  description: string;
  accept?: string;
  actionLabel?: string;
  disabled?: boolean;
  onSelect?: (file: File) => void;
}

export function FileUploadCard({ title, description, accept, actionLabel = 'Seleccionar archivo', disabled, onSelect }: FileUploadCardProps) {
  const inputId = React.useId();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <input
          id={inputId}
          type="file"
          accept={accept}
          disabled={disabled}
          style={{ display: 'none' }}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onSelect?.(file);
          }}
        />
        <label htmlFor={inputId}>
          <Button type="button" variant="secondary" disabled={disabled}>
            {actionLabel}
          </Button>
        </label>
      </CardContent>
    </Card>
  );
}
