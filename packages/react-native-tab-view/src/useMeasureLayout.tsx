import * as React from 'react';
import { type LayoutChangeEvent, type View } from 'react-native';
import useLatestCallback from 'use-latest-callback';

import type { Layout } from './types';

export function useMeasureLayout(
  ref: React.RefObject<View | null>,
  onMeasure?: (layout: Layout) => void
) {
  const [layout, setLayout] = React.useState<Layout>({ width: 0, height: 0 });

  const onMeasureLatest = useLatestCallback(({ width, height }: Layout) => {
    setLayout((layout) =>
      layout.width === width && layout.height === height
        ? layout
        : { width, height }
    );

    onMeasure?.({ width, height });
  });

  React.useLayoutEffect(() => {
    ref.current?.measure((_x, _y, width, height) => {
      onMeasureLatest({ width, height });
    });
  }, [onMeasureLatest, ref]);

  const onLayout = useLatestCallback((event: LayoutChangeEvent) => {
    onMeasureLatest(event.nativeEvent.layout);
  });

  return [layout, onLayout] as const;
}
