'use client';

import { useState } from 'react';
import { Button, Card, useToast } from '@ui/index';
import { api } from '@api/monotickets-sdk';
import confetti from 'canvas-confetti';
import React from 'react';

/**
 * A form that allows guests to confirm or decline attendance using the updated
 * visual language.  Success feedback includes confetti for positive responses.
 */
export const RSVPForm = () => {
  const [response, setResponse] = useState<'none' | 'yes' | 'no'>('none');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const sendRSVP = async (status: 'yes' | 'no') => {
    setLoading(true);
    try {
      await api.post('/guest/rsvp', { status });
      setResponse(status);
      if (status === 'yes') {
        confetti({ particleCount: 160, spread: 70, origin: { y: 0.7 } });
        showToast('¡Tu asistencia quedó confirmada! 🎟️', 'success');
      } else {
        showToast('Gracias por avisarnos, te esperaremos en la próxima.', 'info');
      }
    } catch {
      showToast('Error enviando RSVP', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (response !== 'none')
    return (
      <Card className="space-y-4 text-center">
        <h2 className="text-2xl font-semibold text-[var(--color-text-strong)]">
          {response === 'yes' ? '🎉 ¡Nos alegra verte allí!' : '😔 Lamentamos que no puedas asistir.'}
        </h2>
        <p className="text-sm leading-6 text-[var(--color-text)]">
          {response === 'yes'
            ? 'Te enviaremos tu pase digital y recomendaciones personalizadas en los próximos minutos.'
            : 'Tu lugar se liberará para otra persona interesada. ¡Gracias por hacérnoslo saber!'}
        </p>
        <Button variant="secondary" onClick={() => setResponse('none')}>
          Modificar mi respuesta
        </Button>
      </Card>
    );

  return (
    <Card className="space-y-6">
      <header className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-[var(--color-text-strong)]">Confirmar asistencia</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Cuéntanos si podremos contar contigo. Podrás actualizar tu respuesta cuando quieras.
        </p>
      </header>
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={() => sendRSVP('yes')} disabled={loading}>
          Asistiré
        </Button>
        <Button onClick={() => sendRSVP('no')} disabled={loading} variant="secondary">
          No podré ir
        </Button>
      </div>
    </Card>
  );
};
