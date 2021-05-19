import * as React from 'react';
import { StyleSheet, I18nManager, Platform } from 'react-native';
import {
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderConfig,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  ScreenStackHeaderSearchBarView,
  SearchBar,
} from 'react-native-screens';
import { Route, useTheme } from '@react-navigation/native';
import type { NativeStackNavigationOptions } from '../types';
import { processFonts } from './FontProcessor';

type Props = NativeStackNavigationOptions & {
  route: Route<string>;
};

export default function HeaderConfig({
  headerBackImageSource,
  headerBackTitle,
  headerBackTitleStyle,
  headerBackTitleVisible = true,
  headerCenter,
  headerBackVisible,
  headerShadowVisible,
  headerLargeStyle,
  headerLargeTitle,
  headerLargeTitleShadowVisible,
  headerLargeTitleStyle,
  headerLeft,
  headerRight,
  headerShown,
  headerStyle,
  headerBlurEffect,
  headerTintColor,
  headerTitle,
  headerTitleStyle,
  headerTopInsetEnabled = true,
  headerTranslucent,
  route,
  orientation,
  headerSearchBar,
  statusBarAnimation,
  statusBarHidden,
  statusBarStyle,
  title,
}: Props): JSX.Element {
  const { colors } = useTheme();
  const tintColor = headerTintColor ?? colors.primary;

  const headerBackTitleStyleFlattened =
    StyleSheet.flatten(headerBackTitleStyle) || {};
  const headerLargeTitleStyleFlattened =
    StyleSheet.flatten(headerLargeTitleStyle) || {};
  const headerTitleStyleFlattened = StyleSheet.flatten(headerTitleStyle) || {};
  const headerStyleFlattened = StyleSheet.flatten(headerStyle) || {};
  const headerLargeStyleFlattened = StyleSheet.flatten(headerLargeStyle) || {};

  const [
    backTitleFontFamily,
    largeTitleFontFamily,
    titleFontFamily,
  ] = processFonts([
    headerBackTitleStyleFlattened.fontFamily,
    headerLargeTitleStyleFlattened.fontFamily,
    headerTitleStyleFlattened.fontFamily,
  ]);

  const headerLeftElement = headerLeft?.({ tintColor });
  const headerRightElement = headerRight?.({ tintColor });
  const headerCenterElement = headerCenter?.({ tintColor });

  if (Platform.OS === 'ios' && headerSearchBar != null && SearchBar == null) {
    throw new Error(
      `The current version of 'react-native-screens' doesn't support SearchBar in the header. Please update to the latest version to use this option.`
    );
  }

  return (
    <ScreenStackHeaderConfig
      backButtonInCustomView={headerLeftElement != null && !headerBackVisible}
      backgroundColor={
        headerStyleFlattened.backgroundColor ??
        (headerTranslucent ? 'transparent' : colors.card)
      }
      backTitle={headerBackTitleVisible ? headerBackTitle : ' '}
      backTitleFontFamily={backTitleFontFamily}
      backTitleFontSize={headerBackTitleStyleFlattened.fontSize}
      blurEffect={headerBlurEffect}
      color={tintColor}
      direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
      hidden={headerShown === false}
      hideBackButton={headerBackVisible === false}
      hideShadow={headerShadowVisible === false}
      largeTitle={headerLargeTitle}
      largeTitleBackgroundColor={headerLargeStyleFlattened.backgroundColor}
      largeTitleColor={headerLargeTitleStyleFlattened.color}
      largeTitleFontFamily={largeTitleFontFamily}
      largeTitleFontSize={headerLargeTitleStyleFlattened.fontSize}
      largeTitleFontWeight={headerLargeTitleStyleFlattened.fontWeight}
      largeTitleHideShadow={headerLargeTitleShadowVisible === false}
      screenOrientation={orientation}
      statusBarAnimation={statusBarAnimation}
      statusBarHidden={statusBarHidden}
      statusBarStyle={statusBarStyle}
      title={
        headerTitle !== undefined
          ? headerTitle
          : title !== undefined
          ? title
          : route.name
      }
      titleColor={
        headerTitleStyleFlattened.color ?? headerTintColor ?? colors.text
      }
      titleFontFamily={titleFontFamily}
      titleFontSize={headerTitleStyleFlattened.fontSize}
      titleFontWeight={headerTitleStyleFlattened.fontWeight}
      topInsetEnabled={headerTopInsetEnabled}
      translucent={
        // This defaults to `true`, so we can't pass `undefined`
        headerTranslucent === true
      }
    >
      {headerRightElement != null ? (
        <ScreenStackHeaderRightView>
          {headerRightElement}
        </ScreenStackHeaderRightView>
      ) : null}
      {headerBackImageSource !== undefined ? (
        <ScreenStackHeaderBackButtonImage
          key="backImage"
          source={headerBackImageSource}
        />
      ) : null}
      {headerLeftElement != null ? (
        <ScreenStackHeaderLeftView>
          {headerLeftElement}
        </ScreenStackHeaderLeftView>
      ) : null}
      {headerCenterElement != null ? (
        <ScreenStackHeaderCenterView>
          {headerCenterElement}
        </ScreenStackHeaderCenterView>
      ) : null}
      {Platform.OS === 'ios' && headerSearchBar != null ? (
        <ScreenStackHeaderSearchBarView>
          <SearchBar {...headerSearchBar} />
        </ScreenStackHeaderSearchBarView>
      ) : null}
    </ScreenStackHeaderConfig>
  );
}
