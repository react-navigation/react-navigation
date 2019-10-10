import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import { Route } from '@react-navigation/core';

import { MaterialTopTabBarProps } from '../types';

export default class TabBarTop extends React.PureComponent<
  MaterialTopTabBarProps
> {
  static defaultProps = {
    activeTintColor: 'rgba(255, 255, 255, 1)',
    inactiveTintColor: 'rgba(255, 255, 255, 0.7)',
    showIcon: false,
    showLabel: true,
    upperCaseLabel: true,
    allowFontScaling: true,
  };

  private renderLabel = ({
    route,
    focused,
    color,
  }: {
    route: Route<string>;
    focused: boolean;
    color: string;
  }) => {
    const {
      getLabelText,
      showLabel,
      upperCaseLabel,
      labelStyle,
      allowFontScaling,
    } = this.props;

    if (showLabel === false) {
      return null;
    }

    const label = getLabelText({ route });

    if (typeof label === 'string') {
      return (
        <Animated.Text
          style={[styles.label, { color }, labelStyle]}
          allowFontScaling={allowFontScaling}
        >
          {upperCaseLabel ? label.toUpperCase() : label}
        </Animated.Text>
      );
    }

    if (typeof label === 'function') {
      return label({ focused, color });
    }

    return label;
  };

  private renderIcon = ({
    route,
    focused,
    color,
  }: {
    route: Route<string>;
    focused: boolean;
    color: string;
  }) => {
    const { descriptors, showIcon, iconStyle } = this.props;

    if (showIcon === false) {
      return null;
    }

    const { options } = descriptors[route.key];

    if (options.tabBarIcon !== undefined) {
      const icon =
        typeof options.tabBarIcon === 'function'
          ? options.tabBarIcon({ focused, color })
          : options.tabBarIcon;

      return <View style={[styles.icon, iconStyle]}>{icon}</View>;
    }

    return null;
  };

  render() {
    const {
      state,
      activeTintColor,
      inactiveTintColor,
      getAccessibilityLabel,
      getTestID,
      onTabPress,
      onTabLongPress,
      /* eslint-disable @typescript-eslint/no-unused-vars */
      getLabelText,
      allowFontScaling,
      showLabel,
      showIcon,
      upperCaseLabel,
      tabBarPosition,
      iconStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = this.props;

    return (
      <TabBar
        {...rest}
        activeColor={activeTintColor}
        inactiveColor={inactiveTintColor}
        navigationState={state}
        getAccessibilityLabel={getAccessibilityLabel}
        getTestID={getTestID}
        renderIcon={this.renderIcon}
        renderLabel={this.renderLabel}
        onTabPress={onTabPress}
        onTabLongPress={onTabLongPress}
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
    margin: 4,
    backgroundColor: 'transparent',
  },
});
