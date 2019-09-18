import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import {
  NavigationProp,
  NavigationDescriptor,
  NavigationState,
  NavigationRouteConfigMap,
  ScreenProps,
  NavigationContainer,
  SwitchNavigatorConfig,
} from 'react-navigation';
import {
  createNavigator,
  SceneView,
  SwitchRouter,
} from '@react-navigation/core';
import {
  TransitioningView,
  Transitioning,
  Transition,
} from 'react-native-reanimated';

const DEFAULT_TRANSITION = (
  <Transition.Together>
    <Transition.Out type="fade" durationMs={200} interpolation="easeIn" />
    <Transition.In type="fade" durationMs={200} />
  </Transition.Together>
);

interface Props {
  navigationConfig: {
    transition?: React.ReactNode,
    transitionViewStyle?: ViewStyle,
  };
  navigation: NavigationProp<NavigationState>;
  descriptors: { [key: string]: NavigationDescriptor };
  screenProps?: ScreenProps;
}

class AnimatedSwitchView extends React.Component<Props, {}> {
  containerRef = React.createRef<TransitioningView>();

  componentDidUpdate(prevProps: Props) {
    const { state: prevState } = prevProps.navigation;
    const prevActiveKey = prevState.routes[prevState.index].key;
    const { state } = this.props.navigation;
    const activeKey = state.routes[state.index].key;

    if (activeKey !== prevActiveKey && this.containerRef.current) {
      this.containerRef.current.animateNextTransition();
    }
  }

  render() {
    const { navigationConfig } = this.props;
    const { state } = this.props.navigation;
    const activeKey = state.routes[state.index].key;
    const descriptor = this.props.descriptors[activeKey];
    const ChildComponent = descriptor.getComponent();

    const transition =
      (navigationConfig && navigationConfig.transition) || DEFAULT_TRANSITION;
    const transitionViewStyle =
      (navigationConfig && navigationConfig.transitionViewStyle) || null;

    return (
      <Transitioning.View
        ref={this.containerRef}
        transition={transition}
        style={[styles.container, transitionViewStyle]}
      >
        <SceneView
          component={ChildComponent}
          navigation={descriptor.navigation}
          screenProps={this.props.screenProps}
        />
      </Transitioning.View>
    );
  }
}

export interface AnimatedSwitchNavigatorConfig extends SwitchNavigatorConfig {
  transition?: React.ReactNode;
  transitionViewStyle?: ViewStyle;
}

export default function createAnimatedSwitchNavigator(
  routeConfigMap: NavigationRouteConfigMap,
  switchConfig: SwitchNavigatorConfig & {
    transition?: React.ReactNode;
  }
): NavigationContainer {
  const router = SwitchRouter(routeConfigMap, switchConfig);
  const Navigator = createNavigator(AnimatedSwitchView, router, switchConfig);

  return Navigator;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
