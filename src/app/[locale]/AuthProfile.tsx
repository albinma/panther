'use client';

import LogoutButton from '@/app/[locale]/LogoutButton';
import MetamaskLoginButton from '@/app/[locale]/MetamaskLoginButton';
import { useSession } from 'next-auth/react';

export default function AuthProfile(): JSX.Element {
  const session = useSession();

  return (
    <>
      <p>{session.status}</p>
      {session.status !== 'authenticated' ? (
        <MetamaskLoginButton />
      ) : (
        <LogoutButton />
      )}
    </>
  );
}
