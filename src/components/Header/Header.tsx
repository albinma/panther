import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';
import Link from 'next/link';

export default function Header(): JSX.Element {
  return (
    <header
      data-testid="header"
      className="sticky top-0 z-50 w-full shadow-md dark:bg-black transition-colors duration-200"
    >
      <div className="flex flex-nowrap items-center justify-between px-4 py-4 md:px-8">
        <div className="grow">
          <Link
            href="/"
            className="cursor-pointer px-2 text-xl font-bold text-slate-900 md:text-3xl dark:text-slate-50 transition-colors duration-200"
          >
            Panther
          </Link>
        </div>
        <div className="flex-nowrap items-center justify-between md:flex">
          <nav className="px-6">
            <ul className="mx-auto flex flex-row items-center justify-between space-x-6">
              <li className="flex flex-row items-center">
                <ThemeSwitcher />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
