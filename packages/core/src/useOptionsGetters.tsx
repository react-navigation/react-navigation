import * as React from 'react';
import { useEffect } from 'react';
import NavigationBuilderContext from './NavigationBuilderContext';
import { NavigationState } from '@react-navigation/routers';

export default function useOptionsGetters({
  getState,
  key,
}: {
  getState: () => NavigationState | undefined;
  getKey?: () => string | undefined;
  key?: string | undefined;
}) {
  const optionsGetters = React.useRef<
    Record<string, (() => object | undefined) | undefined>
  >({});

  const optionsGettersFromNavigator = React.useRef<
    Record<string, (() => object | undefined) | undefined>
  >({});

  const { addOptionsGetter: parentAddOptionsGetter } = React.useContext(
    NavigationBuilderContext
  );

  const getCurrentOptions = React.useCallback(() => {
    const state = getState();
    if (state === undefined) {
      return undefined;
    }
    const { key } = state.routes[state.index];
    const getterFromNavigator = optionsGettersFromNavigator.current[key];
    if (getterFromNavigator) {
      return getterFromNavigator();
    }
    const getter = optionsGetters.current[key];
    return getter === undefined ? undefined : getter();
  }, [optionsGetters, getState]);

  useEffect(() => {
    return parentAddOptionsGetter?.(key as string, getCurrentOptions, true);
  }, [getCurrentOptions, parentAddOptionsGetter, key]);

  const addOptionsGetter = React.useCallback(
    (key: string, getter: () => object | undefined, fromNavigator: boolean) => {
      const getters = fromNavigator
        ? optionsGettersFromNavigator.current
        : optionsGetters.current;

      getters[key] = getter;

      return () => {
        getters[key] = undefined;
      };
    },
    []
  );

  const getRootOptions = React.useCallback(() => {
    const key = Object.keys(optionsGettersFromNavigator.current)[0];
    if (key === undefined) {
      return undefined;
    }
    return optionsGettersFromNavigator.current[key]!();
  }, []);

  return {
    addOptionsGetter,
    getCurrentOptions,
    getRootOptions,
  };
}
