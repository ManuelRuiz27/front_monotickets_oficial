import './globals.css';
import React from 'react';
import { Toast } from '@ui/index';
import { ThemeProvider } from '../components/ThemeProvider';
import { AppShell } from '../components/AppShell';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className="antialiased"
        style={{
          fontFamily: 'var(--font-body)',
          backgroundColor: 'var(--color-background)',
        }}
      >
        <ThemeProvider>
          <AppShell>{children}</AppShell>
          <Toast />
        </ThemeProvider>
      </body>
    </html>
  );
}
