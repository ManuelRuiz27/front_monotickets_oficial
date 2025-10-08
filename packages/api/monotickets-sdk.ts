import axios from 'axios';
import { getSession } from '@utils/auth';

// Configure a shared Axios instance for the Monotickets API.  The base URL can be
// overridden via the NEXT_PUBLIC_API_URL environment variable; otherwise it
// defaults to the production API.  A reasonable timeout is set to avoid
// hanging requests.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.monotickets.com',
  timeout: 10000,
});

// Automatically include the bearer token from localStorage on every request
// when running in the browser.  This keeps authentication simple and avoids
// sprinkling token retrieval throughout your application code.
api.interceptors.request.use((config) => {
  const session = typeof window !== 'undefined' ? getSession() : null;
  if (session?.token) config.headers.Authorization = `Bearer ${session.token}`;
  return config;
});

// Define a strongly-typed client API for Super Admin operations.  Each method
// returns an Axios Promise, allowing further chaining with then/catch.
export const SuperAdminAPI = {
  /**
   * Authenticate as a super admin.  Expects credentials in `data` and
   * receives a JWT on success.
   */
  login: (data: any) => api.post('/superadmin/login', data),
  /**
   * Retrieve a list of administrator users.  Returns an array of user
   * records on success.
   */
  getAdmins: () => api.get('/superadmin/users'),
  /**
   * Assign credits to an administrator or user.  Requires a payload with
   * relevant fields (e.g. userId, amount).
   */
  assignCredits: (data: any) => api.post('/superadmin/credits', data),
  /**
   * Update global superadmin-level settings.  Sends the provided data via
   * PUT and returns the updated settings on success.
   */
  updateSettings: (data: any) => api.put('/superadmin/settings', data),
};
