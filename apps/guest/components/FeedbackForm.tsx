'use client';
import { useState } from 'react';
import { Button, Card, useToast } from '@ui/index';
import { api } from '@api/monotickets-sdk';
import { motion } from 'framer-motion';
import React from 'react';

/**
 * Collects feedback from event attendees.  Allows users to rate the
 * event from 1–5 stars and submit a text comment.  After submission
 * it displays a thank-you message.
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
    } catch {
      showToast('Error al enviar feedback ❌', 'error');
    }
  };

  if (sent)
    return (
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
        <Card>
          <h2 className="text-xl font-bold mb-2">¡Gracias por tus comentarios! 💬</h2>
          <p>Tu opinión nos ayuda a mejorar futuras experiencias.</p>
        </Card>
      </motion.div>
    );

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Feedback del evento</h2>
      <div className="flex gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => setRating(i)}
            className={`text-2xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            aria-label={`${i} star rating`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="w-full border p-2 rounded mb-3"
        rows={3}
        placeholder="Escribe tu comentario..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={submitFeedback}>Enviar</Button>
    </Card>
  );
};
