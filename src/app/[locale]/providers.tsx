'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import {
  AbstractIntlMessages,
  Formats,
  NextIntlClientProvider,
} from 'next-intl';

import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

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
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, sepolia],
    [publicProvider()],
  );

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({
        chains,
        options: {
          shimDisconnect: true,
          UNSTABLE_shimOnConnectSelectAccount: true,
        },
      }),
    ],
    publicClient,
    webSocketPublicClient,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
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
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </NextUIProvider>
    </WagmiConfig>
  );
}
