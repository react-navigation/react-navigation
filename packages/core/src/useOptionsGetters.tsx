import * as React from 'react';
import NavigationStateContext from './NavigationStateContext';
import { NavigationState } from '@react-navigation/routers';

export default function useOptionsGetters({
  key,
  getOptions,
  getState,
}: {
  key?: string;
  getOptions?: () => object | undefined;
  getState?: () => NavigationState;
}) {
  const optionsGettersFromChild = React.useRef<
    Record<string, (() => object | undefined | null) | undefined>
  >({});

  const { addOptionsGetter: parentAddOptionsGetter } = React.useContext(
    NavigationStateContext
  );

  const getOptionsFromListener = React.useCallback(() => {
    for (let key in optionsGettersFromChild.current) {
      if (optionsGettersFromChild.current.hasOwnProperty(key)) {
        const result = optionsGettersFromChild.current[key]?.();
        // null means unfocused route
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  }, []);

  const getCurrentOptions = React.useCallback(() => {
    if (getState) {
      const state = getState();
      if (state.routes[state.index].key !== key) {
        // null means unfocused route
        return null;
      }
    }

    const optionsFromListener = getOptionsFromListener();
    if (optionsFromListener !== null) {
      return optionsFromListener;
    }
    return getOptions?.() ?? undefined;
  }, [getState, getOptionsFromListener, getOptions, key]);

  React.useEffect(() => {
    return parentAddOptionsGetter?.(key!, getCurrentOptions);
  }, [getCurrentOptions, parentAddOptionsGetter, key]);

  const addOptionsGetter = React.useCallback(
    (key: string, getter: () => object | undefined | null) => {
      optionsGettersFromChild.current[key] = getter;

      return () => {
        optionsGettersFromChild.current[key] = undefined;
      };
    },
    []
  );

  return {
    addOptionsGetter,
    getCurrentOptions,
  };
}
