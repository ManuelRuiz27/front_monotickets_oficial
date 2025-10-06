'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Card, useToast } from '@ui/index';
import { usePreserveScroll } from '@hooks/usePreserveScroll';

type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  tags: string[];
};

type Buyer = {
  name: string;
  email: string;
};

const events: Event[] = [
  {
    id: 'mtk-aurora',
    name: 'Aurora Sessions',
    date: '15 de noviembre • 20:00 hrs',
    location: 'Auditorio Metropolitano, CDMX',
    description: 'Una noche inmersiva con visuales envolventes y música electrónica downtempo.',
    tags: ['Experiencia 360°', 'Aforo limitado'],
  },
  {
    id: 'mtk-summit',
    name: 'Summit Creativo 2024',
    date: '23 de noviembre • 09:00 hrs',
    location: 'Centro de Innovación, Guadalajara',
    description: 'Charlas, talleres y networking para mentes creativas y líderes de la industria.',
    tags: ['Day pass', 'Networking'],
  },
  {
    id: 'mtk-classics',
    name: 'Noches Clásicas',
    date: '8 de diciembre • 19:30 hrs',
    location: 'Teatro Degollado, Guadalajara',
    description: 'La filarmónica interpreta piezas icónicas en un formato íntimo y multisensorial.',
    tags: ['VIP disponibles', 'Accesibilidad total'],
  },
];

const stepTitles = ['Selecciona un evento', 'Elige tus entradas', 'Datos del comprador', 'Confirma y paga'];

const stepVariants = {
  initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -24, filter: 'blur(8px)', transition: { duration: 0.3, ease: 'easeIn' } },
};

