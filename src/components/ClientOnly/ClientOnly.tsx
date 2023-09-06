// https://www.joshwcomeau.com/react/the-perils-of-rehydration/#the-solution
// This is a component that will only render on the client side.
// It's to combat the hydration mismatch issue that Next.js has.

'use client';

import { useEffect, useState } from 'react';

export default function ClientOnly({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element | null {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Render
  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
