import { type RootParamList, useTheme } from '@react-navigation/core';
import * as React from 'react';
import type { GestureResponderEvent, TextProps, TextStyle } from 'react-native';

import { type LinkProps, useLinkProps } from './useLinkProps';

type PressEvent =
  | React.MouseEvent<HTMLAnchorElement, MouseEvent>
  | GestureResponderEvent;

type LinkBaseProps = Omit<TextProps, 'disabled' | 'onPress' | 'style'> & {
  target?: string;
  onPress?: (e: PressEvent) => void;
  disabled?: boolean | undefined;
  style?: (React.CSSProperties & TextStyle) | undefined;
  children: React.ReactNode;
};

export type Props<
  ParamList extends {} = RootParamList,
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
> = LinkProps<NoInfer<ParamList>, RouteName> & LinkBaseProps;

/**
 * Component to render link to another screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.in Name of the current or parent screen whose navigator contains the target screen.
 * @param props.screen Name of the screen to navigate to (e.g. `'Feeds'`).
 * @param props.params Params to pass to the screen to navigate to (e.g. `{ sort: 'hot' }`).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to override the in-page navigation. The `href` is still derived from `screen`, so this can be used to render a link while dispatching a different action (e.g. a `replace`).
 * @param props.children Child elements to render the content.
 */
export function Link<
  ParamList extends {} = RootParamList,
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
>({
  in: parent,
  screen,
  params,
  action,
  href,
  style,
  target,
  disabled,
  onPress,
  children,
  accessibilityLabel,
  'aria-label': ariaLabel,
  id,
  numberOfLines,
  selectable,
  testID,
  nativeID: _nativeID,
  ...rest
}: Props<ParamList, RouteName>) {
  // @ts-expect-error: destructuring loses the relationship between target props
  const props = useLinkProps({ in: parent, screen, params, action, href });

  // Keep usage of `useTheme` after `useLinkProps`
  // This ensures proper error when used outside of navigation container
  const { colors, fonts } = useTheme();

  if (typeof colors.primary !== 'string') {
    throw new Error('Invalid color format.');
  }

  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    onPress?.(e);

    // Let user prevent default behavior
    if (!e.defaultPrevented) {
      props.onPress(e);
    }
  };

  return (
    <a
      {...rest}
      aria-label={ariaLabel ?? accessibilityLabel}
      aria-disabled={disabled}
      data-testid={testID}
      id={id}
      target={target}
      role={props.role}
      href={props.href}
      onAuxClick={
        disabled
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
            }
          : undefined
      }
      onClick={onClick}
      style={{
        backgroundColor: 'transparent',
        boxSizing: 'border-box',
        color: colors.primary,
        display:
          numberOfLines === 1
            ? 'inline-block'
            : numberOfLines && numberOfLines > 1
              ? '-webkit-box'
              : 'inline',
        font: '14px System',
        listStyle: 'none',
        margin: 0,
        maxWidth: numberOfLines ? '100%' : undefined,
        padding: 0,
        position: 'relative',
        textAlign: 'start',
        textDecoration: 'none',
        whiteSpace: numberOfLines === 1 ? 'nowrap' : 'pre-wrap',
        overflowWrap: 'break-word',
        WebkitBoxOrient:
          numberOfLines && numberOfLines > 1 ? 'vertical' : undefined,
        WebkitLineClamp:
          numberOfLines && numberOfLines > 1 ? numberOfLines : undefined,
        overflow: numberOfLines ? 'hidden' : undefined,
        textOverflow: numberOfLines === 1 ? 'ellipsis' : undefined,
        userSelect: selectable === false ? 'none' : undefined,
        ...fonts.regular,
        ...style,
      }}
    >
      {children}
    </a>
  );
}
