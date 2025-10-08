import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardCard } from './DashboardCard';

describe('DashboardCard', () => {
  it('renders the title, value and description', () => {
    render(
      <DashboardCard
        title="Eventos activos"
        value="12"
        description="Eventos publicados en el último mes"
        trendLabel="+8% vs. mes anterior"
      />
    );

    expect(screen.getByText('Eventos activos')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Eventos publicados en el último mes')).toBeInTheDocument();
    expect(screen.getByText(/8%/)).toBeInTheDocument();
  });
});
