import type { Icon } from '@react-navigation/elements';
import { MaterialSymbol } from '@react-navigation/native';
import * as React from 'react';
import type { ColorValue } from 'react-native';
import {
  Stack,
  type StackHeaderConfigProps,
  type StackHeaderConfigRef,
  type StackHeaderToolbarMenuElementOptionsAndroid,
} from 'react-native-screens/experimental';

import type {
  NativeStackHeaderToolbarMenu,
  NativeStackHeaderToolbarMenuElement,
  NativeStackHeaderToolbarMenuElementOptions,
  NativeStackHeaderToolbarMenuGroup,
  NativeStackHeaderToolbarMenuRef,
} from '../../types';
import {
  getHeaderConfigBase,
  type HeaderConfigProps,
  useHeaderConfig,
} from './HeaderConfigShared';

type StackHeaderConfigAndroid = NonNullable<StackHeaderConfigProps['android']>;
type StackHeaderToolbarMenuAndroid = NonNullable<
  StackHeaderConfigAndroid['toolbarMenu']
>;
type StackHeaderToolbarMenuElementAndroid = NonNullable<
  StackHeaderToolbarMenuAndroid['children']
>[number];

export function HeaderConfig(props: HeaderConfigProps) {
  const config = useHeaderConfig(props);
  const {
    colors,
    descriptor: { options },
    hasCustomHeader,
    headerBack,
    headerLeftElement,
    headerRightElement,
    headerTitleElement,
  } = config;
  const usesHeaderLeftElement = headerLeftElement != null;
  const usesHeaderRightElement = headerRightElement != null;
  const headerBackgroundElement =
    options.headerBackground != null &&
    !hasCustomHeader &&
    options.headerShown !== false
      ? options.headerBackground()
      : null;
  const toolbarMenuTintColor = options.headerTintColor ?? colors.text;
  const headerConfig: StackHeaderConfigProps = {
    ...getHeaderConfigBase(config, usesHeaderLeftElement),
    android: {
      type: options.headerType,
      backgroundSubview:
        headerBackgroundElement == null
          ? undefined
          : {
              collapseMode: options.headerBackgroundCollapseMode,
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
      // Work around the experimental native header making the back icon
      // transparent when a pressed or focused tint is set without a normal
      // tint. Supply the regular header tint only in that case so the button
      // remains visible. Remove this fallback when the native header keeps its
      // normal tint by itself.
      backButtonTintColorNormal:
        options.headerTintColor ??
        (options.headerBackButtonTintColorPressed != null ||
        options.headerBackButtonTintColorFocused != null
          ? colors.text
          : undefined),
      backButtonTintColorPressed: options.headerBackButtonTintColorPressed,
      backButtonTintColorFocused: options.headerBackButtonTintColorFocused,
      backButtonIcon:
        options.headerBackIcon == null
          ? undefined
          : getAndroidIcon(
              options.headerBackIcon,
              options.headerTintColor ?? colors.text
            ),
      scrollFlagScroll: options.headerScrollFlagScroll,
      scrollFlagEnterAlways: options.headerScrollFlagEnterAlways,
      scrollFlagEnterAlwaysCollapsed:
        options.headerScrollFlagEnterAlwaysCollapsed,
      scrollFlagExitUntilCollapsed: options.headerScrollFlagExitUntilCollapsed,
      scrollFlagSnap: options.headerScrollFlagSnap,
      toolbarMenu:
        options.unstable_headerToolbarMenu == null
          ? undefined
          : getAndroidToolbarMenu(
              options.unstable_headerToolbarMenu,
              toolbarMenuTintColor
            ),
      toolbarMenuGroupDividerEnabled:
        options.unstable_headerToolbarMenuGroupDividerEnabled,
    },
  };

  return (
    <>
      {props.children(headerBack)}
      <HeaderConfigView
        config={headerConfig}
        toolbarMenuRef={options.unstable_headerToolbarMenu?.ref}
        toolbarMenuTintColor={toolbarMenuTintColor}
      />
    </>
  );
}

function HeaderConfigView({
  config,
  toolbarMenuRef,
  toolbarMenuTintColor,
}: {
  config: StackHeaderConfigProps;
  toolbarMenuRef?: React.Ref<NativeStackHeaderToolbarMenuRef> | undefined;
  toolbarMenuTintColor: ColorValue;
}) {
  const ref = React.useRef<StackHeaderConfigRef>(null);

  React.useImperativeHandle(
    toolbarMenuRef,
    () => ({
      setOptions: (identifier, options) => {
        ref.current?.android?.setToolbarMenuElementOptions(
          identifier,
          getAndroidToolbarMenuElementOptions(options, toolbarMenuTintColor)
        );
      },
    }),
    [toolbarMenuTintColor]
  );

  return <Stack.HeaderConfig ref={ref} {...config} />;
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

function getAndroidMenuGroups(
  groups: NativeStackHeaderToolbarMenuGroup[] | undefined
): StackHeaderToolbarMenuAndroid['groups'] {
  return groups?.map((group) => ({
    groupId: group.identifier,
    singleSelection: group.singleSelection,
    ...(group.onSelectionChange == null
      ? {}
      : { onSelectionChange: group.onSelectionChange }),
  }));
}

function getAndroidToolbarMenu(
  menu: NativeStackHeaderToolbarMenu,
  tintColor: ColorValue
): StackHeaderToolbarMenuAndroid {
  return {
    groups: getAndroidMenuGroups(menu.groups),
    ...(menu.items == null
      ? {}
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
  const base = {
    id: item.identifier,
    title: item.label,
    titleCondensed: item.condensedLabel,
    tooltipText: item.tooltip,
    hidden: item.hidden,
    disabled: item.disabled,
    showAsAction: item.showAsAction,
    icon: item.icon == null ? undefined : getAndroidIcon(item.icon, tintColor),
    // Work around the experimental native header making this icon transparent
    // when a state tint is set without a normal tint. Supply the menu's regular
    // tint only in that case so the item remains visible. Remove this fallback
    // when the native header keeps its normal tint by itself.
    iconTintColorNormal:
      item.iconTintColor ??
      (item.iconTintColorPressed != null ||
      item.iconTintColorFocused != null ||
      item.iconTintColorDisabled != null
        ? tintColor
        : undefined),
    iconTintColorPressed: item.iconTintColorPressed,
    iconTintColorFocused: item.iconTintColorFocused,
    iconTintColorDisabled: item.iconTintColorDisabled,
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
    groups: getAndroidMenuGroups(item.groups),
    ...(item.items == null
      ? {}
      : {
          children: item.items.map((child) =>
            getAndroidToolbarMenuElement(child, tintColor)
          ),
        }),
  };
}

function getAndroidToolbarMenuElementOptions(
  options: NativeStackHeaderToolbarMenuElementOptions,
  tintColor: ColorValue
): StackHeaderToolbarMenuElementOptionsAndroid {
  const hasIconTintUpdate =
    'iconTintColor' in options ||
    'iconTintColorPressed' in options ||
    'iconTintColorFocused' in options ||
    'iconTintColorDisabled' in options;
  const hasStateIconTint =
    options.iconTintColorPressed != null ||
    options.iconTintColorFocused != null ||
    options.iconTintColorDisabled != null;

  return {
    ...('label' in options ? { title: options.label } : {}),
    ...('condensedLabel' in options
      ? { titleCondensed: options.condensedLabel }
      : {}),
    ...('tooltip' in options ? { tooltipText: options.tooltip } : {}),
    ...('hidden' in options ? { hidden: options.hidden } : {}),
    ...('disabled' in options ? { disabled: options.disabled } : {}),
    ...('showAsAction' in options
      ? { showAsAction: options.showAsAction }
      : {}),
    ...('icon' in options
      ? {
          icon:
            options.icon == null
              ? undefined
              : getAndroidIcon(options.icon, tintColor),
        }
      : {}),
    ...(hasIconTintUpdate
      ? {
          // Keep the normal icon visible when this update adds a state tint.
          // The native API otherwise replaces the missing normal tint with a
          // transparent color. Remove this fallback when the native header
          // keeps its normal tint by itself.
          iconTintColorNormal:
            options.iconTintColor ?? (hasStateIconTint ? tintColor : undefined),
        }
      : {}),
    ...('iconTintColorPressed' in options
      ? { iconTintColorPressed: options.iconTintColorPressed }
      : {}),
    ...('iconTintColorFocused' in options
      ? { iconTintColorFocused: options.iconTintColorFocused }
      : {}),
    ...('iconTintColorDisabled' in options
      ? { iconTintColorDisabled: options.iconTintColorDisabled }
      : {}),
    ...('checked' in options ? { checked: options.checked } : {}),
    ...('menuLabel' in options ? { menuTitle: options.menuLabel } : {}),
  };
}
