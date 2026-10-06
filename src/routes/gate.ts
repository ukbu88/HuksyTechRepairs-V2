import { notFound } from 'next/navigation';
import { getFeatures } from '@/features/snapshot';
import { findRoute, isRouteAvailable } from './catalogue';

/**
 * Call at the top of a page component. Renders Next's real 404 when the route's
 * feature is off or its content gate is closed.
 */
export function gateRoute(path: string) {
  const features = getFeatures();
  const route = findRoute(path);
  if (!route || !isRouteAvailable(route, features)) notFound();
  return { features, route };
}
