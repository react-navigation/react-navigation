/* @flow */

import * as React from 'react';
import { ThemeContext } from '@react-navigation/core';
import { BottomNavigation } from 'react-native-paper';
import { createTabNavigator, type InjectedProps } from 'react-navigation-tabs';

type Props = InjectedProps & {
  activeTintColor?: string,
  activeTintColorLight?: string,
  activeTintColorDark?: string,
  inactiveTintColor?: string,
  inactiveTintColorLight?: string,
  inactiveTintColorDark?: string,
  // todo: once this is properly typed, add other types for themed props
};

class BottomNavigationView extends React.Component<Props> {
  static contextType = ThemeContext;

  _getColor = ({ route }) => {
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    if (this.context === 'dark' && options.tabBarColorDark) {
      return options.tabBarColorDark;
    } else if (this.tabBarColorLight) {
      return options.tabBarColorLight;
    } else {
      return options.tabBarColor;
    }
  };

  _getActiveTintColor = () => {
    let {
      activeTintColor,
      activeTintColorLight,
      activeTintColorDark,
    } = this.props;

    if (this.context === 'dark' && activeTintColorDark) {
      return activeTintColorDark;
    } else if (activeTintColorLight) {
      return activeTintColorLight;
    } else {
      return activeTintColor;
    }
  };

  _getInactiveTintColor = () => {
    let {
      inactiveTintColor,
      inactiveTintColorLight,
      inactiveTintColorDark,
    } = this.props;

    if (this.context === 'dark' && inactiveTintColorDark) {
      return inactiveTintColorDark;
    } else if (inactiveTintColorLight) {
      return inactiveTintColorLight;
    } else {
      return inactiveTintColor;
    }
  };

  _getBarStyle = () => {
    let { barStyle, barStyleLight, barStyleDark } = this.props;

    if (this.context === 'dark' && barStyleDark) {
      return barStyleDark;
    } else if (barStyleLight) {
      return barStyleLight;
    } else {
      return barStyle;
    }
  };

  _isVisible() {
    const { navigation, descriptors } = this.props;
    const { state } = navigation;
    const route = state.routes[state.index];
    const options = descriptors[route.key].options;
    return options.tabBarVisible;
  }

  _renderIcon = ({ route, focused, color }) => {
    return this.props.renderIcon({ route, focused, tintColor: color });
  };

  render() {
    const {
      navigation,
      // eslint-disable-next-line no-unused-vars
      descriptors,
      ...rest
    } = this.props;

    const activeTintColor = this._getActiveTintColor();
    const inactiveTintColor = this._getInactiveTintColor();
    const barStyle = this._getBarStyle();

    const isVisible = this._isVisible();
    const extraStyle =
      typeof isVisible === 'boolean'
        ? { display: isVisible ? null : 'none' }
        : null;

    return (
      <BottomNavigation
        // Pass these for backward compaibility
        {...rest}
        activeColor={activeTintColor}
        inactiveColor={inactiveTintColor}
        renderIcon={this._renderIcon}
        barStyle={[barStyle, extraStyle]}
        navigationState={navigation.state}
        getColor={this._getColor}
      />
    );
  }
}

export default createTabNavigator(BottomNavigationView);
