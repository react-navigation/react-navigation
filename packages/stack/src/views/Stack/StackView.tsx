import * as React from 'react';
import { Platform } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaConsumer,
} from 'react-native-safe-area-context';
import { SceneView, StackActions, NavigationRoute } from 'react-navigation';
import Stack from './Stack';
import HeaderContainer, {
  Props as HeaderContainerProps,
} from '../Header/HeaderContainer';
import {
  NavigationStackProp,
  NavigationStackConfig,
  SceneDescriptorMap,
} from '../../types';

type Props = {
  navigation: NavigationStackProp;
  descriptors: SceneDescriptorMap;
  navigationConfig: NavigationStackConfig;
  onPageChangeStart?: () => void;
  onPageChangeConfirm?: () => void;
  onPageChangeCancel?: () => void;
  screenProps?: unknown;
};

type State = {
  // Local copy of the routes which are actually rendered
  routes: NavigationRoute[];
  // Previous routes, to compare whether routes have changed or not
  previousRoutes: NavigationRoute[];
  // Previous descriptors, to compare whether descriptors have changed or not
  previousDescriptors: SceneDescriptorMap;
  // List of routes being opened, we need to animate pushing of these new routes
  openingRouteKeys: string[];
  // List of routes being closed, we need to animate popping of these routes
  closingRouteKeys: string[];
  // List of routes being replaced, we need to keep a copy until the new route animates in
  replacingRouteKeys: string[];
  // Since the local routes can vary from the routes from props, we need to keep the descriptors for old routes
  // Otherwise we won't be able to access the options for routes that were removed
  descriptors: SceneDescriptorMap;
};

