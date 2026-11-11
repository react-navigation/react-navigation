import type { Icon } from '@react-navigation/elements';
import {
  type LocaleDirection,
  MaterialSymbol,
  useLocale,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { type ColorValue, StyleSheet } from 'react-native';
import type {
  StackHeaderConfigProps,
  StackHeaderConfigRef,
  StackHeaderToolbarMenuElementOptionsAndroid,
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

const BACK_ICON_SIZE = 24;

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
  const { direction } = useLocale();
  const { colors, fonts } = useTheme();

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
              ? options.icon?.type !== 'image' || options.icon.tinted !== false
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
            direction,
            currentIconState,
            nextIconState
          ),
        });

        iconStateByIdentifierRef.current.set(identifier, nextIconState);
      },
    }),
    [direction, tintColor]
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

  const headerBackIcon =
    options.headerBackIcon?.type === 'sfSymbol'
      ? undefined
      : options.headerBackIcon;

  const isBackIconTintEnabled =
    headerBackIcon?.type !== 'image' || headerBackIcon.tinted !== false;

  const isBackIconVisible = !(
    hasCustomHeader ||
    options.headerShown === false ||
    options.headerBackVisible === false
  );

  const backButtonIcon: StackHeaderConfigAndroid['backButtonIcon'] =
    !isBackIconVisible
      ? undefined
      : headerBackIcon != null
        ? getAndroidIcon(headerBackIcon, tintColor, direction)
        : MaterialSymbol.isAvailable()
          ? {
              type: 'imageSource',
              imageSource: MaterialSymbol.getImageSource({
                name: 'arrow_back',
                color: tintColor,
                size: BACK_ICON_SIZE,
                direction,
              }),
            }
          : undefined;

  const headerStyle = StyleSheet.flatten(options.headerStyle) ?? {};
  const headerTitleStyle = {
    ...fonts.medium,
    ...StyleSheet.flatten(options.headerTitleStyle),
  };
  const headerLargeTitleStyle = {
    ...fonts.medium,
    ...StyleSheet.flatten(options.headerLargeTitleStyle),
  };

  const titleColor = headerTitleStyle.color ?? tintColor;
  const usesHeaderBackground = hasHeaderBackground && !ignoresHeaderBackground;

  const backgroundColor =
    headerStyle.backgroundColor ??
    (options.headerTransparent || usesHeaderBackground
      ? 'transparent'
      : colors.card);

  const scrolledBackgroundColor =
    headerStyle.backgroundColor ??
    (options.headerTransparent ||
    (usesHeaderBackground && headerBackgroundElement == null)
      ? 'transparent'
      : colors.card);

  const isTitleCentered = options.headerTitleAlign === 'center';

  const platformConfig: HeaderConfigResult['platformConfig'] = {
    android: {
      // FIXME: The native side throws when these props are reset to `null`
      // So we pass the default values instead of `undefined`
      type: options.unstable_headerType ?? 'small',
      backgroundSubview:
        headerBackgroundElement == null
          ? undefined
          : {
              collapseMode:
                options.unstable_headerBackgroundCollapseMode ?? 'off',
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
      backButtonTintColorNormal: isBackIconTintEnabled ? tintColor : undefined,
      backButtonTintColorPressed: isBackIconTintEnabled
        ? options.unstable_headerBackButtonTintColorPressed
        : undefined,
      backButtonTintColorFocused: isBackIconTintEnabled
        ? options.unstable_headerBackButtonTintColorFocused
        : undefined,
      backButtonIcon,
      overflowIconTintColorNormal: tintColor,
      backgroundColor,
      scrolledBackgroundColor,
      titleCentered: isTitleCentered,
      subtitleCentered: isTitleCentered,
      titleColor,
      titleFontFamily: headerTitleStyle.fontFamily,
      titleFontSize: headerTitleStyle.fontSize,
      titleFontWeight: headerTitleStyle.fontWeight,
      collapsedTitleColor: titleColor,
      collapsedTitleFontFamily: headerTitleStyle.fontFamily,
      collapsedTitleFontSize: headerTitleStyle.fontSize,
      collapsedTitleFontWeight: headerTitleStyle.fontWeight,
      expandedTitleColor: headerLargeTitleStyle.color ?? titleColor,
      expandedTitleFontFamily: headerLargeTitleStyle.fontFamily,
      expandedTitleFontSize: headerLargeTitleStyle.fontSize,
      expandedTitleFontWeight: headerLargeTitleStyle.fontWeight,
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
          : getAndroidToolbarMenu(toolbarMenu, tintColor, direction),
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
  tintColor: ColorValue,
  direction: LocaleDirection
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
        fill: icon.fill,
        color: tintColor,
        direction,
      }),
    };
  }

  throw new Error(
    `Unsupported icon type: ${icon.type}. Only 'image' and 'materialSymbol' icons are supported on Android.`
  );
}

function getAndroidToolbarMenu(
  menu: Pick<NativeStackHeaderToolbarMenu, 'groups' | 'items'>,
  tintColor: ColorValue,
  direction: LocaleDirection
): StackHeaderToolbarMenuAndroid {
  return {
    groups: menu.groups?.map((group) => {
      const { onChange } = group;

      const toggleItemIds = (menu.items ?? []).flatMap((item) =>
        item.type === 'toggle' && item.groupIdentifier === group.identifier
          ? [item.identifier]
          : []
      );

      return {
        groupId: group.identifier,
        singleSelection: group.singleSelection,
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
      };
    }),
    ...(menu.items == null
      ? null
      : {
          children: menu.items.map((item) =>
            getAndroidToolbarMenuElement(item, tintColor, direction)
          ),
        }),
  };
}

function getAndroidToolbarMenuElement(
  item: NativeStackHeaderToolbarMenuElement,
  tintColor: ColorValue,
  direction: LocaleDirection
): StackHeaderToolbarMenuElementAndroid {
  const isIconTintEnabled =
    item.icon?.type !== 'image' || item.icon.tinted !== false;
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
    icon:
      item.icon == null
        ? undefined
        : getAndroidIcon(item.icon, tintColor, direction),
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
      onPress: item.onPress,
    };
  }

  if (item.type === 'toggle') {
    return {
      ...base,
      type: 'menuItem',
      groupId: item.groupIdentifier,
      itemType: 'toggle',
      initialToggleState: item.defaultChecked,
    };
  }

  return {
    ...base,
    type: 'menu',
    menuTitle: item.menuLabel,
    ...getAndroidToolbarMenu(item, tintColor, direction),
  };
}

function getAndroidToolbarMenuElementOptions(
  options: NativeStackHeaderToolbarMenuElementOptions,
  tintColor: ColorValue,
  direction: LocaleDirection,
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
  const setsTintedImage = icon?.type === 'image' && nextIconState.tintEnabled;

  const iconTintOptions = nextIconState.tintEnabled
    ? {
        ...(updatesNormalIconTint ||
        hasStateIconTint ||
        enablesIconTint ||
        setsTintedImage
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
      ? {
          icon:
            icon == null
              ? undefined
              : getAndroidIcon(icon, tintColor, direction),
        }
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
      tintEnabled: item.icon?.type !== 'image' || item.icon.tinted !== false,
      normalTint: item.iconTintColor ?? tintColor,
    });

    if (item.type === 'menu') {
      getAndroidToolbarMenuIconStates(item.items, tintColor, result);
    }
  }

  return result;
}
