import Test from '@/app/[locale]/test';
import { useTranslations } from 'next-intl';

export default function Home(): JSX.Element {
  const t = useTranslations('Home');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-black dark:text-slate-50 transition-colors duration-150">
      {t('hello')}
      <Test />
    </main>
  );
}
