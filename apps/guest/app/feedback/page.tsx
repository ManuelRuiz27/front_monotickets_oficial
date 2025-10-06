'use client';
import { FeedbackForm } from '../../components/FeedbackForm';
import { motion } from 'framer-motion';
import React from 'react';

/**
 * Post-event feedback page.  Wraps the feedback form in a motion
 * component for a smooth entrance animation.
 */
export default function FeedbackPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
      <FeedbackForm />
    </motion.div>
  );
}
