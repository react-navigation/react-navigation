import * as React from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import useLatestCallback from 'use-latest-callback';

import PlatformPressable from './PlatformPressable';
import type { NavigationState, Route, Scene } from './types';

export type Props<T extends Route> = {
  position: Animated.AnimatedInterpolation;
  route: T;
  navigationState: NavigationState<T>;
  activeColor?: string;
  inactiveColor?: string;
  pressColor?: string;
  pressOpacity?: number;
  getLabelText: (scene: Scene<T>) => string | undefined;
  getAccessible: (scene: Scene<T>) => boolean | undefined;
  getAccessibilityLabel: (scene: Scene<T>) => string | undefined;
  getTestID: (scene: Scene<T>) => string | undefined;
  renderLabel?: (scene: {
    route: T;
    focused: boolean;
    color: string;
  }) => React.ReactNode;
  renderIcon?: (scene: {
    route: T;
    focused: boolean;
    color: string;
  }) => React.ReactNode;
  renderBadge?: (scene: Scene<T>) => React.ReactNode;
  onLayout?: (event: LayoutChangeEvent) => void;
  onPress: () => void;
  onLongPress: () => void;
  defaultTabWidth?: number;
  labelStyle?: StyleProp<TextStyle>;
  style: StyleProp<ViewStyle>;
};

const DEFAULT_ACTIVE_COLOR = 'rgba(255, 255, 255, 1)';
const DEFAULT_INACTIVE_COLOR = 'rgba(255, 255, 255, 0.7)';

const getActiveOpacity = (
  position: Animated.AnimatedInterpolation,
  routesLength: number,
  tabIndex: number
) => {
  if (routesLength > 1) {
    const inputRange = Array.from({ length: routesLength }, (_, i) => i);

    return position.interpolate({
      inputRange,
      outputRange: inputRange.map((i) => (i === tabIndex ? 1 : 0)),
    });
  } else {
    return 1;
  }
};

const getInactiveOpacity = (
  position: Animated.AnimatedInterpolation,
  routesLength: number,
  tabIndex: number
) => {
  if (routesLength > 1) {
    const inputRange = Array.from({ length: routesLength }, (_, i) => i);

    return position.interpolate({
      inputRange,
      outputRange: inputRange.map((i: number) => (i === tabIndex ? 0 : 1)),
    });
  } else {
    return 0;
  }
};

type TabBarItemInternalProps<T extends Route> = Omit<
  Props<T>,
  'navigationState'
> & {
  isFocused: boolean;
  index: number;
  routesLength: number;
};

const TabBarItemInternal = <T extends Route>({
  getAccessibilityLabel,
  getAccessible,
  getLabelText,
  getTestID,
  onLongPress,
  onPress,
  isFocused,
  position,
  route,
  style,
  inactiveColor: inactiveColorCustom,
  activeColor: activeColorCustom,
  labelStyle,
  onLayout,
  index: tabIndex,
  pressColor,
  pressOpacity,
  renderBadge,
  renderIcon,
  defaultTabWidth,
  routesLength,
  renderLabel: renderLabelCustom,
}: TabBarItemInternalProps<T>) => {
  const labelColorFromStyle = StyleSheet.flatten(labelStyle || {}).color;

  const activeColor =
    activeColorCustom !== undefined
      ? activeColorCustom
      : typeof labelColorFromStyle === 'string'
      ? labelColorFromStyle
      : DEFAULT_ACTIVE_COLOR;
  const inactiveColor =
    inactiveColorCustom !== undefined
      ? inactiveColorCustom
      : typeof labelColorFromStyle === 'string'
      ? labelColorFromStyle
      : DEFAULT_INACTIVE_COLOR;

  const activeOpacity = getActiveOpacity(position, routesLength, tabIndex);
  const inactiveOpacity = getInactiveOpacity(position, routesLength, tabIndex);

  let icon: React.ReactNode | null = null;
  let label: React.ReactNode | null = null;

  if (renderIcon) {
    const activeIcon = renderIcon({
      route,
      focused: true,
      color: activeColor,
    });
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

  const renderLabel =
    renderLabelCustom !== undefined
      ? renderLabelCustom
      : (labelProps: { route: T; color: string }) => {
          const labelText = getLabelText({ route: labelProps.route });

          if (typeof labelText === 'string') {
            return (
              <Animated.Text
                style={[
                  styles.label,
                  icon ? { marginTop: 0 } : null,
                  labelStyle,
                  { color: labelProps.color },
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
  const isWidthSet = tabStyle?.width !== undefined;

  const tabContainerStyle: ViewStyle | null = isWidthSet
    ? null
    : { width: defaultTabWidth };

  const scene = { route };

  let accessibilityLabel = getAccessibilityLabel(scene);

  accessibilityLabel =
    typeof accessibilityLabel !== 'undefined'
      ? accessibilityLabel
      : getLabelText(scene);

  const badge = renderBadge ? renderBadge(scene) : null;

  return (
    <PlatformPressable
      android_ripple={{ borderless: true }}
      testID={getTestID(scene)}
      accessible={getAccessible(scene)}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      // @ts-ignore: this is to support older React Native versions
      accessibilityStates={isFocused ? ['selected'] : []}
      pressColor={pressColor}
      pressOpacity={pressOpacity}
      delayPressIn={0}
      onLayout={onLayout}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.pressable, tabContainerStyle]}
    >
      <View pointerEvents="none" style={[styles.item, tabStyle]}>
        {icon}
        {label}
        {badge != null ? <View style={styles.badge}>{badge}</View> : null}
      </View>
    </PlatformPressable>
  );
};

const MemoizedTabBarItemInternal = React.memo(
  TabBarItemInternal
) as typeof TabBarItemInternal;

function TabBarItem<T extends Route>(props: Props<T>) {
  const { onPress, onLongPress, onLayout, navigationState, route, ...rest } =
    props;
  const onPressLatest = useLatestCallback(onPress);
  const onLongPressLatest = useLatestCallback(onLongPress);
  const onLayoutLatest = useLatestCallback(onLayout ? onLayout : () => {});

  const tabIndex = navigationState.routes.indexOf(route);

  return (
    <MemoizedTabBarItemInternal
      {...rest}
      onPress={onPressLatest}
      onLayout={onLayoutLatest}
      onLongPress={onLongPressLatest}
      isFocused={navigationState.index === tabIndex}
      route={route}
      index={tabIndex}
      routesLength={navigationState.routes.length}
    />
  );
}

export default TabBarItem;

const styles = StyleSheet.create({
  label: {
    margin: 4,
    backgroundColor: 'transparent',
    textTransform: 'uppercase',
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
  pressable: {
    // The label is not pressable on Windows
    // Adding backgroundColor: 'transparent' seems to fix it
    backgroundColor: 'transparent',
  },
});
