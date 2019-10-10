import * as React from 'react';
import {
  // @ts-ignore
  ScreenStackHeaderConfig,
  // @ts-ignore
  ScreenStackHeaderRightView,
  // eslint-disable-next-line import/no-unresolved
} from 'react-native-screens';
import { Route } from '@react-navigation/core';
import { NativeStackNavigationOptions } from '../types';

type Props = NativeStackNavigationOptions & {
  route: Route<string>;
};

export default function HeaderConfig(props: Props) {
  const {
    route,
    title,
    headerRight,
    headerTitle,
    headerBackTitle,
    headerTintColor,
    gestureEnabled,
    headerLargeTitle,
    headerTranslucent,
    headerStyle = {},
    headerTitleStyle = {},
    headerBackTitleStyle = {},
    headerShown,
  } = props;

  return (
    <ScreenStackHeaderConfig
      hidden={headerShown === false}
      translucent={headerTranslucent === true}
      title={
        headerTitle !== undefined
          ? headerTitle
          : title !== undefined
          ? title
          : route.name
      }
      titleFontFamily={headerTitleStyle.fontFamily}
      titleFontSize={headerTitleStyle.fontFamily}
      titleColor={
        headerTitleStyle.color !== undefined
          ? headerTitleStyle.color
          : headerTintColor
      }
      backTitle={headerBackTitle}
      backTitleFontFamily={headerBackTitleStyle.fontFamily}
      backTitleFontSize={headerBackTitleStyle.fontSize}
      color={headerTintColor}
      gestureEnabled={gestureEnabled === undefined ? true : gestureEnabled}
      largeTitle={headerLargeTitle}
      backgroundColor={headerStyle.backgroundColor}
    >
      {headerRight !== undefined ? (
        <ScreenStackHeaderRightView>{headerRight()}</ScreenStackHeaderRightView>
      ) : null}
    </ScreenStackHeaderConfig>
  );
}
