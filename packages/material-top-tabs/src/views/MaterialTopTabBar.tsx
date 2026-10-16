import { Text } from '@react-navigation/elements';
import {
  type ParamListBase,
  type TabNavigationState,
  useLinkBuilder,
  useLocale,
  useTheme,
} from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  type Route,
  TabBar,
  TabBarIndicator,
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

const renderLabelDefault = ({
  color,
  labelText,
  style,
  allowFontScaling,
}: MaterialLabelProps) => {
  return (
    <Text
      style={[{ color }, styles.label, style]}
      allowFontScaling={allowFontScaling}
    >
      {labelText}
    </Text>
  );
};

export function MaterialTopTabBar({
  state,
  navigation,
  descriptors,
  ...rest
}: MaterialTopTabBarProps) {
  const { colors } = useTheme();
  const { direction } = useLocale();
  const { buildHref } = useLinkBuilder();

  const focusedOptions = descriptors[state.routes[state.index].key].options;

  const activeColor = focusedOptions.tabBarActiveTintColor ?? colors.text;
  const inactiveColor =
    focusedOptions.tabBarInactiveTintColor ??
    Color(activeColor).alpha(0.5).rgb().string();

  const optionsCache = React.useRef<Record<string, CachedOptions>>({});

  const nextOptions = Object.fromEntries<CachedOptions>(
    state.routes.map((route) => {
      const { options } = descriptors[route.key];

      const {
        title,
        tabBarLabel,
        tabBarButtonTestID,
        tabBarAccessibilityLabel,
        tabBarBadge,
        tabBarShowIcon,
        tabBarShowLabel,
        tabBarIcon,
        tabBarAllowFontScaling,
        tabBarLabelStyle,
      } = options;

      const focused = state.routes[state.index].key === route.key;
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
        tabBarShowIcon,
        tabBarShowLabel,
        tabBarIcon,
        tabBarAllowFontScaling,
        tabBarLabelStyle,
        typeof tabBarLabel === 'function' && focused,
      ];

      if (
        previous &&
        Object.hasOwn(optionsCache.current, route.key) &&
        previous.deps.length === deps.length &&
        deps.every((dep, index) => Object.is(dep, previous.deps[index]))
      ) {
        return [route.key, previous];
      }

      const tabOptions: TabDescriptor<Route> = {
        href,
        testID: tabBarButtonTestID,
        accessibilityLabel: tabBarAccessibilityLabel,
        badge: tabBarBadge,
        icon: tabBarShowIcon === false ? undefined : tabBarIcon,
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
    const { tabBarRepeatedPressBehavior } =
      descriptors[route.key]?.options ?? {};
    const isRepeatedPress = state.routes[state.index].key === route.key;

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
      data: {
        behavior: {
          scrollToTop:
            isRepeatedPress &&
            tabBarRepeatedPressBehavior?.scrollToTop !== false,
          popToTop:
            isRepeatedPress && tabBarRepeatedPressBehavior?.popToTop !== false,
        },
      },
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
      pressColor={focusedOptions.tabBarPressColor}
      pressOpacity={focusedOptions.tabBarPressOpacity}
      tabStyle={focusedOptions.tabBarItemStyle}
      indicatorStyle={[
        { backgroundColor: colors.primary },
        focusedOptions.tabBarIndicatorStyle,
      ]}
      gap={focusedOptions.tabBarGap}
      android_ripple={focusedOptions.tabBarAndroidRipple}
      indicatorContainerStyle={focusedOptions.tabBarIndicatorContainerStyle}
      contentContainerStyle={focusedOptions.tabBarContentContainerStyle}
      style={[{ backgroundColor: colors.card }, focusedOptions.tabBarStyle]}
      onTabPress={onTabPress}
      onTabLongPress={onTabLongPress}
      renderIndicator={({ navigationState: state, ...rest }) => {
        return focusedOptions.tabBarIndicator ? (
          focusedOptions.tabBarIndicator({
            state: state as TabNavigationState<ParamListBase>,
            ...rest,
          })
        ) : (
          <TabBarIndicator navigationState={state} {...rest} />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    fontSize: 14,
    margin: 4,
    backgroundColor: 'transparent',
  },
});
