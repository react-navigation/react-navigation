import * as React from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation, DefaultTheme, DarkTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Route,
  TabNavigationState,
  TabActions,
  useTheme,
} from '@react-navigation/native';

import {
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

export default function MaterialBottomTabView({
  state,
  navigation,
  descriptors,
  ...rest
}: Props) {
  const { dark, colors } = useTheme();

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
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key];

        if (typeof options.tabBarIcon === 'string') {
          return (
            <MaterialCommunityIcons
              name={options.tabBarIcon}
              color={color}
              size={24}
              style={styles.icon}
              importantForAccessibility="no-hide-descendants"
              accessibilityElementsHidden
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

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
