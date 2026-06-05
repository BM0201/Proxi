import * as React from 'react';
import { EmptyState } from './EmptyState';

export interface SimpleTableProps {
  headers: string[];
  rows: React.ReactNode[][];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function SimpleTable({
  headers,
  rows,
  emptyTitle = 'Sin registros',
  emptyDescription = 'Todavia no hay elementos para mostrar.',
}: SimpleTableProps) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                style={{
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  background: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                  color: '#4b5563',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: 0,
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
