import { SafeAreaProviderCompat } from '@react-navigation/elements';
import {
  CommonActions,
  Link,
  ParamListBase,
  Route,
  TabNavigationState,
  useLinkBuilder,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import {
  BottomNavigation,
  DarkTheme,
  DefaultTheme,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type {
  MaterialBottomTabDescriptorMap,
  MaterialBottomTabNavigationConfig,
  MaterialBottomTabNavigationHelpers,
} from '../types';

type Props = MaterialBottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: MaterialBottomTabNavigationHelpers;
  descriptors: MaterialBottomTabDescriptorMap;
};

type Scene = { route: { key: string } };

// Optionally require vector-icons referenced from react-native-paper:
// https://github.com/callstack/react-native-paper/blob/4b26429c49053eaa4c3e0fae208639e01093fa87/src/components/MaterialCommunityIcon.tsx#L14
let MaterialCommunityIcons: React.ComponentType<
  React.ComponentProps<
    typeof import('react-native-vector-icons/MaterialCommunityIcons').default
  >
>;

try {
  // Optionally require vector-icons
  MaterialCommunityIcons =
    require('react-native-vector-icons/MaterialCommunityIcons').default;
} catch (e: any) {
  let isErrorLogged = false;

  // Fallback component for icons
  MaterialCommunityIcons = ({
    name,
    color,
    size,
    selectionColor: _0,
    onLayout: _1,
    ...rest
  }) => {
    if (!isErrorLogged) {
      if (
        !/(Cannot find module|Module not found|Cannot resolve module)/.test(
          e.message
        )
      ) {
        console.error(e);
      }

      console.warn(
        `Tried to use the icon '${name}' in a component from '@react-navigation/material-bottom-tabs', but 'react-native-vector-icons/MaterialCommunityIcons' could not be loaded.`,
        `To remove this warning, try installing 'react-native-vector-icons' or use another method to specify icon: https://reactnavigation.org/docs/material-bottom-tab-navigator/#tabbaricon.`
      );

      isErrorLogged = true;
    }

    return (
      <Text
        {...rest}
        style={[
          styles.icon,
          {
            color: typeof color !== 'number' ? color : undefined,
            fontSize: size,
          },
        ]}
      >
        □
      </Text>
    );
  };
}

function MaterialBottomTabViewInner({
  state,
  navigation,
  descriptors,
  safeAreaInsets,
  ...rest
}: Props) {
  const insets = useSafeAreaInsets();
  const { dark, colors } = useTheme();
  const paperTheme = usePaperTheme();

  const buildLink = useLinkBuilder();

  const t =
    // If the theme from React Navigation and Paper match, then user the customized theme
    // Otherwise fallback to the matching default theme from Paper
    dark === paperTheme.dark ? paperTheme : dark ? DarkTheme : DefaultTheme;

  const theme = React.useMemo(() => {
    return {
      ...t,
      colors: {
        ...t.colors,
        ...colors,
        surface: colors.card,
      },
    };
  }, [colors, t]);

  return (
    <BottomNavigation
      {...rest}
      theme={theme}
      navigationState={state}
      onIndexChange={(index: number) =>
        navigation.dispatch({
          ...CommonActions.navigate({
            name: state.routes[index].name,
            merge: true,
          }),
          target: state.key,
        })
      }
      renderScene={({ route }) => descriptors[route.key].render()}
      renderTouchable={
        Platform.OS === 'web'
          ? ({
              onPress,
              route,
              accessibilityRole: _0,
              borderless: _1,
              centered: _2,
              rippleColor: _3,
              style,
              ...rest
            }) => {
              return (
                <Link
                  {...rest}
                  // @ts-expect-error: to could be undefined, but it doesn't affect functionality
                  to={buildLink(route.name, route.params)}
                  accessibilityRole="link"
                  onPress={(e: any) => {
                    if (
                      !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && // ignore clicks with modifier keys
                      (e.button == null || e.button === 0) // ignore everything but left clicks
                    ) {
                      e.preventDefault();
                      onPress?.(e);
                    }
                  }}
                  style={[styles.touchable, style]}
                />
              );
            }
          : undefined
      }
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key];

        if (typeof options.tabBarIcon === 'string') {
          return (
            <MaterialCommunityIcons
              name={options.tabBarIcon}
              color={color}
              size={24}
              style={styles.icon}
            />
          );
        }

        if (typeof options.tabBarIcon === 'function') {
          return options.tabBarIcon({ focused, color });
        }

        return null;
      }}
      getLabelText={({ route }: Scene) => {
        const { options } = descriptors[route.key];

        return options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : (route as Route<string>).name;
      }}
      getColor={({ route }) => descriptors[route.key].options.tabBarColor}
      getBadge={({ route }) => descriptors[route.key].options.tabBarBadge}
      getAccessibilityLabel={({ route }) =>
        descriptors[route.key].options.tabBarAccessibilityLabel
      }
      getTestID={({ route }) => descriptors[route.key].options.tabBarTestID}
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
      safeAreaInsets={{
        top: safeAreaInsets?.top ?? insets?.top,
        right: safeAreaInsets?.right ?? insets?.right,
        bottom: safeAreaInsets?.bottom ?? insets?.bottom,
        left: safeAreaInsets?.left ?? insets?.left,
      }}
    />
  );
}

export default function MaterialBottomTabView(props: Props) {
  return (
    <SafeAreaProviderCompat>
      <MaterialBottomTabViewInner {...props} />
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
  touchable: {
    display: 'flex',
    justifyContent: 'center',
  },
});
