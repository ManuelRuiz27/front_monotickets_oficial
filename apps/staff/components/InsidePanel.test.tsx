import React from 'react';
import { render, screen } from '@testing-library/react';
import InsidePanel from './InsidePanel';
import { useInside } from '../lib/insideStore';
import { connectWS } from '../lib/ws';

jest.mock('../lib/insideStore', () => ({
  useInside: jest.fn(),
}));

jest.mock('../lib/ws', () => ({
  connectWS: jest.fn(),
}));

describe('Panel Interior', () => {
  beforeEach(() => {
    (useInside as jest.Mock).mockClear();
    (connectWS as jest.Mock).mockClear();
  });

  it('debería renderizar el estado inicial correctamente', () => {
    (useInside as jest.Mock).mockReturnValue({
      insideCount: 0,
      lastPerson: null,
    });
    render(<InsidePanel />);
    expect(screen.getByText('Aforo dentro')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Aún no hay escaneos en esta sesión.')).toBeInTheDocument();
  });

  it('debería renderizar los detalles de la última persona escaneada', () => {
    const lastPerson = {
      name: 'John Doe',
      passType: 'VIP',
      status: 'valid',
      alreadyEntered: false,
      lastCheckinAt: new Date().toISOString(),
    };
    (useInside as jest.Mock).mockReturnValue({
      insideCount: 1,
      lastPerson,
    });
    render(<InsidePanel />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('• VIP')).toBeInTheDocument();
    expect(screen.getByText('✅ válido')).toBeInTheDocument();
    expect(screen.getByText(/Primera entrada/)).toBeInTheDocument();
  });

  it('debería llamar a connectWS al montarse', () => {
    (useInside as jest.Mock).mockReturnValue({
      insideCount: 0,
      lastPerson: null,
    });
    render(<InsidePanel />);
    expect(connectWS).toHaveBeenCalled();
  });
});