import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import {
  createNavigator,
  CreateNavigatorConfig,
  NavigationDescriptor,
  NavigationParams,
  NavigationProp,
  NavigationRoute,
  NavigationRouteConfigMap,
  NavigationScreenProp,
  NavigationState,
  NavigationSwitchProp,
  NavigationSwitchRouterConfig,
  SceneView,
  SwitchRouter,
  SupportedThemes,
  NavigationScreenConfig,
} from 'react-navigation';
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

type Props = {
  navigationConfig: NavigationAnimatedSwitchConfig;
  navigation: NavigationProp<NavigationState>;
  descriptors: {
    [key: string]: NavigationDescriptor<
      NavigationParams,
      NavigationAnimatedSwitchOptions,
      NavigationSwitchProp<NavigationRoute, any>
    >;
  };
  screenProps?: unknown;
};

class AnimatedSwitchView extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const { state: prevState } = prevProps.navigation;
    const prevActiveKey = prevState.routes[prevState.index].key;
    const { state } = this.props.navigation;
    const activeKey = state.routes[state.index].key;

    if (activeKey !== prevActiveKey && this.containerRef.current) {
      this.containerRef.current.animateNextTransition();
    }
  }

  private containerRef = React.createRef<TransitioningView>();

  render() {
    const { navigationConfig, screenProps } = this.props;
    const { state } = this.props.navigation;
    const activeKey = state.routes[state.index].key;
    const descriptor = this.props.descriptors[activeKey];
    const ChildComponent = descriptor.getComponent();

    const transition = navigationConfig?.transition || DEFAULT_TRANSITION;
    const transitionViewStyle = navigationConfig?.transitionViewStyle || null;

    return (
      <Transitioning.View
        ref={this.containerRef}
        transition={transition}
        style={[styles.container, transitionViewStyle]}
      >
        <SceneView
          component={ChildComponent}
          navigation={descriptor.navigation}
          screenProps={screenProps}
        />
      </Transitioning.View>
    );
  }
}

export type NavigationAnimatedSwitchConfig = NavigationSwitchRouterConfig & {
  transition?: React.ReactNode;
  transitionViewStyle?: ViewStyle;
};

export type NavigationAnimatedSwitchOptions = {};

export type NavigationAnimatedSwitchProp<
  State = NavigationRoute,
  Params = NavigationParams
> = NavigationScreenProp<State, Params> & {
  jumpTo: (routeName: string, key?: string) => void;
};

export type NavigationAnimatedSwitchScreenProps<
  Params = NavigationParams,
  ScreenProps = unknown
> = {
  theme: SupportedThemes;
  navigation: NavigationAnimatedSwitchProp<NavigationRoute, Params>;
  screenProps: ScreenProps;
};

export type NavigationAnimatedSwitchScreenComponent<
  Params = NavigationParams,
  ScreenProps = unknown
> = React.ComponentType<
  NavigationAnimatedSwitchScreenProps<Params, ScreenProps>
> & {
  navigationOptions?: NavigationScreenConfig<
    NavigationAnimatedSwitchOptions,
    NavigationAnimatedSwitchProp<NavigationRoute, Params>,
    ScreenProps
  >;
};

export default function createAnimatedSwitchNavigator(
  routeConfigMap: NavigationRouteConfigMap<{}, NavigationAnimatedSwitchProp>,
  switchConfig: CreateNavigatorConfig<
    NavigationAnimatedSwitchConfig,
    NavigationSwitchRouterConfig,
    NavigationAnimatedSwitchOptions,
    NavigationAnimatedSwitchProp<NavigationRoute, any>
  > = {}
) {
  const router = SwitchRouter(routeConfigMap, switchConfig);

  // TODO: don't have time to fix it right now
  // @ts-ignore
  const Navigator = createNavigator(AnimatedSwitchView, router, switchConfig);

  return Navigator;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
