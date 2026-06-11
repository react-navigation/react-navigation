import {
  CommonActions,
  getPathFromState,
  type NavigationAction,
  NavigationContainerRefContext,
  NavigationContext,
  type NavigationProp,
  NavigationRouteContext,
  type NavigatorScreenParams,
  type ParamListBase,
  type RootParamList,
  useStateForPath,
} from '@react-navigation/core';
import * as React from 'react';
import { type GestureResponderEvent, Platform } from 'react-native';

import { LinkingContext } from './LinkingContext';

type NotUndefined<T> = T extends undefined ? never : T;

type NestedParamLists<ParamList extends {}> = {
  [RouteName in keyof ParamList]: NotUndefined<
    ParamList[RouteName]
  > extends NavigatorScreenParams<infer T>
    ? T
    : never;
}[keyof ParamList];

type RouteNames<ParamList extends {}> = string extends keyof ParamList
  ? string
  : Extract<keyof ParamList, string>;

type LinkScreenTargetProps<
  ParamList extends {},
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
> = {
  href?: string;
  action?: NavigationAction;
} & (RouteName extends unknown
  ? keyof ParamList[RouteName] extends never
    ? { screen: RouteName; params?: ParamList[RouteName] }
    : { screen: RouteName; params: ParamList[RouteName] }
  : never);

type LinkToScreenProps<
  ParamList extends {},
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
> = LinkScreenTargetProps<ParamList, RouteName> & {
  in?: undefined;
};

type LinkToActionProps = {
  href?: string;
  action: NavigationAction;
  in?: undefined;
  screen?: undefined;
  params?: undefined;
};

type LinkToParentScreenProps<
  ParamList extends {} = RootParamList,
  ParentName extends RouteNames<ParamList> = RouteNames<ParamList>,
> =
  | (LinkScreenTargetProps<ParamList> & {
      in: ParentName;
    })
  | LinkToNestedParentScreenProps<NestedParamLists<ParamList>>;

type LinkToNestedParentScreenProps<ParamList> = ParamList extends {}
  ? LinkToParentScreenProps<ParamList>
  : never;

export type LinkProps<
  ParamList extends {} = RootParamList,
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
> =
  | LinkToScreenProps<ParamList, RouteName>
  | LinkToParentScreenProps<ParamList>
  | LinkToActionProps;

type MinimalState = {
  routes: [
    {
      name: string;
      params?: object | undefined;
      state?: MinimalState | undefined;
    },
  ];
};

const getObjectParams = (params: unknown) =>
  typeof params === 'object' && params != null ? params : undefined;

const getTopNavigation = (
  navigation: NavigationProp<ParamListBase> | undefined
) => {
  let current = navigation;
  let parent = current?.getParent();

  while (parent !== undefined) {
    current = parent;
    parent = current.getParent();
  }

  return current;
};

const NAVIGATE_ACTION_TYPES = [
  'NAVIGATE',
  'PUSH',
  'REPLACE',
  'POP_TO',
  'JUMP_TO',
];

const getRouteFromAction = (
  action: NavigationAction | undefined,
  screens: Record<string, unknown> | undefined
) => {
  if (action == null || screens == null) {
    return undefined;
  }

  if (!NAVIGATE_ACTION_TYPES.includes(action.type)) {
    return undefined;
  }

  const { payload } = action;

  if (
    payload != null &&
    'name' in payload &&
    typeof payload.name === 'string' &&
    payload.name in screens
  ) {
    return {
      screen: payload.name,
      params: 'params' in payload ? getObjectParams(payload.params) : undefined,
    };
  }

  return undefined;
};

