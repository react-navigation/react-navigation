import * as React from 'react';
import {
  Animated,
  type ColorValue,
  type LayoutChangeEvent,
  Platform,
  type PressableAndroidRippleConfig,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import useLatestCallback from 'use-latest-callback';

import {
  TAB_BAR_INACTIVE_COLOR,
  TAB_BAR_PRIMARY_ACTIVE_COLOR,
  TAB_BAR_SECONDARY_ACTIVE_COLOR,
} from './constants';
import { PlatformPressable } from './PlatformPressable';
import { TabBarItemLabel } from './TabBarItemLabel';
import type { NavigationState, Route, TabDescriptor } from './types';

type Layout = {
  width: number;
  height: number;
};

export type Props<T extends Route> = TabDescriptor<T> & {
  variant?: 'primary' | 'secondary' | undefined;
  position: Animated.AnimatedInterpolation<number>;
  route: T;
  navigationState: NavigationState<T>;
  activeColor?: ColorValue | undefined;
  inactiveColor?: ColorValue | undefined;
  pressColor?: ColorValue | undefined;
  pressOpacity?: number | undefined;
  onMeasureLayout: (layout: Layout) => void;
  onMeasureLabelLayout: (layout: Layout) => void;
  onPress: () => void;
  onLongPress: () => void;
  style: StyleProp<ViewStyle>;
  android_ripple?: PressableAndroidRippleConfig | undefined;
};

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
  | 'variant'
> & {
  isFocused: boolean;
  index: number;
  routesLength: number;
  variant: NonNullable<Props<T>['variant']>;
} & TabDescriptor<T>;

const ANDROID_RIPPLE_DEFAULT = { borderless: false, foreground: true };

const TabBarItemInternal = <T extends Route>({
  variant,
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
  onMeasureLayout,
  onMeasureLabelLayout,
  index: tabIndex,
  pressColor,
  pressOpacity,
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
  const defaultActiveColor =
    variant === 'primary'
      ? TAB_BAR_PRIMARY_ACTIVE_COLOR
      : TAB_BAR_SECONDARY_ACTIVE_COLOR;

  const activeColor =
    activeColorCustom !== undefined
      ? activeColorCustom
      : typeof labelColorFromStyle === 'string'
        ? labelColorFromStyle
        : defaultActiveColor;
  const inactiveColor =
    inactiveColorCustom !== undefined
      ? inactiveColorCustom
      : typeof labelColorFromStyle === 'string'
        ? labelColorFromStyle
        : TAB_BAR_INACTIVE_COLOR;

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
          allowFontScaling={labelAllowFontScaling}
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

  const ariaLabel =
    typeof accessibilityLabel !== 'undefined' ? accessibilityLabel : labelText;

  const viewRef = React.useRef<View>(null);
  const labelRef = React.useRef<View>(null);

  React.useLayoutEffect(() => {
    viewRef.current?.measure((_x, _y, width, height) => {
      onMeasureLayout({ width, height });
    });

    labelRef.current?.measure((_x, _y, width, height) => {
      onMeasureLabelLayout({ width, height });
    });

    // Only measure on mount. onLayout handles updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    onMeasureLayout({ width, height });
  };

  const onLabelLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    onMeasureLabelLayout({ width, height });
  };

  return (
    <PlatformPressable
      android_ripple={android_ripple}
      testID={testID}
      accessible={accessible}
      role="tab"
      aria-label={ariaLabel}
      aria-selected={isFocused}
      pressColor={pressColor}
      pressOpacity={pressOpacity}
      unstable_pressDelay={0}
      onPress={onPress}
      onLongPress={onLongPress}
      href={href}
      style={styles.pressable}
    >
      <View ref={viewRef} onLayout={onLayout} style={[styles.item, style]}>
        <View ref={labelRef} onLayout={onLabelLayout}>
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

export function TabBarItem<T extends Route>({
  variant = 'primary',
  onPress,
  onLongPress,
  onMeasureLayout,
  onMeasureLabelLayout,
  navigationState,
  route,
  ...rest
}: Props<T>) {
  const onPressLatest = useLatestCallback(onPress);
  const onLongPressLatest = useLatestCallback(onLongPress);
  const onMeasureLayoutLatest = useLatestCallback(onMeasureLayout);
  const onMeasureLabelLayoutLatest = useLatestCallback(onMeasureLabelLayout);

  const tabIndex = navigationState.routes.indexOf(route);

  return (
    <MemoizedTabBarItemInternal
      {...rest}
      variant={variant}
      onPress={onPressLatest}
      onMeasureLayout={onMeasureLayoutLatest}
      onMeasureLabelLayout={onMeasureLabelLayoutLatest}
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
    paddingHorizontal: 16,
    minHeight: 48,
    pointerEvents: 'none',
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
      ios: {
        borderRadius: 10,
        borderCurve: 'continuous',
      },
      default: null,
    }),
  },
});
