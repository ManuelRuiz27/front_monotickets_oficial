'use client';
import { useState } from 'react';
import { Button, Card, useToast } from '@ui/index';
import { api } from '@api/monotickets-sdk';
import { useRouter } from 'next/navigation';

/**
 * Login page for the admin section.  It collects user credentials and
 * attempts to authenticate against the `/admin/login` endpoint.  On
 * success the token is stored and the user is redirected to the dashboard.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/admin/login', { email, password });
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch {
      showToast('Credenciales incorrectas ❌', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card>
        <h2 className="text-xl font-bold mb-4">Login Administrador</h2>
        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-4 rounded"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>{loading ? 'Ingresando...' : 'Ingresar'}</Button>
      </Card>
    </div>
  );
}
