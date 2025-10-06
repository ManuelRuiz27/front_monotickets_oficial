const DB_NAME = 'monotickets_staff';
const DB_VERSION = 2;
const STORES = ['checkins', 'queue'] as const;
type StoreName = (typeof STORES)[number];

export type CheckinPayload = {
  id: string;
  code: string;
  ts: number;
  gate?: string | null;
  passType?: string | null;
};
export type CheckinRecord = CheckinPayload;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      STORES.forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'id' });
        }
      });
      // v2 upgrade does not require data migration; reserved for future transforms
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function upsert<N extends StoreName>(store: N, value: any) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(value);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function remove<N extends StoreName>(store: N, id: string) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAll<N extends StoreName>(store: N) {
  const db = await openDB();
  return new Promise<any[]>((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
