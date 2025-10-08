'use client';

import React, { useMemo, useState } from 'react';
import { Button, Card } from '../primitives';
import { useToast } from '../hooks/useToast';
import { api } from '@api/monotickets-sdk';
import { setSession, SessionRole } from '@utils/auth';
import { useRouter } from 'next/navigation';

export type UnifiedLoginFormProps = {
  /**
   * Role selected by default when the form renders.  Users can still switch
   * between the available tabs.
   */
  defaultRole?: SessionRole;
  /**
   * Custom redirect targets per role.  Absolute URLs are supported which
   * allows sending staff and super admins to their dedicated apps.
   */
  redirects?: Partial<Record<SessionRole, string>>;
};

type RoleDefinition = {
  role: SessionRole;
  title: string;
  description: string;
  endpoint: string;
  fields: Array<{
    id: 'email' | 'password' | 'user' | 'pin';
    label: string;
    type?: string;
    placeholder?: string;
  }>;
};

const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: 'superadmin',
    title: 'Súper Admin',
    description: 'Control global de la plataforma, créditos y configuración general.',
    endpoint: '/superadmin/login',
    fields: [
      { id: 'email', label: 'Correo institucional', type: 'email', placeholder: 'admin@monotickets.com' },
      { id: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••' },
    ],
  },
  {
    role: 'organizer',
    title: 'Administrador de eventos',
    description: 'Gestiona eventos, invitados y reportes en tiempo real.',
    endpoint: '/admin/login',
    fields: [
      { id: 'email', label: 'Correo de acceso', type: 'email', placeholder: 'planner@evento.com' },
      { id: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••' },
    ],
  },
  {
    role: 'staff',
    title: 'Staff / Control de Accesos',
    description: 'Escaneo QR, conteo de aforo y sincronización offline.',
    endpoint: '/staff/login',
    fields: [
      { id: 'user', label: 'Usuario', placeholder: 'Puesto o dispositivo' },
      { id: 'pin', label: 'PIN o token temporal', type: 'password', placeholder: '0000' },
    ],
  },
];

const defaultRedirects: Record<SessionRole, string> = {
  superadmin: '/',
  organizer: '/dashboard',
  staff: '/scan',
};

export function UnifiedLoginForm({ defaultRole = 'organizer', redirects }: UnifiedLoginFormProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<SessionRole>(defaultRole);
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const role = useMemo(
    () => ROLE_DEFINITIONS.find((definition) => definition.role === activeRole) ?? ROLE_DEFINITIONS[0],
    [activeRole]
  );

  const mergedRedirects = useMemo(() => ({
    superadmin:
      redirects?.superadmin ?? process.env.NEXT_PUBLIC_SUPERADMIN_APP_URL?.concat('') ?? defaultRedirects.superadmin,
    organizer:
      redirects?.organizer ?? process.env.NEXT_PUBLIC_ORGANIZER_APP_URL?.concat('') ?? defaultRedirects.organizer,
    staff: redirects?.staff ?? process.env.NEXT_PUBLIC_STAFF_APP_URL?.concat('') ?? defaultRedirects.staff,
  }), [redirects]);

  const handleChange = (id: string, value: string) => {
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Record<string, string> = {};
      for (const field of role.fields) {
        payload[field.id] = formState[field.id] || '';
      }
      const { data } = await api.post(role.endpoint, payload);
      if (!data?.token) {
        throw new Error('Respuesta inválida');
      }
      setSession({ token: data.token, role: role.role, issuedAt: Date.now(), expiresAt: data?.expiresAt });
      const target = mergedRedirects[role.role];
      if (target.startsWith('http')) {
        window.location.href = target;
      } else {
        router.push(target);
      }
    } catch (error) {
      console.error(error);
      showToast('No pudimos iniciar sesión. Revisa tus credenciales.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-12">
      <Card className="w-full max-w-3xl bg-white/95 shadow-[0_24px_64px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-8 lg:flex-row">
          <section className="flex-1 space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Monotickets Control</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Acceso unificado</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Un mismo punto de entrada para Súper Administradores, Organizadores y Staff. Selecciona tu rol y
                continúa con credenciales seguras.
              </p>
            </div>
            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p>• Tokens cifrados en almacenamiento seguro.</p>
              <p>• Redirecciones automáticas según permisos.</p>
              <p>• Compatible con PIN temporal para staff en campo.</p>
            </div>
          </section>
          <section className="flex-1">
            <div className="flex gap-2 rounded-2xl bg-slate-100 p-1 text-xs font-medium text-slate-500">
              {ROLE_DEFINITIONS.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setActiveRole(item.role)}
                  className={`flex-1 rounded-xl px-4 py-2 transition-all ${
                    item.role === role.role ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{role.title}</h2>
                <p className="text-sm text-slate-500">{role.description}</p>
              </div>
              {role.fields.map((field) => (
                <label key={field.id} className="block">
                  <span className="text-sm font-medium text-slate-600">{field.label}</span>
                  <input
                    value={formState[field.id] ?? ''}
                    onChange={(event) => handleChange(field.id, event.target.value)}
                    required
                    type={field.type ?? 'text'}
                    placeholder={field.placeholder}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              ))}
              <Button type="submit" disabled={loading} className="w-full justify-center">
                {loading ? 'Validando credenciales…' : 'Ingresar'}
              </Button>
            </form>
          </section>
        </div>
      </Card>
    </div>
  );
}
