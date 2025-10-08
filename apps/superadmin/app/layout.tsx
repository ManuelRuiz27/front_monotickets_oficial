import './globals.css';
import { tokens } from '@tokens/index';
import React from 'react';
import { Toast } from '@ui/index';

/**
 * Root layout for the Super Admin application.  Sets the HTML language to
 * Spanish and applies global font family and background color from our
 * design tokens.  A simple header and main layout provide a consistent
 * structure across all pages.
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
        <div className="min-h-screen flex flex-col">
          <header className="p-4 bg-primary text-white font-bold">Monotickets Súper Admin</header>
          <main className="flex-1 p-6">{children}</main>
        </div>
        <Toast />
      </body>
    </html>
  );
}
