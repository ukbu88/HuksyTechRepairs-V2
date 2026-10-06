'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Closes a <details> menu when the route changes, on Escape, or on a tap outside.
 * Progressive enhancement only: without JavaScript the menu still opens and closes
 * from its summary. Renders nothing.
 */
export function CloseOnNavigate({ detailsId }: { detailsId: string }) {
  const pathname = usePathname();
  useEffect(() => {
    const el = document.getElementById(detailsId);
    if (el instanceof HTMLDetailsElement) el.open = false;
  }, [pathname, detailsId]);
  useEffect(() => {
    const el = document.getElementById(detailsId);
    if (!(el instanceof HTMLDetailsElement)) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && el.open) {
        el.open = false;
        el.querySelector('summary')?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (el.open && e.target instanceof Node && !el.contains(e.target)) el.open = false;
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [detailsId]);
  return null;
}
