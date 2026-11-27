import type { Metadata } from 'next';
import '@/styles/main.scss';

export const metadata: Metadata = {
  title: 'MEARN-Admin',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
