import * as React from 'react';

import { NavigationBuilderContext } from './NavigationBuilderContext';
import { NavigationStateContext } from './NavigationStateContext';
import { IsFocusedContext } from './useIsFocused';

type Options = {
  key?: string;
  options?: object | undefined;
  getFocusedRouteKey?: () => string | undefined;
};

export function useOptionsGetters({
  key,
  options,
  getFocusedRouteKey,
}: Options) {
  const isFocused = React.use(IsFocusedContext) ?? true;

  const optionsRef = React.useRef<object | undefined>(options);
  const optionsGettersFromChildRef = React.useRef<
    Record<string, () => object | undefined | null>
  >({});

  const onOptionsChange = React.use(NavigationBuilderContext)?.onOptionsChange;

  const { addOptionsGetter: parentAddOptionsGetter } = React.use(
    NavigationStateContext
  );

  React.useInsertionEffect(() => {
    optionsRef.current = options;
  }, [options]);

  React.useEffect(() => {
    onOptionsChange?.();
  }, [isFocused, onOptionsChange, options]);

  const getOptionsFromListener = React.useCallback(() => {
    for (const key in optionsGettersFromChildRef.current) {
      if (key in optionsGettersFromChildRef.current) {
        const result = optionsGettersFromChildRef.current[key]?.();

        // null means unfocused route
        if (result !== null) {
          return result;
        }
      }
    }

    return null;
  }, []);

  const getCurrentOptions = React.useCallback(() => {
    // We use focused route key from the navigator instead of `isFocused`
    // Because `isFocused` may reflect the value the screen last rendered with,
    // e.g. if `Activity` hides the screen before it rendered the new value,
    // it updates at a lower priority, so it may be delayed.
    if (key != null && getFocusedRouteKey?.() !== key) {
      return null;
    }

    const optionsFromListener = getOptionsFromListener();

    if (optionsFromListener !== null) {
      return optionsFromListener;
    }

    return optionsRef.current;
  }, [key, getFocusedRouteKey, getOptionsFromListener]);

  React.useInsertionEffect(() => {
    // We don't have a parent at the root
    if (key != null) {
      return parentAddOptionsGetter?.(key, getCurrentOptions);
    }
  }, [getCurrentOptions, parentAddOptionsGetter, key]);

  const addOptionsGetter = React.useCallback(
    (key: string, getter: () => object | undefined | null) => {
      optionsGettersFromChildRef.current[key] = getter;

      return () => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete optionsGettersFromChildRef.current[key];

        // Other getters and the focused route may still change during cleanup.
        // Wait until the commit finishes before reporting the remaining options.
        if (onOptionsChange !== undefined) {
          queueMicrotask(onOptionsChange);
        }
      };
    },
    [onOptionsChange]
  );

  return {
    addOptionsGetter,
    getCurrentOptions,
  };
}
