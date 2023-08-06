import Header from '@/components/Header/Header';
import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import cn from 'classnames';
import Providers from '@/app/[locale]/providers';
import { notFound } from 'next/navigation';
import { isRtlLang } from 'rtl-detect';
import { FORMATS } from '@/i18n';

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

  const dir = isRtlLang(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={cn(inter.className, 'dark:bg-black bg-white')}>
        <Providers locale={locale} messages={messages} formats={FORMATS}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
