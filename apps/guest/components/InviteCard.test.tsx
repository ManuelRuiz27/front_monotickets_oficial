import React from 'react';
import { render, screen } from '@testing-library/react';
import { InviteCard } from './InviteCard';

describe('Tarjeta de Invitación', () => {
  const invite = {
    event_name: 'Boda de Ana y Juan',
    description: 'Nos complace invitarte a nuestra boda.',
    date: 'Sábado, 25 de Diciembre de 2025',
    location: 'Salón de Fiestas "El Roble"',
  };

  it('debería renderizar los detalles de la invitación correctamente', () => {
    render(<InviteCard invite={invite} />);
    expect(screen.getByText('Boda de Ana y Juan')).toBeInTheDocument();
    expect(screen.getByText('Nos complace invitarte a nuestra boda.')).toBeInTheDocument();
    expect(screen.getByText('Salón de Fiestas "El Roble"')).toBeInTheDocument();
    expect(screen.getByText('Sábado, 25 de Diciembre de 2025')).toBeInTheDocument();
  });

  it('debería tener un enlace al a la página de RSVP', () => {
    render(<InviteCard invite={invite} />);
    const link = screen.getByRole('link', { name: 'Confirmar asistencia' });
    expect(link).toHaveAttribute('href', '/rsvp');
  });
});