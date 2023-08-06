import Header from '@/components/Header/Header';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import cn from 'classnames';
import Providers from '@/app/[locale]/providers';
import { notFound } from 'next/navigation';
import { isRtlLang } from 'rtl-detect';
import { AbstractIntlMessages } from 'next-intl';
import { NEXT_INTL_FORMATS, SUPPORTED_LOCALES } from '@/localization';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Panther',
  description: 'Panther App',
};

async function getMessages(locale: string): Promise<AbstractIntlMessages> {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export function generateStaticParams(): { locale: string }[] {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}): Promise<JSX.Element> {
  const messages = await getMessages(locale);
  const dir = isRtlLang(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={cn(inter.className, 'dark:bg-black bg-white')}>
        <Providers
          locale={locale}
          messages={messages}
          formats={NEXT_INTL_FORMATS}
        >
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
