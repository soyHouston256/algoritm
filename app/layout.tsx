import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Algo · De cero a estructuras de datos',
  description:
    '37 retos guiados: desde variables y bucles hasta linked lists, árboles, grafos y programación dinámica. Aprende con pistas visuales y casos prácticos.',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
