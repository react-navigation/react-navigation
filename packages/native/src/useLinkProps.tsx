import {
  CommonActions,
  type FocusedRouteState,
  getPathFromState,
  type NavigationAction,
  type NavigationContainerRef,
  NavigationContainerRefContext,
  NavigationContext,
  NavigationFocusedRouteStateContext,
  type NavigationHelpers,
  NavigationHelpersContext,
  type NavigationProp,
  type NavigatorScreenParams,
  type ParamListBase,
  type ParamListForNavigator,
  type RootParamList,
} from '@react-navigation/core';
import * as React from 'react';
import type { GestureResponderEvent } from 'react-native';
import useLatestCallback from 'use-latest-callback';

import { IS_NATIVE } from './constants';
import { LinkingContext } from './LinkingContext';
import { useDeepStableValue } from './useDeepStableValue';

type LinkScreenTargetProps<
  ParamList extends {},
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
> = RouteName extends unknown
  ? undefined extends ParamList[RouteName]
    ? {
        href?: string | undefined;
        action?: NavigationAction | undefined;
        in?: Extract<keyof ParamList, string> | undefined;
        screen: RouteName;
        params?: ParamList[RouteName] | undefined;
      }
    : {
        href?: string | undefined;
        action?: NavigationAction | undefined;
        in?: Extract<keyof ParamList, string> | undefined;
        screen: RouteName;
        params: ParamList[RouteName];
      }
  : never;

type LinkScreenTargetPropsWithIn<
  ParamList extends {},
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
> = RouteName extends unknown
  ? undefined extends ParamList[RouteName]
    ? {
        href?: string | undefined;
        action?: NavigationAction | undefined;
        in: Extract<keyof ParamList, string>;
        screen: RouteName;
        params?: ParamList[RouteName] | undefined;
      }
    : {
        href?: string | undefined;
        action?: NavigationAction | undefined;
        in: Extract<keyof ParamList, string>;
        screen: RouteName;
        params: ParamList[RouteName];
      }
  : never;

type LinkPropsWithInForParams<Params> = [Params] extends [never]
  ? never
  : [Params] extends [NavigatorScreenParams<infer Navigator>]
    ? ParamListForNavigator<Navigator> extends infer NestedParamList extends {}
      ?
          | LinkScreenTargetPropsWithIn<NestedParamList>
          | LinkPropsWithIn<NestedParamList>
      : never
    : never;

type LinkPropsWithIn<ParamList extends {}> = string extends keyof ParamList
  ? never
  : {
      [RouteName in keyof ParamList]: LinkPropsWithInForParams<
        Exclude<ParamList[RouteName], undefined>
      >;
    }[keyof ParamList];

export type LinkProps<
  ParamList extends {} = RootParamList,
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
> =
  | LinkScreenTargetProps<ParamList, RouteName>
  | LinkPropsWithIn<ParamList>
  | {
      href?: string | undefined;
      action: NavigationAction;
      in?: undefined;
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

      Reflect.set(copy, key, cloned);
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

const getStateForParent = (
  parent: string | undefined,
  targetState: FocusedRouteState,
  focusedRouteState: FocusedRouteState | undefined
): FocusedRouteState | undefined => {
  if (parent === undefined) {
    return targetState;
  }

  if (focusedRouteState === undefined) {
    return undefined;
  }

  const route = focusedRouteState.routes[0];

  const childState = getStateForParent(parent, targetState, route.state);

  if (childState !== undefined) {
    return {
      routes: [
        {
          ...route,
          state: childState,
        },
      ],
    };
  }

  if (route.name === parent) {
    return targetState;
  }

  return undefined;
};

/**
 * Hook to get props for an anchor tag so it can work with in page navigation.
 *
 * @param props.in Name of the current or parent screen whose navigator contains the target screen.
 * @param props.screen Name of the screen to navigate to (e.g. `'Feeds'`).
 * @param props.params Params to pass to the screen to navigate to (e.g. `{ sort: 'hot' }`).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to override the in-page navigation. The `href` is still derived from `screen`, so this can be used to render a link while dispatching a different action (e.g. a `replace`).
 */
export function useLinkProps<
  ParamList extends {} = RootParamList,
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
>({
  in: parent,
  screen,
  params,
  action,
  ...rest
}: LinkProps<NoInfer<ParamList>, RouteName>) {
  const root = React.use(NavigationContainerRefContext);

  let navigation:
    | NavigationHelpers<ParamListBase>
    | NavigationProp<ParamListBase>
    | NavigationContainerRef<ParamListBase>
    | undefined = React.use(NavigationContext);

  if (parent != null) {
    navigation = navigation?.getParent(parent);
  } else if (action != null) {
    const helpers = React.use(NavigationHelpersContext);

    // Handle custom actions in the immediate parent
    navigation = helpers ?? navigation ?? root;
  } else {
    // The ref dispatches in currently focused screen
    // So prefer the top-most navigator if available
    let parent = navigation?.getParent();

    while (parent !== undefined) {
      navigation = parent;
      parent = navigation.getParent();
    }

    navigation = navigation ?? root;
  }

  if (navigation == null) {
    if (parent != null) {
      throw new Error(
        `Couldn't find a navigation object for '${parent}' in current or any parent screens. Is your component inside the correct screen?`
      );
    }

    throw new Error(
      "Couldn't find a navigation object. Is your component inside NavigationContainer?"
    );
  }

  const { options } = React.use(LinkingContext);

  const onPress = useLatestCallback(
    (
      e?:
        | React.MouseEvent<HTMLAnchorElement, MouseEvent>
        | GestureResponderEvent
    ) => {
      if (!IS_NATIVE && e) {
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
            ? [undefined, null, '', '_self'].includes(e.currentTarget.target)
            : true;

        // let the browser handle the interaction
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
          CommonActions.navigate(
            screen,
            // @ts-expect-error This is already type-checked by the prop types
            params
          )
        );

        if (parent != null) {
          cloned = {
            ...cloned,
            target: navigation.getState()?.key,
          };
        }
      }

      navigation.dispatch(cloned);
    }
  );

  const target = useDeepStableValue(
    !IS_NATIVE
      ? typeof screen === 'string'
        ? {
            screen,
            params:
              typeof params === 'object' && params != null ? params : undefined,
          }
        : getTargetFromAction(action, options?.config?.screens)
      : undefined
  );

  const state =
    !IS_NATIVE && rest.href == null && target != null
      ? React.use(NavigationFocusedRouteStateContext)
      : undefined;

  const href = React.useMemo(() => {
    if (IS_NATIVE || rest.href != null || target == null) {
      return rest.href;
    }

    const stateForParent = getStateForParent(
      parent,
      {
        routes: [
          {
            name: target.screen,
            params: target.params,
          },
        ],
      },
      state
    );

    if (stateForParent) {
      const getPath = options?.getPathFromState ?? getPathFromState;

      return getPath(stateForParent, options?.config);
    }

    return undefined;
  }, [
    rest.href,
    target,
    parent,
    state,
    options?.getPathFromState,
    options?.config,
  ]);

  return {
    href,
    role: 'link' as const,
    onPress,
  };
}
