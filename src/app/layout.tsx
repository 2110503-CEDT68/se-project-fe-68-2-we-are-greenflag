import './globals.css';
import type { Metadata } from 'next';
import ThemeManager from '../components/ThemeManager';

export const metadata: Metadata = {
  title: 'WorkSpace',
  description: 'Coworking space management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeManager />
        {children}
      </body>
    </html>
  );
}
