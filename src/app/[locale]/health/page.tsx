import HealthStatus from '@/app/[locale]/health/HealthStatus';

export const dynamic = 'force-dynamic';

export default async function HealthPage(): Promise<JSX.Element> {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-black dark:text-slate-50 transition-colors duration-150">
      <h1>Health</h1>
      <HealthStatus />
    </div>
  );
}
