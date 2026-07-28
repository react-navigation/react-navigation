import { SafeAreaProviderCompat } from '@react-navigation/elements/internal';
import {
  type ParamListBase,
  StackActions,
  type StackNavigationState,
} from '@react-navigation/native';
import type { Dispatch, ReactElement } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'react-native-screens';

import type {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../../types';
import { useDismissedRouteError } from '../../utils/useDismissedRouteError';
import { useInvalidPreventRemoveError } from '../../utils/useInvalidPreventRemoveError';
import { CardScreen } from './CardScreen';
import {
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
    dispatch: Dispatch<NativeStackViewStateAction>;
  };

const SUPPORTS_FORM_SHEET = Platform.OS === 'android' || Platform.OS === 'ios';

function NativeStackViewContent({
  state,
  navigation,
  descriptors,
  renderedRoutes,
  poppedByKey,
  dispatch,
}: NativeStackViewContentProps) {
  useInvalidPreventRemoveError(descriptors);

  const { setNextDismissedKey } = useDismissedRouteError(state);

  const routeIndexByKey = new Map(
    state.routes.map((route, index) => [route.key, index])
  );

  const onRemovePoppedRoute = (key: string) => {
    dispatch({ type: 'REMOVE_POPPED_ROUTE', key });
  };

  const onNativeDismiss = ({
    key,
    markNativelyDismissed,
  }: {
    key: string;
    markNativelyDismissed: boolean;
  }) => {
    const index = routeIndexByKey.get(key);

    if (index == null) {
      return;
    }

    const dismissCount = state.index - index + 1;

    if (dismissCount < 1) {
      return;
    }

    if (markNativelyDismissed) {
      dispatch({
        type: 'ADD_NATIVELY_DISMISSED_ROUTES',
        keys: state.routes
          .slice(index, state.index + 1)
          .map((route) => route.key),
      });
    }

    navigation.dispatch({
      ...StackActions.pop(dismissCount),
      source: key,
      target: state.key,
    });

    if (markNativelyDismissed) {
      setNextDismissedKey(key);
    }
  };

  const onNativeDismissPrevented = (key: string) => {
    navigation.dispatch({
      ...StackActions.pop(),
      source: key,
      target: state.key,
    });
  };

  const { cards, sheets } = renderedRoutes.reduce<{
    cards: ReactElement[];
    sheets: ReactElement[];
  }>(
    (result, route) => {
      const index = routeIndexByKey.get(route.key);
      const popped = poppedByKey.get(route.key);
      const descriptor = descriptors[route.key] ?? popped?.descriptor;

      if (descriptor == null) {
        throw new Error(
          `Couldn't find descriptor for route ${route.name} (${route.key}). This is likely a bug.`
        );
      }

      const presentation = descriptor.options.presentation ?? 'card';

      if (presentation !== 'card' && presentation !== 'formSheet') {
        throw new Error(
          `The route '${route.name}' uses the '${presentation}' presentation, which is not supported in native stack. Only 'card' and 'formSheet' presentations are supported.`
        );
      }

      const isPopped = popped != null;
      const isSheet = SUPPORTS_FORM_SHEET && presentation === 'formSheet';

      const props = {
        descriptor,
        navigation,
        isFocused: index === state.index,
        isPopped,
        onRemovePoppedRoute,
        onNativeDismissPrevented: () => {
          onNativeDismissPrevented(route.key);
        },
      };

      if (isSheet) {
        if (index === 0) {
          throw new Error(
            `The route '${route.name}' cannot use 'formSheet' presentation because it is the first route in the native stack. Add a screen with 'card' presentation before it.`
          );
        }

        const routeAboveSheet =
          index != null && index < state.index
            ? state.routes[index + 1]
            : undefined;

        if (routeAboveSheet != null) {
          throw new Error(
            `The route '${routeAboveSheet.name}' was pushed above the form sheet route '${route.name}' in the same native stack. A form sheet does not create a nested stack automatically. Render a nested navigator inside '${route.name}' and push '${routeAboveSheet.name}' on that nested navigator instead.`
          );
        }

        if (popped?.focusedReplacementKey != null) {
          const replacementDescriptor =
            descriptors[popped.focusedReplacementKey];

          if (replacementDescriptor?.options.presentation === 'formSheet') {
            throw new Error(
              `The form sheet route '${replacementDescriptor.route.name}' cannot replace '${route.name}' in the same native stack. Wait for the previous sheet to close before presenting another sheet.`
            );
          }
        }

        result.sheets.push(
          <SheetScreen
            key={route.key}
            {...props}
            onNativeDismiss={(markNativelyDismissed) => {
              onNativeDismiss({
                key: route.key,
                markNativelyDismissed,
              });
            }}
          />
        );
      } else {
        const previousRoute =
          index == null ? undefined : state.routes[index - 1];

        const previousDescriptor = isPopped
          ? popped?.previousDescriptor
          : previousRoute == null
            ? undefined
            : descriptors[previousRoute.key];

        result.cards.push(
          <CardScreen
            key={route.key}
            {...props}
            previousDescriptor={previousDescriptor}
            isBeforeLast={index === state.index - 1}
            isDetached={index != null && index > state.index}
            onNativeDismiss={() => {
              onNativeDismiss({
                key: route.key,
                markNativelyDismissed: true,
              });
            }}
          />
        );
      }

      return result;
    },
    { cards: [], sheets: [] }
  );

  return (
    <SafeAreaProviderCompat>
      <Stack.Host>{cards}</Stack.Host>
      {sheets}
    </SafeAreaProviderCompat>
  );
}

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
