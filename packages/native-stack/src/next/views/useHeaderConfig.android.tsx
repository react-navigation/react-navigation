import type { Icon } from '@react-navigation/elements';
import { MaterialSymbol } from '@react-navigation/native';
import * as React from 'react';
import type { ColorValue } from 'react-native';
import {
  type StackHeaderConfigProps,
  type StackHeaderConfigRef,
  type StackHeaderToolbarMenuElementOptionsAndroid,
} from 'react-native-screens';

import type {
  NativeStackHeaderToolbarMenu,
  NativeStackHeaderToolbarMenuElement,
  NativeStackHeaderToolbarMenuElementOptions,
} from '../../types';
import type {
  HeaderConfigOptions,
  HeaderConfigResult,
} from './useHeaderConfig';

type StackHeaderConfigAndroid = NonNullable<StackHeaderConfigProps['android']>;
type StackHeaderToolbarMenuAndroid = NonNullable<
  StackHeaderConfigAndroid['toolbarMenu']
>;
type StackHeaderToolbarMenuElementAndroid = NonNullable<
  StackHeaderToolbarMenuAndroid['children']
>[number];
type AndroidToolbarMenuIconState = {
  tintEnabled: boolean;
  normalTint: ColorValue;
};

export function useHeaderConfig({
  options,
  hasCustomHeader,
  headerLeftElement,
  headerRightElement,
  headerTitleElement,
  tintColor,
}: HeaderConfigOptions): HeaderConfigResult {
  const toolbarMenu = options.unstable_headerToolbarMenu;
  const headerConfigRef = React.useRef<StackHeaderConfigRef>(null);
  const iconStateByIdentifierRef = React.useRef(
    new Map<string, AndroidToolbarMenuIconState>()
  );

  React.useInsertionEffect(() => {
    iconStateByIdentifierRef.current = getAndroidToolbarMenuIconStates(
      toolbarMenu?.items,
      tintColor
    );
  }, [toolbarMenu, tintColor]);

  React.useImperativeHandle(
    toolbarMenu?.ref,
    () => ({
      setOptions: (identifier, options) => {
        const currentIconState = iconStateByIdentifierRef.current.get(
          identifier
        ) ?? {
          tintEnabled: true,
          normalTint: tintColor,
        };
        const nextIconState = {
          tintEnabled:
            'icon' in options
              ? isAndroidIconTintEnabled(options.icon)
              : currentIconState.tintEnabled,
          normalTint:
            'iconTintColor' in options
              ? (options.iconTintColor ?? tintColor)
              : currentIconState.normalTint,
        };

        headerConfigRef.current?.android?.updateToolbarMenuElements({
          id: identifier,
          options: getAndroidToolbarMenuElementOptions(
            options,
            tintColor,
            currentIconState,
            nextIconState
          ),
        });

        iconStateByIdentifierRef.current.set(identifier, nextIconState);
      },
    }),
    [tintColor]
  );

  const usesHeaderLeftElement = headerLeftElement != null;
  const usesHeaderRightElement = headerRightElement != null;
  const headerScroll = options.unstable_headerScroll;
  const isHeaderScrollDisabled = headerScroll?.enabled === false;
  const enabledHeaderScroll =
    headerScroll?.enabled === true ? headerScroll : undefined;
  const hasCollapsingHeader =
    options.unstable_headerType === 'medium' ||
    options.unstable_headerType === 'large';
  const hasHeaderBackground =
    options.headerBackground != null &&
    !hasCustomHeader &&
    options.headerShown !== false;
  const isHeaderScrollingEnabled = headerScroll?.enabled ?? hasCollapsingHeader;
  const ignoresHeaderBackground =
    hasHeaderBackground && !hasCollapsingHeader && isHeaderScrollingEnabled;
  const headerBackgroundElement =
    hasHeaderBackground && hasCollapsingHeader
      ? options.headerBackground?.()
      : null;

  const isBackIconTintEnabled = isAndroidIconTintEnabled(
    options.headerBackIcon
  );
  const usesTintedBackImage =
    options.headerBackIcon?.type === 'image' && isBackIconTintEnabled;
  const platformConfig: HeaderConfigResult['platformConfig'] = {
    android: {
      type: options.unstable_headerType,
      backgroundSubview:
        headerBackgroundElement == null
          ? undefined
          : {
              collapseMode: options.unstable_headerBackgroundCollapseMode,
              render: () => <>{headerBackgroundElement}</>,
            },
      leadingSubview: usesHeaderLeftElement
        ? { render: () => <>{headerLeftElement}</> }
        : undefined,
      centerSubview:
        headerTitleElement == null
          ? undefined
          : { render: () => <>{headerTitleElement}</> },
      trailingSubview: usesHeaderRightElement
        ? { render: () => <>{headerRightElement}</> }
        : undefined,
      // Image icons are tinted by default unless `tinted` is disabled. The
      // normal tint also keeps the icon visible when a state tint is present,
      // since the native header otherwise uses a transparent normal tint.
      backButtonTintColorNormal: isBackIconTintEnabled
        ? (options.headerTintColor ??
          (usesTintedBackImage ||
          options.unstable_headerBackButtonTintColorPressed != null ||
          options.unstable_headerBackButtonTintColorFocused != null
            ? tintColor
            : undefined))
        : undefined,
      backButtonTintColorPressed: isBackIconTintEnabled
        ? options.unstable_headerBackButtonTintColorPressed
        : undefined,
      backButtonTintColorFocused: isBackIconTintEnabled
        ? options.unstable_headerBackButtonTintColorFocused
        : undefined,
      backButtonIcon:
        options.headerBackIcon == null
          ? undefined
          : getAndroidIcon(options.headerBackIcon, tintColor),
      scrollFlagScroll: headerScroll?.enabled,
      scrollFlagEnterAlways: isHeaderScrollDisabled
        ? false
        : enabledHeaderScroll?.enterAlways,
      scrollFlagEnterAlwaysCollapsed: isHeaderScrollDisabled
        ? false
        : enabledHeaderScroll?.enterAlwaysCollapsed,
      scrollFlagExitUntilCollapsed: isHeaderScrollDisabled
        ? false
        : enabledHeaderScroll?.exitUntilCollapsed,
      scrollFlagSnap: isHeaderScrollDisabled
        ? false
        : enabledHeaderScroll?.snap,
      toolbarMenu:
        toolbarMenu == null
          ? undefined
          : getAndroidToolbarMenu(toolbarMenu, tintColor),
      toolbarMenuGroupDividerEnabled:
        options.unstable_headerToolbarMenuGroupDividerEnabled,
    },
  };

  return {
    platformConfig,
    headerConfigRef,
    usesHeaderLeftElement,
    headerBackgroundMode: ignoresHeaderBackground
      ? 'none'
      : headerBackgroundElement != null
        ? 'native'
        : 'screen',
  };
}

