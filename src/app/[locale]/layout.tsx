import Providers from '@/app/[locale]/providers';
import Header from '@/components/Header/Header';
import { NEXT_INTL_FORMATS, SUPPORTED_LOCALES } from '@/localization';
import cn from 'classnames';
import type { Metadata } from 'next';
import { createTranslator } from 'next-intl';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { isRtlLang } from 'rtl-detect';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const messages = await getMessages(locale);

  // You can use the core (non-React) APIs when you have to use next-intl
  // outside of components. Potentially this will be simplified in the future
  // (see https://next-intl-docs.vercel.app/docs/next-13/server-components).
  const t = createTranslator({ locale, messages });

  return {
    title: t('LocalLayout.title'),
    description: t('LocalLayout.description'),
  };
}

async function getMessages(locale: string): Promise<IntlMessages> {
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
}: Props): Promise<JSX.Element> {
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
