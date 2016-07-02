/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import TouchableItem from './TouchableItem';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { Route, SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: 'black',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    elevation: 4,
  },
  tabitem: {
    flex: 1,
  },
  tablabel: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    marginVertical: 16,
    marginHorizontal: 12,
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
  renderLabel: (props: { route: Route; focused: boolean; }) => ?React.Element<any>;
}

type Props = SceneRendererProps & {
  pressColor?: string;
  renderLabel: (props: { route: Route; focused: boolean; }) => React.Element<any>;
  tabItemStyle?: any;
  indicatorStyle?: any;
  style?: any;
}

export default class TabBarTop extends Component<DefaultProps, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    pressColor: TouchableItem.propTypes.pressColor,
    renderLabel: PropTypes.func.isRequired,
    tabItemStyle: View.propTypes.style,
    indicatorStyle: View.propTypes.style,
    style: View.propTypes.style,
  };

  static defaultProps = {
    renderLabel: ({ route }) => route.title ? <Text style={styles.tablabel}>{route.title.toUpperCase()}</Text> : null,
  };

  shouldComponentUpdate(nextProps: Props, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { layout: { width }, position } = this.props;
    const { routes, index } = this.props.navigationState;

    const translateX = Animated.multiply(position, width / routes.length);
    const inputRange = routes.map((x, i) => i);

    return (
      <View style={[ styles.tabbar, this.props.style ]}>
        {routes.map((route, i) => {
          const focused = index === i;
          const outputRange = inputRange.map(inputIndex => inputIndex === i ? 1 : 0.7);
          const opacity = position.interpolate({
            inputRange,
            outputRange,
          });
          const label = this.props.renderLabel({ route, focused });
          return (
            <TouchableItem
              key={route.key}
              style={styles.tabitem}
              pressColor={this.props.pressColor}
              onPress={() => this.props.jumpToIndex(i)}
            >
              <Animated.View style={[ styles.tabitem, { opacity }, this.props.tabItemStyle ]}>
                {label}
              </Animated.View>
            </TouchableItem>
          );
        })}
        <Animated.View style={[ styles.indicator, { width: width / routes.length, transform: [ { translateX } ] }, this.props.indicatorStyle ]} />
      </View>
    );
  }
}
