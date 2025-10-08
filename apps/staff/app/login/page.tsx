'use client';

import React from 'react';
import { UnifiedLoginForm } from '@ui/index';

/**
 * El staff utiliza el mismo login unificado que el resto de la plataforma.
 * Se mantiene el modo oscuro global y el formulario acepta usuario + PIN
 * para operar en campo con dispositivos compartidos.
 */
export default function LoginPage() {
  return (
    <UnifiedLoginForm
      defaultRole="staff"
      redirects={{
        superadmin: process.env.NEXT_PUBLIC_SUPERADMIN_APP_URL?.concat('/') || 'http://localhost:3000/',
        organizer:
          process.env.NEXT_PUBLIC_ORGANIZER_APP_URL?.concat('/dashboard') || 'http://localhost:3001/dashboard',
        staff: '/scan',
      }}
    />
  );
}
