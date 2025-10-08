import { DashboardCard } from '../../components/DashboardCard';
import { Button, Card } from '@ui/index';
import React from 'react';

const upcomingEvents = [
  {
    id: 'evt-1',
    name: 'Expo Gourmand',
    date: '2024-11-03',
    venue: 'Pepsi Center',
    status: 'Publicado',
    confirmations: '82%',
  },
  {
    id: 'evt-2',
    name: 'Graduación Tec Campus Norte',
    date: '2024-12-02',
    venue: 'Auditorio Metropolitano',
    status: 'Borrador',
    confirmations: '45%',
  },
];

/**
 * Dashboard operativo del organizador.  Aporta KPIs, accesos rápidos,
 * monitoreo de aforo y vista de próximos eventos tal como se describe en
 * la documentación del módulo.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel del organizador</h1>
          <p className="text-sm text-slate-500">
            Resumen de eventos activos, confirmaciones y aforo en tiempo real.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="/events/new">+ Crear nuevo evento</a>
          </Button>
          <Button asChild variant="secondary">
            <a href="/checkin">Panel de check-in</a>
          </Button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Eventos activos"
          value="12"
          description="Publicados con al menos un pase disponible."
          trendLabel="+8% vs. mes anterior"
        />
        <DashboardCard
          title="Invitaciones enviadas"
          value="18,420"
          description="Incluye correos y mensajes SMS del mes actual."
          trendLabel="+12% en la última semana"
        />
        <DashboardCard
          title="Confirmaciones"
          value="76%"
          description="Promedio RSVP confirmado en todos los eventos."
          trendLabel="+4 pts"
        />
        <DashboardCard
          title="Capacidad ocupada"
          value="58%"
          description="Aforo utilizado del portafolio activo."
          trendLabel="-3 pts"
          trendDirection="down"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <Card className="space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Próximos eventos</h2>
              <p className="text-sm text-slate-500">Wizard de seguimiento con estado en tiempo real.</p>
            </div>
            <Button asChild variant="secondary">
              <a href="/events">Ver todos</a>
            </Button>
          </header>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{event.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{event.status}</p>
                  </div>
                  <div className="text-sm text-slate-500">
                    <p>{new Date(event.date).toLocaleDateString('es-MX')}</p>
                    <p>{event.venue}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-emerald-600">
                    RSVP {event.confirmations}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Check-in en vivo</h2>
          <div className="space-y-3 text-sm text-slate-500">
            <p>
              Entradas validadas: <span className="font-semibold text-emerald-600">1,124</span>
            </p>
            <p>
              Rechazos por duplicado: <span className="font-semibold text-amber-600">32</span>
            </p>
            <p>
              Tiempo promedio de validación: <span className="font-semibold text-slate-800">1.2s</span>
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-600">Entradas por hora</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-500">
              <li>18:00 - 120 accesos</li>
              <li>19:00 - 210 accesos</li>
              <li>20:00 - 160 accesos</li>
            </ul>
          </div>
        </Card>
      </section>
    </div>
  );
}
