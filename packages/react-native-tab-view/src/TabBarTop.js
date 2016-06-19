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
import type { SceneRendererProps } from './TabViewTypes';

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
  inactive: {
    color: 'rgba(255, 255, 255, .5)',
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

type Props = SceneRendererProps & {
  pressColor?: string;
  indicatorStyle?: any;
  labelStyle?: any;
  labelActiveStyle?: any;
  labelInactiveStyle?: any;
  style?: any;
}

export default class TabBarTop extends Component<void, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    pressColor: TouchableItem.propTypes.pressColor,
    labelStyle: Text.propTypes.style,
    indicatorStyle: View.propTypes.style,
    labelActiveStyle: Text.propTypes.style,
    labelInactiveStyle: Text.propTypes.style,
    style: View.propTypes.style,
  };

  shouldComponentUpdate(nextProps: Props, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { width, position } = this.props;
    const { scenes, index } = this.props.navigationState;

    const sceneDivider = new Animated.Value(-1 / scenes.length);
    const translateX = Animated.multiply(position, sceneDivider);

    return (
      <View style={[ styles.tabbar, this.props.style ]}>
        {scenes.map((scene, i) => {
          const active = index === i;
          return (
            <TouchableItem
              key={scene.key}
              style={styles.tabitem}
              pressColor={this.props.pressColor}
              onPress={() => this.props.updateIndex(i)}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.tablabel,
                  this.props.labelStyle,
                  active ? null : styles.inactive,
                  active ? this.props.labelActiveStyle : this.props.labelInactiveStyle,
                ]}
              >
                {scene.label.toUpperCase()}
              </Text>
            </TouchableItem>
          );
        })}
        <Animated.View style={[ styles.indicator, { width: width / scenes.length, transform: [ { translateX } ] }, this.props.indicatorStyle ]} />
      </View>
    );
  }
}
