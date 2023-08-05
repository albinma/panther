'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import * as Icon from 'react-feather';
import { Button } from '@nextui-org/react';

export default function ThemeSwitcher(): JSX.Element | undefined {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // switches between the opposite of current theme on every invocation
  const toggleTheme = (): void =>
    setTheme(theme === 'light' ? 'dark' : 'light');

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return;
  }

  return (
    <Button
      data-testid="theme-switcher"
      isIconOnly
      onClick={() => toggleTheme()}
      color="default"
      variant="light"
    >
      {theme === 'light' ? (
        <Icon.Sun
          data-testid="theme-switcher-icon-light"
          className="h-unit-6 w-unit-6"
        />
      ) : (
        <Icon.Moon
          data-testid="theme-switcher-icon-dark"
          className="h-unit-6 w-unit-6 text-slate-50"
        />
      )}
    </Button>
  );
}
