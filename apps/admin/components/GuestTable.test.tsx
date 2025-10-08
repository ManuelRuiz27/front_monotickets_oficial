import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GuestTable } from './GuestTable';
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

describe('Tabla de Invitados', () => {
  beforeEach(() => {
    mockShowToast.mockClear();
    (Papa.parse as jest.Mock).mockReset();
  });

  it('muestra encabezados y controles de filtros', () => {
    render(<GuestTable />);
    expect(screen.getByText('Listado de invitados')).toBeInTheDocument();
    expect(screen.getByText('Mensaje personalizado')).toBeInTheDocument();
    expect(screen.getByLabelText('Importar invitados')).toBeInTheDocument();
  });

  it('llama a Papa.parse al importar un archivo', () => {
    render(<GuestTable />);
    const file = new File(['name,email\nJohn Doe,john@doe.com'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Importar invitados');
    fireEvent.change(input, { target: { files: [file] } });
    expect(Papa.parse).toHaveBeenCalledWith(file, expect.any(Object));
  });

  it('actualiza la tabla con datos importados', () => {
    (Papa.parse as jest.Mock).mockImplementation((_file, config) => {
      config.complete({ data: [{ name: 'John', email: 'john@test.com', passType: 'VIP', status: 'confirmado' }] });
    });
    render(<GuestTable />);
    const file = new File([''], 'invitados.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Importar invitados');
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
    expect(screen.getAllByText('VIP').length).toBeGreaterThan(0);
    expect(mockShowToast).toHaveBeenCalled();
  });
});
