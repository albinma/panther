'use client';

import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import Link from 'next/link';

export default function Header(): JSX.Element {
  return (
    <Navbar isBordered shouldHideOnScroll data-testid="header">
      <NavbarBrand>
        <Link
          href="/"
          className="cursor-pointer px-2 text-xl font-bold text-slate-900 md:text-3xl dark:text-slate-50 transition-colors duration-200"
        >
          Panther
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
