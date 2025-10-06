import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GuestTable } from './GuestTable';
import Papa from 'papaparse';

jest.mock('papaparse', () => ({
  parse: jest.fn(),
}));

describe('Tabla de Invitados', () => {
  it('debería renderizar la tabla vacía correctamente', () => {
    render(<GuestTable />);
    expect(screen.getByText('Importar CSV')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Correo')).toBeInTheDocument();
  });

  it('debería llamar a Papa.parse al subir un archivo CSV', () => {
    render(<GuestTable />);
    const file = new File(['name,email\nJohn Doe,john@doe.com'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Importar CSV');
    fireEvent.change(input, { target: { files: [file] } });
    expect(Papa.parse).toHaveBeenCalledWith(file, expect.any(Object));
  });

  it('debería actualizar la tabla con los datos del CSV', () => {
    const guests = [
      { name: 'John Doe', email: 'john@doe.com' },
      { name: 'Jane Doe', email: 'jane@doe.com' },
    ];
    (Papa.parse as jest.Mock).mockImplementation((_file, config) => {
      config.complete({ data: guests });
    });

    render(<GuestTable />);
    const file = new File([''], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Importar CSV');
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@doe.com')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@doe.com')).toBeInTheDocument();
  });
});
