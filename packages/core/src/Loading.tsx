import * as React from 'react';
import { useMemo } from 'react';

import { useRoute } from './useRoute';

export enum LoadState {
  Loading,
  Completed,
  LoadedEarly, // not supported yet
  Interrupted,
}

export function registerLoader(
  loader: Loader,
  navigationAction?: () => void
): LoaderEntry {
  const abortController = new AbortController();
  const promise = loader(abortController.signal);

  const loaderRegister = {
    loader,
    abortController,
    navigationAction: navigationAction,
    promise,
    state: LoadState.Loading,
  };

  // eslint-disable-next-line promise/catch-or-return
  promise.then(() => {
    // eslint-disable-next-line promise/always-return
    if (loaderRegister?.state === LoadState.Loading) {
      loaderRegister.state = LoadState.Completed;
      loaderRegister.navigationAction?.();
    }
  });
  return loaderRegister;
}

export type Loader = (signal: AbortSignal) => Promise<any>;

export type LoaderEntry = {
  loader: Loader; // remove me
  abortController: AbortController;
  promise: Promise<any>;
  navigationAction?: () => void;
  component?: React.ComponentType<any>;
  state: LoadState;
};
export type LoadersEntries = Record<string, undefined | LoaderEntry>;

export const ScreenLoaderContext = React.createContext<{
  loadersEntries: LoadersEntries;
  invokeLoader: (name: string) => void;
}>({
  get loadersEntries(): any {
    throw new Error("Couldn't find a navigation context. ");
  },
  get invokeLoader(): any {
    throw new Error("Couldn't find a navigation context. ");
  },
});

export const SyncContext = React.createContext<{
  cancelLoading: () => void;
  syncLoading: (callback: () => void) => void;
}>({
  get cancelLoading(): any {
    throw new Error("Couldn't find a navigation context. ");
  },
  get syncLoading(): any {
    throw new Error("Couldn't find a navigation context. ");
  },
});

export function useLoadingSync() {
  const currentLoaderCallback = React.useRef<undefined | (() => void)>(
    undefined
  );
  return useMemo(
    () => ({
      cancelLoading: () => {
        currentLoaderCallback.current?.();
        currentLoaderCallback.current = undefined;
      },
      syncLoading: (callback: () => void) => {
        currentLoaderCallback.current?.();
        currentLoaderCallback.current = callback;
      },
    }),
    []
  );
}

function LoaderSuspenseFallback() {
  const route = useRoute();
  const { loadersEntries, invokeLoader } =
    React.useContext(ScreenLoaderContext);
  let loader = loadersEntries[route.name];
  if (!loader) {
    // no loading have been registered for this route. We need to make one
    invokeLoader(route.name);
  }

  loader = loadersEntries[route.name];

  if (!loader?.promise) {
    throw new Error(
      `No promise found for route ${route.name}. Make sure the loader is registered.`
    );
  }
  React.use(loader.promise);
  return null;
}

export const LoadedScreenWrapper = () => {
  const { loadersEntries } = React.useContext(ScreenLoaderContext);

  const route = useRoute();

  const loader = loadersEntries[route.name];

  const LazyComponent = loader?.component;

  if (LazyComponent) {
    // we don't wrap it inside React.load if it's already loaded
    // (otherwise the suspense boundary gets invoked for a couple of frames)
    return <LazyComponent route={route} />;
  } else {
    return <LoaderSuspenseFallback />;
  }
};
