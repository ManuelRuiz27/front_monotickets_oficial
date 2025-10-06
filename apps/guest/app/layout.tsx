import './globals.css';
import { tokens } from '@tokens/index';
import React from 'react';
import { Toast } from '@ui/index';

/**
 * Root layout for the guest application.  Centers the content on the page
 * and applies a minimum height to fill the viewport.  Global fonts and
 * background colors are pulled from the design tokens.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: tokens.typography.fontFamily,
          backgroundColor: tokens.colors.background,
        }}
        className="min-h-screen flex flex-col items-center justify-center p-6"
      >
        {children}
      </body>
    </html>
  );
}
