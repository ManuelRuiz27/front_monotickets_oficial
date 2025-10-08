import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventWizard } from './EventWizard';
import Papa from 'papaparse';

const mockShowToast = jest.fn();

jest.mock('@ui/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('papaparse', () => ({
  parse: jest.fn(),
}));

describe('Asistente para crear eventos', () => {
  beforeEach(() => {
    mockShowToast.mockClear();
    (Papa.parse as jest.Mock).mockReset();
  });

  it('muestra el paso inicial con campos básicos', () => {
    render(<EventWizard />);
    expect(screen.getByText('Paso 1: Datos básicos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Conferencia Monotickets')).toBeInTheDocument();
  });

  it('permite capturar el nombre del evento', () => {
    render(<EventWizard />);
    const input = screen.getByPlaceholderText('Conferencia Monotickets') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Mi nuevo evento' } });
    expect(input.value).toBe('Mi nuevo evento');
  });

  it('avanza y regresa entre los pasos', () => {
    render(<EventWizard />);
    fireEvent.click(screen.getByText('Siguiente'));
    expect(screen.getByText('Paso 2: Tipos de pase')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Atrás'));
    expect(screen.getByText('Paso 1: Datos básicos')).toBeInTheDocument();
  });

  it('importa invitados desde un archivo CSV', () => {
    render(<EventWizard />);
    fireEvent.click(screen.getByText('Siguiente'));
    fireEvent.click(screen.getByText('Siguiente'));
    const file = new File(['name,email\nJohn,john@example.com'], 'invitados.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Importar invitados');
    (Papa.parse as jest.Mock).mockImplementation((_file, config) => {
      config.complete({ data: [{ name: 'John', email: 'john@example.com' }] });
    });
    fireEvent.change(input, { target: { files: [file] } });
    expect(Papa.parse).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith('Archivo invitados.csv importado', 'success');
  });

  it('publica el evento en el paso final', () => {
    render(<EventWizard />);
    fireEvent.click(screen.getByText('Siguiente'));
    fireEvent.click(screen.getByText('Siguiente'));
    fireEvent.click(screen.getByText('Siguiente'));
    fireEvent.click(screen.getByText('Publicar evento'));
    expect(mockShowToast).toHaveBeenCalledWith('Evento creado y publicado 🎉', 'success');
  });
});
