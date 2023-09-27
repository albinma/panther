// https://testing-library.com/docs/react-testing-library/setup/#custom-render

import { NEXT_INTL_FORMATS } from '@/localization';
import messages from '@messages/en.json';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import React, { ReactElement } from 'react';

interface TestProviderOptions {
  theme?: string;
}

interface CustomOptions extends RenderOptions, TestProviderOptions {}

const createTestProviders =
  ({ theme = 'dark' }: TestProviderOptions) =>
  ({ children }: { children?: React.ReactNode }): JSX.Element => {
    return allProviders({ theme, children });
  };

const allProviders = ({
  theme,
  children,
}: {
  theme: string;
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <NextIntlClientProvider
      locale={'en'}
      messages={messages}
      formats={NEXT_INTL_FORMATS}
    >
      <ThemeProvider defaultTheme={theme}>{children}</ThemeProvider>
    </NextIntlClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  { theme, ...options }: CustomOptions = {},
): RenderResult =>
  render(ui, { wrapper: createTestProviders({ theme }), ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
