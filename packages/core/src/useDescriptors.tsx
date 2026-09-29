import type {
  NavigationAction,
  NavigationState,
  ParamListBase,
  PartialState,
  Router,
} from '@react-navigation/routers';
import * as React from 'react';

import { isArrayEqual } from './isArrayEqual';
import { isRecordEqual } from './isRecordEqual';
import {
  type AddKeyedListener,
  type AddListener,
  NavigationBuilderContext,
} from './NavigationBuilderContext';
import { NavigationProvider } from './NavigationProvider';
import { SceneView } from './SceneView';
import { ThemeContext } from './theming/ThemeContext';
import type {
  Descriptor,
  EventMapBase,
  NavigationHelpers,
  NavigationProp,
  RouteConfig,
  RouteProp,
} from './types';
import type { NavigationEventEmitter } from './useEventEmitter';
import { useNavigationCache } from './useNavigationCache';
import { useRouteCache } from './useRouteCache';

export type ScreenConfigWithParent<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
> = {
  keys: (string | undefined)[];
  options: (ScreenOptionsOrCallback<ScreenOptions> | undefined)[] | undefined;
  layout: ScreenLayout<ScreenOptions> | undefined;
  props: RouteConfig<
    ParamListBase,
    string,
    State,
    ScreenOptions,
    EventMap,
    unknown
  >;
};

type ScreenLayout<ScreenOptions extends {}> = (props: {
  route: RouteProp<ParamListBase, string>;
  options: ScreenOptions;
  navigation: any;
  theme: ReactNavigation.Theme;
  children: React.ReactElement;
}) => React.ReactElement;

type ScreenOptionsOrCallback<ScreenOptions extends {}> =
  | ScreenOptions
  | ((props: {
      route: RouteProp<ParamListBase, string>;
      navigation: any;
      theme: ReactNavigation.Theme;
    }) => ScreenOptions);

type Options<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
> = {
  state: State;
  screens: Record<
    string,
    ScreenConfigWithParent<State, ScreenOptions, EventMap>
  >;
  navigation: NavigationHelpers<ParamListBase>;
  screenOptions: ScreenOptionsOrCallback<ScreenOptions> | undefined;
  screenLayout: ScreenLayout<ScreenOptions> | undefined;
  onAction: (action: NavigationAction) => boolean;
  getState: () => State;
  setState: (state: State) => void;
  addListener: AddListener;
  addKeyedListener: AddKeyedListener;
  onRouteFocus: (key: string) => void;
  router: Router<State, NavigationAction>;
  emitter: NavigationEventEmitter<EventMap>;
};

type DescriptorCache<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  ActionHelpers extends Record<string, () => void>,
> = Record<
  string,
  {
    descriptor: Descriptor<
      ScreenOptions,
      NavigationProp<
        ParamListBase,
        string,
        string | undefined,
        State,
        ScreenOptions,
        EventMap
      > &
        ActionHelpers,
      RouteProp<ParamListBase>
    >;
    deps: unknown[];
  }
>;

/**
 * Hook to create descriptor objects for the child routes.
 *
 * A descriptor object provides 3 things:
 * - Helper method to render a screen
 * - Options specified by the screen for the navigator
 * - Navigation object intended for the route
 */
export function useDescriptors<
  State extends NavigationState,
  ActionHelpers extends Record<string, () => void>,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
