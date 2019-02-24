/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import TouchableItem from './TouchableItem';
import type { Scene, Route, NavigationState } from './types';
import type {
  ViewStyleProp,
  TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';
import Animated from 'react-native-reanimated';

type Props<T> = {|
  position: Animated.Node,
  route: T,
  navigationState: NavigationState<T>,
  scrollEnabled?: boolean,
  activeColor?: string,
  inactiveColor?: string,
  pressColor?: string,
  pressOpacity?: number,
  getLabelText: (scene: Scene<T>) => ?string,
  getAccessible: (scene: Scene<T>) => ?boolean,
  getAccessibilityLabel: (scene: Scene<T>) => ?string,
  getTestID: (scene: Scene<T>) => ?string,
  renderLabel?: (scene: {|
    route: T,
    focused: boolean,
    color: string,
  |}) => React.Node,
  renderIcon?: (scene: {|
    route: T,
    focused: boolean,
    color: string,
  |}) => React.Node,
  renderBadge?: (scene: Scene<T>) => React.Node,
  onPress: () => mixed,
  onLongPress: () => mixed,
  tabWidth: number,
  labelStyle?: TextStyleProp,
  style: ViewStyleProp,
|};

const DEFAULT_ACTIVE_COLOR = 'rgba(255, 255, 255, 1)';
const DEFAULT_INACTIVE_COLOR = 'rgba(255, 255, 255, 0.7)';

export default function TabBarItem<T: Route>({
  route,
  position,
  navigationState,
  scrollEnabled,
  renderLabel,
  renderIcon,
  renderBadge,
  getLabelText,
  getTestID,
  getAccessibilityLabel,
  getAccessible,
  activeColor = DEFAULT_ACTIVE_COLOR,
  inactiveColor = DEFAULT_INACTIVE_COLOR,
  pressColor,
  pressOpacity,
  labelStyle,
  style,
  tabWidth,
  onPress,
  onLongPress,
}: Props<T>) {
  const tabIndex = navigationState.routes.indexOf(route);
  const isFocused = navigationState.index === tabIndex;

  // Prepend '-1', so there are always at least 2 items in inputRange
  const inputRange = [-1, ...navigationState.routes.map((x, i) => i)];

  const activeOpacity = Animated.interpolate(position, {
    inputRange,
    outputRange: inputRange.map(i => (i === tabIndex ? 1 : 0)),
  });

  const inactiveOpacity = Animated.interpolate(position, {
    inputRange,
    outputRange: inputRange.map(i => (i === tabIndex ? 0 : 1)),
  });

  let icon = null;
  let label = null;

  if (renderIcon) {
    const activeIcon = renderIcon({ route, focused: true, color: activeColor });
    const inactiveIcon = renderIcon({
      route,
      focused: false,
      color: inactiveColor,
    });

    if (inactiveIcon != null && activeIcon != null) {
      icon = (
        <View style={styles.icon}>
          <Animated.View style={{ opacity: inactiveOpacity }}>
            {inactiveIcon}
          </Animated.View>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: activeOpacity }]}
          >
            {activeIcon}
          </Animated.View>
        </View>
      );
    }
  }

  renderLabel =
    renderLabel !== undefined
      ? renderLabel
      : ({ route, color }) => {
          const labelText = getLabelText({ route });

          if (typeof labelText === 'string') {
            return (
              <Animated.Text
                style={[
                  styles.label,
                  icon && { marginTop: 0 },
                  { color },
                  labelStyle,
                ]}
              >
                {labelText}
              </Animated.Text>
            );
          }

          return labelText;
        };

  if (renderLabel) {
    const activeLabel = renderLabel({
      route,
      focused: true,
      color: activeColor,
    });
    const inactiveLabel = renderLabel({
      route,
      focused: false,
      color: inactiveColor,
    });

    label = (
      <View>
        <Animated.View style={{ opacity: inactiveOpacity }}>
          {inactiveLabel}
        </Animated.View>
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: activeOpacity }]}
        >
          {activeLabel}
        </Animated.View>
      </View>
    );
  }

  const tabStyle = StyleSheet.flatten(style);
  const isWidthSet =
    (tabStyle && typeof tabStyle.width !== 'undefined') ||
    scrollEnabled === true;

  const tabContainerStyle = {};
  const itemStyle = isWidthSet ? { width: tabWidth } : null;

  if (tabStyle && typeof tabStyle.flex === 'number') {
    tabContainerStyle.flex = tabStyle.flex;
  } else if (!isWidthSet) {
    tabContainerStyle.flex = 1;
  }

  const scene = { route };

  let accessibilityLabel = getAccessibilityLabel(scene);

  accessibilityLabel =
    typeof accessibilityLabel !== 'undefined'
      ? accessibilityLabel
      : getLabelText(scene);

  const badge = renderBadge ? renderBadge(scene) : null;

  return (
    <TouchableItem
      borderless
      testID={getTestID(scene)}
      accessible={getAccessible(scene)}
      accessibilityLabel={accessibilityLabel}
      accessibilityTraits={isFocused ? ['button', 'selected'] : 'button'}
      accessibilityComponentType="button"
      accessibilityRole="button"
      accessibilityStates={isFocused ? ['selected'] : []}
      pressColor={pressColor}
      pressOpacity={pressOpacity}
      delayPressIn={0}
      onPress={onPress}
      onLongPress={onLongPress}
      style={tabContainerStyle}
    >
      <View pointerEvents="none" style={[styles.item, itemStyle, tabStyle]}>
        {icon}
        {label}
        {badge != null ? <View style={styles.badge}>{badge}</View> : null}
      </View>
    </TouchableItem>
  );
}

const styles = StyleSheet.create({
  label: {
    margin: 4,
    backgroundColor: 'transparent',
  },
  icon: {
    margin: 2,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    minHeight: 48,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
