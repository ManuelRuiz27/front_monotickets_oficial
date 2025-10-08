'use client';
import { useMemo, useState, useCallback } from 'react';
import { Card, Button } from '@ui/index';
import Papa from 'papaparse';
import React from 'react';
import { useToast } from '@ui/hooks/useToast';

type Guest = {
  name: string;
  email: string;
  passType: string;
  status: 'pendiente' | 'confirmado' | 'rechazado';
  sent?: boolean;
};

const PASS_TYPES = ['VIP', 'General', 'Backstage', 'Prensa'];
const STATUS_OPTIONS: Guest['status'][] = ['pendiente', 'confirmado', 'rechazado'];

/**
 * Gestión completa de invitados: permite importar listas, filtrar por tipo
 * de pase y estado RSVP, además de enviar y reenviar invitaciones
 * personalizadas.
 */
export const GuestTable = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filterPass, setFilterPass] = useState<string>('Todos');
  const [filterStatus, setFilterStatus] = useState<'Todos' | Guest['status']>('Todos');
  const [messagePreview, setMessagePreview] = useState('Hola {{nombre}}, tu pase ya está listo.');
  const { showToast } = useToast();

  const importCSV = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsed = (results.data as Partial<Guest>[]).map((row) => {
          const sentValue = row.sent as unknown;
          const sent =
            typeof sentValue === 'boolean'
              ? sentValue
              : typeof sentValue === 'string'
                ? sentValue.toLowerCase() === 'true'
                : false;

          return {
            name: row.name ?? 'Invitado',
            email: row.email ?? 'sin-correo@monotickets.com',
            passType: row.passType ?? 'General',
            status: (row.status as Guest['status']) ?? 'pendiente',
            sent,
          };
        });
        setGuests(parsed);
        showToast(`Importados ${parsed.length} invitados`, 'success');
      },
      error: () => showToast('No se pudo leer el archivo', 'error'),
    });
  }, [showToast]);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const passMatch = filterPass === 'Todos' || guest.passType === filterPass;
      const statusMatch = filterStatus === 'Todos' || guest.status === filterStatus;
      return passMatch && statusMatch;
    });
  }, [guests, filterPass, filterStatus]);

  const sendInvitations = (selectedGuests: Guest[]) => {
    if (selectedGuests.length === 0) {
      showToast('No hay invitados seleccionados', 'warning');
      return;
    }
    setGuests((current) =>
      current.map((guest) =>
        selectedGuests.some((selected) => selected.email === guest.email)
          ? { ...guest, sent: true }
          : guest
      )
    );
    showToast(`Invitaciones enviadas a ${selectedGuests.length} invitado(s)`, 'success');
  };

  const resend = (guest: Guest) => {
    showToast(`Reenvío programado para ${guest.email}`, 'info');
  };

  return (
    <Card className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Listado de invitados</h2>
          <p className="text-sm text-slate-500">Importa CSV/Excel, filtra por tipo de pase y envía invitaciones.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <label className="cursor-pointer font-semibold text-[var(--color-accent)]">
            Importar CSV / Excel
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={importCSV} aria-label="Importar invitados" />
          </label>
          <label className="flex items-center gap-2">
            Pase
            <select
              className="rounded-lg border border-slate-200 px-3 py-2"
              value={filterPass}
              onChange={(event) => setFilterPass(event.target.value)}
            >
              <option>Todos</option>
              {PASS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            Estado RSVP
            <select
              className="rounded-lg border border-slate-200 px-3 py-2"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value as typeof filterStatus)}
            >
              <option value="Todos">Todos</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <section className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <label className="grid gap-1">
          <span>Mensaje personalizado</span>
          <textarea
            className="min-h-[100px] rounded-lg border border-slate-200 px-3 py-2"
            value={messagePreview}
            onChange={(event) => setMessagePreview(event.target.value)}
          />
        </label>
        <div className="flex justify-between text-xs text-slate-500">
          <span>
            Usa variables como {'{{nombre}}'} y {'{{pase}}'} para personalizar.
          </span>
          <Button onClick={() => sendInvitations(filteredGuests)}>Enviar a filtrados</Button>
        </div>
      </section>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="p-2 font-semibold">Nombre</th>
              <th className="p-2 font-semibold">Correo</th>
              <th className="p-2 font-semibold">Pase</th>
              <th className="p-2 font-semibold">Estado RSVP</th>
              <th className="p-2 font-semibold">Invitación</th>
              <th className="p-2 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredGuests.map((guest) => (
              <tr key={guest.email}>
                <td className="p-2 font-medium text-slate-900">{guest.name}</td>
                <td className="p-2 text-slate-500">{guest.email}</td>
                <td className="p-2 text-slate-500">{guest.passType}</td>
                <td className="p-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      guest.status === 'confirmado'
                        ? 'bg-emerald-100 text-emerald-700'
                        : guest.status === 'rechazado'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {guest.status}
                  </span>
                </td>
                <td className="p-2 text-slate-500">{guest.sent ? 'Enviada' : 'Pendiente'}</td>
                <td className="p-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => sendInvitations([guest])}>
                      Enviar
                    </Button>
                    <Button variant="secondary" onClick={() => resend(guest)}>
                      Reenviar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-400">
                  No hay invitados con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
