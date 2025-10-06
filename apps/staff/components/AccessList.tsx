'use client';
import { CheckinRecord } from '../lib/idb';
import React from 'react';

type AccessListProps = {
  items: CheckinRecord[];
};

/**
 * Renders a table of local check-in records including gate and pass type.
 */
export const AccessList = React.memo(({ items }: AccessListProps) => {
  return (
    <div className="overflow-auto rounded-lg border border-white/10">
      <table className="min-w-full text-sm">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left px-3 py-2">Código</th>
            <th className="text-left px-3 py-2">Fecha/Hora</th>
            <th className="text-left px-3 py-2">Puerta</th>
            <th className="text-left px-3 py-2">Tipo Pase</th>
            <th className="text-left px-3 py-2">ID local</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-3 py-4 opacity-70">
                Sin registros
              </td>
            </tr>
          )}
          {items.map((it) => (
            <tr key={it.id} className="border-t border-white/5">
              <td className="px-3 py-2 font-mono">{it.code}</td>
              <td className="px-3 py-2">{new Date(it.ts).toLocaleString()}</td>
              <td className="px-3 py-2">{it.gate || '-'}</td>
              <td className="px-3 py-2">{it.passType || '-'}</td>
              <td className="px-3 py-2 text-xs opacity-70">{it.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

AccessList.displayName = 'AccessList';
