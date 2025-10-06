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

/**
 * Component used to display event invitation details.  It animates into
 * view and provides a call-to-action to confirm attendance via the
 * RSVP page.
 */
export const InviteCard = React.memo(({ invite }: InviteCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
  >
    <Card>
      <h2 className="text-2xl font-bold mb-2">{invite.event_name}</h2>
      <p className="text-gray-600 mb-2">{invite.description}</p>
      <p className="text-gray-800 mb-2">📅 {invite.date}</p>
      <p className="text-gray-800 mb-2">📍 {invite.location}</p>
      <div className="mt-4">
        <Link href="/rsvp">
          <Button>Confirmar Asistencia</Button>
        </Link>
      </div>
    </Card>
  </motion.div>
));

InviteCard.displayName = 'InviteCard';
