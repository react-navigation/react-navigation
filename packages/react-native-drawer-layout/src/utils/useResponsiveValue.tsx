import * as React from 'react';

import {
  getResponsiveValue,
  getResponsiveValueBranches,
  type ResponsiveValue,
  toCSSMediaQuery,
} from './responsiveValue';

/**
 * Resolve a responsive value based on the media queries matching on web.
 *
 * Layout related styles are handled by CSS media queries in a style tag.
 * This hook is only for cases where the resolved value is needed outside
 * of CSS, e.g. to toggle attributes such as `inert` on elements.
 */
export function useResponsiveValue<T extends string | number | boolean>(
  value: ResponsiveValue<T>
): T {
  const branches = getResponsiveValueBranches(value);

  const key = branches
    .flatMap((branch) =>
      branch.query != null ? [toCSSMediaQuery(branch.query)] : []
    )
    .join('\n');

  const subscribe = React.useCallback(
    (callback: () => void) => {
      if (key === '') {
        return () => {};
      }

      const queries = key.split('\n').map((query) => window.matchMedia(query));

      queries.forEach((query) => query.addEventListener('change', callback));

      return () => {
        queries.forEach((query) =>
          query.removeEventListener('change', callback)
        );
      };
    },
    [key]
  );

  return React.useSyncExternalStore(
    subscribe,
    () =>
      branches.find(
        (branch) =>
          branch.query == null ||
          window.matchMedia(toCSSMediaQuery(branch.query)).matches
      )?.value ?? getResponsiveValue(value, null),
    () => getResponsiveValue(value, null)
  );
}
