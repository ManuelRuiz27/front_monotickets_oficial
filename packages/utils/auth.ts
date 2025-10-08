export type SessionRole = 'superadmin' | 'organizer' | 'staff';

export type MonoticketsSession = {
  token: string;
  role: SessionRole;
  issuedAt: number;
  expiresAt?: number;
};

const STORAGE_KEY = 'monotickets.session';

const isBrowser = typeof window !== 'undefined';

const parseSession = (value: string | null): MonoticketsSession | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as MonoticketsSession;
    if (!parsed?.token || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const getSession = (): MonoticketsSession | null => {
  if (!isBrowser) return null;
  return parseSession(localStorage.getItem(STORAGE_KEY));
};

export const setSession = (session: MonoticketsSession) => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  // Maintain compatibility with legacy keys used by some utilities/tests.
  localStorage.setItem('token', session.token);
  if (session.role === 'staff') {
    localStorage.setItem('staff_token', session.token);
  } else {
    localStorage.removeItem('staff_token');
  }
};

export const clearSession = () => {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('token');
  localStorage.removeItem('staff_token');
};

export const hasRole = (role: SessionRole): boolean => {
  return getSession()?.role === role;
};

export const ensureSession = (): MonoticketsSession => {
  const session = getSession();
  if (!session) {
    throw new Error('No hay una sesión activa.');
  }
  return session;
};
