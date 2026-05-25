import type {
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import * as React from 'react';

import type { BottomTabDescriptorMap } from '../types';

type Props = {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  eager?: boolean | undefined;
};

export function useDeferredRouteKeys({ state, descriptors, eager }: Props) {
  const focusedRouteKey = state.routes[state.index].key;

  const [routesToRender, setRoutesToRender] = React.useState([focusedRouteKey]);

  React.useEffect(() => {
    React.startTransition(() => {
      setRoutesToRender((current) => {
        const routes = state.routes
          .filter((route) => {
            const { lazy = !eager } = descriptors[route.key].options;

            return route.key === focusedRouteKey || lazy === false;
          })
          .map((route) => route.key);

        return routes.length === current.length &&
          routes.every((key, index) => key === current[index])
          ? current
          : routes;
      });
    });
  }, [descriptors, eager, focusedRouteKey, state.routes]);

  return routesToRender;
}
