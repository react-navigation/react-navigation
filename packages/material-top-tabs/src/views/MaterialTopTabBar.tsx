import { Color, Text } from '@react-navigation/elements';
import {
  type ParamListBase,
  type TabNavigationState,
  useLinkBuilder,
  useLocale,
  useTheme,
} from '@react-navigation/native';
import { type ColorValue, StyleSheet } from 'react-native';
import {
  type Route,
  TabBar,
  TabBarIndicator,
  type TabDescriptor,
} from 'react-native-tab-view';

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

  const focusedOptions = descriptors[state.routes[state.index].key].options;

  const activeColor: ColorValue =
    focusedOptions.tabBarActiveTintColor ?? colors.text;
  const inactiveColor: ColorValue =
    focusedOptions.tabBarInactiveTintColor ??
    Color(activeColor)?.alpha(0.5).string() ??
    (dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)');

  const tabBarOptions = Object.fromEntries(
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

      return [
        route.key,
        {
          href: buildHref(route.name, route.params),
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
                      focused: state.routes[state.index].key === route.key,
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