function getAndroidIcon(
  icon: Icon,
  tintColor: ColorValue
): StackHeaderConfigAndroid['backButtonIcon'] {
  if (icon.type === 'image') {
    return { type: 'imageSource', imageSource: icon.source };
  }

  if (icon.type === 'materialSymbol') {
    return {
      type: 'imageSource',
      imageSource: MaterialSymbol.getImageSource({
        name: icon.name,
        variant: icon.variant,
        weight: icon.weight,
        color: tintColor,
      }),
    };
  }

  throw new Error(
    `Unsupported icon type: ${icon.type}. Only 'image' and 'materialSymbol' icons are supported on Android.`
  );
}

function isAndroidIconTintEnabled(icon: Icon | null | undefined) {
  return icon?.type !== 'image' || icon.tinted !== false;
}

function getAndroidToolbarMenu(
  menu: Pick<NativeStackHeaderToolbarMenu, 'groups' | 'items'>,
  tintColor: ColorValue
): StackHeaderToolbarMenuAndroid {
  return {
    groups: menu.groups?.map((group) => ({
      groupId: group.identifier,
      singleSelection: group.singleSelection,
      ...(group.onSelectionChange == null
        ? null
        : { onSelectionChange: group.onSelectionChange }),
    })),
    ...(menu.items == null
      ? null
      : {
          children: menu.items.map((item) =>
            getAndroidToolbarMenuElement(item, tintColor)
          ),
        }),
  };
}

