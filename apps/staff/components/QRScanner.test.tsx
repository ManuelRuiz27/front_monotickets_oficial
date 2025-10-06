import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QRScanner } from './QRScanner';
import { api } from '@api/monotickets-sdk';
import { useOfflineQueue } from '../lib/offlineQueue';
import { useUI } from '../lib/uiStore';
import { useInside } from '../lib/insideStore';
import { upsert } from '../lib/idb';
import { playBeep } from '../lib/sounds';

jest.mock('@api/monotickets-sdk', () => ({ api: { post: jest.fn() } }));
jest.mock('../lib/idb', () => ({ upsert: jest.fn() }));
jest.mock('../lib/offlineQueue', () => ({ useOfflineQueue: jest.fn() }));
jest.mock('../lib/sounds', () => ({ playBeep: jest.fn() }));
jest.mock('../lib/uiStore', () => ({ useUI: jest.fn() }));

const mockSetFromCheckin = jest.fn();
jest.mock('../lib/insideStore', () => ({
  useInside: Object.assign(jest.fn(), {
    getState: () => ({
      setFromCheckin: mockSetFromCheckin,
    }),
  }),
}));

describe('Escáner QR', () => {
  const mockEnqueue = jest.fn();
  const mockSetToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUI as jest.Mock).mockReturnValue({ gate: 'A', passType: 'VIP' });
    (useInside as jest.Mock).mockReturnValue({ setFromCheckin: mockSetFromCheckin });
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      value: { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [{ stop: jest.fn() }] }) },
    });
    navigator.vibrate = jest.fn();
    window.HTMLMediaElement.prototype.play = jest.fn();
  });

  it('debería renderizar el componente correctamente', () => {
    (useOfflineQueue as jest.Mock).mockReturnValue({ online: true, enqueue: mockEnqueue, setToast: mockSetToast });
    render(<QRScanner />);
    expect(screen.getByPlaceholderText(/Ingresar código manual/)).toBeInTheDocument();
    expect(screen.getByText('Validar')).toBeInTheDocument();
    expect(screen.getByText('Esperando…')).toBeInTheDocument();
  });

  it('debería llamar a la API al validar un código manualmente estando en línea', async () => {
    (useOfflineQueue as jest.Mock).mockReturnValue({ online: true, enqueue: mockEnqueue, setToast: mockSetToast });
    (api.post as jest.Mock).mockResolvedValue({ data: { status: 'valid' } });

    render(<QRScanner />);
    const input = screen.getByPlaceholderText(/Ingresar código manual/);
    const button = screen.getByText('Validar');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'ABC-123' } });
      fireEvent.click(button);
    });

    expect(upsert).toHaveBeenCalled();
    expect(api.post).toHaveBeenCalledWith('/staff/checkin', { code: 'ABC-123', gate: 'A', passType: 'VIP' });
    expect(playBeep).toHaveBeenCalledWith('ok');
    expect(mockSetToast).toHaveBeenCalledWith({ kind: 'success', message: 'Acceso válido ✅' });
  });

  it('debería añadir a la cola al validar un código manualmente estando sin conexión', async () => {
    (useOfflineQueue as jest.Mock).mockReturnValue({ online: false, enqueue: mockEnqueue, setToast: mockSetToast });

    render(<QRScanner />);
    const input = screen.getByPlaceholderText(/Ingresar código manual/);
    const button = screen.getByText('Validar');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'DEF-456' } });
      fireEvent.click(button);
    });

    expect(upsert).toHaveBeenCalled();
    expect(api.post).not.toHaveBeenCalled();
    expect(mockEnqueue).toHaveBeenCalled();
    expect(playBeep).toHaveBeenCalledWith('offline');
    expect(mockSetToast).toHaveBeenCalledWith({ kind: 'info', message: 'Guardado offline. Se sincronizará.' });
  });
});