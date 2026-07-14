// Self-hosted Vazirmatn Variable font — covers Arabic + Latin subsets,
// weights 100–900 in a single variable file, no dependency on Google's CDN.
import '@fontsource-variable/vazirmatn/wght.css';
import './globals.css';

export const metadata = {
  title: 'Metasho | Multilingual Cultural Studio',
  description: 'A modern multilingual Next.js website for Metasho with stronger language separation and premium UI.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#060816',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