export const TicketPurchaseFlow = () => {
  usePreserveScroll('guest-events');
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ticketCount, setTicketCount] = useState(2);
  const [buyer, setBuyer] = useState<Buyer>({ name: '', email: '' });
  const [processing, setProcessing] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  const total = useMemo(() => ticketCount * 650, [ticketCount]);

  const goNext = () => setStep((current) => Math.min(current + 1, stepTitles.length - 1));
  const goPrev = () => setStep((current) => Math.max(current - 1, 0));

  const resetFlow = () => {
    setStep(0);
    setSelectedEvent(null);
    setTicketCount(2);
    setBuyer({ name: '', email: '' });
    setConfirmationId(null);
    setProcessing(false);
  };

  const handlePurchase = async () => {
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    const confirmation = `MTK-${Math.floor(Math.random() * 899999 + 100000)}`;
    setConfirmationId(confirmation);
    showToast('🎉 Compra confirmada. Revisa tu correo con los detalles.', 'success');
    setProcessing(false);
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3">
        <p className="badge w-fit">Flujo guiado</p>
        <h2>{stepTitles[step]}</h2>
        <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">
          Simplificamos el proceso para que no pierdas el enfoque: selecciona tu experiencia, confirma tus entradas y realiza el pago
          en menos de un minuto.
        </p>
      </header>

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stepTitles.map((title, index) => {
          const active = index === step;
          const completed = index < step;
          return (
            <li
              key={title}
              className={`glass-card flex flex-col gap-1 rounded-2xl border px-4 py-3 text-xs font-semibold transition-base ${
                active
                  ? 'border-[var(--color-accent)] text-[var(--color-text-strong)]'
                  : completed
                    ? 'border-transparent text-[var(--color-text-muted)] opacity-80'
                    : 'border-transparent text-[var(--color-text-muted)] opacity-70'
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)]">Paso {index + 1}</span>
              <span className="text-sm">{title}</span>
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div key={step} variants={stepVariants} initial="initial" animate="animate" exit="exit">
          {step === 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => {
                const active = selectedEvent?.id === event.id;
                return (
                  <Card
                    key={event.id}
                    className={`h-full cursor-pointer border-2 transition-base hover:border-[var(--color-accent)] hover:shadow-[0_20px_45px_rgba(75,163,255,0.35)] ${
                      active ? 'border-[var(--color-accent)] text-[var(--color-text-strong)]' : 'border-transparent'
                    }`}
                    component="article"
                    onClick={() => {
                      setSelectedEvent(event);
                      setStep(1);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(eventKey) => {
                      if (eventKey.key === 'Enter' || eventKey.key === ' ') {
                        eventKey.preventDefault();
                        setSelectedEvent(event);
                        setStep(1);
                      }
                    }}
                    aria-pressed={active}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{event.name}</h3>
                      <span className="badge text-[10px]">{event.tags[0]}</span>
                    </div>
                    <p className="mt-3 text-sm text-[var(--color-text-muted)]">{event.description}</p>
                    <dl className="mt-6 space-y-2 text-sm">
                      <div className="flex items-center gap-3">
                        <span aria-hidden>📅</span>
                        <div>
                          <dt className="sr-only">Fecha</dt>
                          <dd>{event.date}</dd>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span aria-hidden>📍</span>
                        <div>
                          <dt className="sr-only">Ubicación</dt>
                          <dd>{event.location}</dd>
                        </div>
                      </div>
                    </dl>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-[rgba(75,163,255,0.18)] px-3 py-1 text-xs text-[var(--color-text-strong)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {step === 1 && selectedEvent && (
            <Card className="space-y-6">
              <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">{selectedEvent.location}</p>
                  <h3 className="text-2xl font-semibold">{selectedEvent.name}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{selectedEvent.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--color-text-muted)]">Precio por entrada</p>
                  <p className="text-2xl font-semibold text-[var(--color-text-strong)]">$650 MXN</p>
                </div>
              </header>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-3 text-sm font-medium text-[var(--color-text)]">
                  Cantidad
                  <div className="flex items-center rounded-full border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.05)] shadow-soft">
                    <button
                      type="button"
                      onClick={() => setTicketCount((count) => Math.max(1, count - 1))}
                      className="h-10 w-10 text-lg text-[var(--color-text)] transition-base hover:text-[var(--color-text-strong)]"
                      aria-label="Disminuir cantidad"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-base font-semibold text-[var(--color-text-strong)]">{ticketCount}</span>
                    <button
                      type="button"
                      onClick={() => setTicketCount((count) => Math.min(10, count + 1))}
                      className="h-10 w-10 text-lg text-[var(--color-text)] transition-base hover:text-[var(--color-text-strong)]"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </label>
                <p className="text-sm text-[var(--color-text-muted)]">Máximo 10 entradas por compra.</p>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border-soft)] bg-[rgba(75,163,255,0.08)] px-5 py-4 text-sm">
                <div>
                  <p className="font-semibold text-[var(--color-text-strong)]">Total estimado</p>
                  <p className="text-[var(--color-text-muted)]">Incluye cargos por servicio e IVA.</p>
                </div>
                <p className="text-2xl font-semibold text-[var(--color-text-strong)]">${total.toLocaleString('es-MX')} MXN</p>
              </div>

              <div className="flex flex-wrap justify-between gap-3">
                <Button variant="secondary" onClick={goPrev}>
                  Volver a eventos
                </Button>
                <Button onClick={goNext}>
                  Continuar con mis entradas
                </Button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="space-y-5">
              <header className="space-y-1">
                <h3 className="text-2xl font-semibold">Datos del comprador</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Estos datos se utilizarán para enviar las entradas y notificaciones importantes.
                </p>
              </header>
              <form className="grid gap-5 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Nombre completo
                  <input
                    type="text"
                    required
                    value={buyer.name}
                    onChange={(event) => setBuyer((prev) => ({ ...prev, name: event.target.value }))}
                    className="rounded-2xl border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.06)] px-4 py-3 text-[var(--color-text)] shadow-soft transition-base focus-visible:border-[var(--color-accent)]"
                    placeholder="Ej. Alex Martínez"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Correo electrónico
                  <input
                    type="email"
                    required
                    value={buyer.email}
                    onChange={(event) => setBuyer((prev) => ({ ...prev, email: event.target.value }))}
                    className="rounded-2xl border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.06)] px-4 py-3 text-[var(--color-text)] shadow-soft transition-base focus-visible:border-[var(--color-accent)]"
                    placeholder="tucorreo@email.com"
                  />
                </label>
              </form>
              <div className="flex flex-wrap justify-between gap-3">
                <Button variant="secondary" onClick={goPrev}>
                  Volver
                </Button>
                <Button onClick={() => goNext()} disabled={!buyer.name || !buyer.email}>
                  Revisar y pagar
                </Button>
              </div>
            </Card>
          )}

          {step === 3 && selectedEvent && (
            <Card className="space-y-6">
              <header className="space-y-2">
                <h3 className="text-2xl font-semibold text-[var(--color-text-strong)]">Confirma tu compra</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Revisa que los datos sean correctos antes de confirmar y realizar el pago seguro.
                </p>
              </header>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.05)] p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">Evento</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--color-text-strong)]">{selectedEvent.name}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{selectedEvent.date}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{selectedEvent.location}</p>
                </div>
                <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.05)] p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">Entradas</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--color-text-strong)]">{ticketCount} {ticketCount === 1 ? 'boleto' : 'boletos'}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Total a pagar: ${total.toLocaleString('es-MX')} MXN</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Comprador: {buyer.name}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Contacto: {buyer.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-between gap-3">
                <Button variant="secondary" onClick={goPrev}>
                  Editar datos
                </Button>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={resetFlow}>
                    Reiniciar
                  </Button>
                  <Button onClick={handlePurchase} disabled={processing}>
                    {processing ? 'Procesando...' : 'Confirmar y pagar' }
                  </Button>
                </div>
              </div>
              {confirmationId && (
                <div className="rounded-3xl border border-[var(--color-border-soft)] bg-[rgba(75,163,255,0.12)] px-5 py-4 text-sm text-[var(--color-text-strong)]">
                  <p className="font-semibold">Código de confirmación: {confirmationId}</p>
                  <p className="text-[var(--color-text-muted)]">
                    Recibirás tus boletos digitales y factura en los próximos minutos. ¡Gracias por confiar en Monotickets!
                  </p>
                </div>
              )}
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
