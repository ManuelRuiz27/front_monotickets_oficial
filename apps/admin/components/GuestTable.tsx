'use client';
import { useState, useCallback } from 'react';
import { Card, Button } from '@ui/index';
import Papa from 'papaparse';
import React from 'react';

type Guest = {
  name: string;
  email: string;
};

/**
 * Displays a list of guests and allows importing them from a CSV file.
 * Uses the papaparse library to parse CSVs client-side.
 */
export const GuestTable = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const importCSV = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => setGuests(results.data as Guest[]),
    });
  }, []);
  return (
    <Card>
      <div className="flex justify-between mb-3">
        <label className="cursor-pointer text-blue-600">
          Importar CSV
          <input type="file" accept=".csv" className="hidden" onChange={importCSV} />
        </label>
        <Button>Enviar Invitaciones</Button>
      </div>
      <table className="w-full border-t border-gray-200">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="p-2">Nombre</th>
            <th className="p-2">Correo</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.email} className="border-t">
              <td className="p-2">{g.name}</td>
              <td className="p-2">{g.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
