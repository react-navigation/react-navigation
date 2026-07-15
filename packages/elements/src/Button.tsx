import {
  type LinkProps,
  type ParamListBase,
  type RootParamList,
  useLinkProps,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import {
  ActivityIndicator,
  type ColorValue,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { Color } from './Color';
import { PlatformIcon } from './PlatformIcon';
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
   * Whether to show a loading indicator instead of the icon.
   */
  loading?: boolean | undefined;
  /**
   * Label text to display inside the button.
   */
  children: string | string[] | React.ReactElement | React.ReactElement[];
};

type ButtonLinkProps<
  ParamList extends {} = RootParamList,
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
> = LinkProps<NoInfer<ParamList>, RouteName> & ButtonBaseProps;

const BUTTON_RADIUS = 40;
const ICON_SIZE = 14;

/**
 * Component to render a button that navigates to a screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.in Name of the current or parent screen whose navigator contains the target screen.
 * @param props.screen Name of the screen to navigate to (e.g. `'Feeds'`).
 * @param props.params Params to pass to the screen to navigate to (e.g. `{ sort: 'hot' }`).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to override the in-page navigation. The `href` is still derived from `screen`, so this can be used to render a link while dispatching a different action (e.g. a `replace`).
 */
export function Button<
  ParamList extends {} = RootParamList,
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
>(props: ButtonLinkProps<ParamList, RouteName>): React.JSX.Element;

/**
 * Component to render a button.
 */
export function Button(props: ButtonBaseProps): React.JSX.Element;

export function Button(
  props: ButtonBaseProps | ButtonLinkProps<ParamListBase>
) {
  if ('screen' in props || 'action' in props) {
    return <ButtonLink {...props} />;
  } else {
    return <ButtonBase {...props} />;
  }
}

function ButtonLink({
  in: parent,
  screen,
  params,
  action,
  href,
  onPress,
  ...rest
}: ButtonLinkProps<ParamListBase>) {
  // @ts-expect-error: destructuring loses the relationship between target props
  const props = useLinkProps({ in: parent, screen, params, action, href });

  const [isPending, startTransition] = React.useTransition();

  // Avoid flashing the loading indicator when the transition is fast
  const isPendingDeferred = React.useDeferredValue(isPending);

  return (
    <ButtonBase
      {...rest}
      {...props}
      loading={
        typeof rest.loading === 'boolean'
          ? rest.loading
          : isPending && isPendingDeferred
      }
      onPress={(e) => {
        onPress?.(e);

        startTransition(() => {
          props.onPress(e);
        });
      }}
    />
  );
}

function ButtonBase({
  variant = 'tinted',
  color: customColor,
  icon,
  loading = false,
  android_ripple,
  disabled,
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

  if (disabled || loading) {
    textColor = dark ? 'rgba(235, 235, 245, 0.3)' : 'rgba(60, 60, 67, 0.3)';

    if (variant !== 'plain') {
      backgroundColor = dark
        ? 'rgba(118, 118, 128, 0.24)'
        : 'rgba(118, 118, 128, 0.12)';
    }
  }

  const rippleColor =
    Color(textColor)?.fade(0.88).string() ??
    (variant === 'filled' || dark
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(0, 0, 0, 0.12)');

  const iconNode = loading ? (
    <ActivityIndicator color={textColor} size={ICON_SIZE} />
  ) : (
    renderIcon(icon, textColor, ICON_SIZE)
  );

  return (
    <PlatformPressable
      {...rest}
      disabled={disabled || loading}
      android_ripple={{
        foreground: true,
        color: rippleColor,
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
    return <PlatformIcon icon={iconValue} size={size} color={color} />;
  }

  return null;
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BUTTON_RADIUS,
    borderCurve: 'continuous',
    overflow: 'hidden',
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
