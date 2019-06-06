import * as React from 'react';
import { SceneView, StackActions } from '@react-navigation/core';
import Stack from './Stack';
import {
  DefaultTransition,
  ModalSlideFromBottomIOS,
} from '../../TransitionConfigs/TransitionPresets';
import {
  NavigationProp,
  SceneDescriptor,
  NavigationConfig,
  Route,
} from '../../types';
import { Platform } from 'react-native';

type Props = {
  navigation: NavigationProp;
  descriptors: { [key: string]: SceneDescriptor };
  navigationConfig: NavigationConfig;
  onTransitionStart?: (
    curr: { index: number },
    prev: { index: number }
  ) => void;
  onGestureBegin?: () => void;
  onGestureCanceled?: () => void;
  onGestureEnd?: () => void;
  screenProps?: unknown;
};

type State = {
  routes: Route[];
  descriptors: { [key: string]: SceneDescriptor };
};

class StackView extends React.Component<Props, State> {
  static getDerivedStateFromProps(
    props: Readonly<Props>,
    state: Readonly<State>
  ) {
    const { navigation } = props;
    const { transitions } = navigation.state;

    let { routes } = navigation.state;

    if (transitions.pushing.length) {
      // If there are multiple routes being pushed/popped, we'll encounter glitches
      // Only keep one screen animating at a time to avoid this
      const toFilter = transitions.popping.length
        ? // If there are screens popping, we want to defer pushing of all screens
          transitions.pushing
        : transitions.pushing.length > 1
        ? // If there are more than 1 screens pushing, we want to defer pushing all except the first
          transitions.pushing.slice(1)
        : undefined;

      if (toFilter) {
        routes = routes.filter(route => !toFilter.includes(route.key));
      }
    }

    if (transitions.popping.length) {
      // Get indices of routes that were removed so we can preserve their position when transitioning away
      const indices = state.routes.reduce(
        (acc, curr, index) => {
          if (transitions.popping.includes(curr.key)) {
            acc.push([curr, index]);
          }

          return acc;
        },
        [] as Array<[Route, number]>
      );

      if (indices.length) {
        routes = routes.slice();
        indices.forEach(([route, index]) => {
          routes.splice(index, 0, route);
        });
      }
    }

    return {
      routes,
      descriptors: { ...state.descriptors, ...props.descriptors },
    };
  }

  state: State = {
    routes: this.props.navigation.state.routes,
    descriptors: {},
  };

  private getGesturesEnabled = ({ route }: { route: Route }) => {
    const { routes } = this.props.navigation.state;

    const isFirst = routes[0].key === route.key;

    if (isFirst) {
      // The user shouldn't be able to close the first screen
      return false;
    }

    const descriptor = this.state.descriptors[route.key];

    return descriptor && descriptor.options.gesturesEnabled !== undefined
      ? descriptor.options.gesturesEnabled
      : Platform.OS !== 'android';
  };

  private renderScene = ({ route }: { route: Route }) => {
    const descriptor = this.state.descriptors[route.key];
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

  private handleGoBack = ({ route }: { route: Route }) => {
    // This event will trigger when a gesture ends
    // We need to perform the transition before popping the route completely
    this.props.navigation.dispatch(StackActions.pop({ key: route.key }));
  };

  private handleTransitionComplete = ({ route }: { route: Route }) => {
    // When transition completes, we need to remove the item from the pushing/popping arrays
    this.props.navigation.dispatch(
      StackActions.completeTransition({ toChildKey: route.key })
    );
  };

  private handleOpenRoute = ({ route }: { route: Route }) => {
    this.handleTransitionComplete({ route });
  };

  private handleCloseRoute = ({ route }: { route: Route }) => {
    // This event will trigger when the transition for closing the route ends
    // In this case, we need to clean up any state tracking the route and pop it immediately

    // @ts-ignore
    this.setState(state => ({
      routes: state.routes.filter(r => r.key !== route.key),
      descriptors: { ...state.descriptors, [route.key]: undefined },
    }));

    this.props.navigation.dispatch(
      StackActions.pop({ key: route.key, immediate: true })
    );

    this.handleTransitionComplete({ route });
  };

  render() {
    const {
      navigation,
      navigationConfig,
      onTransitionStart,
      onGestureBegin,
      onGestureCanceled,
      onGestureEnd,
    } = this.props;

    const { mode, ...config } = navigationConfig;
    const { pushing, popping } = navigation.state.transitions;

    const { routes, descriptors } = this.state;

    const headerMode =
      mode !== 'modal' && Platform.OS === 'ios' ? 'float' : 'screen';

    const transitionPreset =
      mode === 'modal' && Platform.OS === 'ios'
        ? ModalSlideFromBottomIOS
        : DefaultTransition;

    return (
      <Stack
        getGesturesEnabled={this.getGesturesEnabled}
        routes={routes}
        openingRoutes={pushing}
        closingRoutes={popping}
        onGoBack={this.handleGoBack}
        onOpenRoute={this.handleOpenRoute}
        onCloseRoute={this.handleCloseRoute}
        onTransitionStart={onTransitionStart}
        onGestureBegin={onGestureBegin}
        onGestureCanceled={onGestureCanceled}
        onGestureEnd={onGestureEnd}
        renderScene={this.renderScene}
        headerMode={headerMode}
        navigation={navigation}
        descriptors={descriptors}
        {...transitionPreset}
        {...config}
      />
    );
  }
}

export default StackView;
