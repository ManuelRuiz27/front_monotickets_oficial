'use client';

import Link from 'next/link';
import { Card, Button } from '@ui/index';
import { motion } from 'framer-motion';
import React from 'react';

type Invite = {
  event_name: string;
  description: string;
  date: string;
  location: string;
};

type InviteCardProps = {
  invite: Invite;
};

const cardVariants = {
  initial: { opacity: 0, y: 28, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

/**
 * Component used to display event invitation details following the refreshed
 * Monotickets visual system.  Applies glassmorphism, subtle motion, and clear
 * action hierarchy for accessibility.
 */
export const InviteCard = React.memo(({ invite }: InviteCardProps) => (
  <motion.div variants={cardVariants} initial="initial" animate="animate">
    <Card className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-[var(--color-text-strong)]">{invite.event_name}</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{invite.location}</p>
        </div>
        <span className="badge">Invitación exclusiva</span>
      </header>
      <p className="text-base leading-7 text-[var(--color-text)]">{invite.description}</p>
      <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.05)] px-5 py-4">
        <p className="text-sm font-semibold text-[var(--color-text-strong)]">Fecha y hora</p>
        <p className="text-sm text-[var(--color-text-muted)]">{invite.date}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href="/rsvp">Confirmar asistencia</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/ticket/demo">Ver mi pase</Link>
        </Button>
      </div>
    </Card>
  </motion.div>
));

InviteCard.displayName = 'InviteCard';
