import type {
  NavigationAction,
  NavigationState,
  ParamListBase,
  Router,
} from '@react-navigation/routers';
import * as React from 'react';

import NavigationBuilderContext, {
  AddKeyedListener,
  AddListener,
} from './NavigationBuilderContext';
import NavigationContext from './NavigationContext';
import NavigationRouteContext from './NavigationRouteContext';
import SceneView from './SceneView';
import type {
  Descriptor,
  EventMapBase,
  NavigationHelpers,
  NavigationProp,
  RouteConfig,
  RouteProp,
} from './types';
import type { NavigationEventEmitter } from './useEventEmitter';
import useNavigationCache from './useNavigationCache';
import useRouteCache from './useRouteCache';

export type ScreenConfigWithParent<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase
> = {
  keys: (string | undefined)[];
  options: (ScreenOptionsOrCallback<ScreenOptions> | undefined)[] | undefined;
  props: RouteConfig<ParamListBase, string, State, ScreenOptions, EventMap>;
};

type ScreenOptionsOrCallback<ScreenOptions extends {}> =
  | ScreenOptions
  | ((props: {
      route: RouteProp<ParamListBase, string>;
      navigation: any;
    }) => ScreenOptions);

type Options<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase
> = {
  state: State;
  screens: Record<
    string,
    ScreenConfigWithParent<State, ScreenOptions, EventMap>
  >;
  navigation: NavigationHelpers<ParamListBase>;
  screenOptions?: ScreenOptionsOrCallback<ScreenOptions>;
  defaultScreenOptions?:
    | ScreenOptions
    | ((props: {
        route: RouteProp<ParamListBase>;
        navigation: any;
        options: ScreenOptions;
      }) => ScreenOptions);
  onAction: (action: NavigationAction) => boolean;
  getState: () => State;
  setState: (state: State) => void;
  addListener: AddListener;
  addKeyedListener: AddKeyedListener;
  onRouteFocus: (key: string) => void;
  router: Router<State, NavigationAction>;
  emitter: NavigationEventEmitter<EventMap>;
};

/**
 * Hook to create descriptor objects for the child routes.
 *
 * A descriptor object provides 3 things:
 * - Helper method to render a screen
 * - Options specified by the screen for the navigator
 * - Navigation object intended for the route
 */
export default function useDescriptors<
  State extends NavigationState,
  ActionHelpers extends Record<string, () => void>,
  ScreenOptions extends {},
  EventMap extends EventMapBase
>({
  state,
  screens,
  navigation,
  screenOptions,
  defaultScreenOptions,
  onAction,
  getState,
  setState,
  addListener,
  addKeyedListener,
  onRouteFocus,
  router,
  emitter,
}: Options<State, ScreenOptions, EventMap>) {
  const [options, setOptions] = React.useState<Record<string, object>>({});
  const { onDispatchAction, onOptionsChange, stackRef } = React.useContext(
    NavigationBuilderContext
  );

  const context = React.useMemo(
    () => ({
      navigation,
      onAction,
      addListener,
      addKeyedListener,
      onRouteFocus,
      onDispatchAction,
      onOptionsChange,
      stackRef,
    }),
    [
      navigation,
      onAction,
      addListener,
      addKeyedListener,
      onRouteFocus,
      onDispatchAction,
      onOptionsChange,
      stackRef,
    ]
  );

  const navigations = useNavigationCache<State, ScreenOptions, EventMap>({
    state,
    getState,
    navigation,
    setOptions,
    router,
    emitter,
  });

  const routes = useRouteCache(state.routes);

  return routes.reduce<
    Record<
      string,
      Descriptor<
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
      >
    >
  >((acc, route, i) => {
    const config = screens[route.name];
    const screen = config.props;
    const navigation = navigations[route.key];

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
      options[route.key],
    ];

    const customOptions = optionsList.reduce<ScreenOptions>(
      (acc, curr) =>
        Object.assign(
          acc,
          // @ts-expect-error: we check for function but TS still complains
          typeof curr !== 'function' ? curr : curr({ route, navigation })
        ),
      {} as ScreenOptions
    );

    const mergedOptions = {
      ...(typeof defaultScreenOptions === 'function'
        ? // @ts-expect-error: ts gives incorrect error here
          defaultScreenOptions({
            route,
            navigation,
            options: customOptions,
          })
        : defaultScreenOptions),
      ...customOptions,
    };

    const clearOptions = () =>
      setOptions((o) => {
        if (route.key in o) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [route.key]: _, ...rest } = o;
          return rest;
        }

        return o;
      });

    acc[route.key] = {
      route,
      // @ts-expect-error: it's missing action helpers, fix later
      navigation,
      render() {
        return (
          <NavigationBuilderContext.Provider key={route.key} value={context}>
            <NavigationContext.Provider value={navigation}>
              <NavigationRouteContext.Provider value={route}>
                <SceneView
                  navigation={navigation}
                  route={route}
                  screen={screen}
                  routeState={state.routes[i].state}
                  getState={getState}
                  setState={setState}
                  options={mergedOptions}
                  clearOptions={clearOptions}
                />
              </NavigationRouteContext.Provider>
            </NavigationContext.Provider>
          </NavigationBuilderContext.Provider>
        );
      },
      options: mergedOptions as ScreenOptions,
    };

    return acc;
  }, {});
}
