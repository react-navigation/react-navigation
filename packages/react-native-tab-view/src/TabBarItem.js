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

type Props<T> = {
  position: Animated.Node,
  scene: Scene<T>,
  navigationState: NavigationState<T>,
  scrollEnabled?: boolean,
  pressColor?: string,
  pressOpacity?: number,
  getLabelText: (scene: Scene<T>) => ?string,
  getAccessible: (scene: Scene<T>) => ?boolean,
  getAccessibilityLabel: (scene: Scene<T>) => ?string,
  getTestID: (scene: Scene<T>) => ?string,
  renderLabel?: (scene: Scene<T>) => React.Node,
  renderIcon?: (scene: Scene<T>) => React.Node,
  renderBadge?: (scene: Scene<T>) => React.Node,
  onTabPress: (scene: Scene<T>) => void,
  onTabLongPress: (scene: Scene<T>) => void,
  tabWidth: number,
  tabStyle: ViewStyleProp,
  labelStyle?: TextStyleProp,
};

export default function TabBarItem<T: Route>({
  scene,
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
  pressColor,
  pressOpacity,
  labelStyle,
  tabStyle,
  tabWidth,
  onTabPress,
  onTabLongPress,
}: Props<T>) {
  const activeOpacity = 1;
  const inactiveOpacity = 0.7;

  const tabIndex = navigationState.routes.indexOf(scene.route);
  const isFocused = navigationState.index === tabIndex;

  // Prepend '-1', so there are always at least 2 items in inputRange
  const inputRange = [-1, ...navigationState.routes.map((x, i) => i)];
  const opacity = Animated.interpolate(position, {
    inputRange,
    outputRange: inputRange.map(inputIndex =>
      inputIndex === tabIndex ? activeOpacity : inactiveOpacity
    ),
  });

  const icon = renderIcon ? renderIcon(scene) : null;
  const badge = renderBadge ? renderBadge(scene) : null;

  let label;

  if (typeof renderLabel !== 'undefined') {
    label = renderLabel(scene);
  } else {
    const labelText = getLabelText(scene);

    if (typeof labelText !== 'string') {
      label = null;
    } else {
      label = (
        <Animated.Text style={[styles.tabLabel, labelStyle]}>
          {labelText}
        </Animated.Text>
      );
    }
  }

  const computedTabStyle = {};

  computedTabStyle.opacity = opacity;

  if (icon != null) {
    if (label != null) {
      computedTabStyle.paddingTop = 8;
    } else {
      computedTabStyle.padding = 12;
    }
  }

  const passedTabStyle = StyleSheet.flatten(tabStyle);
  const isWidthSet =
    (passedTabStyle && typeof passedTabStyle.width !== 'undefined') ||
    scrollEnabled === true;
  const tabContainerStyle = {};

  if (isWidthSet) {
    computedTabStyle.width = tabWidth;
  }

  if (passedTabStyle && typeof passedTabStyle.flex === 'number') {
    tabContainerStyle.flex = passedTabStyle.flex;
  } else if (!isWidthSet) {
    tabContainerStyle.flex = 1;
  }

  let accessibilityLabel = getAccessibilityLabel(scene);

  accessibilityLabel =
    typeof accessibilityLabel !== 'undefined'
      ? accessibilityLabel
      : getLabelText(scene);

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
      onPress={() => onTabPress(scene)}
      onLongPress={() => onTabLongPress(scene)}
      style={tabContainerStyle}
    >
      <View pointerEvents="none" style={styles.container}>
        <Animated.View
          style={[
            styles.tabItem,
            computedTabStyle,
            passedTabStyle,
            styles.container,
          ]}
        >
          {icon}
          {label}
        </Animated.View>
        {badge != null ? (
          <Animated.View style={styles.badge}>{badge}</Animated.View>
        ) : null}
      </View>
    </TouchableItem>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabLabel: {
    backgroundColor: 'transparent',
    color: 'white',
    margin: 8,
  },
  tabItem: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
