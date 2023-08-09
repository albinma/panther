import getURL from '@/utils/getURL';

async function getData(): Promise<{ status: string }> {
  const res = await fetch(getURL('/api/health'));
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();

  return data as { status: string };
}

export default async function HealthPage(): Promise<JSX.Element> {
  const data = await getData();
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-black dark:text-slate-50 transition-colors duration-150">
      <h1>Health</h1>
      <p data-testid="health-status">{data.status}</p>
    </div>
  );
}
