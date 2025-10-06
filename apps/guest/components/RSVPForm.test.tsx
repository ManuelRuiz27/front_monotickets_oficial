import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { RSVPForm } from './RSVPForm';
import { api } from '@api/monotickets-sdk';
import confetti from 'canvas-confetti';

const mockShowToast = jest.fn();
jest.mock('@ui/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@api/monotickets-sdk', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('canvas-confetti', () => jest.fn());

describe('Formulario de RSVP', () => {
  beforeEach(() => {
    mockShowToast.mockClear();
    (api.post as jest.Mock).mockClear();
    (confetti as jest.Mock).mockClear();
  });

  it('debería renderizar el formulario correctamente', () => {
    render(<RSVPForm />);
    expect(screen.getByText('Confirmar asistencia')).toBeInTheDocument();
    expect(screen.getByText('Asistiré')).toBeInTheDocument();
    expect(screen.getByText('No podré ir')).toBeInTheDocument();
  });

  it('debería llamar a la API con "yes" y mostrar un mensaje de éxito al hacer clic en "Asistiré"', async () => {
    (api.post as jest.Mock).mockResolvedValue({});
    render(<RSVPForm />);
    
    await act(async () => {
      fireEvent.click(screen.getByText('Asistiré'));
    });

    expect(api.post).toHaveBeenCalledWith('/guest/rsvp', { status: 'yes' });
    expect(confetti).toHaveBeenCalled();
    expect(screen.getByText('🎉 ¡Nos alegra verte allí!')).toBeInTheDocument();
    expect(screen.getByText('Gracias por responder tu invitación.')).toBeInTheDocument();
  });

  it('debería llamar a la API con "no" y mostrar un mensaje de éxito al hacer clic en "No podré ir"', async () => {
    (api.post as jest.Mock).mockResolvedValue({});
    render(<RSVPForm />);

    await act(async () => {
      fireEvent.click(screen.getByText('No podré ir'));
    });

    expect(api.post).toHaveBeenCalledWith('/guest/rsvp', { status: 'no' });
    expect(confetti).not.toHaveBeenCalled();
    expect(screen.getByText('😔 Lamentamos que no puedas asistir.')).toBeInTheDocument();
    expect(screen.getByText('Gracias por responder tu invitación.')).toBeInTheDocument();
  });

  it('debería llamar a showToast con un error si la API falla', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('API Error'));
    render(<RSVPForm />);

    await act(async () => {
      fireEvent.click(screen.getByText('Asistiré'));
    });

    expect(mockShowToast).toHaveBeenCalledWith('Error enviando RSVP', 'error');
  });
});