import { PlatformIcon, Text } from '@react-navigation/elements';
import { Color } from '@react-navigation/elements/internal';
import { useLinkBuilder, useLocale, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { type ColorValue, StyleSheet } from 'react-native';
import {
  type Route,
  TabBar,
  type TabBarProps,
  type TabDescriptor,
} from 'react-native-tab-view';
import useLatestCallback from 'use-latest-callback';

import type { MaterialTopTabBarProps } from '../types';

type MaterialLabelProps = Parameters<
  NonNullable<TabDescriptor<Route>['label']>
>[0];

type CachedOptions = {
  deps: readonly unknown[];
  options: TabDescriptor<Route>;
};

const MaterialLabel = ({
  color,
  labelText,
  style,
  allowFontScaling,
}: MaterialLabelProps) => {
  const { fonts } = useTheme();

  return (
    <Text
      style={[{ color }, fonts.medium, styles.label, style]}
      allowFontScaling={allowFontScaling}
    >
      {labelText}
    </Text>
  );
};

const renderLabelDefault = (props: MaterialLabelProps) => (
  <MaterialLabel {...props} />
);

export function MaterialTopTabBar({
  state,
  navigation,
  descriptors,
  ...rest
}: MaterialTopTabBarProps) {
  const { colors, dark, fonts } = useTheme();
  const { direction } = useLocale();
  const { buildHref } = useLinkBuilder();

  const focusedRoute = state.routes[state.index];

  if (focusedRoute == null) {
    throw new Error(`Couldn't find a route at index ${state.index}.`);
  }

  const focusedOptions = descriptors[focusedRoute.key]?.options ?? {};
  const tabBarVariant = focusedOptions.tabBarVariant ?? 'primary';

  const activeColor: ColorValue =
    focusedOptions.tabBarActiveTintColor ??
    (tabBarVariant === 'primary' ? colors.primary : colors.text);

  const inactiveColor: ColorValue =
    focusedOptions.tabBarInactiveTintColor ??
    Color(colors.text)?.alpha(0.68).string() ??
    (dark ? 'rgba(255, 255, 255, 0.68)' : 'rgba(0, 0, 0, 0.68)');

  const pressColor: ColorValue =
    focusedOptions.tabBarPressColor ??
    Color(tabBarVariant === 'primary' ? colors.primary : colors.text)
      ?.alpha(0.12)
      .string() ??
    (dark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)');

  const optionsCache = React.useRef<Record<string, CachedOptions>>({});

  const nextOptions = Object.fromEntries<CachedOptions>(
    state.routes.map((route) => {
      const {
        title,
        tabBarLabel,
        tabBarButtonTestID,
        tabBarAccessibilityLabel,
        tabBarBadge,
        tabBarBadgeStyle,
        tabBarShowIcon,
        tabBarShowLabel,
        tabBarIcon,
        tabBarAllowFontScaling,
        tabBarLabelStyle,
      } = descriptors[route.key]?.options ?? {};

      const focused = focusedRoute.key === route.key;
      const href = buildHref(route.name, route.params);

      const previous = optionsCache.current[route.key];

      const deps = [
        href,
        route.name,
        title,
        tabBarLabel,
        tabBarButtonTestID,
        tabBarAccessibilityLabel,
        tabBarBadge,
        tabBarBadgeStyle,
        tabBarShowIcon,
        tabBarShowLabel,
        tabBarIcon,
        tabBarAllowFontScaling,
        tabBarLabelStyle,
        typeof tabBarLabel === 'function' && focused,
        colors.notification,
        fonts.medium,
      ];

      if (
        previous &&
        Object.hasOwn(optionsCache.current, route.key) &&
        previous.deps.length === deps.length &&
        deps.every((dep, index) => Object.is(dep, previous.deps[index]))
      ) {
        return [route.key, previous];
      }

      let badgeStyle;

      if (tabBarBadge != null && typeof tabBarBadge !== 'function') {
        const { backgroundColor = colors.notification, ...restBadgeStyle } =
          StyleSheet.flatten(tabBarBadgeStyle) ?? {};

        badgeStyle = {
          backgroundColor,
          color: Color.foreground(backgroundColor),
          ...fonts.medium,
          ...restBadgeStyle,
        };
      }

      let icon;

      if (tabBarShowIcon !== false && tabBarIcon) {
        icon = ({
          focused,
          color,
          size,
        }: {
          focused: boolean;
          color: ColorValue;
          size: number;
        }) => {
          const iconValue =
            typeof tabBarIcon === 'function'
              ? tabBarIcon({ focused, color, size })
              : tabBarIcon;

          if (React.isValidElement(iconValue)) {
            return iconValue;
          }

          if (
            typeof iconValue === 'object' &&
            iconValue != null &&
            'type' in iconValue
          ) {
            return <PlatformIcon icon={iconValue} size={size} color={color} />;
          }

          return null;
        };
      }

      const tabOptions: TabDescriptor<Route> = {
        href,
        testID: tabBarButtonTestID,
        accessibilityLabel: tabBarAccessibilityLabel,
        badge: tabBarBadge,
        badgeStyle,
        icon,
        label:
          tabBarShowLabel === false
            ? undefined
            : typeof tabBarLabel === 'function'
              ? ({ labelText, color }: MaterialLabelProps) =>
                  tabBarLabel({
                    focused,
                    color,
                    children: labelText ?? route.name,
                  })
              : renderLabelDefault,
        labelAllowFontScaling: tabBarAllowFontScaling,
        labelStyle: tabBarLabelStyle,
        labelText:
          tabBarShowLabel === false
            ? undefined
            : typeof tabBarLabel === 'string'
              ? tabBarLabel
              : title !== undefined
                ? title
                : route.name,
      };

      return [route.key, { deps, options: tabOptions }];
    })
  );

  React.useInsertionEffect(() => {
    optionsCache.current = nextOptions;
  });

  const onTabPress = useLatestCallback<
    NonNullable<TabBarProps<Route>['onTabPress']>
  >(({ route, preventDefault }) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (event.defaultPrevented) {
      preventDefault();
    }
  });

  const onTabLongPress = useLatestCallback<
    NonNullable<TabBarProps<Route>['onTabLongPress']>
  >(({ route }) =>
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    })
  );

  const tabBarIndicator = focusedOptions.tabBarIndicator;

  return (
    <TabBar
      {...rest}
      navigationState={state}
      options={Object.fromEntries(
        Object.entries(nextOptions).map(([key, { options }]) => [key, options])
      )}
      direction={direction}
      scrollEnabled={focusedOptions.tabBarScrollEnabled}
      bounces={focusedOptions.tabBarBounces}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
      pressColor={pressColor}
      pressOpacity={focusedOptions.tabBarPressOpacity}
      tabStyle={focusedOptions.tabBarItemStyle}
      indicatorStyle={[
        { backgroundColor: colors.primary },
        focusedOptions.tabBarIndicatorStyle,
      ]}
      gap={focusedOptions.tabBarGap}
      variant={tabBarVariant}
      android_ripple={focusedOptions.tabBarAndroidRipple}
      indicatorContainerStyle={focusedOptions.tabBarIndicatorContainerStyle}
      contentContainerStyle={focusedOptions.tabBarContentContainerStyle}
      style={[
        { backgroundColor: colors.card, borderBottomColor: colors.border },
        focusedOptions.tabBarStyle,
      ]}
      onTabPress={onTabPress}
      onTabLongPress={onTabLongPress}
      renderIndicator={
        tabBarIndicator
          ? ({ navigationState: _, ...rest }) =>
              tabBarIndicator({ ...rest, state })
          : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
});
