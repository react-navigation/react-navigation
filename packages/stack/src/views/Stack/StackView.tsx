import * as React from 'react';
import { Platform } from 'react-native';
import { SafeAreaConsumer, EdgeInsets } from 'react-native-safe-area-context';
import { Route } from '@react-navigation/core';
import { StackActions, StackNavigationState } from '@react-navigation/routers';

import CardStack from './CardStack';
import KeyboardManager from '../KeyboardManager';
import HeaderContainer, {
  Props as HeaderContainerProps,
} from '../Header/HeaderContainer';
import SafeAreaProviderCompat from '../SafeAreaProviderCompat';
import {
  StackNavigationHelpers,
  StackNavigationConfig,
  StackDescriptorMap,
} from '../../types';

type Props = StackNavigationConfig & {
  state: StackNavigationState;
  navigation: StackNavigationHelpers;
  descriptors: StackDescriptorMap;
};

type State = {
  // Local copy of the routes which are actually rendered
  routes: Route<string>[];
  // Previous routes, to compare whether routes have changed or not
  previousRoutes: Route<string>[];
  // Previous descriptors, to compare whether descriptors have changed or not
  previousDescriptors: StackDescriptorMap;
  // List of routes being opened, we need to animate pushing of these new routes
  openingRouteKeys: string[];
  // List of routes being closed, we need to animate popping of these routes
  closingRouteKeys: string[];
  // List of routes being replaced, we need to keep a copy until the new route animates in
  replacingRouteKeys: string[];
  // Since the local routes can vary from the routes from props, we need to keep the descriptors for old routes
  // Otherwise we won't be able to access the options for routes that were removed
  descriptors: StackDescriptorMap;
};

class StackView extends React.Component<Props, State> {
  static getDerivedStateFromProps(
    props: Readonly<Props>,
    state: Readonly<State>
  ) {
    // If there was no change in routes, we don't need to compute anything
    if (props.state.routes === state.previousRoutes && state.routes.length) {
      if (props.descriptors !== state.previousDescriptors) {
        const descriptors = state.routes.reduce<StackDescriptorMap>(
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

    // Here we determine which routes were added or removed to animate them
    // We keep a copy of the route being removed in local state to be able to animate it

    let routes =
      props.state.index < props.state.routes.length - 1
        ? // Remove any extra routes from the state
          // The last visible route should be the focused route, i.e. at current index
          props.state.routes.slice(0, props.state.index + 1)
        : props.state.routes;

    // Now we need to determine which routes were added and removed
    let {
      openingRouteKeys,
      closingRouteKeys,
      replacingRouteKeys,
      previousRoutes,
    } = state;

    const previousFocusedRoute = previousRoutes[previousRoutes.length - 1] as
      | Route<string>
      | undefined;
    const nextFocusedRoute = routes[routes.length - 1];

    if (
      previousFocusedRoute &&
      previousFocusedRoute.key !== nextFocusedRoute.key
    ) {
      // We only need to animate routes if the focused route changed
      // Animating previous routes won't be visible coz the focused route is on top of everything

      const isAnimationEnabled = (route: Route<string>) => {
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

    const descriptors = routes.reduce<StackDescriptorMap>((acc, route) => {
      acc[route.key] =
        props.descriptors[route.key] || state.descriptors[route.key];

      return acc;
    }, {});

    return {
      routes,
      previousRoutes: props.state.routes,
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

  private getGesturesEnabled = ({ route }: { route: Route<string> }) => {
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

  private getPreviousRoute = ({ route }: { route: Route<string> }) => {
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

  private renderScene = ({ route }: { route: Route<string> }) => {
    const descriptor =
      this.state.descriptors[route.key] || this.props.descriptors[route.key];

    if (!descriptor) {
      return null;
    }

    return descriptor.render();
  };

  private renderHeader = (props: HeaderContainerProps) => {
    return <HeaderContainer {...props} />;
  };

  private handleGoBack = ({ route }: { route: Route<string> }) => {
    const { state, navigation } = this.props;

    // This event will trigger when a gesture ends
    // We need to perform the transition before removing the route completely
    navigation.dispatch({
      ...StackActions.pop(),
      source: route.key,
      target: state.key,
    });
  };

  private handleOpenRoute = ({ route }: { route: Route<string> }) => {
    this.setState(state => ({
      routes: state.replacingRouteKeys.length
        ? state.routes.filter(r => !state.replacingRouteKeys.includes(r.key))
        : state.routes,
      openingRouteKeys: state.openingRouteKeys.filter(key => key !== route.key),
      closingRouteKeys: state.closingRouteKeys.filter(key => key !== route.key),
      replacingRouteKeys: [],
    }));
  };

  private handleCloseRoute = ({ route }: { route: Route<string> }) => {
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
      state,
      navigation,
      keyboardHandlingEnabled,
      mode = 'card',
      ...rest
    } = this.props;

    const {
      routes,
      descriptors,
      openingRouteKeys,
      closingRouteKeys,
    } = this.state;

    const headerMode =
      mode !== 'modal' && Platform.OS === 'ios' ? 'float' : 'screen';

    return (
      <SafeAreaProviderCompat>
        <SafeAreaConsumer>
          {insets => (
            <KeyboardManager enabled={keyboardHandlingEnabled !== false}>
              {props => (
                <CardStack
                  mode={mode}
                  insets={insets as EdgeInsets}
                  getPreviousRoute={this.getPreviousRoute}
                  getGesturesEnabled={this.getGesturesEnabled}
                  routes={routes}
                  openingRouteKeys={openingRouteKeys}
                  closingRouteKeys={closingRouteKeys}
                  onGoBack={this.handleGoBack}
                  onOpenRoute={this.handleOpenRoute}
                  onCloseRoute={this.handleCloseRoute}
                  renderHeader={this.renderHeader}
                  renderScene={this.renderScene}
                  headerMode={headerMode}
                  state={state}
                  navigation={navigation}
                  descriptors={descriptors}
                  {...rest}
                  {...props}
                />
              )}
            </KeyboardManager>
          )}
        </SafeAreaConsumer>
      </SafeAreaProviderCompat>
    );
  }
}

export default StackView;
