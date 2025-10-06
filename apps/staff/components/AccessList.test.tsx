import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccessList } from './AccessList';

export type CheckinRecord = {
  id: string;
  code: string;
  ts: number;
  gate: string | null;
  passType: string | null;
};

describe('Lista de Acceso', () => {
  it('debería renderizar la tabla con las cabeceras correctas', () => {
    render(<AccessList items={[]} />);
    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Fecha/Hora')).toBeInTheDocument();
    expect(screen.getByText('Puerta')).toBeInTheDocument();
    expect(screen.getByText('Tipo Pase')).toBeInTheDocument();
    expect(screen.getByText('ID local')).toBeInTheDocument();
  });

  it('debería mostrar "Sin registros" cuando no hay items', () => {
    render(<AccessList items={[]} />);
    expect(screen.getByText('Sin registros')).toBeInTheDocument();
  });

  it('debería renderizar los items correctamente', () => {
    const items: CheckinRecord[] = [
      { id: '1', code: 'ABC', ts: Date.now(), gate: 'A', passType: 'VIP' },
      { id: '2', code: 'DEF', ts: Date.now(), gate: 'B', passType: 'General' },
    ];
    render(<AccessList items={items} />);
    expect(screen.getByText('ABC')).toBeInTheDocument();
    expect(screen.getByText('DEF')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('VIP')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
  });
});