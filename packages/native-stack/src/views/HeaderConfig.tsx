import { getHeaderTitle, HeaderTitle } from '@react-navigation/elements';
import { type Route, useLocale, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet, type TextStyle, View } from 'react-native';
import {
  isSearchBarAvailableForCurrentPlatform,
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderConfig,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  ScreenStackHeaderSearchBarView,
  SearchBar,
} from 'react-native-screens';

import type { NativeStackNavigationOptions } from '../types';
import { processFonts } from './FontProcessor';

type Props = NativeStackNavigationOptions & {
  headerTopInsetEnabled: boolean;
  headerHeight: number;
  route: Route<string>;
  canGoBack: boolean;
};

export function HeaderConfig({
  headerBackImageSource,
  headerBackButtonMenuEnabled,
  headerBackTitle,
  headerBackTitleStyle,
  headerBackTitleVisible = true,
  headerBackVisible,
  headerShadowVisible,
  headerLargeStyle,
  headerLargeTitle,
  headerLargeTitleShadowVisible,
  headerLargeTitleStyle,
  headerBackground,
  headerLeft,
  headerRight,
  headerShown,
  headerStyle,
  headerBlurEffect,
  headerTintColor,
  headerTitle,
  headerTitleAlign,
  headerTitleStyle,
  headerTransparent,
  headerSearchBarOptions,
  headerTopInsetEnabled,
  route,
  title,
  canGoBack,
}: Props): JSX.Element {
  const { direction } = useLocale();
  const { colors, fonts } = useTheme();
  const tintColor =
    headerTintColor ?? (Platform.OS === 'ios' ? colors.primary : colors.text);

  const headerBackTitleStyleFlattened =
    StyleSheet.flatten([fonts.regular, headerBackTitleStyle]) || {};
  const headerLargeTitleStyleFlattened =
    StyleSheet.flatten([
      Platform.select({ ios: fonts.heavy, default: fonts.medium }),
      headerLargeTitleStyle,
    ]) || {};
  const headerTitleStyleFlattened =
    StyleSheet.flatten([
      Platform.select({ ios: fonts.bold, default: fonts.medium }),
      headerTitleStyle,
    ]) || {};
  const headerStyleFlattened = StyleSheet.flatten(headerStyle) || {};
  const headerLargeStyleFlattened = StyleSheet.flatten(headerLargeStyle) || {};

  const [backTitleFontFamily, largeTitleFontFamily, titleFontFamily] =
    processFonts([
      headerBackTitleStyleFlattened.fontFamily,
      headerLargeTitleStyleFlattened.fontFamily,
      headerTitleStyleFlattened.fontFamily,
    ]);

  const backTitleFontSize =
    'fontSize' in headerBackTitleStyleFlattened
      ? headerBackTitleStyleFlattened.fontSize
      : undefined;

  const titleText = getHeaderTitle({ title, headerTitle }, route.name);
  const titleColor =
    'color' in headerTitleStyleFlattened
      ? headerTitleStyleFlattened.color
      : headerTintColor ?? colors.text;
  const titleFontSize =
    'fontSize' in headerTitleStyleFlattened
      ? headerTitleStyleFlattened.fontSize
      : undefined;
  const titleFontWeight = headerTitleStyleFlattened.fontWeight;

  const largeTitleBackgroundColor = headerLargeStyleFlattened.backgroundColor;
  const largeTitleColor =
    'color' in headerLargeTitleStyleFlattened
      ? headerLargeTitleStyleFlattened.color
      : undefined;
  const largeTitleFontSize =
    'fontSize' in headerLargeTitleStyleFlattened
      ? headerLargeTitleStyleFlattened.fontSize
      : undefined;
  const largeTitleFontWeight = headerLargeTitleStyleFlattened.fontWeight;

  const headerTitleStyleSupported: TextStyle = { color: titleColor };

  if (headerTitleStyleFlattened.fontFamily != null) {
    headerTitleStyleSupported.fontFamily = headerTitleStyleFlattened.fontFamily;
  }

  if (titleFontSize != null) {
    headerTitleStyleSupported.fontSize = titleFontSize;
  }

  if (titleFontWeight != null) {
    headerTitleStyleSupported.fontWeight = titleFontWeight;
  }

  const headerBackgroundColor =
    headerStyleFlattened.backgroundColor ??
    (headerBackground != null || headerTransparent
      ? 'transparent'
      : colors.card);

  const headerLeftElement = headerLeft?.({
    tintColor,
    canGoBack,
    label: headerBackTitle,
    // `href` is only applicable to web
    href: undefined,
  });
  const headerRightElement = headerRight?.({
    tintColor,
    canGoBack,
  });
  const headerTitleElement =
    typeof headerTitle === 'function'
      ? headerTitle({
          tintColor,
          children: titleText,
        })
      : null;

  const supportsHeaderSearchBar =
    typeof isSearchBarAvailableForCurrentPlatform === 'boolean'
      ? isSearchBarAvailableForCurrentPlatform
      : // Fallback for older versions of react-native-screens
        Platform.OS === 'ios' && SearchBar != null;

  const hasHeaderSearchBar =
    supportsHeaderSearchBar && headerSearchBarOptions != null;

  if (headerSearchBarOptions != null && !supportsHeaderSearchBar) {
    throw new Error(
      `The current version of 'react-native-screens' doesn't support SearchBar in the header. Please update to the latest version to use this option.`
    );
  }

  /**
   * We need to set this in if:
   * - Back button should stay visible when `headerLeft` is specified
   * - If `headerTitle` for Android is specified, so we only need to remove the title and keep the back button
   */
  const backButtonInCustomView = headerBackVisible
    ? headerLeftElement != null
    : Platform.OS === 'android' && headerTitleElement != null;

  const translucent =
    headerBackground != null ||
    headerTransparent ||
    // When using a SearchBar or large title, the header needs to be translucent for it to work on iOS
    ((hasHeaderSearchBar || headerLargeTitle) &&
      Platform.OS === 'ios' &&
      headerTransparent !== false);

  return (
    <ScreenStackHeaderConfig
      backButtonInCustomView={backButtonInCustomView}
      backgroundColor={headerBackgroundColor}
      backTitle={headerBackTitleVisible ? headerBackTitle : ' '}
      backTitleFontFamily={backTitleFontFamily}
      backTitleFontSize={backTitleFontSize}
      blurEffect={headerBlurEffect}
      color={tintColor}
      direction={direction}
      disableBackButtonMenu={headerBackButtonMenuEnabled === false}
      hidden={headerShown === false}
      hideBackButton={headerBackVisible === false}
      hideShadow={
        headerShadowVisible === false ||
        headerBackground != null ||
        (headerTransparent && headerShadowVisible !== true)
      }
      largeTitle={headerLargeTitle}
      largeTitleBackgroundColor={largeTitleBackgroundColor}
      largeTitleColor={largeTitleColor}
      largeTitleFontFamily={largeTitleFontFamily}
      largeTitleFontSize={largeTitleFontSize}
      largeTitleFontWeight={largeTitleFontWeight}
      largeTitleHideShadow={headerLargeTitleShadowVisible === false}
      title={titleText}
      titleColor={titleColor}
      titleFontFamily={titleFontFamily}
      titleFontSize={titleFontSize}
      titleFontWeight={titleFontWeight}
      topInsetEnabled={headerTopInsetEnabled}
      translucent={
        // This defaults to `true`, so we can't pass `undefined`
        translucent === true
      }
    >
      {Platform.OS === 'ios' ? (
        <>
          {headerLeftElement != null ? (
            <ScreenStackHeaderLeftView>
              {headerLeftElement}
            </ScreenStackHeaderLeftView>
          ) : null}
          {headerTitleElement != null ? (
            <ScreenStackHeaderCenterView>
              {headerTitleElement}
            </ScreenStackHeaderCenterView>
          ) : null}
        </>
      ) : (
        <>
          {headerLeftElement != null || typeof headerTitle === 'function' ? (
            <ScreenStackHeaderLeftView>
              <View style={styles.row}>
                {headerLeftElement}
                {headerTitleAlign !== 'center' ? (
                  typeof headerTitle === 'function' ? (
                    headerTitleElement
                  ) : (
                    <HeaderTitle
                      tintColor={tintColor}
                      style={headerTitleStyleSupported}
                    >
                      {titleText}
                    </HeaderTitle>
                  )
                ) : null}
              </View>
            </ScreenStackHeaderLeftView>
          ) : null}
          {headerTitleAlign === 'center' ? (
            <ScreenStackHeaderCenterView>
              {typeof headerTitle === 'function' ? (
                headerTitleElement
              ) : (
                <HeaderTitle
                  tintColor={tintColor}
                  style={headerTitleStyleSupported}
                >
                  {titleText}
                </HeaderTitle>
              )}
            </ScreenStackHeaderCenterView>
          ) : null}
        </>
      )}
      {headerBackImageSource !== undefined ? (
        <ScreenStackHeaderBackButtonImage source={headerBackImageSource} />
      ) : null}
      {headerRightElement != null ? (
        <ScreenStackHeaderRightView>
          {headerRightElement}
        </ScreenStackHeaderRightView>
      ) : null}
      {hasHeaderSearchBar ? (
        <ScreenStackHeaderSearchBarView>
          <SearchBar {...headerSearchBarOptions} />
        </ScreenStackHeaderSearchBarView>
      ) : null}
    </ScreenStackHeaderConfig>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
