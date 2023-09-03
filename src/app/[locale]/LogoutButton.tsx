'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton(): JSX.Element {
  return <button onClick={() => signOut()}>Log out</button>;
}
