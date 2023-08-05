import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';
import React from 'react';
import { render, fireEvent } from '@tests/utils';
import { useTheme } from 'next-themes';

const ThemeSpy = (): JSX.Element => {
  const { theme } = useTheme();
  return <span data-testid="theme-spy">{theme}</span>;
};

describe('ThemeSwitcher', () => {
  let localStorageMock: { [key: string]: string } = {};

  beforeEach(() => {
    global.matchMedia = jest.fn((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    global.Storage.prototype.getItem = jest.fn(
      (key: string) => localStorageMock[key],
    );
    global.Storage.prototype.setItem = jest.fn((key: string, value: string) => {
      localStorageMock[key] = value;
    });

    localStorageMock = {};
  });

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

    // second toggle should be dark
    fireEvent.click(button);
    expect(spy).toHaveTextContent('dark');
    expect(getByTestId('theme-switcher-icon-dark')).toBeInTheDocument();
  });
});
