import './globals.css';
import { tokens } from '@tokens/index';
import GateControls from './partials/GateControls';
import { Toast } from '@ui/index';
import Link from 'next/link';

export const metadata = {
  title: 'Monotickets Staff',
  description: 'Control de accesos en tiempo real',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body
        style={{ fontFamily: tokens.typography.bodyFont, background: '#0B0F1A' }}
        className="text-white"
      >
        <div className="min-h-screen flex flex-col">
          <header className="px-4 py-3 border-b border-white/10 bg-black/30 backdrop-blur">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
              <h1 className="font-bold">Monotickets • Staff</h1>
              <GateControls />
              <nav className="flex gap-4 text-sm">
                <Link href="/scan" className="hover:underline">
                  Escanear
                </Link>
                <Link href="/history" className="hover:underline">
                  Historial
                </Link>
                <Link href="/lookup" className="hover:underline">
                  Consulta
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 max-w-5xl mx-auto w-full p-4">{children}</main>
        </div>
        <Toast />
      </body>
    </html>
  );
}
