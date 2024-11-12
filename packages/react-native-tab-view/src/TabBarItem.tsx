import * as React from 'react';
import {
  Animated,
  type LayoutChangeEvent,
  Platform,
  type PressableAndroidRippleConfig,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import useLatestCallback from 'use-latest-callback';

import { PlatformPressable } from './PlatformPressable';
import { TabBarItemLabel } from './TabBarItemLabel';
import type { NavigationState, Route, TabDescriptor } from './types';

export type Props<T extends Route> = TabDescriptor<T> & {
  position: Animated.AnimatedInterpolation<number>;
  route: T;
  navigationState: NavigationState<T>;
  activeColor?: string;
  inactiveColor?: string;
  pressColor?: string;
  pressOpacity?: number;
  onLayout?: (event: LayoutChangeEvent) => void;
  onPress: () => void;
  onLongPress: () => void;
  defaultTabWidth?: number;
  style: StyleProp<ViewStyle>;
  android_ripple?: PressableAndroidRippleConfig;
};

const DEFAULT_ACTIVE_COLOR = 'rgba(255, 255, 255, 1)';
const DEFAULT_INACTIVE_COLOR = 'rgba(255, 255, 255, 0.7)';
const ICON_SIZE = 24;

const getActiveOpacity = (
  position: Animated.AnimatedInterpolation<number>,
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
  position: Animated.AnimatedInterpolation<number>,
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
  | 'navigationState'
  | 'getAccessibilityLabel'
  | 'getLabelText'
  | 'getTestID'
  | 'getAccessible'
  | 'options'
> & {
  isFocused: boolean;
  index: number;
  routesLength: number;
} & TabDescriptor<T>;

const ANDROID_RIPPLE_DEFAULT = { borderless: true };

const TabBarItemInternal = <T extends Route>({
  accessibilityLabel,
  accessible,
  label: customlabel,
  testID,
  onLongPress,
  onPress,
  isFocused,
  position,
  style,
  inactiveColor: inactiveColorCustom,
  activeColor: activeColorCustom,
  labelStyle,
  onLayout,
  index: tabIndex,
  pressColor,
  pressOpacity,
  defaultTabWidth,
  icon: customIcon,
  badge: customBadge,
  href,
  labelText,
  routesLength,
  android_ripple = ANDROID_RIPPLE_DEFAULT,
  labelAllowFontScaling,
  route,
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

  const icon = React.useMemo(() => {
    if (!customIcon) {
      return null;
    }

    const inactiveIcon = customIcon({
      focused: false,
      color: inactiveColor,
      size: ICON_SIZE,
      route,
    });

    const activeIcon = customIcon({
      focused: true,
      color: activeColor,
      size: ICON_SIZE,
      route,
    });

    return (
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
  }, [
    activeColor,
    activeOpacity,
    customIcon,
    inactiveColor,
    inactiveOpacity,
    route,
  ]);

  const renderLabel = React.useCallback(
    (focused: boolean) =>
      customlabel ? (
        customlabel({
          focused,
          color: focused ? activeColor : inactiveColor,
          style: labelStyle,
          labelText,
          allowFontScaling: labelAllowFontScaling,
          route,
        })
      ) : (
        <TabBarItemLabel
          color={focused ? activeColor : inactiveColor}
          icon={icon}
          label={labelText}
          style={labelStyle}
        />
      ),
    [
      customlabel,
      activeColor,
      labelStyle,
      labelText,
      labelAllowFontScaling,
      route,
      inactiveColor,
      icon,
    ]
  );

  const tabStyle = StyleSheet.flatten(style);
  const isWidthSet = tabStyle?.width !== undefined;

  const tabContainerStyle: ViewStyle | null = isWidthSet
    ? null
    : { width: defaultTabWidth };

  accessibilityLabel =
    typeof accessibilityLabel !== 'undefined' ? accessibilityLabel : labelText;

  return (
    <PlatformPressable
      android_ripple={android_ripple}
      testID={testID}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      pressColor={pressColor}
      pressOpacity={pressOpacity}
      unstable_pressDelay={0}
      onLayout={onLayout}
      onPress={onPress}
      onLongPress={onLongPress}
      href={href}
      style={[styles.pressable, tabContainerStyle]}
    >
      <View pointerEvents="none" style={[styles.item, tabStyle]}>
        {icon}
        <View>
          <Animated.View style={{ opacity: inactiveOpacity }}>
            {renderLabel(false)}
          </Animated.View>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: activeOpacity }]}
          >
            {renderLabel(true)}
          </Animated.View>
        </View>
        {customBadge != null ? (
          <View style={styles.badge}>{customBadge({ route })}</View>
        ) : null}
      </View>
    </PlatformPressable>
  );
};

const MemoizedTabBarItemInternal = React.memo(
  TabBarItemInternal
) as typeof TabBarItemInternal;

export function TabBarItem<T extends Route>(props: Props<T>) {
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

const styles = StyleSheet.create({
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
    end: 0,
  },
  pressable: {
    // The label is not pressable on Windows
    // Adding backgroundColor: 'transparent' seems to fix it
    backgroundColor: 'transparent',
    ...Platform.select({
      // Roundness for iPad hover effect
      ios: { borderRadius: 10 },
      default: null,
    }),
  },
});
