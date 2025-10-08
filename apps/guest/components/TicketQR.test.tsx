import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TicketQR } from './TicketQR';

const mockShowToast = jest.fn();
jest.mock('@ui/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('qrcode.react', () => ({
  QRCodeCanvas: ({ value }: { value: string }) => <div data-testid="qr-code" data-value={value} />,
}));

describe('Ticket QR', () => {
  beforeEach(() => {
    mockShowToast.mockClear();
    window.print = jest.fn();
  });

  it('debería renderizar el código QR con el valor correcto', () => {
    render(<TicketQR id="12345" />);
    const qrCode = screen.getByTestId('qr-code');
    expect(qrCode).toBeInTheDocument();
    expect(qrCode).toHaveAttribute('data-value', '12345');
  });

  it('debería llamar a window.print al hacer clic en "Descargar PDF"', () => {
    render(<TicketQR id="12345" />);
    fireEvent.click(screen.getByText('Descargar PDF'));
    expect(window.print).toHaveBeenCalled();
  });

  it('debería llamar a showToast al hacer clic en "Agregar al Wallet"', () => {
    render(<TicketQR id="12345" />);
    fireEvent.click(screen.getByText('Agregar al Wallet'));
    expect(mockShowToast).toHaveBeenCalledWith('Pronto podrás agregar tus pases a Apple/Google Wallet.', 'info');
  });
});