import { GuestTable } from '../../components/GuestTable';
import React from 'react';

/**
 * Guests management page.  Renders the GuestTable component which allows
 * CSV import and displays a list of guests.
 */
export default function GuestsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Invitados</h1>
      <GuestTable />
    </div>
  );
}
