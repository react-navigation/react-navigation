import { getHeaderTitle, Header } from '@react-navigation/elements';
import { Screen } from '@react-navigation/elements/internal';
import type { ParamListBase, Route } from '@react-navigation/native';
import * as React from 'react';
import { Platform, type StyleProp, type ViewStyle } from 'react-native';

import type {
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
} from '../types';
import { NativeScreen } from './NativeScreen/NativeScreen';

export function ScreenContent({
  isFocused,
  route,
  navigation,
  options,
  style,
  children,
}: {
  isFocused: boolean;
  route: Route<string>;
  navigation: BottomTabNavigationProp<ParamListBase>;
  options: BottomTabNavigationOptions;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const {
    headerTransparent,
    header: renderCustomHeader,
    headerShown = renderCustomHeader != null,
  } = options;

  const hasDefaultHeader = headerShown && renderCustomHeader == null;
  const hasNativeHeader = Platform.OS === 'ios' ? hasDefaultHeader : false;

  const [wasNativeHeaderShown] = React.useState(hasNativeHeader);

  React.useEffect(() => {
    if (wasNativeHeaderShown !== hasNativeHeader) {
      throw new Error(
        `Changing 'headerShown' or 'header' options dynamically is not supported when using native header.`
      );
    }
  }, [wasNativeHeaderShown, hasNativeHeader]);

  if (hasNativeHeader) {
    return (
      <NativeScreen
        route={route}
        navigation={navigation}
        options={options}
        style={style}
      >
        {children}
      </NativeScreen>
    );
  }

  return (
    <Screen
      focused={isFocused}
      route={route}
      navigation={navigation}
      headerShown={headerShown}
      headerTransparent={headerTransparent}
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
