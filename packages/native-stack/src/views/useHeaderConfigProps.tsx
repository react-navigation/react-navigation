import { getHeaderTitle, HeaderTitle } from '@react-navigation/elements';
import { type Route, useLocale, useTheme } from '@react-navigation/native';
import {
  type NativeSyntheticEvent,
  Platform,
  StyleSheet,
  type TextStyle,
  View,
} from 'react-native';
import {
  isSearchBarAvailableForCurrentPlatform,
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  ScreenStackHeaderSearchBarView,
  SearchBar,
} from 'react-native-screens';

import {
  type NativeStackHeaderBarButtonItemMenuAction,
  type NativeStackHeaderBarButtonItemWithMenu,
  type NativeStackNavigationOptions,
} from '../types';
import { prepareHeaderBarButtonItems } from '../utils/prepareHeaderBarButtonItems';
import { processFonts } from './FontProcessor';

type Props = NativeStackNavigationOptions & {
  headerTopInsetEnabled: boolean;
  headerHeight: number;
  headerBack: { title?: string | undefined; href: undefined } | undefined;
  route: Route<string>;
};

export function useHeaderConfigProps({
  headerBackImageSource,
  headerBackButtonDisplayMode,
  headerBackButtonMenuEnabled,
  headerBackTitle,
  headerBackTitleStyle,
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
  headerBack,
  route,
  title,
  headerLeftItems,
  headerRightItems,
}: Props) {
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
      : (headerTintColor ?? colors.text);
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

  const canGoBack = headerBack != null;

  const headerLeftElement = headerLeft?.({
    tintColor,
    canGoBack,
    label: headerBackTitle ?? headerBack?.title,
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

  /**
   * We need to set this in if:
   * - Back button should stay visible when `headerLeft` is specified
   * - If `headerTitle` for Android is specified, so we only need to remove the title and keep the back button
   */
  const backButtonInCustomView =
    headerBackVisible ||
    (Platform.OS === 'android' &&
      headerTitleElement != null &&
      headerLeftElement == null);

  const translucent =
    headerBackground != null ||
    headerTransparent ||
    // When using a SearchBar or large title, the header needs to be translucent for it to work on iOS
    ((hasHeaderSearchBar || headerLargeTitle) &&
      Platform.OS === 'ios' &&
      headerTransparent !== false);

  const isBackButtonDisplayModeAvailable =
    // On iOS 14+
    Platform.OS === 'ios' &&
    parseInt(Platform.Version, 10) >= 14 &&
    // Doesn't have custom styling, by default System, see: https://github.com/software-mansion/react-native-screens/pull/2105#discussion_r1565222738
    (backTitleFontFamily == null || backTitleFontFamily === 'System') &&
    backTitleFontSize == null &&
    // Back button menu is not disabled
    headerBackButtonMenuEnabled !== false;

  const isCenterViewRenderedAndroid = headerTitleAlign === 'center';

  const children = (
    <>
      {Platform.OS === 'ios' ? (
        <>
          {headerLeftItems ? (
            headerLeftItems.map((item, index) => {
              if ('customView' in item) {
                return (
                  // eslint-disable-next-line @eslint-react/no-array-index-key
                  <ScreenStackHeaderLeftView key={index}>
                    {item.customView({
                      tintColor,
                      canGoBack,
                      label: headerBackTitle ?? headerBack?.title,
                      // `href` is only applicable to web
                      href: undefined,
                    })}
                  </ScreenStackHeaderLeftView>
                );
              }
              return null;
            })
          ) : headerLeftElement != null ? (
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
            // The style passed to header left, together with title element being wrapped
            // in flex view is reqruied for proper header layout, in particular,
            // for the text truncation to work.
            <ScreenStackHeaderLeftView
              style={!isCenterViewRenderedAndroid ? { flex: 1 } : null}
            >
              {headerLeftElement}
              {headerTitleAlign !== 'center' ? (
                typeof headerTitle === 'function' ? (
                  <View style={{ flex: 1 }}>{headerTitleElement}</View>
                ) : (
                  <View style={{ flex: 1 }}>
                    <HeaderTitle
                      tintColor={tintColor}
                      style={headerTitleStyleSupported}
                    >
                      {titleText}
                    </HeaderTitle>
                  </View>
                )
              ) : null}
            </ScreenStackHeaderLeftView>
          ) : null}
          {isCenterViewRenderedAndroid ? (
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
      {headerRightItems ? (
        headerRightItems.map((item, index) => {
          if ('customView' in item) {
            return (
              // eslint-disable-next-line @eslint-react/no-array-index-key
              <ScreenStackHeaderRightView key={index}>
                {item.customView({
                  tintColor,
                  canGoBack,
                })}
              </ScreenStackHeaderRightView>
            );
          }
          return null;
        })
      ) : headerRightElement != null ? (
        <ScreenStackHeaderRightView>
          {headerRightElement}
        </ScreenStackHeaderRightView>
      ) : null}
      {hasHeaderSearchBar ? (
        <ScreenStackHeaderSearchBarView>
          <SearchBar {...headerSearchBarOptions} />
        </ScreenStackHeaderSearchBarView>
      ) : null}
    </>
  );

  const preparedHeaderLeftBarButtonItems = headerLeftItems
    ? prepareHeaderBarButtonItems(headerLeftItems, route.key, 'left')
    : undefined;
  const preparedHeaderRightBarButtonItems = headerRightItems
    ? prepareHeaderBarButtonItems(headerRightItems, route.key, 'right')
    : undefined;
  const hasHeaderBarButtonItems =
    preparedHeaderLeftBarButtonItems?.length ||
    preparedHeaderRightBarButtonItems?.length;

  // Handle bar button item presses
  const onPressHeaderBarButtonItem = hasHeaderBarButtonItems
    ? (event: NativeSyntheticEvent<{ buttonId: string }>) => {
        const pressedItem = [
          ...(preparedHeaderLeftBarButtonItems ?? []),
          ...(preparedHeaderRightBarButtonItems ?? []),
        ].find(
          (item) =>
            item &&
            'onPress' in item &&
            item.buttonId === event.nativeEvent.buttonId
        );
        if (pressedItem && 'onPress' in pressedItem && pressedItem.onPress) {
          pressedItem.onPress();
        }
      }
    : undefined;

  // Handle bar button menu item presses by deep-searching nested menus
  const onPressHeaderBarButtonMenuItem = hasHeaderBarButtonItems
    ? (event: NativeSyntheticEvent<{ menuId: string }>) => {
        const { menuId } = event.nativeEvent;
        // Recursively search menu tree
        const findInMenu = (
          menu: NativeStackHeaderBarButtonItemWithMenu['menu'],
          menuId: string
        ): NativeStackHeaderBarButtonItemMenuAction | undefined => {
          for (const item of menu.items) {
            if ('items' in item) {
              // submenu: recurse
              const found = findInMenu(item, menuId);
              if (found) {
                return found;
              }
            } else if ('menuId' in item && item.menuId === menuId) {
              return item;
            }
          }
          return undefined;
        };

        // Check each bar-button item with a menu
        const allItems = [
          ...(preparedHeaderLeftBarButtonItems ?? []),
          ...(preparedHeaderRightBarButtonItems ?? []),
        ];
        for (const item of allItems) {
          if (item && 'menu' in item && item.menu) {
            const action = findInMenu(item.menu, menuId);
            if (action) {
              action.onPress();
              return;
            }
          }
        }
      }
    : undefined;

  return {
    backButtonInCustomView,
    backgroundColor: headerBackgroundColor,
    backTitle: headerBackTitle,
    backTitleVisible: isBackButtonDisplayModeAvailable
      ? undefined
      : headerBackButtonDisplayMode !== 'minimal',
    backButtonDisplayMode: isBackButtonDisplayModeAvailable
      ? headerBackButtonDisplayMode
      : undefined,
    backTitleFontFamily,
    backTitleFontSize,
    blurEffect: headerBlurEffect,
    color: tintColor,
    direction,
    disableBackButtonMenu: headerBackButtonMenuEnabled === false,
    hidden: headerShown === false,
    hideBackButton: headerBackVisible === false,
    hideShadow:
      headerShadowVisible === false ||
      headerBackground != null ||
      (headerTransparent && headerShadowVisible !== true),
    largeTitle: headerLargeTitle,
    largeTitleBackgroundColor,
    largeTitleColor,
    largeTitleFontFamily,
    largeTitleFontSize,
    largeTitleFontWeight,
    largeTitleHideShadow: headerLargeTitleShadowVisible === false,
    title: titleText,
    titleColor,
    titleFontFamily,
    titleFontSize,
    titleFontWeight: String(titleFontWeight),
    topInsetEnabled: headerTopInsetEnabled,
    translucent: translucent === true,
    children,
    headerLeftBarButtonItems: preparedHeaderLeftBarButtonItems,
    headerRightBarButtonItems: preparedHeaderRightBarButtonItems,
    onPressHeaderBarButtonItem,
    onPressHeaderBarButtonMenuItem,
  } as const;
}
