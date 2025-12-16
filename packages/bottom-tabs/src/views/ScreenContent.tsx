import { getHeaderTitle, Header } from '@react-navigation/elements';
import { NativeScreen, Screen } from '@react-navigation/elements/internal';
import type { ParamListBase, Route } from '@react-navigation/native';
import * as React from 'react';
import {
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { ScreenStack } from 'react-native-screens';

import type {
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
} from '../types';

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
      <ScreenStack style={styles.container}>
        <NativeScreen
          route={route}
          navigation={navigation}
          options={options}
          style={style}
        >
          {children}
        </NativeScreen>
      </ScreenStack>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
