'use client';

import React from 'react';
import { UnifiedLoginForm } from '@ui/index';

/**
 * Login page for the Súper Admin portal.  Reuses the unified login
 * experience so that admins, organizers and staff comparten un solo flujo
 * de autenticación.  Se fija el rol por defecto en Súper Admin y se
 * configuran redirecciones hacia los módulos oficiales.
 */
export default function LoginPage() {
  return (
    <UnifiedLoginForm
      defaultRole="superadmin"
      redirects={{
        superadmin: '/',
        organizer:
          process.env.NEXT_PUBLIC_ORGANIZER_APP_URL?.concat('/dashboard') || 'http://localhost:3001/dashboard',
        staff:
          process.env.NEXT_PUBLIC_STAFF_APP_URL?.concat('/scan') || 'http://localhost:3002/scan',
      }}
    />
  );
}
