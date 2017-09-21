/* @flow */

import React, { PureComponent } from 'react';
import { Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import TabBarIcon from './TabBarIcon';

import type {
  NavigationAction,
  NavigationRoute,
  NavigationState,
  NavigationScreenProp,
  ViewStyleProp,
  TextStyleProp,
} from '../../TypeDefinition';

import type { TabScene } from './TabView';

type DefaultProps = {
  activeTintColor: string,
  activeBackgroundColor: string,
  inactiveTintColor: string,
  inactiveBackgroundColor: string,
  showLabel: boolean,
};

type Props = {
  activeTintColor: string,
  activeBackgroundColor: string,
  inactiveTintColor: string,
  inactiveBackgroundColor: string,
  position: Animated.Value,
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  jumpToIndex: (index: number) => void,
  getLabel: (scene: TabScene) => ?(React.Element<*> | string),
  getOnPress: (
    scene: TabScene
  ) => (scene: TabScene, jumpToIndex: (index: number) => void) => void,
  renderIcon: (scene: TabScene) => React.Element<*>,
  showLabel: boolean,
  style?: ViewStyleProp,
  labelStyle?: TextStyleProp,
  tabStyle?: ViewStyleProp,
  showIcon: boolean,
};

export default class TabBarBottom extends PureComponent<
  DefaultProps,
  Props,
  void
> {
  // See https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/UIKitUICatalog/UITabBar.html
  static defaultProps = {
    activeTintColor: '#3478f6', // Default active tint color in iOS 10
    activeBackgroundColor: 'transparent',
    inactiveTintColor: '#929292', // Default inactive tint color in iOS 10
    inactiveBackgroundColor: 'transparent',
    showLabel: true,
    showIcon: true,
  };

  props: Props;

  _renderLabel = (scene: TabScene) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      labelStyle,
      showLabel,
    } = this.props;
    if (showLabel === false) {
      return null;
    }
    const { index } = scene;
    const { routes } = navigation.state;
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x: *, i: number) => i)];
    const outputRange = inputRange.map(
      (inputIndex: number) =>
        inputIndex === index ? activeTintColor : inactiveTintColor
    );
    const color = position.interpolate({
      inputRange,
      outputRange: (outputRange: Array<string>),
    });

    const tintColor = scene.focused ? activeTintColor : inactiveTintColor;
    const label = this.props.getLabel({ ...scene, tintColor });
    if (typeof label === 'string') {
      return (
        <Animated.Text style={[styles.label, { color }, labelStyle]}>
          {label}
        </Animated.Text>
      );
    }

    if (typeof label === 'function') {
      return label({ ...scene, tintColor });
    }

    return label;
  };

  _renderIcon = (scene: TabScene) => {
    const {
      position,
      navigation,
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
        navigation={navigation}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        scene={scene}
        style={styles.icon}
      />
    );
  };

  render() {
    const {
      position,
      navigation,
      jumpToIndex,
      getOnPress,
      activeBackgroundColor,
      inactiveBackgroundColor,
      style,
      tabStyle,
    } = this.props;
    const { routes } = navigation.state;
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x: *, i: number) => i)];
    return (
      <Animated.View style={[styles.tabBar, style]}>
        {routes.map((route: NavigationRoute, index: number) => {
          const focused = index === navigation.state.index;
          const scene = { route, index, focused };
          const onPress = getOnPress(scene);
          const outputRange = inputRange.map(
            (inputIndex: number) =>
              inputIndex === index
                ? activeBackgroundColor
                : inactiveBackgroundColor
          );
          const backgroundColor = position.interpolate({
            inputRange,
            outputRange: (outputRange: Array<string>),
          });
          const justifyContent = this.props.showIcon ? 'flex-end' : 'center';
          return (
            <TouchableWithoutFeedback
              key={route.key}
              onPress={() =>
                onPress ? onPress(scene, jumpToIndex) : jumpToIndex(index)}
            >
              <Animated.View
                style={[
                  styles.tab,
                  { backgroundColor, justifyContent },
                  tabStyle,
                ]}
              >
                {this._renderIcon(scene)}
                {this._renderLabel(scene)}
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    height: 49, // Default tab bar height in iOS 10
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    backgroundColor: '#F7F7F7', // Default background color in iOS 10
  },
  tab: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  icon: {
    flexGrow: 1,
  },
  label: {
    textAlign: 'center',
    fontSize: 10,
    marginBottom: 1.5,
    backgroundColor: 'transparent',
  },
});
