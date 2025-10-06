'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { Card, Button, useToast } from '@ui/index';
import React from 'react';

/**
 * Displays a QR code for a guest’s ticket with elevated glass styling and
 * accessible controls for download and wallet actions.
 */
export const TicketQR = ({ id }: { id: string }) => {
  const { showToast } = useToast();

  return (
    <Card className="space-y-6 text-center">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-[var(--color-text-strong)]">Tu pase digital 🎟️</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Muestra este código en la entrada o guárdalo en tu wallet favorito para un acceso más rápido.
        </p>
      </header>
      <div className="mx-auto inline-flex rounded-3xl border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.08)] p-6 shadow-soft">
        <QRCodeCanvas
          value={id}
          size={220}
          includeMargin
          bgColor="rgba(255,255,255,0)"
          fgColor="#4BA3FF"
          aria-label="Código QR de tu ticket"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={() => window.print()}>Descargar PDF</Button>
        <Button
          variant="secondary"
          onClick={() => showToast('Pronto podrás agregar tus pases a Apple/Google Wallet.', 'info')}
        >
          Agregar al Wallet
        </Button>
      </div>
    </Card>
  );
};
