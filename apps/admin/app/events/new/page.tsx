import { EventWizard } from '../../../components/EventWizard';
import React from 'react';

/**
 * Entry point for the event creation wizard.  Wraps the EventWizard
 * component and provides a heading.
 */
export default function NewEventPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Nuevo Evento</h1>
      <EventWizard />
    </div>
  );
}
