'use client';
import React, { useState } from 'react';
import { Button, Card } from '@ui/index';
import { SuperAdminAPI } from '@api/monotickets-sdk';

/**
 * Simple login page for the Super Admin portal.  It collects email and
 * password, calls the login API, stores the returned token in
 * localStorage, and provides basic error handling.  On success, the page
 * refreshes to show the dashboard.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await SuperAdminAPI.login({ email, password });
      const token = response.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        window.location.href = '/';
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <Card>
        <h1 className="text-xl font-bold mb-4">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button variant="primary" onClick={handleSubmit}>
            {loading ? 'Cargando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
