'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import {
  AbstractIntlMessages,
  Formats,
  NextIntlClientProvider,
} from 'next-intl';
import { WagmiConfig } from 'wagmi';
import wagmiConfig from '@/configs/wagmi';

export default function Providers({
  children,
  locale,
  messages,
  formats,
}: {
  children: React.ReactNode;
  locale?: string;
  messages?: AbstractIntlMessages;
  formats?: Partial<Formats>;
}): JSX.Element {
  return (
    <NextUIProvider>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        formats={formats}
      >
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="light"
        >
          <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
        </ThemeProvider>
      </NextIntlClientProvider>
    </NextUIProvider>
  );
}
