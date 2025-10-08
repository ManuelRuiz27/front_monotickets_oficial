import './globals.css';
import { tokens } from '@tokens/index';
import React from 'react';
import Link from 'next/link';
import { Toast } from '@ui/index';

/**
 * Root layout for the Admin application.  It defines the main shell with
 * a sidebar containing navigation links and a main area where pages are
 * rendered.  The global styles are imported and design tokens are used
 * for typography and background colors.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: tokens.typography.bodyFont,
          backgroundColor: tokens.colors.background,
        }}
      >
        <div className="flex min-h-screen">
          <aside className="w-64 bg-primary text-white p-4">
            <h1 className="text-2xl font-bold mb-6">Monotickets</h1>
            <nav className="flex flex-col gap-3">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/events" className="hover:underline">
                Eventos
              </Link>
              <Link href="/guests" className="hover:underline">
                Invitados
              </Link>
              <Link href="/templates" className="hover:underline">
                Plantillas
              </Link>
              <Link href="/checkin" className="hover:underline">
                Check-in Live
              </Link>
              <Link href="/credits" className="hover:underline">
                Créditos
              </Link>
              <Link href="/reports" className="hover:underline">
                Reportes
              </Link>
            </nav>
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
        <Toast />
      </body>
    </html>
  );
}
