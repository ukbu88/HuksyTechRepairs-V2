'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Closes a <details> menu when the route changes. Renders nothing. */
export function CloseOnNavigate({ detailsId }: { detailsId: string }) {
  const pathname = usePathname();
  useEffect(() => {
    const el = document.getElementById(detailsId);
    if (el instanceof HTMLDetailsElement) el.open = false;
  }, [pathname, detailsId]);
  return null;
}
