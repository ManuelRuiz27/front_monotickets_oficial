'use client';

import React, { useMemo, useState } from 'react';
import { Button, Card } from '@ui/index';
import { useToast } from '@ui/hooks/useToast';
import { formatCurrency, sleep } from '@utils/index';
import { SuperAdminAPI } from '@api/monotickets-sdk';

type AdminEvent = {
  id: string;
  name: string;
  status: 'Borrador' | 'Publicado' | 'Archivado';
  startDate: string;
  invitations: number;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  creditLimit: number;
  assignedCredits: number;
  permissions: string[];
  events: AdminEvent[];
};

type CreditMovement = {
  id: string;
  adminId: string;
  adminName: string;
  type: 'Asignación' | 'Retiro';
  amount: number;
  reason: string;
  at: string;
};

type GlobalSettings = {
  brandColor: string;
  accentColor: string;
  logoUrl: string;
  faviconUrl: string;
  maxEvents: number;
  tokenDurationHours: number;
  invitationPolicy: string;
};

const initialAdmins: AdminUser[] = [
  {
    id: 'admin-001',
    name: 'Laura Méndez',
    email: 'laura@monotickets.com',
    status: 'active',
    creditLimit: 10000,
    assignedCredits: 8200,
    permissions: ['Dashboard', 'Eventos', 'Créditos'],
    events: [
      { id: 'evt-1', name: 'Summit Tecnológico 2024', status: 'Publicado', startDate: '2024-11-02', invitations: 1800 },
      { id: 'evt-2', name: 'Fiesta Corporativa Lumen', status: 'Borrador', startDate: '2024-12-15', invitations: 450 },
    ],
  },
  {
    id: 'admin-002',
    name: 'Carlos Vega',
    email: 'c.vega@monotickets.com',
    status: 'active',
    creditLimit: 5000,
    assignedCredits: 2100,
    permissions: ['Dashboard', 'Plantillas'],
    events: [
      { id: 'evt-3', name: 'Graduación ULSA', status: 'Publicado', startDate: '2024-10-28', invitations: 950 },
    ],
  },
  {
    id: 'admin-003',
    name: 'Mariana Ortiz',
    email: 'mariana.ortiz@monotickets.com',
    status: 'inactive',
    creditLimit: 3000,
    assignedCredits: 0,
    permissions: ['Dashboard'],
    events: [],
  },
];

const initialMovements: CreditMovement[] = [
  {
    id: 'mov-1',
    adminId: 'admin-001',
    adminName: 'Laura Méndez',
    type: 'Asignación',
    amount: 2000,
    reason: 'Lanzamiento Summit',
    at: '2024-09-12T10:15:00Z',
  },
  {
    id: 'mov-2',
    adminId: 'admin-002',
    adminName: 'Carlos Vega',
    type: 'Retiro',
    amount: 400,
    reason: 'Ajuste de invitaciones',
    at: '2024-09-10T18:24:00Z',
  },
];

const defaultSettings: GlobalSettings = {
  brandColor: '#081226',
  accentColor: '#4BA3FF',
  logoUrl: 'https://res.cloudinary.com/demo/image/upload/monotickets-logo.svg',
  faviconUrl: 'https://res.cloudinary.com/demo/image/upload/monotickets-favicon.png',
  maxEvents: 250,
  tokenDurationHours: 24,
  invitationPolicy: 'Los tokens expiran en 24 horas y los QR se regeneran automáticamente.',
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));

