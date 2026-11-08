import { getHeaderTitle, Header } from '@react-navigation/elements';
import { Screen } from '@react-navigation/elements/internal';
import type { ParamListBase, Route } from '@react-navigation/native';
import * as React from 'react';

import type {
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
} from '../types';

export function ScreenContent({
  isFocused,
  route,
  navigation,
  options,
  insets,
  style,
  children,
}: {
  isFocused: boolean;
  route: Route<string>;
  navigation: BottomTabNavigationProp<ParamListBase>;
  options: BottomTabNavigationOptions;
  insets?: React.ComponentProps<typeof Screen>['insets'];
  style?: React.ComponentProps<typeof Screen>['style'];
  children: React.ReactNode;
}) {
  const {
    headerTransparent,
    header: renderCustomHeader,
    headerShown = renderCustomHeader != null,
  } = options;

  const hasDefaultHeader = headerShown && renderCustomHeader == null;

  return (
    <Screen
      focused={isFocused}
      route={route}
      navigation={navigation}
      headerShown={headerShown}
      headerTransparent={headerTransparent}
      insets={insets}
      header={
        hasDefaultHeader ? (
          <Header {...options} title={getHeaderTitle(options, route.name)} />
        ) : (
          renderCustomHeader?.({
            route,
            navigation,
            options,
          })
        )
      }
      style={style}
    >
      {children}
    </Screen>
  );
}
