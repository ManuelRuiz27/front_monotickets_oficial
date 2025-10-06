'use client';
import { Card, Button, useToast } from '@ui/index';
import React from 'react';

/**
 * Reports page for the admin app.  Provides a simple call-to-action to
 * export attendance or confirmations as a PDF.
 */
export default function ReportsPage() {
  const { showToast } = useToast();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>
      <Card>
        <p>Descarga reportes de asistencia y confirmaciones.</p>
        <div className="mt-4">
          <Button onClick={() => showToast('Generando PDF...', 'info')}>Exportar PDF</Button>
        </div>
      </Card>
    </div>
  );
}
