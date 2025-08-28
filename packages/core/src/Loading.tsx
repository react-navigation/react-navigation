import { nanoid } from 'nanoid/non-secure';
import * as React from 'react';
import {
  Component,
  type LazyExoticComponent,
  use,
  useMemo,
  useRef,
} from 'react';
import useLatestCallback from 'use-latest-callback';

import type { StaticScreenProps } from './StaticNavigation';
import type { RouteProp } from './types';
import { useRoute } from './useRoute';

export const LoaderContext = React.createContext<{
  initiateLoading: (loader: () => Promise<void>, resolve: () => void) => void;
  cancelLoading: () => void;
}>({
  get initiateLoading(): any {
    throw new Error("Couldn't find a navigation context. ");
  },
  get cancelLoading(): any {
    throw new Error("Couldn't find a navigation context. ");
  },
});

export const ScreenLoaderContext = React.createContext<
  React.RefObject<Record<string, Promise<React.ComponentType<any>> | undefined>>
>({ current: {} });

// export const createLazyScreen = (
//   loader: () => Promise<React.ComponentType<any>>
// ) => {
//   return ({
//     component: function LazyComponentWrapper(props: StaticScreenProps<any>) {
//       const { componentsRef: { current } } = React.useContext(ScreenLoaderContext);
//       const route = useRoute()
//       if (!current) {
//         return null
//       }
//       return (
//         React.lazy(async () => ({
//            default: await (current as Record<string, Promise<React.ComponentType<any>>>)[route.name]
//         }))
//       )
//   };
// };

// We need to keep the lazy components around to avoid remounting
const ComponentStore: Record<
  string,
  LazyExoticComponent<React.ComponentType<any>> | undefined
> = {};

export const LoadedScreenWrapper = React.memo(function LoadedScreenWrapper() {
  const { current } = React.useContext(ScreenLoaderContext);
  const route = useRoute();
  console.log('LoadedScreenWrapper', route.name, current);
  const component = current[route.name];
  if (!component) {
    throw new Error(
      `No component found for route ${route.name}. Make sure the loader is registered.`
    );
  }
  //

  if (!ComponentStore[route.key]) {
    ComponentStore[route.key] = React.lazy(async () => {
      const Comp = await component;
      console.log('Comp', Comp.toString());
      return { default: Comp };
    });
  }

  const LazyComponent = ComponentStore[route.key];

  if (!LazyComponent) {
    throw new Error(`No component found for route ${route.name}.`);
  }
  return <LazyComponent route={route} />;
});

export const useLoadingContainer = () => {
  const currentLoader = React.useRef<{
    loader: () => Promise<void>; // we keep the loader to send signals
    resolve: () => void; // we keep the resolve to call when done
    timeoutId: ReturnType<typeof setTimeout> | null; // to clear the timeout if needed
    isTimeout: boolean; // whether the threashold has passed.
    id: string; // unique id for the loader
    // If timeouted, we don't send the signal to cancel as the screen is already loaded
  } | null>(null);

  const initiateLoading = useLatestCallback(
    (loader: () => Promise<void>, resolve: () => void) => {
      // TODO load anyway not implemented yet
      // we will need to move the loader to the screen post loading
      // const timeoutId = setTimeout(() => {
      //   if (currentLoader.current) {
      //     currentLoader.current.isTimeout = true;
      //   }
      // }, loadAnywayThreasholdMs);

      const id = nanoid();
      console.log('Initiate loading', id);

      currentLoader.current = {
        loader,
        resolve,
        timeoutId: 0 as unknown as NodeJS.Timeout,
        isTimeout: false,
        id,
      };
      // eslint-disable-next-line promise/catch-or-return
      loader().then(() => {
        // eslint-disable-next-line promise/always-return
        if (currentLoader.current && currentLoader.current.id === id) {
          currentLoader.current.resolve();
          currentLoader.current = null;
        }
      });
    }
  );

  const cancelLoading = useLatestCallback(() => {
    // TODO pass the signals
    currentLoader.current = null;
  });
  return useMemo(
    () => ({
      initiateLoading,
      cancelLoading,
    }),
    [initiateLoading, cancelLoading]
  );
};
