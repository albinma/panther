import Header from '@/components/Header/Header';
import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import cn from 'classnames';
import Providers from '@/app/[locale]/providers';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Panther',
  description: 'Panther App',
};

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}): Promise<JSX.Element> {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn(inter.className, 'dark:bg-black bg-white')}>
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
