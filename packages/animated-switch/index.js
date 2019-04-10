import * as React from 'react';
import { createNavigator, SceneView, SwitchRouter } from 'react-navigation';
import { Transitioning, Transition } from 'react-native-reanimated';

const DEFAULT_TRANSITION = (
  <Transition.Together>
    <Transition.Out type="fade" durationMs={200} interpolation="easeIn" />
    <Transition.In type="fade" durationMs={200} />
  </Transition.Together>
);

class SwitchView extends React.Component {
  containerRef = React.createRef();

  componentDidUpdate(prevProps) {
    const { state: prevState } = prevProps.navigation;
    const prevActiveKey = prevState.routes[prevState.index].key;
    const { state } = this.props.navigation;
    const activeKey = state.routes[state.index].key;

    if (activeKey !== prevActiveKey && this.containerRef.current) {
      this.containerRef.current.animateNextTransition();
    }
  }

  render() {
    const { state } = this.props.navigation;
    const activeKey = state.routes[state.index].key;
    const descriptor = this.props.descriptors[activeKey];
    const ChildComponent = descriptor.getComponent();

    const transition =
      this.props.navigationConfig.transition || DEFAULT_TRANSITION;

    return (
      <Transitioning.View
        ref={this.containerRef}
        transition={transition}
        style={{ flex: 1 }}
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

export default function createAnimatedSwitchNavigator(
  routeConfigMap,
  switchConfig = {}
) {
  const router = SwitchRouter(routeConfigMap, switchConfig);
  const Navigator = createNavigator(SwitchView, router, switchConfig);
  return Navigator;
}
