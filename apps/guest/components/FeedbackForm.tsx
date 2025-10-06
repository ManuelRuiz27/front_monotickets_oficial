'use client';

import { useState } from 'react';
import { Button, Card, useToast } from '@ui/index';
import { api } from '@api/monotickets-sdk';
import { motion } from 'framer-motion';
import React from 'react';

const ratings = [1, 2, 3, 4, 5];

/**
 * Collects feedback from event attendees.  Applies the new visual language with
 * glass surfaces, vivid accents, and improved accessibility states.
 */
export const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const submitFeedback = async () => {
    try {
      await api.post('/guest/feedback', { rating, message });
      setSent(true);
      showToast('¡Gracias por compartir tu experiencia! ✨', 'success');
    } catch {
      showToast('Error al enviar feedback ❌', 'error');
    }
  };

  if (sent)
    return (
      <motion.div initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Card className="space-y-3 text-center">
          <h2 className="text-2xl font-semibold text-[var(--color-text-strong)]">¡Gracias por tus comentarios! 💬</h2>
          <p className="text-sm leading-6 text-[var(--color-text)]">
            Tu opinión nos ayuda a diseñar experiencias inolvidables. Revisa tu correo para recibir sorpresas exclusivas.
          </p>
          <Button variant="secondary" onClick={() => setSent(false)}>
            Enviar otro comentario
          </Button>
        </Card>
      </motion.div>
    );

  return (
    <Card className="space-y-6">
      <header className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-[var(--color-text-strong)]">Feedback del evento</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Califica tu experiencia y cuéntanos qué podemos mejorar. ¡Todo feedback es bienvenido!
        </p>
      </header>
      <div className="flex items-center justify-center gap-2">
        {ratings.map((value) => {
          const active = value <= rating;
          return (
            <button
              key={value}
              onClick={() => setRating(value)}
              className={`transition-base text-3xl focus-visible:outline-none ${
                active ? 'text-[var(--color-accent-strong)] drop-shadow-[0_6px_18px_rgba(75,163,255,0.45)]' : 'text-[var(--color-text-muted)]'
              }`}
              aria-label={`${value} de 5 estrellas`}
              type="button"
            >
              ★
            </button>
          );
        })}
      </div>
      <label className="flex flex-col gap-3 text-sm font-medium text-[var(--color-text)]">
        Comentarios adicionales
        <textarea
          className="min-h-[120px] rounded-3xl border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.05)] px-5 py-4 text-[var(--color-text)] shadow-soft transition-base focus-visible:border-[var(--color-accent)]"
          rows={4}
          placeholder="Cuéntanos qué te gustó o qué podríamos mejorar..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-label="Comentario"
        />
      </label>
      <Button onClick={submitFeedback} disabled={rating === 0 || message.trim().length === 0}>
        Enviar opinión
      </Button>
    </Card>
  );
};
