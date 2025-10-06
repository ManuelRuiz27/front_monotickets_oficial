import { InviteCard } from '../../../components/InviteCard';
import React from 'react';

/**
 * Server-rendered page that fetches invitation details based on a token.
 * The invitation is displayed inside a glass-styled card following the
 * refreshed UI guidelines.
 */
export default async function InvitePage({ params }: { params: { token: string } }) {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guest/invite/${params.token}`, {
    cache: 'no-store',
  }).then((response) => response.json());

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <p className="badge">Invitación digital</p>
        <h1 className="text-3xl font-semibold text-[var(--color-text-strong)]">Detalle del evento</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Comparte tu pase y confirma asistencia en segundos. Conservamos tu posición de scroll cuando regreses a la lista de eventos.
        </p>
      </header>
      <InviteCard invite={data} />
    </div>
  );
}