function getAndroidToolbarMenuElement(
  item: NativeStackHeaderToolbarMenuElement,
  tintColor: ColorValue
): StackHeaderToolbarMenuElementAndroid {
  const isIconTintEnabled = isAndroidIconTintEnabled(item.icon);
  const usesTintedImage = item.icon?.type === 'image' && isIconTintEnabled;

  const base = {
    id: item.identifier,
    title: item.label,
    titleCondensed: item.condensedLabel,
    tooltipText: item.tooltip,
    accessibilityLabel: item.accessibilityLabel,
    hidden: item.hidden,
    disabled: item.disabled,
    showAsAction: item.showAsAction,
    icon: item.icon == null ? undefined : getAndroidIcon(item.icon, tintColor),
    // Image icons are tinted by default unless `tinted` is disabled. The
    // normal tint also keeps the icon visible when a state tint is present,
    // since the native header otherwise uses a transparent normal tint.
    iconTintColorNormal: isIconTintEnabled
      ? (item.iconTintColor ??
        (usesTintedImage ||
        item.iconTintColorPressed != null ||
        item.iconTintColorFocused != null ||
        item.iconTintColorDisabled != null
          ? tintColor
          : undefined))
      : undefined,
    iconTintColorPressed: isIconTintEnabled
      ? item.iconTintColorPressed
      : undefined,
    iconTintColorFocused: isIconTintEnabled
      ? item.iconTintColorFocused
      : undefined,
    iconTintColorDisabled: isIconTintEnabled
      ? item.iconTintColorDisabled
      : undefined,
  };

  if (item.type === 'item') {
    return {
      ...base,
      type: 'menuItem',
      groupId: item.groupIdentifier,
      itemType: item.role,
      initialToggleState: item.initialState,
      onPress: item.onPress,
    };
  }

  return {
    ...base,
    type: 'menu',
    menuTitle: item.menuLabel,
    ...getAndroidToolbarMenu(item, tintColor),
  };
}

function getAndroidToolbarMenuElementOptions(
  options: NativeStackHeaderToolbarMenuElementOptions,
  tintColor: ColorValue,
  currentIconState: AndroidToolbarMenuIconState,
  nextIconState: AndroidToolbarMenuIconState
): StackHeaderToolbarMenuElementOptionsAndroid {
  const {
    label,
    condensedLabel,
    tooltip,
    icon,
    iconTintColor,
    iconTintColorPressed,
    iconTintColorFocused,
    iconTintColorDisabled,
    menuLabel,
    ...rest
  } = options;

  const updatesNormalIconTint = 'iconTintColor' in options;
  const normalIconTint = updatesNormalIconTint
    ? (iconTintColor ?? tintColor)
    : nextIconState.normalTint;
  const hasStateIconTint =
    iconTintColorPressed != null ||
    iconTintColorFocused != null ||
    iconTintColorDisabled != null;
  const disablesIconTint =
    currentIconState.tintEnabled && !nextIconState.tintEnabled;
  const enablesIconTint =
    !currentIconState.tintEnabled && nextIconState.tintEnabled;

  const iconTintOptions = nextIconState.tintEnabled
    ? {
        ...(updatesNormalIconTint || hasStateIconTint || enablesIconTint
          ? { iconTintColorNormal: normalIconTint }
          : null),
        ...('iconTintColorPressed' in options
          ? { iconTintColorPressed }
          : null),
        ...('iconTintColorFocused' in options
          ? { iconTintColorFocused }
          : null),
        ...('iconTintColorDisabled' in options
          ? { iconTintColorDisabled }
          : null),
      }
    : {
        ...(disablesIconTint || updatesNormalIconTint
          ? { iconTintColorNormal: undefined }
          : null),
        ...(disablesIconTint || 'iconTintColorPressed' in options
          ? { iconTintColorPressed: undefined }
          : null),
        ...(disablesIconTint || 'iconTintColorFocused' in options
          ? { iconTintColorFocused: undefined }
          : null),
        ...(disablesIconTint || 'iconTintColorDisabled' in options
          ? { iconTintColorDisabled: undefined }
          : null),
      };

  return {
    ...rest,
    ...('label' in options ? { title: label } : null),
    ...('condensedLabel' in options
      ? { titleCondensed: condensedLabel }
      : null),
    ...('tooltip' in options ? { tooltipText: tooltip } : null),
    ...('icon' in options
      ? { icon: icon == null ? undefined : getAndroidIcon(icon, tintColor) }
      : null),
    ...iconTintOptions,
    ...('menuLabel' in options ? { menuTitle: menuLabel } : null),
  };
}

function getAndroidToolbarMenuIconStates(
  items: NativeStackHeaderToolbarMenuElement[] | undefined,
  tintColor: ColorValue,
  result = new Map<string, AndroidToolbarMenuIconState>()
) {
  for (const item of items ?? []) {
    result.set(item.identifier, {
      tintEnabled: isAndroidIconTintEnabled(item.icon),
      normalTint: item.iconTintColor ?? tintColor,
    });

    if (item.type === 'menu') {
      getAndroidToolbarMenuIconStates(item.items, tintColor, result);
    }
  }

  return result;
}
