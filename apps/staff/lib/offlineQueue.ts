'use client';
import { create } from 'zustand';
import { api } from '@api/monotickets-sdk';
import { CheckinPayload, getAll, remove, upsert } from './idb';

type Toast = { kind: 'success' | 'warn' | 'error' | 'info'; message: string };

type Store = {
  online: boolean;
  pending: number;
  toast?: Toast;
  setToast: (t?: Toast) => void;
  enqueue: (p: CheckinPayload) => Promise<void>;
  syncNow: () => Promise<void>;
};

export const useOfflineQueue = create<Store>((set, get) => ({
  online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pending: 0,
  setToast: (t) => set({ toast: t }),
  enqueue: async (p) => {
    await upsert('queue', p);
    const list = await getAll('queue');
    set({ pending: list.length });
  },
  syncNow: async () => {
    const token = localStorage.getItem('staff_token');
    if (!token) {
      set({ toast: { kind: 'error', message: 'Sin sesión, no se puede sincronizar.' } });
      return;
    }
    try {
      const queue = await getAll('queue');
      if (queue.length === 0) {
        set({ toast: { kind: 'info', message: 'No hay pendientes.' } });
        return;
      }
      // Enviar en lote
      await api.post('/staff/sync', { items: queue });
      // Limpiar
      for (const it of queue) await remove('queue', it.id);
      const left = await getAll('queue');
      set({
        pending: left.length,
        toast: { kind: 'success', message: 'Sincronización completa ✅' },
      });
    } catch {
      set({ toast: { kind: 'warn', message: 'No se pudo sincronizar. Intenta luego.' } });
    }
  },
}));

// Listeners de conectividad
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    useOfflineQueue.setState({ online: true });
    await useOfflineQueue.getState().syncNow();
  });
  window.addEventListener('offline', () => {
    useOfflineQueue.setState({ online: false });
  });
}
