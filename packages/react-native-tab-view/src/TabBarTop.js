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
import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';

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
  renderLabel: (props: { scene: Scene; focused: boolean; }) => string;
}

type Props = SceneRendererProps & {
  pressColor?: string;
  renderLabel: (props: { scene: Scene; focused: boolean; }) => React.Element<any> | string;
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
    renderLabel: ({ scene }) => scene.label.toUpperCase(),
  };

  shouldComponentUpdate(nextProps: Props, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { width, position } = this.props;
    const { scenes, index } = this.props.navigationState;

    const translateX = Animated.multiply(position, width / scenes.length);
    const inputRange = Array.from(new Array(scenes.length)).map((x, i) => i);

    return (
      <View style={[ styles.tabbar, this.props.style ]}>
        {scenes.map((scene, i) => {
          const focused = index === i;
          const outputRange = inputRange.map(inputIndex => inputIndex === i ? 1 : 0.5);
          const opacity = position.interpolate({
            inputRange,
            outputRange,
          });
          const label = this.props.renderLabel({ scene, focused });
          return (
            <TouchableItem
              key={scene.key}
              style={styles.tabitem}
              pressColor={this.props.pressColor}
              onPress={() => this.props.updateIndex(i)}
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
        <Animated.View style={[ styles.indicator, { width: width / scenes.length, transform: [ { translateX } ] }, this.props.indicatorStyle ]} />
      </View>
    );
  }
}
