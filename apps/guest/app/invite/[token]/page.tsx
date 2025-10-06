import { InviteCard } from '../../../components/InviteCard';
import React from 'react';
import { env } from '@env/index';

/**
 * Server-rendered page that fetches invitation details based on a token
 * parameter from the URL.  It uses fetch to retrieve data from the API
 * without caching.
 */
export default async function InvitePage({ params }: { params: { token: string } }) {
  // SSR: Obtener datos del invitado desde API
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guest/invite/${params.token}`, {
    cache: 'no-store',
  }).then((r) => r.json());
  return (
    <div className="max-w-lg">
      <InviteCard invite={data} />
    </div>
  );
}