class StackView extends React.Component<Props, State> {
  static getDerivedStateFromProps(
    props: Readonly<Props>,
    state: Readonly<State>
  ) {
    // Here we determine which routes were added or removed to animate them
    // We keep a copy of the route being removed in local state to be able to animate it

    const { navigation } = props;

    // If there was no change in routes, we don't need to compute anything
    if (
      navigation.state.routes === state.previousRoutes &&
      state.routes.length
    ) {
      if (props.descriptors !== state.previousDescriptors) {
        const descriptors = state.routes.reduce<SceneDescriptorMap>(
          (acc, route) => {
            acc[route.key] =
              props.descriptors[route.key] || state.descriptors[route.key];

            return acc;
          },
          {}
        );

        return {
          previousDescriptors: props.descriptors,
          descriptors,
        };
      }

      return null;
    }

    let routes =
      navigation.state.index < navigation.state.routes.length - 1
        ? // Remove any extra routes from the state
          // The last visible route should be the focused route, i.e. at current index
          navigation.state.routes.slice(0, navigation.state.index + 1)
        : navigation.state.routes;

    if (navigation.state.index < navigation.state.routes.length - 1) {
      console.warn(
        'StackRouter provided invalid state, index should always be the last route in the stack.'
      );
    }

    // Now we need to determine which routes were added and removed
    let {
      openingRouteKeys,
      closingRouteKeys,
      replacingRouteKeys,
      previousRoutes,
    } = state;

    const previousFocusedRoute = previousRoutes[previousRoutes.length - 1] as
      | NavigationRoute
      | undefined;
    const nextFocusedRoute = routes[routes.length - 1];

    if (
      previousFocusedRoute &&
      previousFocusedRoute.key !== nextFocusedRoute.key
    ) {
      // We only need to animate routes if the focused route changed
      // Animating previous routes won't be visible coz the focused route is on top of everything

      const isAnimationEnabled = (route: NavigationRoute) => {
        const descriptor =
          props.descriptors[route.key] || state.descriptors[route.key];

        return descriptor
          ? descriptor.options.animationEnabled !== false
          : true;
      };

      if (!previousRoutes.find(r => r.key === nextFocusedRoute.key)) {
        // A new route has come to the focus, we treat this as a push
        // A replace can also trigger this, the animation should look like push

        if (
          isAnimationEnabled(nextFocusedRoute) &&
          !openingRouteKeys.includes(nextFocusedRoute.key)
        ) {
          // In this case, we need to animate pushing the focused route
          // We don't care about animating any other added routes because they won't be visible
          openingRouteKeys = [...openingRouteKeys, nextFocusedRoute.key];

          closingRouteKeys = closingRouteKeys.filter(
            key => key !== nextFocusedRoute.key
          );
          replacingRouteKeys = replacingRouteKeys.filter(
            key => key !== nextFocusedRoute.key
          );

          if (!routes.find(r => r.key === previousFocusedRoute.key)) {
            // The previous focused route isn't present in state, we treat this as a replace

            replacingRouteKeys = [
              ...replacingRouteKeys,
              previousFocusedRoute.key,
            ];

            openingRouteKeys = openingRouteKeys.filter(
              key => key !== previousFocusedRoute.key
            );
            closingRouteKeys = closingRouteKeys.filter(
              key => key !== previousFocusedRoute.key
            );

            // Keep the old route in state because it's visible under the new route, and removing it will feel abrupt
            // We need to insert it just before the focused one (the route being pushed)
            // After the push animation is completed, routes being replaced will be removed completely
            routes = routes.slice();
            routes.splice(routes.length - 1, 0, previousFocusedRoute);
          }
        }
      } else if (!routes.find(r => r.key === previousFocusedRoute.key)) {
        // The previously focused route was removed, we treat this as a pop

        if (
          isAnimationEnabled(previousFocusedRoute) &&
          !closingRouteKeys.includes(previousFocusedRoute.key)
        ) {
          // Sometimes a route can be closed before the opening animation finishes
          // So we also need to remove it from the opening list
          closingRouteKeys = [...closingRouteKeys, previousFocusedRoute.key];

          openingRouteKeys = openingRouteKeys.filter(
            key => key !== previousFocusedRoute.key
          );
          replacingRouteKeys = replacingRouteKeys.filter(
            key => key !== previousFocusedRoute.key
          );

          // Keep a copy of route being removed in the state to be able to animate it
          routes = [...routes, previousFocusedRoute];
        }
      } else {
        // Looks like some routes were re-arranged and no focused routes were added/removed
        // i.e. the currently focused route already existed and the previously focused route still exists
        // We don't know how to animate this
      }
    } else if (replacingRouteKeys.length || closingRouteKeys.length) {
      // Keep the routes we are closing or replacing
      routes = routes.slice();
      routes.splice(
        routes.length - 1,
        0,
        ...state.routes.filter(
          ({ key }) =>
            replacingRouteKeys.includes(key) || closingRouteKeys.includes(key)
        )
      );
    }

    if (!routes.length) {
      throw new Error(`There should always be at least one route.`);
    }

    const descriptors = routes.reduce<SceneDescriptorMap>((acc, route) => {
      acc[route.key] =
        props.descriptors[route.key] || state.descriptors[route.key];

      return acc;
    }, {});

    return {
      routes,
      previousRoutes: navigation.state.routes,
      previousDescriptors: props.descriptors,
      openingRouteKeys,
      closingRouteKeys,
      replacingRouteKeys,
      descriptors,
    };
  }

  state: State = {
    routes: [],
    previousRoutes: [],
    previousDescriptors: {},
    openingRouteKeys: [],
    closingRouteKeys: [],
    replacingRouteKeys: [],
    descriptors: {},
  };

  private getGesturesEnabled = ({ route }: { route: NavigationRoute }) => {
    const descriptor = this.state.descriptors[route.key];

    if (descriptor) {
      const { gestureEnabled, animationEnabled } = descriptor.options;

      if (animationEnabled === false) {
        // When animation is disabled, also disable gestures
        // The gesture to dismiss a route will look weird when not animated
        return false;
      }

      return gestureEnabled !== undefined
        ? gestureEnabled
        : Platform.OS !== 'android';
    }

    return false;
  };

