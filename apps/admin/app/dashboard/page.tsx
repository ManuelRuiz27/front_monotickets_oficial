import { DashboardCard } from '../../components/DashboardCard';
import { Card } from '@ui/index';
import React from 'react';

/**
 * Dashboard for the admin.  Displays high-level metrics in cards and
 * placeholder content for recent activity.
 */
export default function DashboardPage() {
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard del Organizador</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard title="Eventos Activos" value="8" />
        <DashboardCard title="Invitaciones Enviadas" value="2,356" />
        <DashboardCard title="Asistentes Confirmados" value="1,922" />
      </div>
      <Card>
        <p className="text-gray-600">📅 Últimos eventos y actividad reciente.</p>
      </Card>
    </div>
  );
}
