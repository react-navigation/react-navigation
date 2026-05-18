import * as React from 'react';

// Batches onLayout updates from multiple keyed views into a single state update
// per frame, so layout passes don't trigger N renders.
export function useLayoutWidths(priorityKeys: string[]) {
  const [widths, setWidths] = React.useState<Record<string, number>>({});

  const measured = React.useRef<Record<string, number>>({});
  const handle = React.useRef<ReturnType<typeof requestAnimationFrame>>(null);

  const priorityKeysRef = React.useRef(priorityKeys);

  React.useEffect(() => {
    priorityKeysRef.current = priorityKeys;
  });

  const hasFinishedLayoutRef = React.useRef(false);

  React.useLayoutEffect(() => {
    hasFinishedLayoutRef.current = true;
  }, []);

  const onMeasureWidth = React.useCallback((key: string, width: number) => {
    measured.current[key] = width;

    if (handle.current != null) {
      cancelAnimationFrame(handle.current);
    }

    if (
      priorityKeysRef.current.includes(key) &&
      !hasFinishedLayoutRef.current
    ) {
      // Synchronously set widths during the initial layout phase
      // So we don't have to wait for the next frame to render the indicator
      setWidths((prev) => ({ ...prev, [key]: width }));
    } else if (hasFinishedLayoutRef.current) {
      handle.current = requestAnimationFrame(() => {
        setWidths({ ...measured.current });
      });
    }

    return () => {
      if (handle.current != null) {
        cancelAnimationFrame(handle.current);
      }
    };
  }, []);

  return [widths, onMeasureWidth] as const;
}