  private getPreviousRoute = ({ route }: { route: NavigationRoute }) => {
    const { closingRouteKeys, replacingRouteKeys } = this.state;
    const routes = this.state.routes.filter(
      r =>
        r.key === route.key ||
        (!closingRouteKeys.includes(r.key) &&
          !replacingRouteKeys.includes(r.key))
    );
    const index = routes.findIndex(r => r.key === route.key);

    return routes[index - 1];
  };

  private renderScene = ({ route }: { route: NavigationRoute }) => {
    const descriptor =
      this.state.descriptors[route.key] || this.props.descriptors[route.key];

    if (!descriptor) {
      return null;
    }

    const { navigation, getComponent } = descriptor;
    const SceneComponent = getComponent();

    return (
      <SceneView
        screenProps={this.props.screenProps}
        navigation={navigation}
        component={SceneComponent}
      />
    );
  };

  private renderHeader = (props: HeaderContainerProps) => {
    return <HeaderContainer {...props} />;
  };

  private handleTransitionComplete = ({
    route,
  }: {
    route: NavigationRoute;
  }) => {
    // TODO: remove when the new event system lands
    this.props.navigation.dispatch(
      StackActions.completeTransition({ toChildKey: route.key })
    );
  };

  private handleGoBack = ({ route }: { route: NavigationRoute }) => {
    // This event will trigger when a gesture ends
    // We need to perform the transition before removing the route completely
    // @ts-ignore
    this.props.navigation.dispatch(StackActions.pop({ key: route.key }));
  };

  private handleOpenRoute = ({ route }: { route: NavigationRoute }) => {
    this.handleTransitionComplete({ route });
    this.setState(state => ({
      routes: state.replacingRouteKeys.length
        ? state.routes.filter(r => !state.replacingRouteKeys.includes(r.key))
        : state.routes,
      openingRouteKeys: state.openingRouteKeys.filter(key => key !== route.key),
      replacingRouteKeys: [],
      closingRouteKeys: state.closingRouteKeys.filter(key => key !== route.key),
    }));
  };

  private handleCloseRoute = ({ route }: { route: NavigationRoute }) => {
    const index = this.state.routes.findIndex(r => r.key === route.key);
    // While closing route we need to point to the previous one assuming that
    // this previous one in routes array
    this.handleTransitionComplete({
      route: this.state.routes[Math.max(index - 1, 0)],
    });

    // This event will trigger when the animation for closing the route ends
    // In this case, we need to clean up any state tracking the route and pop it immediately

    // @ts-ignore
    this.setState(state => ({
      routes: state.routes.filter(r => r.key !== route.key),
      openingRouteKeys: state.openingRouteKeys.filter(key => key !== route.key),
      closingRouteKeys: state.closingRouteKeys.filter(key => key !== route.key),
    }));
  };

  render() {
    const {
      navigation,
      navigationConfig,
      onPageChangeStart,
      onPageChangeConfirm,
      onPageChangeCancel,
    } = this.props;

    const { mode = 'card', ...config } = navigationConfig;
    const {
      routes,
      descriptors,
      openingRouteKeys,
      closingRouteKeys,
    } = this.state;

    const headerMode =
      mode !== 'modal' && Platform.OS === 'ios' ? 'float' : 'screen';

    return (
      <SafeAreaProvider>
        <SafeAreaConsumer>
          {insets => (
            <Stack
              mode={mode}
              insets={insets}
              getPreviousRoute={this.getPreviousRoute}
              getGesturesEnabled={this.getGesturesEnabled}
              routes={routes}
              openingRoutesKeys={openingRouteKeys}
              closingRoutesKeys={closingRouteKeys}
              onGoBack={this.handleGoBack}
              onOpenRoute={this.handleOpenRoute}
              onCloseRoute={this.handleCloseRoute}
              onPageChangeStart={onPageChangeStart}
              onPageChangeConfirm={onPageChangeConfirm}
              onPageChangeCancel={onPageChangeCancel}
              renderHeader={this.renderHeader}
              renderScene={this.renderScene}
              headerMode={headerMode}
              navigation={navigation}
              descriptors={descriptors}
              {...config}
            />
          )}
        </SafeAreaConsumer>
      </SafeAreaProvider>
    );
  }
}

export default StackView;
