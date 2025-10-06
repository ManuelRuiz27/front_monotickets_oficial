'use client';
import { QRCodeCanvas } from 'qrcode.react';
import { Card, Button, useToast } from '@ui/index';
import React from 'react';

/**
 * Displays a QR code for a guest’s ticket along with options to download
 * or add it to a digital wallet.  The QR code library generates a
 * canvas-based QR that is easy to print or scan.
 */
export const TicketQR = ({ id }: { id: string }) => {
  const { showToast } = useToast();

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Tu Pase Digital 🎟️</h2>
      <div className="flex justify-center mb-4">
        <QRCodeCanvas value={id} size={200} />
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={() => window.print()}>Descargar PDF</Button>
        <Button variant="secondary" onClick={() => showToast('Próximamente...', 'info')}>
          Agregar al Wallet
        </Button>
      </div>
    </Card>
  );
};
