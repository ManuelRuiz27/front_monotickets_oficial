import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventWizard } from './EventWizard';

const mockShowToast = jest.fn();
jest.mock('@ui/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

describe('Asistente para crear eventos', () => {
  beforeEach(() => {
    mockShowToast.mockClear();
  });

  it('debería renderizar el primer paso correctamente', () => {
    render(<EventWizard />);
    expect(screen.getByText('Crear Nuevo Evento')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre del evento')).toBeInTheDocument();
  });

  it('debería permitir al usuario escribir en el campo de nombre', () => {
    render(<EventWizard />);
    const input = screen.getByPlaceholderText('Nombre del evento') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Mi nuevo evento' } });
    expect(input.value).toBe('Mi nuevo evento');
  });

  it('debería pasar al siguiente paso al hacer clic en "Siguiente"', () => {
    render(<EventWizard />);
    fireEvent.click(screen.getByText('Siguiente'));
    expect(screen.getByLabelText('date-input')).toBeInTheDocument();
  });

  it('debería volver al paso anterior al hacer clic en "Atrás"', () => {
    render(<EventWizard />);
    fireEvent.click(screen.getByText('Siguiente'));
    fireEvent.click(screen.getByText('Atrás'));
    expect(screen.getByPlaceholderText('Nombre del evento')).toBeInTheDocument();
  });

  it('debería llamar a showToast al hacer clic en "Finalizar"', () => {
    render(<EventWizard />);
    fireEvent.click(screen.getByText('Siguiente'));
    fireEvent.click(screen.getByText('Siguiente'));
    fireEvent.click(screen.getByText('Finalizar'));
    expect(mockShowToast).toHaveBeenCalledWith('Evento creado!', 'success');
  });
});