import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusToast } from './StatusToast';
import { useOfflineQueue } from '../lib/offlineQueue';

jest.mock('../lib/offlineQueue', () => ({
  useOfflineQueue: jest.fn(),
}));

describe('Toast de Estado', () => {
  it('no debería renderizar nada si no hay mensaje de toast', () => {
    (useOfflineQueue as jest.Mock).mockReturnValue({ toast: null });
    const { container } = render(<StatusToast />);
    expect(container.firstChild).toBeNull();
  });

  it('debería renderizar el mensaje de toast correctamente', () => {
    (useOfflineQueue as jest.Mock).mockReturnValue({
      toast: { kind: 'success', message: 'Operación exitosa' },
    });
    render(<StatusToast />);
    expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
  });

  it('debería tener el color de fondo correcto para un toast de éxito', () => {
    (useOfflineQueue as jest.Mock).mockReturnValue({
      toast: { kind: 'success', message: 'Éxito' },
    });
    render(<StatusToast />);
    const toast = screen.getByTestId('toast');
    expect(toast).toHaveClass('bg-green-600/90');
  });

  it('debería tener el color de fondo correcto para un toast de advertencia', () => {
    (useOfflineQueue as jest.Mock).mockReturnValue({
      toast: { kind: 'warn', message: 'Advertencia' },
    });
    render(<StatusToast />);
    const toast = screen.getByTestId('toast');
    expect(toast).toHaveClass('bg-yellow-600/90');
  });

  it('debería tener el color de fondo correcto para un toast de error', () => {
    (useOfflineQueue as jest.Mock).mockReturnValue({
      toast: { kind: 'error', message: 'Error' },
    });
    render(<StatusToast />);
    const toast = screen.getByTestId('toast');
    expect(toast).toHaveClass('bg-red-600/90');
  });

  it('debería tener el color de fondo correcto para un toast de información', () => {
    (useOfflineQueue as jest.Mock).mockReturnValue({
      toast: { kind: 'info', message: 'Información' },
    });
    render(<StatusToast />);
    const toast = screen.getByTestId('toast');
    expect(toast).toHaveClass('bg-blue-600/90');
  });
});