import { type Theme, useTheme } from '@react-navigation/native';
import { StyleSheet, type TextStyle } from 'react-native';
import type {
  StackHeaderAppearanceIOS,
  StackHeaderConfigProps,
  StackHeaderMenuElementIOS,
  StackHeaderMenuIOS,
} from 'react-native-screens';

import type {
  NativeStackHeaderItem,
  NativeStackHeaderItemMenu,
  NativeStackHeaderItemMenuSubmenu,
  NativeStackNavigationOptions,
} from '../../types';
import type {
  HeaderConfigOptions,
  HeaderConfigResult,
} from './useHeaderConfig';

type StackHeaderConfigIOS = NonNullable<StackHeaderConfigProps['ios']>;
type StackHeaderItemIOS = NonNullable<
  StackHeaderConfigIOS['leadingItems']
>[number];

type HeaderMenu = Omit<NativeStackHeaderItemMenu['menu'], 'title'> &
  Partial<Pick<NativeStackHeaderItemMenuSubmenu, 'icon' | 'inline'>>;

export function useHeaderConfig({
  options,
  hasCustomHeader,
  headerLeftElement,
  headerRightElement,
  headerTitleElement,
  headerTitleText,
  canGoBack,
  tintColor,
  isRemovePrevented,
}: HeaderConfigOptions): HeaderConfigResult {
  const { fonts } = useTheme();

  const renderElementOption = (
    option: NativeStackNavigationOptions['unstable_headerSubtitle']
  ) =>
    !hasCustomHeader && typeof option === 'function'
      ? option({ tintColor })
      : null;

  const headerSubtitleElement = renderElementOption(
    options.unstable_headerSubtitle
  );
  const headerLargeSubtitleElement = renderElementOption(
    options.unstable_headerLargeSubtitle
  );
  const nativeHeaderLeftItems = hasCustomHeader
    ? undefined
    : options.unstable_headerLeftItems?.({
        tintColor,
        canGoBack,
      });
  const nativeHeaderRightItems = hasCustomHeader
    ? undefined
    : options.unstable_headerRightItems?.({
        tintColor,
        canGoBack,
      });
  const usesHeaderLeftElement =
    nativeHeaderLeftItems == null && headerLeftElement != null;
  const usesHeaderRightElement =
    nativeHeaderRightItems == null && headerRightElement != null;
  const platformConfig: HeaderConfigResult['platformConfig'] = {
    ios: {
      subtitleItem:
        headerSubtitleElement == null
          ? undefined
          : {
              id: 'header-subtitle',
              render: () => <>{headerSubtitleElement}</>,
            },
      leadingItems:
        nativeHeaderLeftItems != null
          ? getIOSHeaderItems(nativeHeaderLeftItems, 'leading')
          : usesHeaderLeftElement
            ? [
                {
                  id: 'header-left',
                  type: 'item',
                  hidesSharedBackground:
                    options.headerLeftBackgroundVisible === false,
                  render: () => <>{headerLeftElement}</>,
                },
              ]
            : undefined,
      titleItem:
        headerTitleElement == null
          ? undefined
          : {
              id: 'header-title',
              render: () => <>{headerTitleElement}</>,
            },
      trailingItems:
        nativeHeaderRightItems != null
          ? getIOSHeaderItems([...nativeHeaderRightItems].reverse(), 'trailing')
          : usesHeaderRightElement
            ? [
                {
                  id: 'header-right',
                  type: 'item',
                  hidesSharedBackground:
                    options.headerRightBackgroundVisible === false,
                  render: () => <>{headerRightElement}</>,
                },
              ]
            : undefined,
      largeTitle: headerTitleText,
      largeTitleEnabled: options.headerLargeTitleEnabled,
      largeSubtitle:
        typeof options.unstable_headerLargeSubtitle === 'string'
          ? options.unstable_headerLargeSubtitle
          : undefined,
      largeSubtitleItem:
        headerLargeSubtitleElement == null
          ? undefined
          : {
              id: 'header-large-subtitle',
              render: () => <>{headerLargeSubtitleElement}</>,
            },
      backButtonTitle: options.headerBackTitle,
      backButtonDisplayMode: options.headerBackButtonDisplayMode,
      backButtonMenuEnabled: isRemovePrevented
        ? false
        : options.headerBackButtonMenuEnabled,
      standardAppearance: getIOSHeaderAppearance(
        options,
        fonts,
        options.headerTintColor
      ),
    },
  };

  return {
    platformConfig,
    usesHeaderLeftElement,
    headerBackgroundMode: 'screen',
  };
}

function getIOSHeaderAppearance(
  options: NativeStackNavigationOptions,
  fonts: Theme['fonts'],
  tintColor: NativeStackNavigationOptions['headerTintColor']
): StackHeaderAppearanceIOS | undefined {
  const titleStyle = StyleSheet.flatten(options.headerTitleStyle) ?? {};
  const largeTitleStyle =
    StyleSheet.flatten(options.headerLargeTitleStyle) ?? {};

  const titleFont = getIOSFont(fonts.bold, titleStyle, '600');
  const largeTitleFont = getIOSFont(fonts.heavy, largeTitleStyle, '700');

  const titleFontColor = titleStyle.color ?? tintColor;
  const largeTitleFontColor = largeTitleStyle.color;

  if (
    titleFont == null &&
    largeTitleFont == null &&
    titleFontColor == null &&
    largeTitleFontColor == null
  ) {
    return undefined;
  }

  return {
    titleFontFamily: titleFont?.fontFamily,
    titleFontSize: titleFont?.fontSize,
    titleFontWeight: titleFont?.fontWeight,
    titleFontColor,
    largeTitleFontFamily: largeTitleFont?.fontFamily,
    largeTitleFontSize: largeTitleFont?.fontSize,
    largeTitleFontWeight: largeTitleFont?.fontWeight,
    largeTitleFontColor,
  };
}

