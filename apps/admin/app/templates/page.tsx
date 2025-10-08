'use client';

import React, { useMemo, useState } from 'react';
import { Button, Card } from '@ui/index';

const templates = [
  {
    id: 'wedding',
    name: 'Boda elegante',
    colors: ['#F4E3E8', '#8A4F7D'],
    description: 'Ideal para bodas románticas con tipografías serif y detalles florales.',
  },
  {
    id: 'graduation',
    name: 'Graduación universitaria',
    colors: ['#121E48', '#F7B32B'],
    description: 'Diseño académico con bordes dorados y tipografía solemne.',
  },
  {
    id: 'corporate',
    name: 'Evento empresarial',
    colors: ['#0B1629', '#4BA3FF'],
    description: 'Paleta sobria con bloques de contenido para agenda y código de vestimenta.',
  },
];

/**
 * Biblioteca de plantillas y editor rápido para invitaciones personalizadas.
 */
export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [primaryColor, setPrimaryColor] = useState(selectedTemplate.colors[0]);
  const [accentColor, setAccentColor] = useState(selectedTemplate.colors[1]);
  const [logo, setLogo] = useState('https://res.cloudinary.com/demo/image/upload/monotickets-logo.svg');
  const [message, setMessage] = useState('Estamos felices de invitarte a vivir este momento con nosotros.');

  const previewStyle = useMemo(
    () => ({
      '--invite-primary': primaryColor,
      '--invite-accent': accentColor,
    }),
    [primaryColor, accentColor]
  ) as React.CSSProperties;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Plantillas de invitación</h1>
        <p className="text-sm text-slate-500">
          Elige un diseño, personaliza colores y logotipo, y visualiza la invitación en tiempo real.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.3fr,1fr]">
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Biblioteca de diseños</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  setSelectedTemplate(template);
                  setPrimaryColor(template.colors[0]);
                  setAccentColor(template.colors[1]);
                }}
                className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 ${
                  selectedTemplate.id === template.id ? 'border-[var(--color-accent)] shadow-lg' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {template.colors.map((color) => (
                    <span key={color} className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{template.name}</p>
                <p className="text-xs text-slate-500">{template.description}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Editor rápido</h2>
          <div className="grid gap-3">
            <label className="grid gap-1 text-sm text-slate-600">
              Color primario
              <input type="color" value={primaryColor} onChange={(event) => setPrimaryColor(event.target.value)} />
            </label>
            <label className="grid gap-1 text-sm text-slate-600">
              Color de acento
              <input type="color" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} />
            </label>
            <label className="grid gap-1 text-sm text-slate-600">
              Logotipo
              <input
                type="url"
                className="rounded-lg border border-slate-200 px-3 py-2"
                value={logo}
                onChange={(event) => setLogo(event.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-600">
              Mensaje
              <textarea
                className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>
          </div>
          <Button variant="secondary">Guardar como nueva plantilla</Button>
        </Card>
      </section>

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Vista previa en tiempo real</h2>
        <div
          className="relative grid gap-4 rounded-3xl bg-white/70 p-8 md:grid-cols-[1.4fr,1fr]"
          style={previewStyle}
        >
          <div className="space-y-4">
            <img src={logo} alt="Logotipo" className="h-12 w-auto" />
            <h3 className="text-3xl font-bold" style={{ color: primaryColor }}>
              {selectedTemplate.name}
            </h3>
            <p className="text-sm leading-6 text-slate-600">{message}</p>
            <div className="grid gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
              <span>Fecha • {new Date().toLocaleDateString('es-MX')}</span>
              <span>Lugar • Salón Principal</span>
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--invite-primary)]/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">QR Preview</p>
            <div className="mt-4 h-40 w-40 rounded-2xl border-4 border-dashed border-[var(--invite-accent)]" />
            <p className="mt-4 text-xs text-slate-500">
              Incluye botón “Agregar al Wallet” y descarga PDF automática.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
