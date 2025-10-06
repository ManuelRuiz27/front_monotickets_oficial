'use client';
import { Card, Button, useToast } from '@ui/index';
import { SuperAdminAPI } from '@api/monotickets-sdk';
import React, { useEffect, useState } from 'react';

/**
 * The default dashboard page for the Super Admin app.  It fetches the list
 * of administrators at build time using our API client.  The count of
 * administrators is displayed in a card along with a button to manage
 * administrators (placeholder interaction).  Errors are caught and an empty
 * array is used as a fallback.
 */
export default function Page() {
  const { showToast } = useToast();
  const [adminCount, setAdminCount] = useState(0);

  useEffect(() => {
    SuperAdminAPI.getAdmins()
      .then((res) => setAdminCount(res.data.length))
      .catch(() => setAdminCount(0));
  }, []);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Dashboard General</h1>
      <Card>
        <p>Total de administradores: {adminCount}</p>
        <Button onClick={() => showToast('Gestión de Admins pronto!', 'info')}>Ver Administradores</Button>
      </Card>
    </div>
  );
}