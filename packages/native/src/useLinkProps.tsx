import {
  CommonActions,
  getPathFromState,
  type NavigationAction,
  NavigationContainerRefContext,
  NavigationHelpersContext,
  type NavigatorScreenParams,
  type ParamListBase,
} from '@react-navigation/core';
import type { NavigationState, PartialState } from '@react-navigation/routers';
import * as React from 'react';
import { type GestureResponderEvent, Platform } from 'react-native';

import { LinkingContext } from './LinkingContext';

const NESTED_KEYS = ['payload', 'params', 'state', 'routes'] as const;
const NESTED_PARAMS_KEYS = ['params', 'state'] as const;

/**
 * Nested params are tracked as consumed after handling
 * So navigating with same params again won't work
 * This can happen if the action or params are memoized
 * Or component hasn't re-renderd to re-create inline objects
 * So we clone the action and params when necessary before dispatch
 */
function clone<T>(value: T): T;
function clone(
  value: unknown,
  keys: typeof NESTED_KEYS | typeof NESTED_PARAMS_KEYS,
  clones: WeakMap<object, object>
): unknown;
function clone(
  value: unknown,
  keys: typeof NESTED_KEYS | typeof NESTED_PARAMS_KEYS = NESTED_KEYS,
  clones?: WeakMap<object, object>
): unknown {
  if (typeof value !== 'object' || value == null) {
    return value;
  }

  const existing = clones?.get(value);

  if (existing) {
    return existing;
  }

  const isArray = Array.isArray(value);

  if (
    keys === NESTED_PARAMS_KEYS &&
    'screen' in value &&
    typeof value.screen !== 'string' &&
    !(
      'state' in value &&
      typeof value.state === 'object' &&
      value.state != null &&
      'routes' in value.state &&
      Array.isArray(value.state.routes)
    )
  ) {
    return value;
  }

  let copy: object | undefined =
    keys === NESTED_PARAMS_KEYS ? { ...value } : undefined;

  clones ??= new WeakMap();
  clones.set(value, copy ?? value);

  for (const key of isArray ? value.keys() : keys) {
    const nested: unknown = Reflect.get(value, key);

    const cloned = clone(
      nested,
      key === 'params' ? NESTED_PARAMS_KEYS : NESTED_KEYS,
      clones
    );

    if (cloned !== nested) {
      copy ??= isArray ? [...value] : { ...value };
      clones.set(value, copy);

      Object.assign(copy, { [key]: cloned });
    }
  }

  return copy ?? value;
}

export type LinkProps<
  ParamList extends ReactNavigation.RootParamList,
  RouteName extends keyof ParamList = keyof ParamList,
> =
  | ({
      href?: string;
      action?: NavigationAction;
    } & (RouteName extends unknown
      ? undefined extends ParamList[RouteName]
        ? { screen: RouteName; params?: ParamList[RouteName] }
        : { screen: RouteName; params: ParamList[RouteName] }
      : never))
  | {
      href?: string;
      action: NavigationAction;
      screen?: undefined;
      params?: undefined;
    };

const getStateFromParams = (
  params: NavigatorScreenParams<ParamListBase> | undefined
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
          // @ts-expect-error this is fine 🔥
          state: params.screen
            ? getStateFromParams(
                params.params as
                  | NavigatorScreenParams<ParamListBase>
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
export function useLinkProps<ParamList extends ReactNavigation.RootParamList>({
  screen,
  params,
  href,
  action,
}: LinkProps<ParamList>) {
  const root = React.useContext(NavigationContainerRefContext);
  const navigation = React.useContext(NavigationHelpersContext);
  const { options } = React.useContext(LinkingContext);

  const onPress = (
    e?: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => {
    let shouldHandle = false;

    if (Platform.OS !== 'web' || !e) {
      e?.preventDefault?.();
      shouldHandle = true;
    } else {
      // ignore clicks with modifier keys
      const hasModifierKey =
        ('metaKey' in e && e.metaKey) ||
        ('altKey' in e && e.altKey) ||
        ('ctrlKey' in e && e.ctrlKey) ||
        ('shiftKey' in e && e.shiftKey);

      // only handle left clicks
      const isLeftClick =
        'button' in e ? e.button == null || e.button === 0 : true;

      // let browser handle "target=_blank" etc.
      const isSelfTarget =
        e.currentTarget && 'target' in e.currentTarget
          ? [undefined, null, '', 'self'].includes(e.currentTarget.target)
          : true;

      if (!hasModifierKey && isLeftClick && isSelfTarget) {
        e.preventDefault?.();
        shouldHandle = true;
      }
    }

    if (shouldHandle) {
      const cloned = clone(
        action ??
          // @ts-expect-error This is already type-checked by the prop types
          CommonActions.navigate(screen, params)
      );

      if (navigation) {
        navigation.dispatch(cloned);
      } else if (root) {
        root.dispatch(cloned);
      } else {
        throw new Error(
          "Couldn't find a navigation object. Is your component inside NavigationContainer?"
        );
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
                  // @ts-expect-error this is fine 🔥
                  name: screen,
                  // @ts-expect-error this is fine 🔥
                  params: params,
                  // @ts-expect-error this is fine 🔥
                  state: getStateFromParams(params),
                },
              ],
            },
            options?.config
          )
        : undefined),
    role: 'link' as const,
    onPress,
  };
}
