import * as React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import type {
  EventEmitterProps,
  NavigationState,
  Route,
  SceneRendererProps,
} from './types';

type Props<T extends Route> = SceneRendererProps &
  EventEmitterProps & {
    navigationState: NavigationState<T>;
    lazy: boolean;
    lazyPreloadDistance: number;
    index: number;
    children: (props: { loading: boolean }) => React.ReactNode;
    style?: StyleProp<ViewStyle>;
  };

export function SceneView<T extends Route>({
  children,
  navigationState,
  lazy,
  index,
  lazyPreloadDistance,
  subscribe,
  style,
}: Props<T>) {
  const [isLoading, setIsLoading] = React.useState(
    Math.abs(navigationState.index - index) > lazyPreloadDistance
  );

  if (
    isLoading &&
    Math.abs(navigationState.index - index) <= lazyPreloadDistance
  ) {
    // Always render the route when it becomes focused
    setIsLoading(false);
  }

  React.useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (lazy && isLoading) {
      // If lazy mode is enabled, listen to when we enter screens
      unsubscribe = subscribe((event) => {
        // If we're entering the current route, we need to load it
        if (event.type === 'enter' && event.index === index) {
          setIsLoading((prevState) => {
            if (prevState) {
              return false;
            }
            return prevState;
          });
        }
      });
    } else if (isLoading) {
      // If lazy mode is not enabled, render the scene with a delay if not loaded already
      // This improves the initial startup time as the scene is no longer blocking
      timer = setTimeout(() => setIsLoading(false), 0);
    }

    return () => {
      unsubscribe?.();
      clearTimeout(timer);
    };
  }, [subscribe, index, isLoading, lazy]);

  const focused = navigationState.index === index;

  return (
    <View aria-hidden={!focused} style={[styles.route, style]}>
      {children({ loading: isLoading })}
    </View>
  );
}

const styles = StyleSheet.create({
  route: {
    flex: 1,
    overflow: 'hidden',
  },
});
