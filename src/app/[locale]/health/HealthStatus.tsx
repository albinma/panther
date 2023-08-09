import getURL from '@/utils/getURL';

async function getData(): Promise<{ status: string }> {
  const res = await fetch(getURL('/api/health'), {
    headers: { 'X-Request-ID': 'Test' },
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();

  return data as { status: string };
}

export default async function HealthStatus(): Promise<JSX.Element> {
  const data = await getData();

  return <p data-testid="health-status">{data.status}</p>;
}
