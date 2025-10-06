'use client';
import { RSVPForm } from '../../components/RSVPForm';
import { motion } from 'framer-motion';
import React from 'react';

/**
 * Page for RSVP confirmation.  Wraps the form in a motion component for
 * subtle entrance animation.
 */
export default function RSVPPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
      <RSVPForm />
    </motion.div>
  );
}
