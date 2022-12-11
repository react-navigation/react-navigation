import {
  getPathFromState,
  NavigationAction,
  NavigationContainerRefContext,
  NavigationHelpersContext,
  NavigatorScreenParams,
  ParamListBase,
} from '@react-navigation/core';
import type { NavigationState, PartialState } from '@react-navigation/routers';
import * as React from 'react';
import { GestureResponderEvent, Platform } from 'react-native';

import LinkingContext from './LinkingContext';

export type Props<
  ParamList extends ReactNavigation.RootParamList,
  RouteName extends keyof ParamList = keyof ParamList
> =
  | ({
      screen: Extract<RouteName, string>;
      href?: string;
      action?: NavigationAction;
    } & (undefined extends ParamList[RouteName]
      ? { params?: ParamList[RouteName] }
      : { params: ParamList[RouteName] }))
  | {
      href?: string;
      action: NavigationAction;
      screen?: undefined;
      params?: undefined;
    };

const getStateFromParams = (
  params: NavigatorScreenParams<ParamListBase, NavigationState> | undefined
): PartialState<NavigationState> | NavigationState | undefined => {
  if (params?.state) {
    return params.state;
  }

  if (params?.screen) {
    return {
      routes: [
        {
          name: params.screen,
          params: params.params,
          // @ts-expect-error
          state: params.screen
            ? getStateFromParams(
                params.params as
                  | NavigatorScreenParams<ParamListBase, NavigationState>
                  | undefined
              )
            : undefined,
        },
      ],
    };
  }

  return undefined;
};

/**
 * Hook to get props for an anchor tag so it can work with in page navigation.
 *
 * @param props.screen Name of the screen to navigate to (e.g. `'Feeds'`).
 * @param props.params Params to pass to the screen to navigate to (e.g. `{ sort: 'hot' }`).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 */
export default function useLinkProps<
  ParamList extends ReactNavigation.RootParamList
>({ screen, params, href, action }: Props<ParamList>) {
  const root = React.useContext(NavigationContainerRefContext);
  const navigation = React.useContext(NavigationHelpersContext);
  const { options } = React.useContext(LinkingContext);

  const onPress = (
    e?: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => {
    let shouldHandle = false;

    if (Platform.OS !== 'web' || !e) {
      shouldHandle = e ? !e.defaultPrevented : true;
    } else if (
      !e.defaultPrevented && // onPress prevented default
      // @ts-expect-error: these properties exist on web, but not in React Native
      !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && // ignore clicks with modifier keys
      // @ts-expect-error: these properties exist on web, but not in React Native
      (e.button == null || e.button === 0) && // ignore everything but left clicks
      // @ts-expect-error: these properties exist on web, but not in React Native
      [undefined, null, '', 'self'].includes(e.currentTarget?.target) // let browser handle "target=_blank" etc.
    ) {
      e.preventDefault();
      shouldHandle = true;
    }

    if (shouldHandle) {
      if (action) {
        if (navigation) {
          navigation.dispatch(action);
        } else if (root) {
          root.dispatch(action);
        } else {
          throw new Error(
            "Couldn't find a navigation object. Is your component inside NavigationContainer?"
          );
        }
      } else {
        // @ts-expect-error: This is already type-checked by the prop types
        navigation?.navigate(screen, params);
      }
    }
  };

  const getPathFromStateHelper = options?.getPathFromState ?? getPathFromState;

  return {
    href:
      href ??
      (Platform.OS === 'web' && screen != null
        ? getPathFromStateHelper(
            {
              routes: [
                {
                  name: screen,
                  // @ts-expect-error
                  params: params,
                  // @ts-expect-error
                  state: getStateFromParams(params),
                },
              ],
            },
            options?.config
          )
        : undefined),
    accessibilityRole: 'link' as const,
    onPress,
  };
}
