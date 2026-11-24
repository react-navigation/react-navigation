import { SafeAreaProviderCompat } from '@react-navigation/elements/internal';
import {
  type ParamListBase,
  StackActions,
  type StackNavigationState,
  useLocale,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Stack } from 'react-native-screens';

import type {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../../types';
import { useDismissedRouteError } from '../../utils/useDismissedRouteError';
import { useInvalidPreventRemoveError } from '../../utils/useInvalidPreventRemoveError';
import { CardScreen } from './CardScreen';
import {
  getPresentationType,
  type NativeStackViewState,
  type NativeStackViewStateAction,
  useViewState,
} from './NativeStackViewState';
import { SheetScreen } from './SheetScreen';

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

type NativeStackViewContentProps = Props &
  Pick<NativeStackViewState, 'renderedRoutes' | 'poppedByKey'> & {
    dispatch: React.Dispatch<NativeStackViewStateAction>;
  };

function NativeStackViewContent({
  state,
  navigation,
  descriptors,
  renderedRoutes,
  poppedByKey,
  dispatch,
}: NativeStackViewContentProps) {
  useInvalidPreventRemoveError(descriptors);

  const { direction } = useLocale();
  const { dark } = useTheme();

  const { setNextDismissedKey } = useDismissedRouteError(state);

  const routeIndexByKey = new Map(
    state.routes.map((route, index) => [route.key, index])
  );

  const onRemovePoppedRoute = React.useCallback(
    (key: string) => {
      dispatch({ type: 'REMOVE_POPPED_ROUTE', key });
    },
    [dispatch]
  );

  const onNativeDismiss = React.useCallback(
    (key: string) => {
      const currentState = navigation.getState();
      const index = currentState.routes.findIndex((route) => route.key === key);

      // The route can be already removed in JS, e.g. if it was popped while user swiped back
      // In this case, native dismissal finishes the pop, so it doesn't need to be rendered anymore
      if (index === -1) {
        dispatch({ type: 'REMOVE_POPPED_ROUTE', key });

        return;
      }

      if (index > currentState.index) {
        return;
      }

      dispatch({
        type: 'ADD_NATIVELY_DISMISSED_ROUTES',
        keys: currentState.routes
          .slice(index, currentState.index + 1)
          .map((route) => route.key),
      });

      navigation.dispatch({
        ...StackActions.dismiss(),
        source: key,
        target: currentState.key,
      });

      setNextDismissedKey(key);
    },
    [dispatch, navigation, setNextDismissedKey]
  );

  const onNativeDismissPrevented = React.useCallback(
    (key: string) => {
      const currentState = navigation.getState();
      const route = currentState.routes.find((route) => route.key === key);

      if (route == null) {
        return;
      }

      navigation.dispatch({
        ...StackActions.dismiss(),
        source: key,
        target: currentState.key,
      });
    },
    [navigation]
  );

  const cards: React.ReactElement[] = [];
  const sheets: React.ReactElement[] = [];

  for (const route of renderedRoutes) {
    const index = routeIndexByKey.get(route.key);
    const popped = poppedByKey.get(route.key);
    const descriptor = descriptors[route.key] ?? popped?.descriptor;

    if (descriptor == null) {
      throw new Error(
        `Couldn't find descriptor for route ${route.name} (${route.key}). This is likely a bug.`
      );
    }

    const presentationType = getPresentationType(descriptor);

    const props = {
      descriptor,
      navigation,
      isFocused: index === state.index,
      onRemovePoppedRoute,
      onNativeDismiss,
    };

    if (presentationType === 'card') {
      const previousRoute = index == null ? undefined : state.routes[index - 1];

      const previousDescriptor =
        popped != null
          ? popped.previousDescriptor
          : previousRoute == null
            ? undefined
            : descriptors[previousRoute.key];

      cards.push(
        <CardScreen
          key={route.key}
          {...props}
          previousDescriptor={previousDescriptor}
          isPopped={popped != null}
          isBeforeLast={index === state.index - 1}
          isDetached={index != null && index > state.index}
          hasNestedState={index != null && state.routes[index]?.state != null}
          onNativeDismissPrevented={onNativeDismissPrevented}
        />
      );

      continue;
    }

    const { presentation } = descriptor.options;

    if (index === 0) {
      throw new Error(
        `The route '${route.name}' cannot use '${presentation}' presentation because it is the first route in the native stack. Add a screen with 'card' presentation before it.`
      );
    }

    const routeAbove =
      index != null && index < state.index
        ? state.routes[index + 1]
        : undefined;

    if (routeAbove != null) {
      throw new Error(
        `The route '${routeAbove.name}' was pushed above the '${presentation}' route '${route.name}' in the same native stack. A '${presentation}' route does not create a nested stack automatically. Render a nested navigator inside '${route.name}' and push '${routeAbove.name}' on that nested navigator instead.`
      );
    }

    sheets.push(
      <SheetScreen
        key={route.key}
        {...props}
        onNativeDismissPrevented={onNativeDismissPrevented}
      />
    );
  }

  return (
    <SafeAreaProviderCompat>
      <Stack.Host direction={direction} colorScheme={dark ? 'dark' : 'light'}>
        {cards}
      </Stack.Host>
      {sheets}
    </SafeAreaProviderCompat>
  );
}

// The view state is synced during render, so the content needs to be a separate component
// Otherwise it'd render with outdated routes before the synced state is available
export function NativeStackView({ state, navigation, descriptors }: Props) {
  const [{ renderedRoutes, poppedByKey }, dispatch] = useViewState({
    state,
    descriptors,
  });

  return (
    <NativeStackViewContent
      state={state}
      navigation={navigation}
      descriptors={descriptors}
      renderedRoutes={renderedRoutes}
      poppedByKey={poppedByKey}
      dispatch={dispatch}
    />
  );
}
