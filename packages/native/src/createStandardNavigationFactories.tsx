import {
  CommonActions,
  createNavigatorFactory,
  createScreenFactory,
  type DefaultNavigatorOptions,
  type DefaultRouterOptions,
  type EventMapBase,
  type NavigationAction,
  type NavigationProp,
  type NavigatorTypeBagBase,
  type ParamListBase,
  type RouterFactory,
  type StaticConfig,
  type StaticParamList,
  type StaticScreenFactory,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/core';
import * as React from 'react';
import type {
  createStandardNavigator,
  NavigatorArgs as StandardNavigationArgs,
} from 'standard-navigation';

import { useBuildHref } from './useLinkBuilder';
import { useMemoArray } from './useMemoArray';

type StandardEventMap<EventMap extends EventMapBase> = {
  [EventName in keyof EventMap]: {
    data: EventMap[EventName] extends { data?: infer Data }
      ? Data extends object | undefined
        ? Data
        : object | undefined
      : undefined;
    canPreventDefault: EventMap[EventName] extends { canPreventDefault: true }
      ? true
      : false;
  };
};

type ActionHelpersOf<T> =
  T extends Record<string, (...args: never[]) => unknown> ? T : {};

type StandardNavigationNavigatorProps<
  TypeBag extends StandardNavigationTypeBagBase,
> = TypeBag['RouterOptions'] &
  DefaultNavigatorOptions<
    ParamListBase,
    string | undefined,
    StandardNavigationTypeBagFor<TypeBag, ParamListBase>['State'],
    TypeBag['ScreenOptions'],
    TypeBag['EventMap'],
    StandardNavigation<TypeBag>
  >;

type StandardNavigationTypeBagFor<
  TypeBag extends StandardNavigationTypeBagBase,
  ParamList extends ParamListBase,
  NavigatorID extends string | undefined = string | undefined,
  NavigatorProps extends object = {},
> = TypeBag & {
  ParamList: ParamList;
  NavigatorID: NavigatorID;
  Navigator: React.ComponentType<NavigatorProps>;
};

type StandardNavigation<TypeBag extends StandardNavigationTypeBagBase> =
  StandardNavigationTypeBagFor<
    TypeBag,
    ParamListBase
  >['NavigationList'][keyof StandardNavigationTypeBagFor<
    TypeBag,
    ParamListBase
  >['NavigationList']];

type StandardNavigationPropsMapper<
  TypeBag extends StandardNavigationTypeBagBase,
  MapperProps extends object,
> = (props: {
  state: StandardNavigationTypeBagFor<TypeBag, ParamListBase>['State'];
  navigation: StandardNavigation<TypeBag>;
}) => MapperProps;

type StandardNavigationDefaultBag<
  TypeBag extends StandardNavigationTypeBagBase,
  NavigatorProps extends object,
> = StandardNavigationTypeBagFor<
  TypeBag,
  ParamListBase,
  string | undefined,
  NavigatorProps
>;

type StandardNavigationFactories<
  TypeBag extends StandardNavigationTypeBagBase,
  NavigatorProps extends object,
> = {
  createNavigator: StandardNavigationCreateNavigator<TypeBag, NavigatorProps>;
  createScreen: StaticScreenFactory<
    StandardNavigationDefaultBag<TypeBag, NavigatorProps>
  >;
};

export type StandardNavigationCreateNavigator<
  TypeBag extends StandardNavigationTypeBagBase,
  NavigatorProps extends object,
> = {
  <
    const ParamList extends ParamListBase,
    const NavigatorID extends string | undefined = string | undefined,
  >(): TypedNavigator<
    StandardNavigationTypeBagFor<
      TypeBag,
      ParamList,
      NavigatorID,
      NavigatorProps
    >,
    undefined
  >;
  <
    const Config extends StaticConfig<
      StandardNavigationDefaultBag<TypeBag, NavigatorProps>
    >,
  >(
    config: Config &
      StaticConfig<StandardNavigationDefaultBag<TypeBag, NavigatorProps>>
  ): TypedNavigator<
    StandardNavigationTypeBagFor<
      TypeBag,
      StaticParamList<{ config: Config }> & ParamListBase,
      string | undefined,
      NavigatorProps
    >,
    Config
  >;
};

export interface StandardNavigationTypeBagBase extends NavigatorTypeBagBase {
  ActionHelpers: {};
  ScreenOptions: {};
  EventMap: EventMapBase;
  RouterOptions: DefaultRouterOptions;
  NavigationList: {
    [RouteName in keyof this['ParamList']]: NavigationProp<
      this['ParamList'],
      RouteName,
      this['NavigatorID'],
      this['State'],
      this['ScreenOptions'],
      this['EventMap']
    > &
      ActionHelpersOf<this['ActionHelpers']>;
  };
  Navigator: React.ComponentType<{}>;
}

export function createStandardNavigationFactories<
  TypeBag extends StandardNavigationTypeBagBase,
  NavigatorProps extends object = {},
  MapperProps extends object = {},
>(
  navigator: ReturnType<
    typeof createStandardNavigator<
      TypeBag['ScreenOptions'],
      StandardEventMap<TypeBag['EventMap']>,
      NavigatorProps & MapperProps
    >
  >,
  router: RouterFactory<
    StandardNavigationTypeBagFor<TypeBag, ParamListBase>['State'],
    NavigationAction,
    TypeBag['RouterOptions']
  >,
  mapper?: StandardNavigationPropsMapper<TypeBag, MapperProps>
): StandardNavigationFactories<TypeBag, NavigatorProps> {
  const { type, version, NavigatorContent } = navigator;

  if (type !== 'standard') {
    throw new Error(
      `createStandardNavigationFactories only works with standard navigator objects, but got navigator of ${typeof type === 'string' ? `type "${type}".` : 'unknown type.'}`
    );
  }

  if (version !== 1) {
    throw new Error(
      `createStandardNavigationFactories only works with version 1 of standard navigator objects, but got version ${version}.`
    );
  }

  type Bag = StandardNavigationTypeBagFor<TypeBag, ParamListBase>;
  type StandardArgs = StandardNavigationArgs<
    TypeBag['ScreenOptions'],
    StandardEventMap<TypeBag['EventMap']>
  >;

  function StandardNavigationNavigator(
    props: StandardNavigationNavigatorProps<TypeBag> & NavigatorProps
  ) {
    const builder = useNavigationBuilder<
      Bag['State'],
      TypeBag['RouterOptions'],
      ActionHelpersOf<Bag['ActionHelpers']>,
      TypeBag['ScreenOptions'],
      TypeBag['EventMap']
    >(router, props);

    const buildHref = useBuildHref();

    const routes = useMemoArray(
      ('preloadedRoutes' in builder.state &&
      Array.isArray(builder.state.preloadedRoutes)
        ? builder.state.routes.concat(builder.state.preloadedRoutes)
        : builder.state.routes
      ).map((route) => {
        const href = buildHref(route.name, route.params);

        return [
          {
            key: route.key,
            name: route.name,
            params: route.params,
            href,
          },
          [route.key, route.name, route.params, href],
        ];
      })
    );

    const state = React.useMemo(
      (): StandardArgs['state'] => ({
        index: builder.state.index,
        routes,
      }),
      [builder.state.index, routes]
    );

    const descriptors: StandardArgs['descriptors'] = {};

    for (const route of state.routes) {
      const descriptor =
        builder.descriptors[route.key] ?? builder.describe(route, true);

      descriptors[route.key] = {
        options: descriptor.options,
        render: descriptor.render,
      };
    }

    const actions = React.useMemo<StandardArgs['actions']>(
      () => ({
        navigate(name, params) {
          builder.navigation.dispatch({
            ...CommonActions.navigate(name, params),
            target: builder.state.key,
          });
        },
        back() {
          builder.navigation.goBack();
        },
      }),
      [builder.navigation, builder.state.key]
    );

    const emitter = React.useMemo<StandardArgs['emitter']>(
      () => ({
        // @ts-expect-error - they are compatible
        emit: builder.navigation.emit,
      }),
      [builder.navigation]
    );

    const mapped = mapper?.({
      state: builder.state,
      navigation: builder.navigation as StandardNavigation<TypeBag>,
    });

    // Omit props used by useNavigationBuilder and routers internally
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      children,
      id,
      initialRouteName,
      layout,
      screenLayout,
      screenListeners,
      screenOptions,
      UNSTABLE_routeNamesChangeBehavior,
      UNSTABLE_router,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = props;

    return (
      <builder.NavigationContent>
        <NavigatorContent
          {...(rest as NavigatorProps & MapperProps)}
          {...mapped}
          state={state}
          descriptors={descriptors}
          actions={actions}
          emitter={emitter}
        />
      </builder.NavigationContent>
    );
  }

  const createNavigator = createNavigatorFactory(
    StandardNavigationNavigator
  ) as StandardNavigationCreateNavigator<TypeBag, NavigatorProps>;

  const createScreen =
    createScreenFactory<
      StandardNavigationDefaultBag<TypeBag, NavigatorProps>
    >();

  return {
    createNavigator,
    createScreen,
  };
}
