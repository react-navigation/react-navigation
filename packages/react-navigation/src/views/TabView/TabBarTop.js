/* @flow */

import React, { PureComponent } from 'react';
import {
  Animated,
  StyleSheet,
} from 'react-native';
import { TabBar } from 'react-native-tab-view';
import TabBarIcon from './TabBarIcon';

import type {
  NavigationRoute,
  NavigationState,
} from '../../TypeDefinition';

type TabScene = {
  route: NavigationRoute;
  focused: boolean;
  index: number;
  tintColor?: string;
};

type DefaultProps = {
  activeTintColor: string;
  inactiveTintColor: string;
  showIcon: boolean;
  showLabel: boolean;
  upperCaseLabel: boolean;
};

type Props = {
  activeTintColor: string;
  inactiveTintColor: string;
  showIcon: boolean;
  showLabel: boolean;
  upperCaseLabel: boolean;
  position: Animated.Value;
  navigationState: NavigationState;
  getLabelText: (scene: TabScene) => string;
  renderIcon: (scene: TabScene) => React.Element<*>;
  labelStyle?: any;
};

export default class TabBarTop extends PureComponent<DefaultProps, Props, void> {

  static defaultProps = {
    activeTintColor: '#fff',
    inactiveTintColor: '#fff',
    showIcon: false,
    showLabel: true,
    upperCaseLabel: true,
  };

  props: Props;

  _renderLabel = (scene: TabScene) => {
    const {
      position,
      navigationState,
      activeTintColor,
      inactiveTintColor,
      showLabel,
      upperCaseLabel,
      labelStyle,
    } = this.props;
    if (showLabel === false) {
      return null;
    }
    const { index } = scene;
    const inputRange = navigationState.routes.map((x: any, i: number) => i);
    const outputRange = inputRange.map((inputIndex: number) =>
      (inputIndex === index ? activeTintColor : inactiveTintColor)
    );
    const color = position.interpolate({
      inputRange,
      outputRange,
    });
    const label = this.props.getLabelText(scene);
    return (
      <Animated.Text style={[styles.label, labelStyle, { color }]}>
        {upperCaseLabel && label ? label.toUpperCase() : label}
      </Animated.Text>
    );
  };

  _renderIcon = (scene: TabScene) => {
    const {
      position,
      navigationState,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon,
    } = this.props;
    if (showIcon === false) {
      return null;
    }
    return (
      <TabBarIcon
        position={position}
        navigationState={navigationState}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        scene={scene}
        style={styles.icon}
      />
    );
  };

  render() {
    return (
      <TabBar
        {/* $FlowFixMe */
          ...this.props}
        renderIcon={this._renderIcon}
        renderLabel={this._renderLabel}
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
  },
  label: {
    textAlign: 'center',
    fontSize: 13,
    margin: 8,
    backgroundColor: 'transparent',
  },
});
