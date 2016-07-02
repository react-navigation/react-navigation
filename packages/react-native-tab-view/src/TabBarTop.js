/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import TabBar from './TabBar';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  tablabel: {
    color: 'white',
    fontSize: 14,
    margin: 8,
  },
  indicator: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 2,
  },
});

type DefaultProps = {
  renderLabel: (scene: Scene) => ?React.Element<any>;
}

type Props = SceneRendererProps & {
  renderLabel: (scene: Scene) => React.Element<any>;
  indicatorStyle?: any;
}

export default class TabBarTop extends Component<DefaultProps, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    renderLabel: PropTypes.func.isRequired,
    indicatorStyle: View.propTypes.style,
  };

  static defaultProps = {
    renderLabel: ({ route }) => route.title ? <Text style={styles.tablabel}>{route.title.toUpperCase()}</Text> : null,
  };

  shouldComponentUpdate(nextProps: Props, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  _renderIndicator = (props: SceneRendererProps) => {
    const { layout: { width }, position } = props;
    const { routes } = props.navigationState;

    const translateX = Animated.multiply(position, width / routes.length);

    return (
      <Animated.View
        style={[ styles.indicator, { width: width / routes.length, transform: [ { translateX } ] }, this.props.indicatorStyle ]}
      />
    );
  };

  render() {
    return (
      <TabBar
        {...this.props}
        renderIndicator={this._renderIndicator}
      />
    );
  }
}
