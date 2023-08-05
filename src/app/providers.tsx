'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <NextUIProvider>
      <NextThemesProvider
        attribute="class"
        enableSystem={true}
        defaultTheme="light"
      >
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
