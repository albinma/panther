import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';
import React from 'react';
import { render, fireEvent } from '@tests/utils';
import { useTheme } from 'next-themes';
import messages from '@/messages/en.json';

const ThemeSpy = (): JSX.Element => {
  const { theme } = useTheme();
  return <span data-testid="theme-spy">{theme}</span>;
};

describe('ThemeSwitcher', () => {
  it('toggles the theme', async () => {
    const { getByTestId } = render(
      <>
        <ThemeSwitcher />
        <ThemeSpy />
      </>,
      { theme: 'dark' },
    );

    const button = getByTestId('theme-switcher');
    const spy = getByTestId('theme-spy');

    // default theme is init as dark, so light should be the first toggle
    fireEvent.click(button);
    expect(spy).toHaveTextContent('light');
    expect(getByTestId('theme-switcher-icon-light')).toBeInTheDocument();
    expect(button.getAttribute('aria-label')).toBe(
      messages.Components.ThemeSwitcher.SwitchToDarkMode,
    );

    // second toggle should be dark
    fireEvent.click(button);
    expect(spy).toHaveTextContent('dark');
    expect(getByTestId('theme-switcher-icon-dark')).toBeInTheDocument();
    expect(button.getAttribute('aria-label')).toBe(
      messages.Components.ThemeSwitcher.SwitchToLightMode,
    );
  });
});
