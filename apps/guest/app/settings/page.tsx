'use client';

import React, { useState } from 'react';
import { Card, Button } from '@ui/index';
import { motion } from 'framer-motion';
import { useTheme } from '../../components/ThemeProvider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <p className="badge inline-flex">Ajustes</p>
        <h1 className="text-3xl font-semibold text-[var(--color-text-strong)]">Preferencias personalizadas</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Controla el modo, las notificaciones y la privacidad de tus eventos.
        </p>
      </header>
      <Card className="space-y-6">
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">Modo de visualización</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Elige cómo quieres ver Monotickets.</p>
            </div>
            <div className="flex gap-2">
              <Button variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => setTheme('light')}>
                Claro
              </Button>
              <Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => setTheme('dark')}>
                Oscuro
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">Notificaciones</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Recibe alertas cuando se vendan nuevas entradas.</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifications((prev) => !prev)}
              className={`relative inline-flex h-10 w-20 items-center rounded-full border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.05)] transition-base ${
                notifications ? 'ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[rgba(7,17,32,0.35)]' : ''
              }`}
              aria-pressed={notifications}
              aria-label="Alternar notificaciones"
            >
              <span
                className={`ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-[var(--color-text-strong)] transition-transform ${
                  notifications ? 'translate-x-8' : 'translate-x-0'
                }`}
              >
                {notifications ? 'On' : 'Off'}
              </span>
            </button>
          </div>
        </section>
        <div className="rounded-3xl border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.06)] px-5 py-4 text-sm text-[var(--color-text)]">
          Monotickets respeta tus decisiones. Guardamos tus preferencias de modo y notificaciones en tu dispositivo para que la experiencia se mantenga en cada inicio de sesión.
        </div>
      </Card>
    </motion.section>
  );
}
