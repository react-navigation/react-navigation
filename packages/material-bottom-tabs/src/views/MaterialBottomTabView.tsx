import * as React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { BottomNavigation, DefaultTheme, DarkTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationHelpersContext,
  Route,
  TabNavigationState,
  TabActions,
  useTheme,
  useLinkBuilder,
  Link,
} from '@react-navigation/native';

import type {
  MaterialBottomTabDescriptorMap,
  MaterialBottomTabNavigationConfig,
  MaterialBottomTabNavigationHelpers,
} from '../types';

type Props = MaterialBottomTabNavigationConfig & {
  state: TabNavigationState;
  navigation: MaterialBottomTabNavigationHelpers;
  descriptors: MaterialBottomTabDescriptorMap;
};

type Scene = { route: { key: string } };

function MaterialBottomTabViewInner({
  state,
  navigation,
  descriptors,
  ...rest
}: Props) {
  const { dark, colors } = useTheme();
  const buildLink = useLinkBuilder();

  const theme = React.useMemo(() => {
    const t = dark ? DarkTheme : DefaultTheme;

    return {
      ...t,
      colors: {
        ...t.colors,
        ...colors,
        surface: colors.card,
      },
    };
  }, [colors, dark]);

  return (
    <BottomNavigation
      {...rest}
      theme={theme}
      navigationState={state}
      onIndexChange={(index: number) =>
        navigation.dispatch({
          ...TabActions.jumpTo(state.routes[index].name),
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
    />
  );
}

export default function MaterialBottomTabView(props: Props) {
  return (
    <NavigationHelpersContext.Provider value={props.navigation}>
      <MaterialBottomTabViewInner {...props} />
    </NavigationHelpersContext.Provider>
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