export function SuperAdminDashboard() {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [movements, setMovements] = useState<CreditMovement[]>(initialMovements);
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [formState, setFormState] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    creditLimit: 3000,
    permissions: ['Dashboard'],
  });
  const [creditsForm, setCreditsForm] = useState({ adminId: admins[0].id, amount: 500, reason: '' });
  const { showToast } = useToast();

  const metrics = useMemo(() => {
    const activeAdmins = admins.filter((admin) => admin.status === 'active').length;
    const totalEvents = admins.reduce((acc, admin) => acc + admin.events.length, 0);
    const publishedEvents = admins.reduce(
      (acc, admin) => acc + admin.events.filter((event) => event.status === 'Publicado').length,
      0
    );
    const totalInvitations = admins.reduce(
      (acc, admin) => acc + admin.events.reduce((sum, event) => sum + event.invitations, 0),
      0
    );
    return {
      activeAdmins,
      totalEvents,
      publishedEvents,
      totalInvitations,
    };
  }, [admins]);

  const creditStats = useMemo(() => {
    const totalAssigned = admins.reduce((acc, admin) => acc + admin.assignedCredits, 0);
    const totalLimit = admins.reduce((acc, admin) => acc + admin.creditLimit, 0);
    const usage = totalLimit === 0 ? 0 : Math.round((totalAssigned / totalLimit) * 100);
    const byAdmin = admins.map((admin) => ({
      name: admin.name,
      assigned: admin.assignedCredits,
      remaining: admin.creditLimit - admin.assignedCredits,
    }));
    return { totalAssigned, totalLimit, usage, byAdmin };
  }, [admins]);

  const handleAdminInput = (key: keyof AdminUser, value: string | number | string[]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormState({ name: '', email: '', creditLimit: 3000, permissions: ['Dashboard'] });
    setEditingAdmin(null);
  };

  const persistAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.name || !formState.email) {
      showToast('Nombre y correo son obligatorios.', 'warning');
      return;
    }
    const payload = {
      ...formState,
      permissions: formState.permissions || ['Dashboard'],
    } as AdminUser;
    try {
      await SuperAdminAPI.getAdmins(); // dummy call to illustrate reuse del SDK
    } catch {
      // Ignoramos errores porque en modo demo no existe backend
    }
    await sleep(400);
    setAdmins((prev) => {
      if (editingAdmin) {
        return prev.map((admin) => (admin.id === editingAdmin.id ? { ...admin, ...payload } : admin));
      }
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: payload.name,
          email: payload.email,
          status: 'active',
          creditLimit: payload.creditLimit,
          assignedCredits: payload.assignedCredits ?? 0,
          permissions: payload.permissions,
          events: [],
        },
      ];
    });
    showToast(editingAdmin ? 'Administrador actualizado ✅' : 'Administrador creado ✅', 'success');
    resetForm();
  };

  const toggleStatus = (admin: AdminUser) => {
    setAdmins((prev) =>
      prev.map((item) =>
        item.id === admin.id
          ? {
              ...item,
              status: item.status === 'active' ? 'inactive' : 'active',
            }
          : item
      )
    );
    showToast(`Administrador ${admin.status === 'active' ? 'desactivado' : 'reactivado'}`, 'info');
  };

  const handleCredits = async (event: React.FormEvent) => {
    event.preventDefault();
    const admin = admins.find((item) => item.id === creditsForm.adminId);
    if (!admin) return;
    const isWithdraw = creditsForm.amount < 0;
    const absoluteAmount = Math.abs(creditsForm.amount);
    if (absoluteAmount === 0) {
      showToast('El monto debe ser distinto de cero.', 'warning');
      return;
    }
    await SuperAdminAPI.assignCredits({
      adminId: admin.id,
      amount: creditsForm.amount,
      reason: creditsForm.reason,
    });
    setAdmins((prev) =>
      prev.map((item) =>
        item.id === admin.id
          ? {
              ...item,
              assignedCredits: Math.max(item.assignedCredits + creditsForm.amount, 0),
            }
          : item
      )
    );
    setMovements((prev) => [
      {
        id: crypto.randomUUID(),
        adminId: admin.id,
        adminName: admin.name,
        type: isWithdraw ? 'Retiro' : 'Asignación',
        amount: absoluteAmount,
        reason: creditsForm.reason || (isWithdraw ? 'Ajuste manual' : 'Recarga manual'),
        at: new Date().toISOString(),
      },
      ...prev,
    ]);
    showToast(isWithdraw ? 'Créditos retirados' : 'Créditos asignados', 'success');
    setCreditsForm((prev) => ({ ...prev, amount: 500, reason: '' }));
  };

  const handleSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    await SuperAdminAPI.updateSettings(settings);
    showToast('Configuración global guardada', 'success');
  };

  return (
    <div className="space-y-10">
      <section className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Eventos activos</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{metrics.publishedEvents}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Administradores</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{metrics.activeAdmins}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Invitaciones totales</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{metrics.totalInvitations.toLocaleString('es-MX')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Eventos totales</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{metrics.totalEvents}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
        <Card className="space-y-6">
          <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Gestión de administradores</h2>
              <p className="text-sm text-slate-500">Crea, edita, asigna permisos y visualiza eventos asociados.</p>
            </div>
            <Button onClick={resetForm} variant="secondary">
              Limpiar formulario
            </Button>
          </header>
          <form onSubmit={persistAdmin} className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1">
                <span>Nombre</span>
                <input
                  className="rounded-lg border border-slate-200 px-3 py-2"
                  value={formState.name || ''}
                  onChange={(event) => handleAdminInput('name', event.target.value)}
                  required
                />
              </label>
              <label className="grid gap-1">
                <span>Correo</span>
                <input
                  className="rounded-lg border border-slate-200 px-3 py-2"
                  type="email"
                  value={formState.email || ''}
                  onChange={(event) => handleAdminInput('email', event.target.value)}
                  required
                />
              </label>
              <label className="grid gap-1">
                <span>Límite de créditos</span>
                <input
                  className="rounded-lg border border-slate-200 px-3 py-2"
                  type="number"
                  min={0}
                  value={formState.creditLimit || 0}
                  onChange={(event) => handleAdminInput('creditLimit', Number(event.target.value))}
                />
              </label>
              <label className="grid gap-1">
                <span>Permisos</span>
                <select
                  multiple
                  className="h-24 rounded-lg border border-slate-200 px-3 py-2"
                  value={formState.permissions as string[]}
                  onChange={(event) =>
                    handleAdminInput(
                      'permissions',
                      Array.from(event.target.selectedOptions).map((option) => option.value)
                    )
                  }
                >
                  <option value="Dashboard">Dashboard</option>
                  <option value="Eventos">Eventos</option>
                  <option value="Invitados">Invitados</option>
                  <option value="Créditos">Créditos</option>
                  <option value="Plantillas">Plantillas</option>
                </select>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {editingAdmin ? `Editando a ${editingAdmin.name}` : 'Crearás un nuevo administrador activo'}
              </span>
              <Button type="submit">{editingAdmin ? 'Guardar cambios' : 'Crear administrador'}</Button>
            </div>
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="p-2 font-semibold">Nombre</th>
                  <th className="p-2 font-semibold">Correo</th>
                  <th className="p-2 font-semibold">Estado</th>
                  <th className="p-2 font-semibold">Créditos</th>
                  <th className="p-2 font-semibold">Eventos</th>
                  <th className="p-2 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="p-2 font-medium text-slate-900">{admin.name}</td>
                    <td className="p-2 text-slate-500">{admin.email}</td>
                    <td className="p-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          admin.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {admin.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-2 text-slate-500">
                      {formatCurrency(admin.assignedCredits)} / {formatCurrency(admin.creditLimit)}
                    </td>
                    <td className="p-2 text-slate-500">{admin.events.length}</td>
                    <td className="p-2 text-right space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingAdmin(admin);
                          setFormState(admin);
                        }}
                      >
                        Editar
                      </Button>
                      <Button variant="secondary" onClick={() => toggleStatus(admin)}>
                        {admin.status === 'active' ? 'Desactivar' : 'Reactivar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Eventos por administrador</h2>
            <p className="text-sm text-slate-500">Consulta el detalle asociado a cada responsable.</p>
          </div>
          <div className="space-y-4 overflow-y-auto pr-1" style={{ maxHeight: 440 }}>
            {admins.map((admin) => (
              <div key={admin.id} className="rounded-2xl border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{admin.name}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      {admin.events.length} evento(s)
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Uso de créditos: {Math.round((admin.assignedCredits / admin.creditLimit) * 100 || 0)}%
                  </span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {admin.events.map((event) => (
                    <li key={event.id} className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">{event.name}</span>
                        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{event.status}</span>
                      </div>
                      <p className="text-xs text-slate-500">{new Date(event.startDate).toLocaleDateString('es-MX')}</p>
                      <p className="text-xs text-slate-500">Invitaciones: {event.invitations.toLocaleString('es-MX')}</p>
                    </li>
                  ))}
                  {admin.events.length === 0 && <li className="text-xs text-slate-400">Sin eventos asignados.</li>}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <Card className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Configuración global</h2>
            <p className="text-sm text-slate-500">
              Branding base, parámetros de tokens y políticas de invitaciones.
            </p>
          </div>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSettings}>
            <label className="grid gap-1 text-sm text-slate-600">
              <span>Color base</span>
              <input
                type="color"
                value={settings.brandColor}
                onChange={(event) => setSettings((prev) => ({ ...prev, brandColor: event.target.value }))}
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-600">
              <span>Color acento</span>
              <input
                type="color"
                value={settings.accentColor}
                onChange={(event) => setSettings((prev) => ({ ...prev, accentColor: event.target.value }))}
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-600 md:col-span-2">
              <span>Logo</span>
              <input
                type="url"
                className="rounded-lg border border-slate-200 px-3 py-2"
                value={settings.logoUrl}
                onChange={(event) => setSettings((prev) => ({ ...prev, logoUrl: event.target.value }))}
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-600 md:col-span-2">
              <span>Favicon</span>
              <input
                type="url"
                className="rounded-lg border border-slate-200 px-3 py-2"
                value={settings.faviconUrl}
                onChange={(event) => setSettings((prev) => ({ ...prev, faviconUrl: event.target.value }))}
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-600">
              <span>Límite global de eventos</span>
              <input
                type="number"
                className="rounded-lg border border-slate-200 px-3 py-2"
                min={0}
                value={settings.maxEvents}
                onChange={(event) => setSettings((prev) => ({ ...prev, maxEvents: Number(event.target.value) }))}
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-600">
              <span>Duración de tokens (horas)</span>
              <input
                type="number"
                className="rounded-lg border border-slate-200 px-3 py-2"
                min={1}
                value={settings.tokenDurationHours}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, tokenDurationHours: Number(event.target.value) }))
                }
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-600 md:col-span-2">
              <span>Política</span>
              <textarea
                className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2"
                value={settings.invitationPolicy}
                onChange={(event) => setSettings((prev) => ({ ...prev, invitationPolicy: event.target.value }))}
              />
            </label>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Guardar cambios</Button>
            </div>
          </form>
        </Card>

        <Card className="flex flex-col gap-4">
          <header>
            <h2 className="text-xl font-semibold text-slate-900">Panel de créditos</h2>
            <p className="text-sm text-slate-500">Asigna o retira créditos y consulta el historial.</p>
          </header>
          <form className="grid gap-3 rounded-2xl bg-slate-50 p-4" onSubmit={handleCredits}>
            <label className="grid gap-1 text-sm text-slate-600">
              <span>Administrador</span>
              <select
                className="rounded-lg border border-slate-200 px-3 py-2"
                value={creditsForm.adminId}
                onChange={(event) => setCreditsForm((prev) => ({ ...prev, adminId: event.target.value }))}
              >
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm text-slate-600">
              <span>Monto (usa números negativos para retirar)</span>
              <input
                type="number"
                className="rounded-lg border border-slate-200 px-3 py-2"
                value={creditsForm.amount}
                onChange={(event) => setCreditsForm((prev) => ({ ...prev, amount: Number(event.target.value) }))}
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-600">
              <span>Motivo</span>
              <input
                className="rounded-lg border border-slate-200 px-3 py-2"
                value={creditsForm.reason}
                placeholder="Nueva campaña, ajuste, etc."
                onChange={(event) => setCreditsForm((prev) => ({ ...prev, reason: event.target.value }))}
              />
            </label>
            <Button type="submit">Registrar movimiento</Button>
          </form>

          <div className="rounded-2xl border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-600">Consumo por administrador</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              {creditStats.byAdmin.map((admin) => (
                <li key={admin.name} className="flex justify-between rounded-xl bg-white/60 px-3 py-2">
                  <span className="font-medium text-slate-700">{admin.name}</span>
                  <span>
                    {formatCurrency(admin.assigned)} · Disponible {formatCurrency(Math.max(admin.remaining, 0))}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-400">
              Uso global del crédito: {creditStats.usage}% ({formatCurrency(creditStats.totalAssigned)} de{' '}
              {formatCurrency(creditStats.totalLimit)})
            </p>
          </div>

          <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-100 p-4" style={{ maxHeight: 260 }}>
            <h3 className="text-sm font-semibold text-slate-600">Historial de transacciones</h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-500">
              {movements.map((movement) => (
                <li key={movement.id} className="rounded-xl bg-white/60 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{movement.adminName}</span>
                    <span className={movement.type === 'Asignación' ? 'text-emerald-600' : 'text-rose-600'}>
                      {movement.type === 'Asignación' ? '+' : '-'}
                      {formatCurrency(movement.amount)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{movement.reason}</p>
                  <p className="text-xs text-slate-400">{formatDate(movement.at)}</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </div>
  );
}
