import './globals.css';

export const metadata = {
  title: 'Metasho | Cultural, Artistic & Media Studio',
  description: 'A modern multilingual Next.js website for Metasho.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
