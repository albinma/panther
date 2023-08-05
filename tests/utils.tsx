// https://testing-library.com/docs/react-testing-library/setup/#custom-render

import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';

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
  return <ThemeProvider defaultTheme={theme}>{children}</ThemeProvider>;
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