function getIOSFont(
  themeFont: Theme['fonts']['regular'],
  style: Pick<TextStyle, 'fontFamily' | 'fontSize' | 'fontWeight'>,
  nativeFontWeight: TextStyle['fontWeight']
) {
  const {
    fontFamily = themeFont.fontFamily,
    fontWeight = themeFont.fontWeight,
    fontSize,
  } = style;

  // FIXME: Passing the native default font still changes the header:
  // the large subtitle gets bigger, and the title grows with larger text sizes.
  // So we only pass the font when it differs from the native default.
  if (
    fontFamily === 'System' &&
    fontWeight === nativeFontWeight &&
    fontSize == null
  ) {
    return undefined;
  }

  return {
    fontFamily,
    fontWeight,
    fontSize,
  };
}

function getIOSHeaderItems(
  items: NativeStackHeaderItem[],
  placement: 'leading' | 'trailing'
): StackHeaderItemIOS[] {
  return items.map((item, index) => {
    const fallbackId = `${placement}-${index}`;

    if (item.type === 'button' || item.type === 'menu') {
      const id = item.identifier ?? fallbackId;

      return {
        id,
        identifier: item.identifier,
        type: 'item',
        title: item.label,
        icon: getIOSHeaderIcon(item.icon),
        variant: item.variant === 'done' ? undefined : item.variant,
        disabled: item.disabled,
        hidesSharedBackground: item.hidesSharedBackground,
        visibilityPriority:
          item.visibilityPriority === 'default'
            ? 'standard'
            : item.visibilityPriority,
        ...(item.type === 'button'
          ? { onPress: item.onPress }
          : {
              menu: {
                ...getIOSHeaderMenu(item.menu, `${id}-menu`),
                title: item.menu.title,
              },
            }),
      };
    }

    if (item.type === 'spacing') {
      return {
        id: fallbackId,
        type: 'spacer',
        sizing: 'fixed',
        width: item.spacing,
      };
    }

    return {
      id: fallbackId,
      type: 'item',
      hidesSharedBackground: item.hidesSharedBackground,
      render: () => item.element,
    };
  });
}

function getIOSHeaderMenu(
  menu: HeaderMenu,
  id: string
): Omit<StackHeaderMenuIOS, 'title'> {
  const menuId = menu.identifier ?? id;

  const toggleItemIds = getIOSToggleItemIds(
    menu.items,
    menu.multiselectable === false
  );

  const { onChange } = menu;

  return {
    id: menuId,
    type: 'menu',
    icon: getIOSHeaderIcon(menu.icon),
    displayInline: menu.inline,
    displayAsPalette: menu.layout === 'palette',
    singleSelection:
      typeof menu.multiselectable === 'boolean'
        ? !menu.multiselectable
        : undefined,
    ...(onChange == null
      ? null
      : {
          onSelectionChange: (selectedItemIds: string[]) =>
            onChange({
              checked: Object.fromEntries(
                toggleItemIds.map((itemId) => [
                  itemId,
                  selectedItemIds.includes(itemId),
                ])
              ),
            }),
        }),
    children: menu.items.map((item, index) =>
      getIOSHeaderMenuElement(item, `${menuId}-${index}`)
    ),
  };
}

function getIOSToggleItemIds(
  items: HeaderMenu['items'],
  includeSubmenus: boolean
): string[] {
  return items.flatMap((item) => {
    if (item.type === 'toggle') {
      return [item.identifier];
    }

    if (item.type === 'submenu' && includeSubmenus) {
      return getIOSToggleItemIds(item.items, includeSubmenus);
    }

    return [];
  });
}

function getIOSHeaderMenuElement(
  item: HeaderMenu['items'][number],
  id: string
): StackHeaderMenuElementIOS {
  if (item.type === 'action') {
    return {
      id: item.identifier ?? id,
      type: 'menuItem',
      title: item.label,
      icon: getIOSHeaderIcon(item.icon),
      itemType: 'action',
      ...(item.onPress == null ? null : { onPress: item.onPress }),
      keepsMenuPresented: item.keepsMenuPresented,
    };
  }

  if (item.type === 'toggle') {
    return {
      id: item.identifier,
      type: 'menuItem',
      title: item.label,
      icon: getIOSHeaderIcon(item.icon),
      itemType: 'toggle',
      initialToggleState: item.defaultChecked,
      keepsMenuPresented: item.keepsMenuPresented,
    };
  }

  return {
    ...getIOSHeaderMenu(item, id),
    title: item.label,
  };
}

function getIOSHeaderIcon(
  icon: NativeStackHeaderItemMenu['icon']
): StackHeaderMenuIOS['icon'] {
  if (icon?.type === 'image') {
    return icon.tinted === false
      ? { type: 'imageSource', imageSource: icon.source }
      : { type: 'templateSource', templateSource: icon.source };
  }

  return icon;
}