>({
  state,
  screens,
  navigation,
  screenOptions,
  screenLayout,
  onAction,
  getState,
  setState,
  addListener,
  addKeyedListener,
  onRouteFocus,
  router,
  emitter,
}: Options<State, ScreenOptions, EventMap>) {
  const theme = React.useContext(ThemeContext);
  const [options, setOptions] = React.useState<Record<string, ScreenOptions>>(
    {}
  );
  const {
    onDispatchAction,
    onEmitEvent,
    onOptionsChange,
    scheduleUpdate,
    flushUpdates,
    stackRef,
    getIsStateEmitted,
  } = React.useContext(NavigationBuilderContext);

  const context = React.useMemo(
    () => ({
      navigation,
      onAction,
      addListener,
      addKeyedListener,
      onRouteFocus,
      onDispatchAction,
      onEmitEvent,
      onOptionsChange,
      getIsStateEmitted,
      scheduleUpdate,
      flushUpdates,
      stackRef,
    }),
    [
      navigation,
      onAction,
      addListener,
      addKeyedListener,
      onRouteFocus,
      onDispatchAction,
      onEmitEvent,
      onOptionsChange,
      getIsStateEmitted,
      scheduleUpdate,
      flushUpdates,
      stackRef,
    ]
  );

  const { base, navigations } = useNavigationCache<
    State,
    ScreenOptions,
    EventMap,
    ActionHelpers
  >({
    state,
    getState,
    navigation,
    setOptions,
    router,
    emitter,
  });

  const routes = useRouteCache(state.routes);

  const cache = React.useMemo<{
    current: DescriptorCache<State, ScreenOptions, EventMap, ActionHelpers>;
  }>(() => ({ current: {} }), []);

  const getOptions = (
    route: RouteProp<ParamListBase, string>,
    navigation: NavigationProp<
      ParamListBase,
      string,
      string | undefined,
      State,
      ScreenOptions,
      EventMap
    >,
    overrides: Record<string, ScreenOptions>
  ) => {
    const config = screens[route.name];
    const screen = config.props;

    const optionsList = [
      // The default `screenOptions` passed to the navigator
      screenOptions,
      // The `screenOptions` props passed to `Group` elements
      ...((config.options
        ? config.options.filter(Boolean)
        : []) as ScreenOptionsOrCallback<ScreenOptions>[]),
      // The `options` prop passed to `Screen` elements,
      screen.options,
      // The options set via `navigation.setOptions`
      overrides,
    ];

    return optionsList.reduce<ScreenOptions>(
      (acc, curr) =>
        Object.assign(
          acc,
          // @ts-expect-error: we check for function but TS still complains
          typeof curr !== 'function' ? curr : curr({ route, navigation, theme })
        ),
      {} as ScreenOptions
    );
  };

  const render = (
    route: RouteProp<ParamListBase, string>,
    navigation: NavigationProp<
      ParamListBase,
      string,
      string | undefined,
      State,
      ScreenOptions,
      EventMap
    >,
    customOptions: ScreenOptions,
    routeState: NavigationState | PartialState<NavigationState> | undefined,
    layout: ScreenLayout<ScreenOptions> | undefined
  ) => {
    const config = screens[route.name];
    const screen = config.props;

    const clearOptions = () =>
      setOptions((o) => {
        if (route.key in o) {
          const { [route.key]: _, ...rest } = o;
          return rest;
        }

        return o;
      });

    let element = (
      <SceneView
        navigation={navigation}
        route={route}
        screen={screen}
        routeState={routeState}
        getState={getState}
        setState={setState}
        options={customOptions}
        clearOptions={clearOptions}
      />
    );

    if (layout != null) {
      element = layout({
        route,
        navigation,
        options: customOptions,
        // @ts-expect-error: in practice `theme` will be defined
        theme,
        children: element,
      });
    }

    return (
      <NavigationBuilderContext.Provider key={route.key} value={context}>
        <NavigationProvider route={route} navigation={navigation}>
          {element}
        </NavigationProvider>
      </NavigationBuilderContext.Provider>
    );
  };

  const next: DescriptorCache<State, ScreenOptions, EventMap, ActionHelpers> =
    {};

  const descriptors = routes.reduce<
    Record<
      string,
      DescriptorCache<
        State,
        ScreenOptions,
        EventMap,
        ActionHelpers
      >[string]['descriptor']
    >
  >((acc, route, i) => {
    const navigation = navigations[route.key];
    const customOptions = getOptions(route, navigation, options[route.key]);
    const routeState = state.routes[i].state;
    const config = screens[route.name];
    const screen = config.props;

    const layout =
      // The `layout` prop passed to `Screen` elements,
      screen.layout ??
      // The `screenLayout` props passed to `Group` elements
      config.layout ??
      // The default `screenLayout` passed to the navigator
      screenLayout;

    const deps = [
      route,
      navigation,
      routeState,
      screen.component,
      screen.getComponent,
      screen.children,
      layout,
      context,
      theme,
      getState,
      setState,
    ];

    const previous = cache.current[route.key];

    if (
      previous &&
      isArrayEqual(previous.deps, deps) &&
      isRecordEqual(previous.descriptor.options, customOptions)
    ) {
      next[route.key] = previous;
      acc[route.key] = previous.descriptor;

      return acc;
    }

    const element = render(
      route,
      navigation,
      customOptions,
      routeState,
      layout
    );

    acc[route.key] = {
      route,
      // @ts-expect-error: it's missing action helpers, fix later
      navigation,
      render() {
        return element;
      },
      options: customOptions,
    };

    next[route.key] = {
      descriptor: acc[route.key],
      deps,
    };

    return acc;
  }, {});

  React.useInsertionEffect(() => {
    cache.current = next;
  });

  /**
   * Create a descriptor object for a route.
   *
   * @param route Route object for which the descriptor should be created
   * @param placeholder Whether the descriptor should be a placeholder, e.g. for a route not yet in the state
   * @returns Descriptor object
   */
  const describe = (route: RouteProp<ParamListBase>, placeholder: boolean) => {
    if (!placeholder) {
      if (!(route.key in descriptors)) {
        throw new Error(`Couldn't find a route with the key ${route.key}.`);
      }

      return descriptors[route.key];
    }

    const navigation = base;
    const customOptions = getOptions(route, navigation, {});
    const config = screens[route.name];
    const layout = config.props.layout ?? config.layout ?? screenLayout;
    const element = render(route, navigation, customOptions, undefined, layout);

    return {
      route,
      navigation,
      render() {
        return element;
      },
      options: customOptions as ScreenOptions,
    };
  };

  return {
    describe,
    descriptors,
  };
}
