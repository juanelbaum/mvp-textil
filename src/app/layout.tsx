import type { Metadata } from 'next';
import './globals.css';
import { RoleProvider } from '@/providers/RoleProvider';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'TextilConnect - Plataforma Textil',
  description: 'Conectamos fabricantes de ropa con talleres textiles',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <RoleProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </RoleProvider>
      </body>
    </html>
  );
};

export default RootLayout;
