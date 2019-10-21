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
    headerHideBackButton,
    headerHideShadow,
    headerTintColor,
    headerLargeTitle,
    headerTranslucent,
    headerStyle = {},
    headerTitleStyle = {},
    headerLargeTitleStyle = {},
    headerBackTitleStyle = {},
    headerShown,
    gestureEnabled,
  } = props;

  return (
    <ScreenStackHeaderConfig
      hidden={headerShown === false}
      translucent={headerTranslucent === true}
      hideShadow={headerHideShadow}
      hideBackButton={headerHideBackButton}
      title={
        headerTitle !== undefined
          ? headerTitle
          : title !== undefined
          ? title
          : route.name
      }
      titleFontFamily={headerTitleStyle.fontFamily}
      titleFontSize={headerTitleStyle.fontSize}
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
      largeTitleFontFamily={headerLargeTitleStyle.fontFamily}
      largeTitleFontSize={headerLargeTitleStyle.fontSize}
      backgroundColor={headerStyle.backgroundColor}
    >
      {headerRight !== undefined ? (
        <ScreenStackHeaderRightView>{headerRight()}</ScreenStackHeaderRightView>
      ) : null}
    </ScreenStackHeaderConfig>
  );
}
