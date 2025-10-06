'use client';

import { RSVPForm } from '../../components/RSVPForm';
import { motion } from 'framer-motion';
import React from 'react';

/**
 * Page for RSVP confirmation with glass surfaces and subtle entrance motion.
 */
export default function RSVPPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto max-w-xl space-y-6"
    >
      <header className="space-y-2 text-center">
        <p className="badge inline-flex">Confirma tu lugar</p>
        <h1 className="text-3xl font-semibold text-[var(--color-text-strong)]">RSVP</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Informa a los organizadores con un clic. Tu preferencia se sincroniza con tus invitaciones en cualquier dispositivo.
        </p>
      </header>
      <RSVPForm />
    </motion.section>
  );
}
