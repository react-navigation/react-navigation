import * as React from 'react';
import {
  Stack,
  type StackHeaderConfigProps,
  type StackHeaderMenuElementIOS,
  type StackHeaderMenuIOS,
} from 'react-native-screens/experimental';

import type {
  NativeStackHeaderItem,
  NativeStackHeaderItemMenu,
  NativeStackNavigationOptions,
} from '../../types';
import {
  getHeaderConfigBase,
  type HeaderConfigProps,
  useHeaderConfig,
} from './HeaderConfigShared';

type StackHeaderConfigIOS = NonNullable<StackHeaderConfigProps['ios']>;
type StackHeaderItemIOS = NonNullable<
  StackHeaderConfigIOS['leadingItems']
>[number];

export function HeaderConfig(props: HeaderConfigProps) {
  const config = useHeaderConfig(props);
  const {
    descriptor: { options },
    hasCustomHeader,
    headerBack,
    headerLeftElement,
    headerRightElement,
    headerTitleElement,
    headerTitleText,
    canGoBack,
  } = config;
  const renderElementOption = (
    option: NativeStackNavigationOptions['headerSubtitle']
  ) =>
    !hasCustomHeader && typeof option === 'function'
      ? option({
          tintColor: options.headerTintColor,
          children: '',
        })
      : null;

  const headerSubtitleElement = renderElementOption(options.headerSubtitle);
  const headerLargeSubtitleElement = renderElementOption(
    options.headerLargeSubtitle
  );
  const nativeHeaderLeftItems = hasCustomHeader
    ? undefined
    : options.unstable_headerLeftItems?.({
        tintColor: options.headerTintColor,
        canGoBack,
      });
  const nativeHeaderRightItems = hasCustomHeader
    ? undefined
    : options.unstable_headerRightItems?.({
        tintColor: options.headerTintColor,
        canGoBack,
      });
  const usesHeaderLeftElement =
    nativeHeaderLeftItems == null && headerLeftElement != null;
  const usesHeaderRightElement =
    nativeHeaderRightItems == null && headerRightElement != null;
  const headerConfig: StackHeaderConfigProps = {
    ...getHeaderConfigBase(config, usesHeaderLeftElement),
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
        typeof options.headerLargeSubtitle === 'string'
          ? options.headerLargeSubtitle
          : undefined,
      largeSubtitleItem: getRenderItem(
        'header-large-subtitle',
        headerLargeSubtitleElement
      ),
    },
  };

  return (
    <>
      {props.children(headerBack)}
      <Stack.HeaderConfig {...headerConfig} />
    </>
  );
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
        onPress: item.onPress,
      };
    }

    if (item.type === 'menu') {
      const id = item.identifier ?? fallbackId;

      return {
        id,
        type: 'item',
        title: item.label,
        menu: getIOSHeaderMenu(item.menu, `${id}-menu`),
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
  menu: NativeStackHeaderItemMenu['menu'],
  id: string
): StackHeaderMenuIOS {
  return {
    ...getIOSHeaderMenuBase(menu, id),
    title: menu.title,
  };
}

function getIOSHeaderMenuBase(
  menu: {
    identifier?: string | undefined;
    multiselectable?: boolean | undefined;
    onSelectionChange?: ((selectedItemIds: string[]) => void) | undefined;
    items: NativeStackHeaderItemMenu['menu']['items'];
  },
  id: string
): Omit<StackHeaderMenuIOS, 'title'> {
  const menuId = menu.identifier ?? id;

  return {
    id: menuId,
    type: 'menu',
    singleSelection:
      typeof menu.multiselectable === 'boolean'
        ? !menu.multiselectable
        : undefined,
    ...(menu.onSelectionChange == null
      ? {}
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
      itemType: item.role,
      initialToggleState: item.initialState,
      ...(item.onPress == null ? {} : { onPress: item.onPress }),
      keepsMenuPresented: item.keepsMenuPresented,
    };
  }

  return {
    ...getIOSHeaderMenuBase(item, id),
    title: item.label,
  };
}
