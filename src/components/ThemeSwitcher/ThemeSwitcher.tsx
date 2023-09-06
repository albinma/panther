'use client';

import { Button } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import * as Icon from 'react-feather';

export default function ThemeSwitcher(): JSX.Element | undefined {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations('Components.ThemeSwitcher');

  const isLightMode = theme === 'light';

  // switches between the opposite of current theme on every invocation
  const toggleTheme = (): void => setTheme(isLightMode ? 'dark' : 'light');

  // set the aria label that corresponds to the target theme to switch to
  const ariaLabel = isLightMode
    ? t('SwitchToDarkMode')
    : t('SwitchToLightMode');

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
      onPress={toggleTheme}
      color="default"
      variant="light"
      aria-label={ariaLabel}
    >
      {isLightMode ? (
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
