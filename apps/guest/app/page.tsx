'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Card } from '@ui/index';
import React from 'react';
import { TicketPurchaseFlow } from '../components/TicketPurchaseFlow';

const heroVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const highlightCards = [
  {
    title: 'Mis invitaciones',
    description: 'Consulta tus accesos personalizados, confirma asistencia y comparte con tus invitados.',
    href: '/events',
    cta: 'Explorar eventos',
  },
  {
    title: 'Crear un nuevo evento',
    description: 'Configura experiencias inmersivas en minutos con asistentes automáticos y plantillas listas.',
    href: '/create',
    cta: 'Comenzar ahora',
  },
  {
    title: 'Seguimiento de ventas',
    description: 'Analiza conversiones en tiempo real, recibe alertas y exporta reportes detallados.',
    href: '/sales',
    cta: 'Abrir panel',
  },
];

/**
 * Landing page for guests refreshed with the new design language.  Presents a
 * hero section, quick navigation cards, and a guided ticket purchase flow.
 */
export default function HomePage() {
  return (
    <div className="space-y-16">
      <motion.section
        className="glass-card overflow-hidden rounded-3xl border px-8 py-10 shadow-soft"
        variants={heroVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-6">
            <p className="badge">Experiencias en vivo</p>
            <h1 className="text-4xl font-bold text-[var(--color-text-strong)] sm:text-5xl">
              Gestiona y vive tus eventos con una experiencia premium
            </h1>
            <p className="text-lg leading-8 text-[var(--color-text)]">
              Monotickets rediseñó su interfaz para ofrecer flujos claros, modo oscuro inteligente y superficies de
              glassmorfia que mantienen todo organizado. Compra, comparte y analiza tus eventos sin fricción.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/ticket/demo">Ver un pase de muestra</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/feedback">Dejar feedback</Link>
              </Button>
            </div>
          </div>
          <div className="relative flex-1">
            <div className="absolute -top-12 -right-8 h-40 w-40 rounded-full bg-[rgba(75,163,255,0.18)] blur-3xl" aria-hidden />
            <div className="glass-popover relative z-10 flex flex-col gap-4 rounded-3xl px-6 py-6 text-left shadow-soft">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--color-text-muted)]">Resumen rápido</p>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-[var(--color-text-strong)]">+124k</span>
                <span className="text-sm text-[var(--color-text-muted)]">Entradas escaneadas en tiempo real</span>
              </div>
              <div className="grid gap-3 text-sm text-[var(--color-text)]">
                <p>• Eventos con confirmación instantánea por QR dinámico.</p>
                <p>• Panel responsivo con navegación lateral en escritorio y barra móvil.</p>
                <p>• Preferencias de modo guardadas automáticamente.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {highlightCards.map((card) => (
          <Card key={card.title} className="flex h-full flex-col gap-4 transition-base hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(75,163,255,0.28)]">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-[var(--color-text-strong)]">{card.title}</h3>
              <p className="text-sm leading-6 text-[var(--color-text)]">{card.description}</p>
            </div>
            <div className="mt-auto">
              <Link href={card.href} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] transition-base hover:text-[var(--color-accent-strong)]">
                {card.cta} <span aria-hidden>→</span>
              </Link>
            </div>
          </Card>
        ))}
      </section>

      <TicketPurchaseFlow />
    </div>
  );
}
