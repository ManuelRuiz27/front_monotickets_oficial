import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeedbackForm } from './FeedbackForm';
import { api } from '@api/monotickets-sdk';

const mockShowToast = jest.fn();
jest.mock('@ui/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@api/monotickets-sdk', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('Formulario de Feedback', () => {
  beforeEach(() => {
    mockShowToast.mockClear();
    (api.post as jest.Mock).mockClear();
  });

  it('debería renderizar el formulario correctamente', () => {
    render(<FeedbackForm />);
    expect(screen.getByText('Feedback del evento')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe tu comentario...')).toBeInTheDocument();
  });

  it('debería permitir al usuario seleccionar una calificación', () => {
    render(<FeedbackForm />);
    fireEvent.click(screen.getByLabelText('3 star rating'));
    // After clicking the 3rd star, the first 3 stars should be yellow
    expect(screen.getByLabelText('1 star rating')).toHaveClass('text-yellow-400');
    expect(screen.getByLabelText('2 star rating')).toHaveClass('text-yellow-400');
    expect(screen.getByLabelText('3 star rating')).toHaveClass('text-yellow-400');
    expect(screen.getByLabelText('4 star rating')).not.toHaveClass('text-yellow-400');
    expect(screen.getByLabelText('5 star rating')).not.toHaveClass('text-yellow-400');
  });

  it('debería permitir al usuario escribir en el área de texto', () => {
    render(<FeedbackForm />);
    const textarea = screen.getByPlaceholderText('Escribe tu comentario...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Muy buen evento!' } });
    expect(textarea.value).toBe('Muy buen evento!');
  });

  it('debería llamar a la API y mostrar un mensaje de agradecimiento al enviar el formulario', async () => {
    (api.post as jest.Mock).mockResolvedValue({});
    render(<FeedbackForm />);
    fireEvent.click(screen.getByLabelText('4 star rating'));
    fireEvent.change(screen.getByPlaceholderText('Escribe tu comentario...'), { target: { value: 'Excelente!' } });
    fireEvent.click(screen.getByText('Enviar'));

    await screen.findByText('¡Gracias por tus comentarios! 💬');

    expect(api.post).toHaveBeenCalledWith('/guest/feedback', { rating: 4, message: 'Excelente!' });
    expect(screen.getByText('Tu opinión nos ayuda a mejorar futuras experiencias.')).toBeInTheDocument();
  });

  it('debería llamar a showToast con un error si la API falla', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('API Error'));
    render(<FeedbackForm />);
    fireEvent.click(screen.getByText('Enviar'));

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for the async function to finish

    expect(mockShowToast).toHaveBeenCalledWith('Error al enviar feedback ❌', 'error');
  });
});