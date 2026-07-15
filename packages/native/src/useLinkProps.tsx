import {
  CommonActions,
  getPathFromState,
  type NavigationAction,
  NavigationContainerRefContext,
  NavigationHelpersContext,
} from '@react-navigation/core';
import * as React from 'react';
import { type GestureResponderEvent, Platform } from 'react-native';
import useLatestCallback from 'use-latest-callback';

import { LinkingContext } from './LinkingContext';
import { useDeepStableValue } from './useDeepStableValue';

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

const NESTED_KEYS = ['payload', 'params', 'state', 'routes'] as const;
const NESTED_PARAMS_KEYS = ['params', 'state'] as const;
const NAVIGATE_ACTION_TYPES = [
  'NAVIGATE',
  'PUSH',
  'REPLACE',
  'POP_TO',
  'JUMP_TO',
];

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

const getTargetFromAction = (
  action: NavigationAction | undefined,
  screens: Record<string, unknown> | undefined
) => {
  if (action === undefined || screens === undefined) {
    return undefined;
  }

  const { payload } = action;

  if (
    !NAVIGATE_ACTION_TYPES.includes(action.type) ||
    payload === undefined ||
    !('name' in payload) ||
    typeof payload.name !== 'string' ||
    !(payload.name in screens)
  ) {
    return undefined;
  }

  return {
    screen: payload.name,
    params:
      'params' in payload &&
      typeof payload.params === 'object' &&
      payload.params != null
        ? payload.params
        : undefined,
  };
};

/**
 * Hook to get props for an anchor tag so it can work with in page navigation.
 *
 * @param props.screen Name of the screen to navigate to (e.g. `'Feeds'`).
 * @param props.params Params to pass to the screen to navigate to (e.g. `{ sort: 'hot' }`).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to override the in-page navigation. The `href` is still derived from `screen`, so this can be used to render a link while dispatching a different action (e.g. a `replace`).
 */
export function useLinkProps<ParamList extends ReactNavigation.RootParamList>({
  screen,
  params,
  action,
  ...rest
}: LinkProps<ParamList>) {
  const root = React.useContext(NavigationContainerRefContext);
  const navigation = React.useContext(NavigationHelpersContext) ?? root;

  if (navigation == null) {
    throw new Error(
      "Couldn't find a navigation object. Is your component inside NavigationContainer?"
    );
  }

  const { options } = React.useContext(LinkingContext);

  const onPress = useLatestCallback(
    (
      e?:
        | React.MouseEvent<HTMLAnchorElement, MouseEvent>
        | GestureResponderEvent
    ) => {
      if (Platform.OS === 'web' && e) {
        const hasModifierKey =
          ('metaKey' in e && e.metaKey) ||
          ('altKey' in e && e.altKey) ||
          ('ctrlKey' in e && e.ctrlKey) ||
          ('shiftKey' in e && e.shiftKey);

        const isLeftClick =
          'button' in e ? e.button == null || e.button === 0 : true;

        const isSelfTarget =
          e.currentTarget && 'target' in e.currentTarget
            ? [undefined, null, '', '_self'].includes(e.currentTarget.target)
            : true;

        if (hasModifierKey || !isLeftClick || !isSelfTarget) {
          return;
        }
      }

      e?.preventDefault();

      let cloned: NavigationAction;

      if (action != null) {
        cloned = clone(action);
      } else {
        if (screen == null) {
          throw new Error(
            "Couldn't find a screen to navigate to. Make sure to provide a screen name."
          );
        }

        cloned = clone(
          // @ts-expect-error This is already type-checked by the prop types
          CommonActions.navigate(screen, params)
        );
      }

      navigation.dispatch(cloned);
    }
  );

  const target = useDeepStableValue(
    Platform.OS === 'web'
      ? typeof screen === 'string'
        ? {
            screen,
            params:
              typeof params === 'object' && params != null ? params : undefined,
          }
        : getTargetFromAction(action, options?.config?.screens)
      : undefined
  );

  const href = React.useMemo(() => {
    if (Platform.OS !== 'web' || rest.href != null || target == null) {
      return rest.href;
    }

    const getPath = options?.getPathFromState ?? getPathFromState;

    return getPath(
      {
        routes: [
          {
            name: target.screen,
            params: target.params,
          },
        ],
      },
      options?.config
    );
  }, [rest.href, target, options?.getPathFromState, options?.config]);

  return {
    href,
    role: 'link' as const,
    onPress,
  };
}
