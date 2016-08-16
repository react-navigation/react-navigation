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
  tabLabel: {
    color: 'white',
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

type Props = SceneRendererProps & {
  renderLabel: (scene: Scene) => React.Element<any>;
  indicatorStyle?: any;
  labelStyle?: any;
}

export default class TabBarTop extends Component<void, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    renderLabel: PropTypes.func,
    indicatorStyle: View.propTypes.style,
    labelStyle: Text.propTypes.style,
  };

  shouldComponentUpdate(nextProps: Props, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  _renderLabel = ({ route }: Scene) => (
    route.title ? <Text style={[ styles.tabLabel, this.props.labelStyle ]}>{route.title.toUpperCase()}</Text> : null
  );

  _renderIndicator = (props: SceneRendererProps) => {
    const { layout: { width }, position } = props;
    const { routes } = props.navigationState;

    const translateX = Animated.multiply(position, new Animated.Value(width / routes.length));

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
        renderLabel={this.props.renderLabel || this._renderLabel}
        renderIndicator={this._renderIndicator}
      />
    );
  }
}
