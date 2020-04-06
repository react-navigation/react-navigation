import * as React from 'react';

const MISSING_CONTEXT_ERROR = "Couldn't find a schedule context.";

export const ScheduleUpdateContext = React.createContext<{
  scheduleUpdate: (callback: () => void) => void;
  flushUpdates: () => void;
}>({
  scheduleUpdate() {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  flushUpdates() {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

/**
 * When screen config changes, we want to update the navigator in the same update phase.
 * However, navigation state is in the root component and React won't let us update it from a child.
 * This is a workaround for that, the scheduled update is stored in the ref without actually calling setState.
 * It lets all subsequent updates access the latest state so it stays correct.
 * Then we call setState during after the component updates.
 */
export default function useScheduleUpdate(callback: () => void) {
  const { scheduleUpdate, flushUpdates } = React.useContext(
    ScheduleUpdateContext
  );

  scheduleUpdate(callback);

  React.useEffect(flushUpdates);
}
