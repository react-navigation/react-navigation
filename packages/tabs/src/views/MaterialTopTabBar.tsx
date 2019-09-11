import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import { NavigationRoute } from 'react-navigation';
import { MaterialTabBarProps } from '../types';

type Scene = { route: NavigationRoute; focused: boolean; color: string };

export default class TabBarTop extends React.PureComponent<
  MaterialTabBarProps
> {
  static defaultProps = {
    activeTintColor: 'rgba(255, 255, 255, 1)',
    inactiveTintColor: 'rgba(255, 255, 255, 0.7)',
    showIcon: false,
    showLabel: true,
    upperCaseLabel: true,
    allowFontScaling: true,
  };

  _renderLabel = ({ route, focused, color }: Scene) => {
    const {
      showLabel,
      upperCaseLabel,
      labelStyle,
      allowFontScaling,
    } = this.props;

    if (showLabel === false) {
      return null;
    }

    const label = this.props.getLabelText({ route });

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
      return label({ focused, tintColor: color });
    }

    return label;
  };

  _renderIcon = ({ route, focused, color }: Scene) => {
    const { renderIcon, showIcon, iconStyle } = this.props;

    if (showIcon === false) {
      return null;
    }

    return (
      <View style={[styles.icon, iconStyle]}>
        {renderIcon({
          route,
          focused,
          tintColor: color,
        })}
      </View>
    );
  };

  render() {
    const {
      navigation,
      activeTintColor,
      inactiveTintColor,
      /* eslint-disable @typescript-eslint/no-unused-vars */
      renderIcon,
      getLabelText,
      allowFontScaling,
      showLabel,
      showIcon,
      upperCaseLabel,
      tabBarPosition,
      screenProps,
      iconStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = this.props;

    return (
      <TabBar
        {...rest}
        activeColor={activeTintColor}
        inactiveColor={inactiveTintColor}
        navigationState={navigation.state}
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
    margin: 4,
    backgroundColor: 'transparent',
  },
});
