import SearchGuest from '../../components/SearchGuest';
import React from 'react';

/**
 * Lookup page allows staff to search for guests by name and see if they
 * have checked in.
 */
export default function LookupPage() {
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Consulta de invitados</h1>
      <SearchGuest />
    </div>
  );
}
