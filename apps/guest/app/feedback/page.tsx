'use client';

import { FeedbackForm } from '../../components/FeedbackForm';
import { motion } from 'framer-motion';
import React from 'react';

/**
 * Post-event feedback page with refreshed styling.
 */
export default function FeedbackPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <header className="space-y-2 text-center">
        <p className="badge inline-flex">Queremos escucharte</p>
        <h1 className="text-3xl font-semibold text-[var(--color-text-strong)]">Feedback</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Envía tus comentarios y ayuda a optimizar la experiencia completa de Monotickets.
        </p>
      </header>
      <FeedbackForm />
    </motion.section>
  );
}
