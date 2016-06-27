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
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    margin: 16,
  },
  indicator: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 4,
  },
});

type DefaultProps = {
  renderLabel: (props: { route: Route; focused: boolean; }) => string;
}

type Props = SceneRendererProps & {
  pressColor?: string;
  renderLabel: (props: { route: Route; focused: boolean; }) => React.Element<any> | string;
  labelStyle?: any;
  labelActiveStyle?: any;
  labelInactiveStyle?: any;
  indicatorStyle?: any;
  style?: any;
}

export default class TabBarTop extends Component<DefaultProps, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    pressColor: TouchableItem.propTypes.pressColor,
    renderLabel: PropTypes.func.isRequired,
    labelStyle: Text.propTypes.style,
    labelActiveStyle: Text.propTypes.style,
    labelInactiveStyle: Text.propTypes.style,
    indicatorStyle: View.propTypes.style,
    style: View.propTypes.style,
  };

  static defaultProps = {
    renderLabel: ({ route }) => route.title ? route.title.toUpperCase() : '',
  };

  shouldComponentUpdate(nextProps: Props, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { layout: { width }, position } = this.props;
    const { routes, index } = this.props.navigationState;

    const translateX = Animated.multiply(position, width / routes.length);
    const inputRange = Array.from(new Array(routes.length)).map((x, i) => i);

    return (
      <View style={[ styles.tabbar, this.props.style ]}>
        {routes.map((route, i) => {
          const focused = index === i;
          const outputRange = inputRange.map(inputIndex => inputIndex === i ? 1 : 0.5);
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
              {typeof label === 'string' ?
                <Animated.Text
                  numberOfLines={1}
                  style={[
                    styles.tablabel,
                    this.props.labelStyle,
                    { opacity },
                    focused ? this.props.labelActiveStyle : this.props.labelInactiveStyle,
                  ]}
                >
                  {label}
                </Animated.Text> :
                label
              }
            </TouchableItem>
          );
        })}
        <Animated.View style={[ styles.indicator, { width: width / routes.length, transform: [ { translateX } ] }, this.props.indicatorStyle ]} />
      </View>
    );
  }
}
