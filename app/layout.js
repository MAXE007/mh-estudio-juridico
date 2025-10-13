// app/layout.js
import './globals.css';

export const metadata = {
  title: 'MH ESTUDIO JURÍDICO Y ASOCIADOS — San Rafael, Mendoza',
  description:
    'Asesoramiento legal claro y efectivo. Laboral, Civil, Comercial y Consumidor. San Rafael, Mendoza.',
  openGraph: {
    title: 'MH ESTUDIO JURÍDICO Y ASOCIADOS',
    description:
      'Asesoramiento legal claro y efectivo. Laboral, Civil, Comercial y Consumidor.',
    url: 'https://tudominio.com', // <- actualizar cuando tengas el dominio real
    siteName: 'MH Estudio Jurídico',
    locale: 'es_AR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://tudominio.com', // <- actualizar al deploy
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
