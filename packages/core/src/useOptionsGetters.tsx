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

  const { addOptionsGetter: parentAddOptionsGetter } = React.useContext(
    NavigationBuilderContext
  );

  const getCurrentOptions = React.useCallback(() => {
    const state = getState();
    if (state === undefined) {
      return undefined;
    }
    const { key } = state.routes[state.index];
    const value = optionsGetters.current[key];
    return value === undefined ? undefined : value();
  }, [optionsGetters, getState]);

  useEffect(() => {
    return parentAddOptionsGetter?.(key as string, getCurrentOptions);
  }, [getCurrentOptions, parentAddOptionsGetter, key]);

  const addOptionsGetter = React.useCallback(
    (key: string, getter: () => object | undefined) => {
      // if there's already registered getter by navigator
      // we skip registering by route's screen
      if (optionsGetters.current[key] !== undefined) {
        return () => {};
      }
      optionsGetters.current[key] = getter;

      return () => {
        optionsGetters.current[key] = undefined;
      };
    },
    []
  );

  const getRootOptions = React.useCallback(() => {
    const key = Object.keys(optionsGetters.current)[0];
    if (key === undefined) {
      return undefined;
    }
    return optionsGetters.current[key]!();
  }, []);

  return {
    addOptionsGetter,
    getCurrentOptions,
    getRootOptions,
  };
}
