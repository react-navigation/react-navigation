import { Text } from '@react-navigation/elements';
import { Color } from '@react-navigation/elements/internal';
import {
  MaterialSymbol,
  SFSymbol,
  useLinkBuilder,
  useLocale,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { type ColorValue, Image, StyleSheet } from 'react-native';
import { type Route, TabBar, type TabDescriptor } from 'react-native-tab-view';

import type { MaterialTopTabBarProps } from '../types';

type MaterialLabelProps = Parameters<
  NonNullable<TabDescriptor<Route>['label']>
>[0];

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
  const { colors, dark } = useTheme();
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

  const tabBarOptions = Object.fromEntries(
    state.routes.map((route) => {
      const options = descriptors[route.key]?.options ?? {};

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

      let icon;

      if (tabBarShowIcon === false) {
        icon = undefined;
      } else if (tabBarIcon) {
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
            switch (iconValue.type) {
              case 'image':
                return (
                  <Image
                    source={iconValue.source}
                    style={{
                      width: size,
                      height: size,
                      tintColor: iconValue.tinted === false ? undefined : color,
                    }}
                  />
                );
              case 'sfSymbol':
                return (
                  <SFSymbol name={iconValue.name} size={size} color={color} />
                );
              case 'materialSymbol':
                return (
                  <MaterialSymbol
                    name={iconValue.name}
                    variant={iconValue.variant}
                    weight={iconValue.weight}
                    size={size}
                    color={color}
                  />
                );
              default: {
                const _exhaustiveCheck: never = iconValue;

                return _exhaustiveCheck;
              }
            }
          }

          return null;
        };
      }

      return [
        route.key,
        {
          href: buildHref(route.name, route.params),
          testID: tabBarButtonTestID,
          accessibilityLabel: tabBarAccessibilityLabel,
          badge: tabBarBadge,
          icon,
          label:
            tabBarShowLabel === false
              ? undefined
              : typeof tabBarLabel === 'function'
                ? ({ labelText, color }: MaterialLabelProps) =>
                    tabBarLabel({
                      focused: focusedRoute.key === route.key,
                      color,
                      children: labelText ?? route.name,
                    })
                : renderLabelDefault,
          labelAllowFontScaling: tabBarAllowFontScaling,
          labelStyle: tabBarLabelStyle,
          labelText:
            options.tabBarShowLabel === false
              ? undefined
              : typeof tabBarLabel === 'string'
                ? tabBarLabel
                : title !== undefined
                  ? title
                  : route.name,
        },
      ];
    })
  );

  const tabBarIndicator = focusedOptions.tabBarIndicator;

  return (
    <TabBar
      {...rest}
      navigationState={state}
      options={tabBarOptions}
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
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        }
      }}
      onTabLongPress={({ route }) =>
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        })
      }
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
