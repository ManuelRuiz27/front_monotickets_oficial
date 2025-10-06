'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Card } from '@ui/index';
import React from 'react';

/**
 * Landing page for guests.  Provides a welcoming message and asks the
 * visitor to enter their unique invitation token.  Uses a placeholder
 * token in the link for demonstration.
 */
export default function HomePage() {
  return (
    <motion.div
      className="max-w-md text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <h1 className="text-2xl font-bold mb-3">🎉 Bienvenido a Monotickets</h1>
        <p className="text-gray-600 mb-6">
          Si recibiste una invitación, introduce tu token único para acceder.
        </p>
        <Link href="/invite/abc123">
          <Button>Ver mi invitación</Button>
        </Link>
      </Card>
    </motion.div>
  );
}
