'use client';
import { useEffect, useState } from 'react';
import { getAll, CheckinRecord } from '../../lib/idb';
import { AccessList } from '../../components/AccessList';
import React from 'react';

/**
 * History page shows a table of all local check-ins stored in IndexedDB.
 */
export default function HistoryPage() {
  const [items, setItems] = useState<CheckinRecord[]>([]);
  useEffect(() => {
    getAll('checkins').then(setItems);
  }, []);
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Historial de Accesos</h1>
      <AccessList items={items} />
    </div>
  );
}
