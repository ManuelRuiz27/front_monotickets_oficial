'use client';
import { useState } from 'react';
import { Button, Card, useToast } from '@ui/index';
import { api } from '@api/monotickets-sdk';
import confetti from 'canvas-confetti';
import React from 'react';

/**
 * A form that allows guests to confirm or decline attendance.  Upon
 * submission it sends the response to the API and shows a success
 * message along with a confetti animation for positive responses.
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
      if (status === 'yes') confetti({ particleCount: 120, spread: 70 });
    } catch {
      showToast('Error enviando RSVP', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (response !== 'none')
    return (
      <Card>
        <h2 className="text-xl font-bold mb-2">
          {response === 'yes'
            ? '🎉 ¡Nos alegra verte allí!'
            : '😔 Lamentamos que no puedas asistir.'}
        </h2>
        <p>Gracias por responder tu invitación.</p>
      </Card>
    );

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Confirmar asistencia</h2>
      <div className="flex gap-4">
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
