'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode, useMemo, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { href: '/', label: 'Inicio', description: 'Resumen general de tus actividades' },
  { href: '/events', label: 'Mis eventos', description: 'Lista de eventos que gestionas' },
  { href: '/create', label: 'Crear evento', description: 'Configura un nuevo evento' },
  { href: '/sales', label: 'Ventas', description: 'Revisa desempeño de ventas' },
  { href: '/settings', label: 'Ajustes', description: 'Preferencias y cuenta' },
];

type AppShellProps = {
  children: ReactNode;
};

const Icon = ({ name, active }: { name: string; active: boolean }) => {
  const stroke = active ? 'var(--color-text-strong)' : 'var(--color-text)';
  switch (name) {
    case 'Inicio':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" role="presentation" aria-hidden="true">
          <path
            d="M4.5 10.5 12 4l7.5 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-4.5v-5h-3v5H6a1.5 1.5 0 0 1-1.5-1.5z"
            fill="none"
            stroke={stroke}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'Mis eventos':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" role="presentation" aria-hidden="true">
          <path
            d="M4 5h16M4 9h16M4 19h16M4 13h8"
            stroke={stroke}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );
    case 'Crear evento':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" role="presentation" aria-hidden="true">
          <path
            d="M12 5v14M5 12h14"
            stroke={stroke}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );
    case 'Ventas':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" role="presentation" aria-hidden="true">
          <path
            d="M5 15.5 10 9l4 5 5-7"
            stroke={stroke}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M4 19h16" stroke={stroke} strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" role="presentation" aria-hidden="true">
          <circle cx="12" cy="12" r="6.5" stroke={stroke} strokeWidth={1.6} fill="none" />
          <path d="M12 8v4l2.5 2.5" stroke={stroke} strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      );
  }
};

export const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const activePath = useMemo(() => {
    if (!pathname) return '/';
    if (pathname.startsWith('/events')) return '/events';
    if (pathname.startsWith('/create')) return '/create';
    if (pathname.startsWith('/sales')) return '/sales';
    if (pathname.startsWith('/settings')) return '/settings';
    return '/';
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full bg-transparent">
      <a
        href="#contenido-principal"
        className="absolute left-4 top-4 z-[999] -translate-y-24 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-text-strong)] shadow-soft focus:translate-y-0 focus:outline-none"
      >
        Saltar al contenido
      </a>
      <aside
        className={`glass-card hidden shrink-0 flex-col justify-between border-l-0 border-r border-t-0 border-b-0 p-6 transition-[width] duration-300 ease-in-out md:flex ${collapsed ? 'w-24' : 'w-72'}`}
      >
        <div className="flex flex-col gap-8">
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)] transition-base hover:bg-[rgba(75,163,255,0.15)] hover:text-[var(--color-text-strong)]"
            aria-pressed={collapsed}
            aria-label={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          >
            {collapsed ? '▶' : '◀'}
          </button>
          <nav aria-label="Navegación principal" className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = activePath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(7,17,32,0.35)] ${
                    active
                      ? 'bg-[rgba(75,163,255,0.18)] text-[var(--color-text-strong)]'
                      : 'text-[var(--color-text)] hover:bg-[rgba(75,163,255,0.12)] hover:text-[var(--color-text-strong)]'
                  }`}
                >
                  <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[rgba(75,163,255,0.18)]">
                    <Icon name={item.label} active={active} />
                  </span>
                  {!collapsed && (
                    <span className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-xs font-medium text-[var(--color-text-muted)]">{item.description}</span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <ThemeToggle />
          <p className={`text-xs leading-5 ${collapsed ? 'hidden' : 'block'} text-[var(--color-text-muted)]`}>
            Administra tus eventos con un diseño inspirado en glassmorfismo y listo para modo claro y oscuro.
          </p>
        </div>
      </aside>
      <div className="flex w-full flex-col">
        <header className="sticky top-0 z-40 flex flex-col gap-4 border-b border-[var(--color-border-soft)] bg-[rgba(8,15,28,0.75)] px-6 py-5 backdrop-blur-2xl md:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="badge">Panel</p>
              <h1 className="mt-2 text-xl font-semibold text-[var(--color-text-strong)]">Monotickets</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main id="contenido-principal" className="flex-1 px-4 pb-24 pt-6 sm:px-8">
          {children}
        </main>
        <nav
          aria-label="Navegación inferior"
          className="glass-popover fixed bottom-4 left-1/2 z-40 flex w-[92%] max-w-md -translate-x-1/2 justify-between rounded-full px-6 py-3 shadow-soft transition-base md:hidden"
        >
          {navItems.map((item) => {
            const active = activePath === item.href;
            return (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                className={`flex flex-col items-center gap-1 text-xs font-semibold transition-base ${
                  active
                    ? 'text-[var(--color-text-strong)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]'
                }`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[rgba(75,163,255,0.18)]">
                  <Icon name={item.label} active={active} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
