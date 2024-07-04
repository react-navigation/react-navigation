import { Text } from '@react-navigation/elements';
import {
  type ParamListBase,
  type TabNavigationState,
  useLinkBuilder,
  useLocale,
  useTheme,
} from '@react-navigation/native';
import Color from 'color';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { TabBar, TabBarIndicator } from 'react-native-tab-view';

import type { MaterialTopTabBarProps } from '../types';

type MaterialLabelType = {
  color: string;
  labelText?: string;
  labelStyle?: StyleProp<ViewStyle>;
  allowScaling?: boolean;
};

const MaterialLabel = ({
  color,
  labelText,
  labelStyle,
  allowScaling,
}: MaterialLabelType) => {
  return (
    <Text
      style={[{ color }, styles.label, labelStyle]}
      allowFontScaling={allowScaling}
    >
      {labelText}
    </Text>
  );
};

const renderLabel = (props: MaterialLabelType) => {
  return <MaterialLabel {...props} />;
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

  const tabBarOptions = Object.fromEntries(
    state.routes.map((route) => {
      const { options } = descriptors[route.key];

      return [
        route.key,
        {
          href: buildHref(route.name, route.params),
          testID: options.tabBarButtonTestID,
          accessibilityLabel: options.tabBarAccessibilityLabel,
          badge: options.tabBarBadge,
          icon:
            options.tabBarShowIcon === false ? undefined : options.tabBarIcon,
          label: options.tabBarShowLabel === false ? undefined : renderLabel,
          labelAllowFontScaling: options.tabBarAllowFontScaling,
          labelStyle: options.tabBarLabelStyle,
          labelText:
            options.tabBarShowLabel === false
              ? undefined
              : options.title !== undefined
                ? options.title
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
