import AuthProfile from '@/app/[locale]/AuthProfile';

export default async function IndexPage(): Promise<JSX.Element> {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-black dark:text-slate-50 transition-colors duration-150">
      <AuthProfile />
    </main>
  );
}
