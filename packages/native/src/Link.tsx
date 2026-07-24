import { type RootParamList, useTheme } from '@react-navigation/core';
import * as React from 'react';
import type { GestureResponderEvent, TextProps, TextStyle } from 'react-native';

import { type LinkProps, useLinkProps } from './useLinkProps';

type PressEvent =
  | React.MouseEvent<HTMLAnchorElement, MouseEvent>
  | GestureResponderEvent;

type LinkBaseProps = {
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  disabled?: boolean | undefined;
  id?: string | undefined;
  testID?: string | undefined;
  onPress?: (e: PressEvent) => void;
  numberOfLines?: number | undefined;
  className?: React.AnchorHTMLAttributes<HTMLAnchorElement>['className'];
  style?: (React.CSSProperties & TextStyle) | undefined;
  children: React.ReactNode;
} & Pick<
  TextProps,
  | 'aria-busy'
  | 'aria-expanded'
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-live'
>;

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
  target,
  disabled,
  id,
  testID,
  onPress,
  className,
  style,
  children,
  'aria-label': ariaLabel,
  'aria-busy': ariaBusy,
  'aria-expanded': ariaExpanded,
  'aria-hidden': ariaHidden,
  'aria-labelledby': ariaLabelledBy,
  'aria-live': ariaLive,
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
      aria-busy={ariaBusy}
      aria-disabled={disabled}
      aria-expanded={ariaExpanded}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-live={ariaLive}
      id={id}
      data-testid={testID}
      tabIndex={props.href == null ? 0 : undefined}
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
      onKeyDown={
        props.href == null
          ? (e) => {
              // On browser, pressing Enter on a link triggers a click event
              // So we simulate browser behavior when href is not provided
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.click();
              }
            }
          : undefined
      }
      className={className}
      style={{
        backgroundColor: 'transparent',
        boxSizing: 'border-box',
        color: colors.primary,
        cursor: disabled ? 'default' : 'pointer',
        display: 'inline',
        fontSize: 14,
        margin: 0,
        overflowWrap: 'break-word',
        padding: 0,
        position: 'relative',
        textAlign: 'start',
        textDecoration: 'none',
        whiteSpace: 'pre-wrap',
        ...fonts.regular,
        ...style,
      }}
    >
      {children}
    </a>
  );
}
