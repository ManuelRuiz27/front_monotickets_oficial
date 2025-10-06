import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardCard } from './DashboardCard';

describe('DashboardCard', () => {
  it('renders the title and value', () => {
    render(<DashboardCard title="Test Title" value="Test Value" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });
});
