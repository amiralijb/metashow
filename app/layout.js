import '@fontsource-variable/vazirmatn/wght.css';
import './globals.css';

export const metadata = {
  title: 'Metasho | Advertising Film & Video Studio',
  description: 'A minimal, premium website for Metasho focused on advertising film and video production from idea to delivery.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050816',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
