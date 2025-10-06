import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchGuest from './SearchGuest';
import { api } from '@api/monotickets-sdk';

jest.mock('@api/monotickets-sdk', () => ({
  api: {
    get: jest.fn(),
  },
}));

describe('Búsqueda de Invitados', () => {
  beforeEach(() => {
    (api.get as jest.Mock).mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debería renderizar el componente correctamente', () => {
    render(<SearchGuest />);
    expect(screen.getByPlaceholderText('Buscar por nombre…')).toBeInTheDocument();
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('debería llamar a la API después de que el usuario deje de escribir', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { items: [] } });
    render(<SearchGuest />);
    const input = screen.getByPlaceholderText('Buscar por nombre…');

    fireEvent.change(input, { target: { value: 'John' } });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(api.get).toHaveBeenCalledWith('/staff/search', { params: { query: 'John' } });
  });

  it('debería actualizar la tabla con los resultados de la búsqueda', async () => {
    const items = [
      { id: '1', name: 'John Doe', passType: 'VIP', entered: true, lastCheckinAt: new Date().toISOString() },
    ];
    (api.get as jest.Mock).mockResolvedValue({ data: { items } });
    render(<SearchGuest />);
    const input = screen.getByPlaceholderText('Buscar por nombre…');

    fireEvent.change(input, { target: { value: 'John' } });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('VIP')).toBeInTheDocument();
    expect(screen.getByText('Ingresó ✅')).toBeInTheDocument();
  });

  it('no debería llamar a la API si la consulta tiene menos de 2 caracteres', async () => {
    render(<SearchGuest />);
    const input = screen.getByPlaceholderText('Buscar por nombre…');

    fireEvent.change(input, { target: { value: 'J' } });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(api.get).not.toHaveBeenCalled();
  });
});