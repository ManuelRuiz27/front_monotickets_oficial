'use client';
import { useMemo, useState } from 'react';
import { Button, Card } from '@ui/index';
import { useToast } from '@ui/hooks/useToast';
import React from 'react';
import Papa from 'papaparse';

type PassType = {
  id: string;
  name: string;
  price: number;
  benefits: string;
};

type GuestUpload = {
  filename: string;
  rows: number;
};

const steps = ['Datos básicos', 'Tipos de pase', 'Invitaciones', 'Publicación'];

/**
 * Asistente completo con cuatro pasos para crear eventos.  Cubre los
 * requisitos de datos básicos, definición de pases, carga de invitados y
 * publicación final con resumen y políticas.
 */
export const EventWizard = () => {
  const [step, setStep] = useState(0);
  const [basicData, setBasicData] = useState({
    name: '',
    date: '',
    venue: '',
    description: '',
    mapUrl: '',
  });
  const [passes, setPasses] = useState<PassType[]>([
    { id: crypto.randomUUID(), name: 'General', price: 0, benefits: 'Acceso general' },
  ]);
  const [guestUpload, setGuestUpload] = useState<GuestUpload | null>(null);
  const [invitationMessage, setInvitationMessage] = useState('¡Te esperamos para vivir una experiencia inolvidable!');
  const [scheduleAt, setScheduleAt] = useState('');
  const { showToast } = useToast();

  const handleNext = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handlePrevious = () => setStep((prev) => Math.max(prev - 1, 0));

  const updatePass = (id: string, key: keyof PassType, value: string | number) => {
    setPasses((current) => current.map((pass) => (pass.id === id ? { ...pass, [key]: value } : pass)));
  };

  const addPass = () => {
    setPasses((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: 'Nuevo pase',
        price: 0,
        benefits: 'Incluye acceso general',
      },
    ]);
  };

  const removePass = (id: string) => {
    setPasses((current) => (current.length <= 1 ? current : current.filter((pass) => pass.id !== id)));
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setGuestUpload({ filename: file.name, rows: results.data.length });
        showToast(`Archivo ${file.name} importado`, 'success');
      },
    });
  };

  const handlePublish = () => {
    showToast('Evento creado y publicado 🎉', 'success');
  };

  const embedsrc = useMemo(() => {
    if (basicData.mapUrl) return basicData.mapUrl;
    if (!basicData.venue) return '';
    return `https://www.google.com/maps/embed/v1/search?key=AIzaSyDemo&q=${encodeURIComponent(basicData.venue)}`;
  }, [basicData.mapUrl, basicData.venue]);

  return (
    <Card className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Nuevo evento</h2>
        <p className="text-sm text-slate-500">Sigue los pasos para publicar tu evento y notificar a los invitados.</p>
        <ol className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
          {steps.map((label, index) => (
            <li
              key={label}
              className={`rounded-full px-4 py-1 ${
                index === step ? 'bg-[var(--color-accent)] text-white' : 'bg-slate-100'
              }`}
            >
              Paso {index + 1}: {label}
            </li>
          ))}
        </ol>
      </header>

      {step === 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-600">
            <span>Nombre del evento</span>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2"
              value={basicData.name}
              onChange={(event) => setBasicData((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Conferencia Monotickets"
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-600">
            <span>Fecha</span>
            <input
              type="date"
              aria-label="date-input"
              className="rounded-lg border border-slate-200 px-3 py-2"
              value={basicData.date}
              onChange={(event) => setBasicData((prev) => ({ ...prev, date: event.target.value }))}
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-600 md:col-span-2">
            <span>Lugar / Venue</span>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2"
              value={basicData.venue}
              onChange={(event) => setBasicData((prev) => ({ ...prev, venue: event.target.value }))}
              placeholder="Centro Citibanamex"
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-600 md:col-span-2">
            <span>Descripción breve</span>
            <textarea
              className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2"
              value={basicData.description}
              onChange={(event) => setBasicData((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Comparte el propósito y agenda del evento"
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-600 md:col-span-2">
            <span>Mapa (URL personalizada opcional)</span>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2"
              value={basicData.mapUrl}
              onChange={(event) => setBasicData((prev) => ({ ...prev, mapUrl: event.target.value }))}
              placeholder="https://www.google.com/maps/embed..."
            />
          </label>
          {embedsrc && (
            <iframe
              className="md:col-span-2 h-64 w-full rounded-2xl border"
              src={embedsrc}
              loading="lazy"
              allowFullScreen
              title="Mapa del evento"
            />
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Define pases, precios y beneficios. Puedes agregar ilimitados tipos.</p>
          <div className="space-y-3">
            {passes.map((pass) => (
              <div key={pass.id} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1.5fr,1fr,1fr]">
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Nombre
                  <input
                    className="rounded-lg border border-slate-200 px-3 py-2"
                    value={pass.name}
                    onChange={(event) => updatePass(pass.id, 'name', event.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Precio
                  <input
                    type="number"
                    className="rounded-lg border border-slate-200 px-3 py-2"
                    value={pass.price}
                    onChange={(event) => updatePass(pass.id, 'price', Number(event.target.value))}
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:col-span-1">
                  Beneficios
                  <input
                    className="rounded-lg border border-slate-200 px-3 py-2"
                    value={pass.benefits}
                    onChange={(event) => updatePass(pass.id, 'benefits', event.target.value)}
                  />
                </label>
                <div className="md:col-span-3 flex justify-end">
                  <Button variant="secondary" onClick={() => removePass(pass.id)}>
                    Eliminar pase
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary" onClick={addPass}>
            + Agregar otro tipo de pase
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-600">Carga masiva de invitados</p>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--color-accent)]">
              <span className="underline">Importar CSV / Excel</span>
              <input type="file" accept=".csv,.xlsx" hidden onChange={handleFile} aria-label="Importar invitados" />
            </label>
            {guestUpload && (
              <p className="mt-2 text-xs text-slate-500">
                {guestUpload.filename} · {guestUpload.rows} registros listos para enviar.
              </p>
            )}
          </div>
          <label className="grid gap-1 text-sm text-slate-600">
            <span>Mensaje personalizado</span>
            <textarea
              className="min-h-[140px] rounded-lg border border-slate-200 px-3 py-2"
              value={invitationMessage}
              onChange={(event) => setInvitationMessage(event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-600">
            <span>Programar envío (opcional)</span>
            <input
              type="datetime-local"
              className="rounded-lg border border-slate-200 px-3 py-2"
              value={scheduleAt}
              onChange={(event) => setScheduleAt(event.target.value)}
            />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-4 md:grid-cols-[1.4fr,1fr]">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Resumen final</h3>
            <ul className="space-y-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <li>Evento: {basicData.name || '—'}</li>
              <li>Fecha: {basicData.date || '—'}</li>
              <li>Lugar: {basicData.venue || '—'}</li>
              <li>Descripción: {basicData.description || '—'}</li>
              <li>Pases configurados: {passes.length}</li>
              <li>{guestUpload ? `Archivo cargado: ${guestUpload.filename}` : 'Pendiente subir invitados.'}</li>
            </ul>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-600">Políticas</h3>
            <label className="flex items-start gap-2 text-xs text-slate-500">
              <input type="checkbox" className="mt-1" defaultChecked />
              Confirmo que la información y políticas de privacidad han sido revisadas.
            </label>
            <label className="flex items-start gap-2 text-xs text-slate-500">
              <input type="checkbox" className="mt-1" />
              Quiero habilitar QR dinámico para evitar duplicados.
            </label>
            <label className="flex items-start gap-2 text-xs text-slate-500">
              <input type="checkbox" className="mt-1" defaultChecked />
              Activar seguimiento de aforo en tiempo real.
            </label>
          </div>
        </div>
      )}

      <footer className="flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-500">
          Paso {step + 1} de {steps.length}. Puedes guardar borrador o continuar.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handlePrevious} disabled={step === 0}>
            Atrás
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={handleNext}>Siguiente</Button>
          ) : (
            <Button onClick={handlePublish}>Publicar evento</Button>
          )}
        </div>
      </footer>
    </Card>
  );
};
