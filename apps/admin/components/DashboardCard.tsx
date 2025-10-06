import { Card } from '@ui/index';
import React from 'react';

type DashboardCardProps = {
  title: string;
  value: string;
};

/**
 * Simple card used on the dashboard to display a metric and its label.
 */
export const DashboardCard = React.memo(({ title, value }: DashboardCardProps) => (
  <Card>
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </Card>
));

DashboardCard.displayName = 'DashboardCard';
