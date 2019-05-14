/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import type {
  ViewStyleProp,
  TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

type Route = {
  key: string,
  routeName: string,
};

type Layout = {|
  width: number,
  height: number,
|};

export type TabBarOptions = {|
  activeTintColor?: string,
  allowFontScaling?: boolean,
  bounces?: boolean,
  inactiveTintColor?: string,
  pressColor?: string,
  pressOpacity?: number,
  scrollEnabled?: boolean,
  showIcon?: boolean,
  showLabel?: boolean,
  upperCaseLabel?: boolean,
  tabStyle?: ViewStyleProp,
  indicatorStyle?: ViewStyleProp,
  iconStyle?: any,
  labelStyle?: TextStyleProp,
  contentContainerStyle?: ViewStyleProp,
  style?: ViewStyleProp,
|};

type Props = {|
  ...TabBarOptions,
  layout: Layout,
  position: Animated.Node<number>,
  jumpTo: (key: string) => void,
  getLabelText: (scene: { route: Route }) => ?string,
  getAccessible?: (scene: { route: Route }) => ?boolean,
  getAccessibilityLabel: (scene: { route: Route }) => ?string,
  getTestID: (scene: { route: Route }) => ?string,
  renderIcon: (scene: {
    route: Route,
    focused: boolean,
    tintColor: string,
    horizontal?: boolean,
  }) => React.Node,
  renderBadge?: (scene: { route: Route }) => React.Node,
  onTabPress?: (scene: { route: Route }) => mixed,
  onTabLongPress?: (scene: { route: Route }) => mixed,
  tabBarPosition: 'top' | 'bottom',
  navigationState: any,
  screenProps: any,
  navigation: any,
|};

export default class TabBarTop extends React.PureComponent<Props> {
  static defaultProps = {
    activeTintColor: 'rgba(255, 255, 255, 1)',
    inactiveTintColor: 'rgba(255, 255, 255, 0.7)',
    showIcon: false,
    showLabel: true,
    upperCaseLabel: true,
    allowFontScaling: true,
  };

  _renderLabel = ({ route, focused, color }) => {
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

  _renderIcon = ({ route, focused, color }) => {
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
      /* eslint-disable no-unused-vars */
      renderIcon,
      getLabelText,
      allowFontScaling,
      showLabel,
      showIcon,
      upperCaseLabel,
      tabBarPosition,
      navigationState,
      screenProps,
      iconStyle,
      /* eslint-enable no-unused-vars */
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
