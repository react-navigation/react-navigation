import {
  CommonActions,
  createNavigatorFactory,
  createScreenFactory,
  type DefaultRouterOptions,
  type EventMapBase,
  type NavigationAction,
  type NavigatorTypeBagBase,
  type ParamListBase,
  type RouterFactory,
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

export interface StandardNavigationTypeBagBase extends NavigatorTypeBagBase {
  RouterOptions: DefaultRouterOptions;
  Navigator: React.ComponentType<{}>;
}

type StandardNavigationTypeBagFor<
  TypeBag extends StandardNavigationTypeBagBase,
  ParamList extends ParamListBase,
> = TypeBag & { ParamList: ParamList };

type StandardNavigationListFor<
  TypeBag extends StandardNavigationTypeBagBase,
  ParamList extends ParamListBase,
> = StandardNavigationTypeBagFor<TypeBag, ParamList>['NavigationList'];

type StandardNavigationMapperProps<
  TypeBag extends StandardNavigationTypeBagBase,
> = {
  state: StandardNavigationTypeBagFor<TypeBag, ParamListBase>['State'];
  navigation: StandardNavigationListFor<
    TypeBag,
    ParamListBase
  >[keyof StandardNavigationListFor<TypeBag, ParamListBase>];
};

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
  mapper?: (props: StandardNavigationMapperProps<TypeBag>) => MapperProps
) {
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

  type StandardArgs = StandardNavigationArgs<
    TypeBag['ScreenOptions'],
    StandardEventMap<TypeBag['EventMap']>
  >;

  function StandardNavigationNavigator(props: any) {
    const builder = useNavigationBuilder<
      TypeBag['State'],
      TypeBag['RouterOptions'],
      TypeBag['ActionHelpers'],
      TypeBag['ScreenOptions'],
      TypeBag['EventMap']
    >(router, props);

    const buildHref = useBuildHref();

    const routes = useMemoArray(
      builder.state.routes.map((route) => {
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
      const descriptor = builder.descriptors[route.key];

      if (descriptor == null) {
        throw new Error(
          `No descriptor found for route "${route.name}" (${route.key}).`
        );
      }

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
      state: builder.state as TypeBag['State'],
      navigation: builder.navigation as never,
    });

    // Omit props used by useNavigationBuilder and routers internally
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      children,
      initialRouteName,
      layout,
      routeNamesChangeBehavior,
      router: routerOverride,
      screenLayout,
      screenListeners,
      screenOptions,
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

  const createNavigator = createNavigatorFactory<
    TypeBag & {
      Navigator: React.ComponentType<NavigatorProps>;
    }
  >(StandardNavigationNavigator);

  const createScreen = createScreenFactory<TypeBag>();

  return {
    createNavigator,
    createScreen,
  };
}
