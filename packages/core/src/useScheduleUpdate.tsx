import * as React from 'react';

import { NavigationBuilderContext } from './NavigationBuilderContext';
import { useClientLayoutEffect } from './useClientLayoutEffect';

/**
 * When screen config changes, we want to update the navigator in the same update phase.
 * However, navigation state is in the root component and React won't let us update it from a child during render.
 * The render could also be interrupted in concurrent mode, so we need to update after commit.
 * So we queue the update in an insertion effect and flush it in a layout effect.
 * Insertion effects run before layout effects, so every navigator in the tree has queued its update before we flush.
 * This lets nested updates be applied from the root down without clobbering each other.
 */
export function useScheduleUpdate(callback: () => void) {
  const { scheduleUpdate, flushUpdates } = React.useContext(
    NavigationBuilderContext
  );

  React.useInsertionEffect(() => {
    scheduleUpdate(callback);
  });

  useClientLayoutEffect(flushUpdates);
}
