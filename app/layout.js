import './globals.css';

export const metadata = {
  title: 'Metasho | Multilingual Cultural Studio',
  description: 'A modern multilingual Next.js website for Metasho with stronger language separation and premium UI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
