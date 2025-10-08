'use client';
import { useEffect } from 'react';
import { QRScanner } from '../../components/QRScanner';
import { StatusToast } from '../../components/StatusToast';
import { useOfflineQueue } from '../../lib/offlineQueue';
import InsidePanel from '../../components/InsidePanel';
import React from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@utils/auth';

/**
 * Main scanning page.  Shows the scanner, a panel with live occupancy
 * information and last scan details, and status toast notifications.
 */
export default function ScanPage() {
  const { pending, syncNow, online } = useOfflineQueue();
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== 'staff') {
      router.replace('/login');
    }
  }, [router]);
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Escáner QR</h1>
        <div className="text-sm opacity-80">
          Estado:{' '}
          <span className={online ? 'text-green-400' : 'text-yellow-400'}>
            {online ? 'En línea' : 'Sin conexión'}
          </span>{' '}
          • Pendientes por enviar: <b>{pending}</b>
          <button onClick={syncNow} className="ml-3 underline underline-offset-4 hover:text-white">
            Sincronizar
          </button>
        </div>
      </div>
      <QRScanner />
      <InsidePanel />
      <StatusToast />
    </div>
  );
}
