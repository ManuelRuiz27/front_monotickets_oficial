'use client';

import React from 'react';
import { UnifiedLoginForm } from '@ui/index';

/**
 * Login screen shared across the Monotickets suite.  In el contexto del
 * administrador de eventos dejamos seleccionado el rol de organizer pero
 * el usuario puede cambiar a Súper Admin o Staff según sus permisos.
 */
export default function LoginPage() {
  return (
    <UnifiedLoginForm
      defaultRole="organizer"
      redirects={{
        superadmin: process.env.NEXT_PUBLIC_SUPERADMIN_APP_URL?.concat('/') || 'http://localhost:3000/',
        organizer: '/dashboard',
        staff:
          process.env.NEXT_PUBLIC_STAFF_APP_URL?.concat('/scan') || 'http://localhost:3002/scan',
      }}
    />
  );
}