const getStateForParent = (
  parent: string | undefined,
  targetState: MinimalState | undefined,
  focusedRouteState: MinimalState | undefined
): MinimalState | undefined => {
  if (targetState == null) {
    return undefined;
  }

  if (parent === undefined) {
    return targetState;
  }

  if (focusedRouteState == null) {
    return undefined;
  }

  const route = focusedRouteState.routes[0];

  if (route.name === parent) {
    return targetState;
  }

  const childState = getStateForParent(parent, targetState, route.state);

  if (childState == null) {
    return undefined;
  }

  return {
    routes: [
      {
        ...route,
        state: childState,
      },
    ],
  };
};

/**
 * Hook to get props for an anchor tag so it can work with in page navigation.
 *
 * @param props.in Name of the current or parent screen whose navigator contains the target screen.
 * @param props.screen Name of the screen to navigate to (e.g. `'Feeds'`).
 * @param props.params Params to pass to the screen to navigate to (e.g. `{ sort: 'hot' }`).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 */
export function useLinkProps<
  const ParamList extends {} = RootParamList,
  const RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
>(
  props: LinkProps<NoInfer<ParamList>, RouteName>
): {
  href: string | undefined;
  role: 'link';
  onPress: (
    e?: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
} {
  // @ts-expect-error: TypeScript doesn't preserve common optional properties across this generic union.
  const { in: parent, screen, params, href, action } = props;

  const root = React.use(NavigationContainerRefContext);
  const navigation = React.use(NavigationContext);
  const route = React.use(NavigationRouteContext);
  const focusedRouteState = useStateForPath();
  const { options } = React.use(LinkingContext);

  const target = React.useMemo(() => {
    if (typeof screen === 'string') {
      return { screen, params: getObjectParams(params) };
    }

    if (Platform.OS === 'web') {
      return getRouteFromAction(action, options?.config?.screens);
    }

    return undefined;
  }, [action, options?.config?.screens, params, screen]);

  const getPathFromStateHelper = options?.getPathFromState ?? getPathFromState;
  const hrefFromState = React.useMemo(() => {
    if (Platform.OS !== 'web' || target?.screen === undefined) {
      return undefined;
    }

    const state = getStateForParent(
      parent,
      {
        routes: [
          {
            name: target.screen,
            params: target.params,
          },
        ],
      },
      focusedRouteState
    );

    return state ? getPathFromStateHelper(state, options?.config) : undefined;
  }, [
    focusedRouteState,
    getPathFromStateHelper,
    options?.config,
    parent,
    target?.params,
    target?.screen,
  ]);

  const onPress = React.useCallback(
    (
      e?:
        | React.MouseEvent<HTMLAnchorElement, MouseEvent>
        | GestureResponderEvent
    ) => {
      if (Platform.OS === 'web' && e) {
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

        // let the browser handle the interaction
        if (hasModifierKey || !isLeftClick || !isSelfTarget) {
          return;
        }
      }

      e?.preventDefault?.();

      const targetNavigation =
        parent === undefined
          ? action
            ? (navigation ?? root)
            : (getTopNavigation(navigation) ?? root)
          : route?.name === parent
            ? navigation
            : navigation?.getParent(parent);

      if (targetNavigation === undefined) {
        if (parent !== undefined) {
          throw new Error(
            `Couldn't find a navigation object for '${parent}' in current or any parent screens. Is your component inside the correct screen?`
          );
        }

        throw new Error(
          "Couldn't find a navigation object. Is your component inside NavigationContainer?"
        );
      }

      if (action) {
        targetNavigation.dispatch(action);
      } else {
        if (target?.screen === undefined) {
          throw new Error(
            "Couldn't find a screen to navigate to. Make sure to provide a screen name."
          );
        }

        const navigateAction = CommonActions.navigate(
          target.screen,
          target.params
        );

        targetNavigation.dispatch(
          parent === undefined
            ? navigateAction
            : {
                ...navigateAction,
                target: targetNavigation.getState()?.key,
              }
        );
      }
    },
    [
      action,
      navigation,
      parent,
      root,
      route?.name,
      target?.params,
      target?.screen,
    ]
  );

  return {
    href: href ?? hrefFromState,
    role: 'link' as const,
    onPress,
  };
}
