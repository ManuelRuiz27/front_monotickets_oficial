'use client';
import { useState } from 'react';
import { api } from '@api/monotickets-sdk';
import { Card, Button, useToast } from '@ui/index';
import { useRouter } from 'next/navigation';

/**
 * Login page for staff.  Accepts a username and PIN/token and stores the
 * returned token in localStorage.  Redirects to the scan page on success.
 */
export default function LoginPage() {
  const [user, setUser] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const doLogin = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/staff/login', { user, pin });
      // Store tokens for both staff_token and generic token for API interceptors
      localStorage.setItem('staff_token', data.token);
      localStorage.setItem('token', data.token);
      router.push('/scan');
    } catch (e) {
      showToast('Login inválido', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card>
        <h2 className="text-xl font-bold mb-4">Ingreso Staff</h2>
        <input
          className="bg-white/5 border border-white/10 rounded p-2 w-72 mb-3"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className="bg-white/5 border border-white/10 rounded p-2 w-72 mb-4"
          placeholder="PIN o Token"
          value={pin}
          type="password"
          onChange={(e) => setPin(e.target.value)}
        />
        <Button onClick={doLogin}>{loading ? 'Entrando…' : 'Entrar'}</Button>
      </Card>
    </div>
  );
}
