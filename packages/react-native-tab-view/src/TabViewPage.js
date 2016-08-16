/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import TabViewPanResponder from './TabViewPanResponder';
import TabViewStyleInterpolator from './TabViewStyleInterpolator';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { Route, Scene, SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  page: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

type Props = SceneRendererProps & {
  route: Route;
  renderScene: (scene: Scene) => ?React.Element<any>;
  panHandlers?: any;
  style?: any;
}

type State = {
  panHandlers: any;
}

export default class TabViewPage extends Component<void, Props, State> {
  static propTypes = {
    ...SceneRendererPropType,
    renderScene: PropTypes.func.isRequired,
    panHandlers: PropTypes.object,
    style: PropTypes.any,
  };

  static PanResponder = TabViewPanResponder;
  static StyleInterpolator = TabViewStyleInterpolator;

  state: State = {
    panHandlers: null,
  };

  componentWillMount() {
    this._updatePanHandlers(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.navigationState !== nextProps.navigationState) {
      this._updatePanHandlers(nextProps);
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return shallowCompare(this, nextProps, nextState);
  }

  _updatePanHandlers = (props: Props) => {
    const { panHandlers } = props;
    const viewPanHandlers = typeof panHandlers !== 'undefined' ? panHandlers : TabViewPanResponder.forHorizontal(props);
    this.setState({
      panHandlers: PanResponder.create(viewPanHandlers).panHandlers,
    });
  };

  render() {
    const { navigationState, renderScene, getLastPosition, style, route } = this.props;
    const { routes, index } = navigationState;

    const viewStyle = typeof style !== 'undefined' ? style : TabViewStyleInterpolator.forHorizontal(this.props);
    const scene = {
      route,
      focused: index === routes.indexOf(route),
      index: routes.indexOf(route)
    };

    return (
      <Animated.View style={[ styles.page, viewStyle ]} {...(this.state.panHandlers : null)}>
        {renderScene(scene)}
      </Animated.View>
    );
  }
}
