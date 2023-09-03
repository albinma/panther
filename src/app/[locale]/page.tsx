import { getSession } from '@auth0/nextjs-auth0';

export default async function IndexPage(): Promise<JSX.Element> {
  const session = await getSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-black dark:text-slate-50 transition-colors duration-150">
      <a href="/api/auth/login">Login</a>
      <a href="/api/auth/logout">Logout</a>
      {session && session.user && (
        <div>
          <img src={session.user.picture} alt="pic" />
          <h2>{session.user.nickname}</h2>
          <p>{session.user.sub}</p>
        </div>
      )}
    </main>
  );
}
