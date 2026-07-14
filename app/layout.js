import '@fontsource-variable/vazirmatn/wght.css';
import './globals.css';

export const metadata = {
  title: 'استودیو ساخت فیلم و ویدیو تبلیغاتی',
  description: 'طراحی مینیمال برای معرفی خدمات ساخت فیلم و ویدیو تبلیغاتی از صفر تا صد.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7f3eb',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
