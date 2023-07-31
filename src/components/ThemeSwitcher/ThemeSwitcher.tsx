'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import * as Icon from 'react-feather';

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
    <button onClick={() => toggleTheme()}>
      {theme === 'light' ? (
        <Icon.Sun className="h-6 w-6" />
      ) : (
        <Icon.Moon className="h-6 w-6 text-slate-50" />
      )}
    </button>
  );
}
