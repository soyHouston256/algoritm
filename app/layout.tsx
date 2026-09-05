import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Algo · Un reto, una nueva idea', description: 'Descubre algoritmos con retos prácticos, pistas visuales y pequeños momentos de ajá.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
