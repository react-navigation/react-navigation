import {
  type LinkProps,
  MaterialSymbol,
  type RootParamList,
  SFSymbol,
  useLinkProps,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import {
  type ColorValue,
  Image,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { Color } from './Color';
import {
  PlatformPressable,
  type Props as PlatformPressableProps,
} from './PlatformPressable';
import { Text } from './Text';
import type { Icon } from './types';

type ButtonBaseProps = Omit<PlatformPressableProps, 'children'> & {
  /**
   * Variant of the button.
   *
   * - `plain`: transparent background, colored text
   * - `tinted`: lightly tinted background, colored text
   * - `filled`: colored background, contrasting text color
   *
   * @default 'tinted'
   */
  variant?: 'plain' | 'tinted' | 'filled' | undefined;
  /**
   * Custom color for the button.
   * Changes the text color for `plain` and `tinted` variants,
   * and background color for `filled` variant.
   */
  color?: ColorValue | undefined;
  /**
   * Icon to display before the label.
   *
   * Supported types:
   * - image: custom image source
   * - sfSymbol: SF Symbol icon (iOS only)
   * - materialSymbol: material symbol icon (Android only)
   * - React Node: function that returns a React Element
   */
  icon?:
    | Icon
    | ((props: { color: ColorValue; size: number }) => Icon | React.ReactNode)
    | undefined;
  /**
   * Label text to display inside the button.
   */
  children: string | string[];
};

type ButtonLinkProps<
  ParamList extends {} = RootParamList,
  RouteName extends keyof ParamList = keyof ParamList,
> = LinkProps<ParamList, RouteName> & ButtonBaseProps;

const BUTTON_RADIUS = 40;
const ICON_SIZE = 14;

export function Button<
  ParamList extends {} = RootParamList,
  RouteName extends keyof ParamList = keyof ParamList,
>(props: ButtonLinkProps<ParamList, RouteName>): React.JSX.Element;

export function Button(props: ButtonBaseProps): React.JSX.Element;

export function Button<
  ParamList extends {} = RootParamList,
  RouteName extends keyof ParamList = keyof ParamList,
>(props: ButtonBaseProps | ButtonLinkProps<ParamList, RouteName>) {
  if ('screen' in props || 'action' in props) {
    // @ts-expect-error: This is already type-checked by the prop types
    return <ButtonLink {...props} />;
  } else {
    return <ButtonBase {...props} />;
  }
}

function ButtonLink<
  const ParamList extends {} = RootParamList,
  const RouteName extends keyof ParamList = keyof ParamList,
>({
  screen,
  params,
  action,
  href,
  onPress,
  ...rest
}: ButtonLinkProps<ParamList, RouteName>) {
  // @ts-expect-error: This is already type-checked by the prop types
  const props = useLinkProps({ screen, params, action, href });

  return (
    <ButtonBase
      {...rest}
      {...props}
      onPress={(e) => {
        onPress?.(e);
        props.onPress?.(e);
      }}
    />
  );
}

function ButtonBase({
  variant = 'tinted',
  color: customColor,
  icon,
  android_ripple,
  style,
  children,
  ...rest
}: ButtonBaseProps) {
  const { dark, colors, fonts } = useTheme();

  const color = customColor ?? colors.primary;

  let backgroundColor: ColorValue;
  let textColor: ColorValue;

  switch (variant) {
    case 'plain':
      backgroundColor = 'transparent';
      textColor = color;
      break;
    case 'tinted':
      backgroundColor =
        Color(color)?.fade(0.85).string() ??
        (dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)');
      textColor = color;
      break;
    case 'filled':
      backgroundColor = color;
      textColor = Color.foreground(backgroundColor);
      break;
  }

  const iconNode = renderIcon(icon, textColor, ICON_SIZE);

  return (
    <PlatformPressable
      {...rest}
      android_ripple={{
        radius: BUTTON_RADIUS,
        color: Color(textColor)?.fade(0.85).string() ?? 'rgba(0, 0, 0, 0.1)',
        ...android_ripple,
      }}
      pressOpacity={Platform.OS === 'ios' ? undefined : 1}
      hoverEffect={
        typeof textColor === 'string' ? { color: textColor } : undefined
      }
      style={[{ backgroundColor }, styles.button, style]}
    >
      <View style={styles.content}>
        {iconNode && <View style={styles.icon}>{iconNode}</View>}
        <Text style={[{ color: textColor }, fonts.regular, styles.text]}>
          {children}
        </Text>
      </View>
    </PlatformPressable>
  );
}

function renderIcon(
  icon: ButtonBaseProps['icon'],
  color: ColorValue,
  size: number
) {
  if (!icon) {
    return null;
  }

  const iconValue = typeof icon === 'function' ? icon({ color, size }) : icon;

  if (React.isValidElement(iconValue)) {
    return iconValue;
  }

  if (
    typeof iconValue === 'object' &&
    iconValue != null &&
    'type' in iconValue
  ) {
    switch (iconValue.type) {
      case 'image':
        return (
          <Image
            source={iconValue.source}
            style={{
              width: size,
              height: size,
              tintColor: iconValue.tinted === false ? undefined : color,
            }}
          />
        );
      case 'sfSymbol':
        return <SFSymbol name={iconValue.name} size={size} color={color} />;
      case 'materialSymbol':
        return (
          <MaterialSymbol
            name={iconValue.name}
            variant={iconValue.variant}
            weight={iconValue.weight}
            size={size}
            color={color}
          />
        );
      default: {
        const _exhaustiveCheck: never = iconValue;

        return _exhaustiveCheck;
      }
    }
  }

  return null;
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BUTTON_RADIUS,
    borderCurve: 'continuous',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    marginLeft: -6,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
});
