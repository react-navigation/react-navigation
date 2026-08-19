import * as React from 'react';
import {
  type StackHeaderConfigProps,
  type StackHeaderMenuElementIOS,
  type StackHeaderMenuIOS,
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

// eslint-disable-next-line @eslint-react/hooks-extra/no-unnecessary-use-prefix, @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks
export function useHeaderConfig({
  options,
  hasCustomHeader,
  headerLeftElement,
  headerRightElement,
  headerTitleElement,
  headerTitleText,
  canGoBack,
  tintColor,
}: HeaderConfigOptions): HeaderConfigResult {
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
      subtitleItem: getRenderItem('header-subtitle', headerSubtitleElement),
      leadingItems:
        nativeHeaderLeftItems != null
          ? getIOSHeaderItems(nativeHeaderLeftItems, 'leading')
          : usesHeaderLeftElement
            ? [
                {
                  id: 'header-left',
                  type: 'item',
                  render: () => <>{headerLeftElement}</>,
                },
              ]
            : undefined,
      titleItem: getRenderItem('header-title', headerTitleElement),
      trailingItems:
        nativeHeaderRightItems != null
          ? getIOSHeaderItems([...nativeHeaderRightItems].reverse(), 'trailing')
          : usesHeaderRightElement
            ? [
                {
                  id: 'header-right',
                  type: 'item',
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
      largeSubtitleItem: getRenderItem(
        'header-large-subtitle',
        headerLargeSubtitleElement
      ),
    },
  };

  return {
    platformConfig,
    usesHeaderLeftElement,
    headerBackgroundMode: 'screen',
  };
}

function getRenderItem(id: string, element: React.ReactNode) {
  return element == null ? undefined : { id, render: () => <>{element}</> };
}

function getIOSHeaderItems(
  items: NativeStackHeaderItem[],
  placement: 'leading' | 'trailing'
): StackHeaderItemIOS[] {
  return items.map((item, index) => {
    const fallbackId = `${placement}-${index}`;

    if (item.type === 'button') {
      return {
        id: item.identifier ?? fallbackId,
        type: 'item',
        title: item.label,
        icon: getIOSHeaderIcon(item.icon),
        onPress: item.onPress,
      };
    }

    if (item.type === 'menu') {
      const id = item.identifier ?? fallbackId;

      return {
        id,
        type: 'item',
        title: item.label,
        icon: getIOSHeaderIcon(item.icon),
        menu: {
          ...getIOSHeaderMenu(item.menu, `${id}-menu`),
          title: item.menu.title,
        },
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
      render: () => item.element,
    };
  });
}

function getIOSHeaderMenu(
  menu: HeaderMenu,
  id: string
): Omit<StackHeaderMenuIOS, 'title'> {
  const menuId = menu.identifier ?? id;

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
    ...(menu.onSelectionChange == null
      ? null
      : { onSelectionChange: menu.onSelectionChange }),
    children: menu.items.map((item, index) =>
      getIOSHeaderMenuElement(item, `${menuId}-${index}`)
    ),
  };
}

function getIOSHeaderMenuElement(
  item: NativeStackHeaderItemMenu['menu']['items'][number],
  id: string
): StackHeaderMenuElementIOS {
  if (item.type === 'action') {
    return {
      id: item.identifier ?? id,
      type: 'menuItem',
      title: item.label,
      icon: getIOSHeaderIcon(item.icon),
      itemType: item.role,
      initialToggleState: item.initialState,
      ...(item.onPress == null ? null : { onPress: item.onPress }),
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
