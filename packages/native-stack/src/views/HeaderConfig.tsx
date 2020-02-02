import * as React from 'react';
import {
  ScreenStackHeaderConfig,
  ScreenStackHeaderRightView,
  // eslint-disable-next-line import/no-unresolved
} from 'react-native-screens';
import { Route, useTheme } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '../types';

type Props = NativeStackNavigationOptions & {
  route: Route<string>;
};

export default function HeaderConfig(props: Props) {
  const { colors } = useTheme();
  const {
    route,
    title,
    headerRight,
    headerTitle,
    headerBackTitle,
    headerBackTitleVisible = true,
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
          : headerTintColor !== undefined
          ? headerTintColor
          : colors.text
      }
      backTitle={headerBackTitleVisible ? headerBackTitle : ' '}
      backTitleFontFamily={headerBackTitleStyle.fontFamily}
      backTitleFontSize={headerBackTitleStyle.fontSize}
      color={headerTintColor !== undefined ? headerTintColor : colors.primary}
      // Keep this temporarily for compatibility with old versions of screens
      // @ts-ignore
      gestureEnabled={gestureEnabled}
      largeTitle={headerLargeTitle}
      largeTitleFontFamily={headerLargeTitleStyle.fontFamily}
      largeTitleFontSize={headerLargeTitleStyle.fontSize}
      backgroundColor={
        headerStyle.backgroundColor !== undefined
          ? headerStyle.backgroundColor
          : colors.card
      }
    >
      {headerRight !== undefined ? (
        <ScreenStackHeaderRightView>{headerRight()}</ScreenStackHeaderRightView>
      ) : null}
    </ScreenStackHeaderConfig>
  );
}
