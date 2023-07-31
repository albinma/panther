import Header from '@/components/Header/Header';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import cn from 'classnames';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Panther',
  description: 'Panther App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'dark:bg-black bg-white')}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
