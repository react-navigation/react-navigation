/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TouchableItem from './TouchableItem';
import { NavigationStatePropType } from './TabViewPropTypes';
import type { NavigationState } from './TabViewTypes';

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

type Props = {
  navigationState: NavigationState;
  onRequestChangeTab: Function;
  indicatorColor: string;
  labelStyle?: any;
  labelActiveStyle?: any;
  labelInactiveStyle?: any;
  style?: any;
}

type State = {
  width: number;
  translateAnim: Animated.Value;
}

export default class TabBarTop extends Component<void, Props, State> {
  static propTypes = {
    navigationState: NavigationStatePropType.isRequired,
    onRequestChangeTab: PropTypes.func.isRequired,
    indicatorColor: PropTypes.string,
    labelStyle: Text.propTypes.style,
    labelActiveStyle: Text.propTypes.style,
    labelInactiveStyle: Text.propTypes.style,
    style: View.propTypes.style,
  };

  state: State = {
    width: 0,
    translateAnim: new Animated.Value(0),
  };

  componentDidUpdate() {
    const { scenes, index } = this.props.navigationState;
    const { width, translateAnim } = this.state;
    const offsetLeft = (width / scenes.length) * index;

    Animated.timing(translateAnim, {
      toValue: offsetLeft,
    }).start();
  }

  _handleChangeTab = (index: number) => {
    if (this.props.navigationState.index === index) {
      return;
    }

    this.props.onRequestChangeTab(index);
  };

  _handleLayout = (e: any) => {
    const { width } = e.nativeEvent.layout;

    this.setState({
      width,
    });
  };

  render() {
    const { scenes, index } = this.props.navigationState;
    const { width, translateAnim } = this.state;

    return (
      <View
        {...this.props}
        onLayout={this._handleLayout}
        style={[ styles.tabbar, this.props.style ]}
      >
        {scenes.map((scene, i) => {
          const active = index === i;
          return (
            <TouchableItem
              key={scene.key}
              style={styles.tabitem}
              onPress={() => this._handleChangeTab(i)}
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
        <Animated.View
          style={[
            styles.indicator,
            this.props.indicatorColor && { backgroundColor: this.props.indicatorColor },
            { width: width / scenes.length }, { transform: [ { translateX: translateAnim } ] },
          ]}
        />
      </View>
    );
  }
}
