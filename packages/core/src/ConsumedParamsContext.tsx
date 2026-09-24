import * as React from 'react';

/**
 * Tracks which route keys have already consumed a nested params object.
 * Keyed by route key so that the same params object can be reused for a new route,
 * while a navigator remounting under the same route doesn't re-apply the params.
 */
export const ConsumedParamsContext = React.createContext<
  WeakMap<object, Set<string>> | undefined
>(undefined);
