/* @flow */

import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import CrossFadeIcon from './CrossFadeIcon';

export type TabBarOptions = {
  activeTintColor?: string,
  inactiveTintColor?: string,
  showLabel?: boolean,
  showIcon?: boolean,
  upperCaseLabel?: boolean,
  labelStyle?: any,
  iconStyle?: any,
  allowFontScaling?: boolean,
};

type Props = TabBarOptions & {
  position: Animated.Value,
  offsetX: Animated.Value,
  panX: Animated.Value,
  layout: any,
  navigation: any,
  renderIcon: (props: {
    route: any,
    focused: boolean,
    tintColor: string,
  }) => React.Node,
  getLabelText: (props: { route: any }) => any,
  getAccessibilityLabel: (props: { route: any }) => string,
  getTestID: (props: { route: any }) => string,
  useNativeDriver?: boolean,
  jumpTo: (key: string) => any,
};

export default class TabBarTop extends React.PureComponent<Props> {
  static defaultProps = {
    activeTintColor: '#fff',
    inactiveTintColor: '#fff',
    showIcon: false,
    showLabel: true,
    upperCaseLabel: true,
    allowFontScaling: true,
  };

  _renderLabel = ({ route }) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      showLabel,
      upperCaseLabel,
      labelStyle,
      allowFontScaling,
    } = this.props;

    if (showLabel === false) {
      return null;
    }

    const { routes } = navigation.state;
    const index = routes.indexOf(route);
    const focused = index === navigation.state.index;

    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)];
    const outputRange = inputRange.map(inputIndex =>
      inputIndex === index ? activeTintColor : inactiveTintColor
    );
    const color = position.interpolate({
      inputRange,
      outputRange: outputRange,
    });

    const tintColor = focused ? activeTintColor : inactiveTintColor;
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
      return label({ focused, tintColor });
    }

    return label;
  };

  _renderIcon = ({ route }) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon,
      iconStyle,
    } = this.props;

    if (showIcon === false) {
      return null;
    }

    const index = navigation.state.routes.indexOf(route);

    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...navigation.state.routes.map((x, i) => i)];
    const activeOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 1 : 0)),
    });
    const inactiveOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 0 : 1)),
    });

    return (
      <CrossFadeIcon
        route={route}
        navigation={navigation}
        activeOpacity={activeOpacity}
        inactiveOpacity={inactiveOpacity}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        style={[styles.icon, iconStyle]}
      />
    );
  };

  render() {
    /* eslint-disable no-unused-vars */
    const { navigation, renderIcon, getLabelText, ...rest } = this.props;

    return (
      /* $FlowFixMe */
      <TabBar
        {...rest}
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
    margin: 8,
    backgroundColor: 'transparent',
  },
});
