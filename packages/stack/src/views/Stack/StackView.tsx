import * as React from 'react';
import { Platform } from 'react-native';
import { Route } from '@react-navigation/core';
import { StackActions, StackNavigationState } from '@react-navigation/routers';

import Stack from './Stack';
import HeaderContainer, {
  Props as HeaderContainerProps,
} from '../Header/HeaderContainer';
import {
  StackNavigationHelpers,
  StackNavigationConfig,
  StackDescriptorMap,
} from '../../types';

type Props = StackNavigationConfig & {
  state: StackNavigationState;
  navigation: StackNavigationHelpers;
  descriptors: StackDescriptorMap;
  onPageChangeStart?: () => void;
  onPageChangeConfirm?: () => void;
  onPageChangeCancel?: () => void;
};

type State = {
  // Local copy of the routes which are actually rendered
  routes: Route<string>[];
  // List of routes being opened, we need to animate pushing of these new routes
  opening: string[];
  // List of routes being closed, we need to animate popping of these routes
  closing: string[];
  // List of routes being replaced, we need to keep a copy until the new route animates in
  replacing: string[];
  // Since the local routes can vary from the routes from props, we need to keep the descriptors for old routes
  // Otherwise we won't be able to access the options for routes that were removed
  descriptors: StackDescriptorMap;
};

class StackView extends React.Component<Props, State> {
  static getDerivedStateFromProps(
    props: Readonly<Props>,
    state: Readonly<State>
  ) {
    // Here we determine which routes were added or removed to animate them
    // We keep a copy of the route being removed in local state to be able to animate it

    let routes =
      props.state.index < props.state.routes.length - 1
        ? // Remove any extra routes from the state
          // The last visible route should be the focused route, i.e. at current index
          props.state.routes.slice(0, props.state.index + 1)
        : props.state.routes;

    if (props.state.index < props.state.routes.length - 1) {
      console.warn(
        'StackRouter provided invalid state, index should always be the last route in the stack.'
      );
    }

    // If there was no change in routes, we don't need to compute anything
    if (routes === state.routes || !state.routes.length) {
      return {
        routes,
        descriptors: props.descriptors,
      };
    }

    // Now we need to determine which routes were added and removed
    let { opening, closing, replacing } = state;

    const previousRoutes = state.routes.filter(
      route => !closing.includes(route.key) && !replacing.includes(route.key)
    );

    const previousFocusedRoute = previousRoutes[previousRoutes.length - 1];
    const nextFocusedRoute = routes[routes.length - 1];

    if (previousFocusedRoute.key !== nextFocusedRoute.key) {
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
          !opening.includes(nextFocusedRoute.key)
        ) {
          // In this case, we need to animate pushing the focused route
          // We don't care about animating any other added routes because they won't be visible
          opening = [...opening, nextFocusedRoute.key];

          closing = closing.filter(key => key !== nextFocusedRoute.key);
          replacing = replacing.filter(key => key !== nextFocusedRoute.key);

          if (!routes.find(r => r.key === previousFocusedRoute.key)) {
            // The previous focused route isn't present in state, we treat this as a replace

            replacing = [...replacing, previousFocusedRoute.key];

            opening = opening.filter(key => key !== previousFocusedRoute.key);
            closing = closing.filter(key => key !== previousFocusedRoute.key);

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
          !closing.includes(previousFocusedRoute.key)
        ) {
          // Sometimes a route can be closed before the opening animation finishes
          // So we also need to remove it from the opening list
          closing = [...closing, previousFocusedRoute.key];

          opening = opening.filter(key => key !== previousFocusedRoute.key);
          replacing = replacing.filter(key => key !== previousFocusedRoute.key);

          // Keep a copy of route being removed in the state to be able to animate it
          routes = [...routes, previousFocusedRoute];
        }
      } else {
        // Looks like some routes were re-arranged and no focused routes were added/removed
        // i.e. the currently focused route already existed and the previously focused route still exists
        // We don't know how to animate this
      }
    } else {
      // Keep the routes we are closing or replacing
      routes = routes.slice();
      routes.splice(
        routes.length - 1,
        0,
        ...state.routes.filter(
          ({ key }) => replacing.includes(key) || closing.includes(key)
        )
      );
    }

    if (!routes.length) {
      throw new Error(`There should always be at least one route.`);
    }

    const descriptors = routes.reduce(
      (acc, route) => {
        acc[route.key] =
          props.descriptors[route.key] || state.descriptors[route.key];

        return acc;
      },
      {} as StackDescriptorMap
    );

    return {
      routes,
      opening,
      closing,
      replacing,
      descriptors,
    };
  }

  state: State = {
    routes: [],
    opening: [],
    closing: [],
    replacing: [],
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
    const { closing, replacing } = this.state;
    const routes = this.state.routes.filter(
      r =>
        r.key === route.key ||
        (!closing.includes(r.key) && !replacing.includes(r.key))
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
      routes: state.replacing.length
        ? state.routes.filter(r => !state.replacing.includes(r.key))
        : state.routes,
      opening: state.opening.filter(key => key !== route.key),
      closing: state.closing.filter(key => key !== route.key),
      replacing: [],
    }));
  };

  private handleCloseRoute = ({ route }: { route: Route<string> }) => {
    // This event will trigger when the animation for closing the route ends
    // In this case, we need to clean up any state tracking the route and pop it immediately

    // @ts-ignore
    this.setState(state => ({
      routes: state.routes.filter(r => r.key !== route.key),
      opening: state.opening.filter(key => key !== route.key),
      closing: state.closing.filter(key => key !== route.key),
    }));
  };

  render() {
    const {
      state,
      navigation,
      onPageChangeStart,
      onPageChangeConfirm,
      onPageChangeCancel,
      mode = 'card',
      ...rest
    } = this.props;

    const { routes, descriptors, opening, closing } = this.state;

    const headerMode =
      mode !== 'modal' && Platform.OS === 'ios' ? 'float' : 'screen';

    return (
      <Stack
        mode={mode}
        getPreviousRoute={this.getPreviousRoute}
        getGesturesEnabled={this.getGesturesEnabled}
        routes={routes}
        openingRoutes={opening}
        closingRoutes={closing}
        onGoBack={this.handleGoBack}
        onOpenRoute={this.handleOpenRoute}
        onCloseRoute={this.handleCloseRoute}
        onPageChangeStart={onPageChangeStart}
        onPageChangeConfirm={onPageChangeConfirm}
        onPageChangeCancel={onPageChangeCancel}
        renderHeader={this.renderHeader}
        renderScene={this.renderScene}
        headerMode={headerMode}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
        {...rest}
      />
    );
  }
}

export default StackView;
