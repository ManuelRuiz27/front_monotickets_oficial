import { TicketQR } from '../../../components/TicketQR';
import React from 'react';

/**
 * Ticket page that displays a QR code for a given ticket ID.  The
 * TicketQR component handles rendering the QR code and actions for
 * downloading or adding to a wallet.
 */
export default function TicketPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-md">
      <TicketQR id={params.id} />
    </div>
  );
}
