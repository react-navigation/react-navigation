import { SafeAreaProviderCompat } from '@react-navigation/elements/internal';
import {
  type ParamListBase,
  type Route,
  type StackNavigationState,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform } from 'react-native';

import type {
  NativeStackDescriptor,
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../../types';
import { useInvalidPreventRemoveError } from '../../utils/useInvalidPreventRemoveError';
import { CardGroup } from './CardGroup';
import {
  createNativeStackViewState,
  nativeStackViewReducer,
} from './NativeStackViewState';
import type { RouteGroupContext } from './RouteGroupShared';
import { buildRouteGroupTree } from './RouteGroupTree';
import { SheetGroup } from './SheetGroup';

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

export function NativeStackView({ state, navigation, descriptors }: Props) {
  useInvalidPreventRemoveError(descriptors);

  const [viewState, dispatchViewState] = React.useReducer(
    nativeStackViewReducer<NativeStackDescriptor>,
    {
      index: state.index,
      routes: state.routes,
      descriptors,
    },
    createNativeStackViewState<NativeStackDescriptor>
  );

  if (
    state.index !== viewState.previous.index ||
    state.routes !== viewState.previous.routes ||
    descriptors !== viewState.previous.descriptors
  ) {
    dispatchViewState({
      type: 'SYNC_STATE',
      index: state.index,
      routes: state.routes,
      descriptors,
    });
  }

  const activeRoutes = state.routes.slice(0, state.index + 1);
  const detachedRoutes = state.routes.slice(state.index + 1);

  const renderedRoutes = viewState.renderedRoutes;
  const poppedByKey = new Map(
    viewState.popped.map((popped) => [popped.route.key, popped])
  );
  const poppedRouteKeys = new Set(poppedByKey.keys());
  const detachedRouteKeys = new Set(detachedRoutes.map((route) => route.key));

  const getDescriptor = (route: Route<string>) => {
    const descriptor =
      descriptors[route.key] ?? poppedByKey.get(route.key)?.descriptor;

    if (descriptor == null) {
      throw new Error(
        `Couldn't find descriptor for route ${route.name} (${route.key}). This is likely a bug.`
      );
    }

    return descriptor;
  };

  const stateRouteIndexByKey = new Map(
    state.routes.map((route, index) => [route.key, index])
  );
  const renderedRouteIndexByKey = new Map(
    renderedRoutes.map((route, index) => [route.key, index])
  );

  const getPreviousDescriptor = (route: Route<string>) => {
    const stateIndex = stateRouteIndexByKey.get(route.key);
    const renderedIndex = renderedRouteIndexByKey.get(route.key);
    const previousRoute =
      stateIndex != null
        ? state.routes[stateIndex - 1]
        : renderedIndex != null
          ? renderedRoutes[renderedIndex - 1]
          : undefined;

    return previousRoute == null ? undefined : getDescriptor(previousRoute);
  };

  const isFormSheet = (route: Route<string>) =>
    (Platform.OS === 'android' || Platform.OS === 'ios') &&
    getDescriptor(route).options.presentation === 'formSheet';

  if (__DEV__) {
    const sheetIndex = activeRoutes.findIndex(
      (route, index) => index !== 0 && isFormSheet(route)
    );
    const sheetRoute = activeRoutes[sheetIndex];
    const routeAboveSheet = activeRoutes[sheetIndex + 1];

    if (sheetRoute != null && routeAboveSheet != null) {
      throw new Error(
        `The route '${routeAboveSheet.name}' was pushed above the form sheet route '${sheetRoute.name}' in the same native stack. A form sheet does not create a nested stack automatically. Render a nested navigator inside '${sheetRoute.name}' and push '${routeAboveSheet.name}' on that nested navigator instead.`
      );
    }
  }

  const rootGroup = buildRouteGroupTree({
    routes: state.routes,
    renderedRoutes,
    isFormSheet,
    getAnchorRouteKey: (key) => poppedByKey.get(key)?.anchorKey,
  });

  const context: RouteGroupContext = {
    state,
    navigation,
    poppedRouteKeys,
    detachedRouteKeys,
    routeIndexByKey: stateRouteIndexByKey,
    getDescriptor,
    getPreviousDescriptor,
    onRemovePoppedRoute: (key) => {
      dispatchViewState({ type: 'REMOVE_POPPED_ROUTE', key });
    },
    onAddNativelyDismissedRoutes: (keys) => {
      dispatchViewState({ type: 'ADD_NATIVELY_DISMISSED_ROUTES', keys });
    },
  };

  const sheets = rootGroup.children.map((group, index) => {
    const sheetRoute = group.sheetRoute;

    if (sheetRoute == null) {
      throw new Error('Expected a form sheet route group. This is a bug.');
    }

    // Workaround for replacing one form sheet with another. A popped sheet
    // stays in the React tree until its native closing animation is done. If
    // the replacement opens at the same time, both native sheets try to
    // present and the new one can appear behind the old one. Keep the new
    // sheet closed until the old sheet finishes closing. Remove this when
    // FormSheet can replace another FormSheet safely in one native update.
    const isPresentationBlocked = rootGroup.children
      .slice(index + 1)
      .some(
        (sibling) =>
          sibling.sheetRoute != null &&
          poppedRouteKeys.has(sibling.sheetRoute.key)
      );

    return (
      <SheetGroup
        key={sheetRoute.key}
        context={context}
        descriptor={getDescriptor(sheetRoute)}
        routesToDismiss={group.routes}
        isPresentationBlocked={isPresentationBlocked}
      />
    );
  });

  return (
    <SafeAreaProviderCompat>
      <CardGroup context={context} routes={rootGroup.routes}>
        {sheets}
      </CardGroup>
    </SafeAreaProviderCompat>
  );
}
