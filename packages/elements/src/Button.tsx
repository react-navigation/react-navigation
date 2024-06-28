import {
  type LinkProps,
  useLinkProps,
  useTheme,
} from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import {
  PlatformPressable,
  type Props as PlatformPressableProps,
} from './PlatformPressable';
import { Text } from './Text';

type ButtonBaseProps = Omit<PlatformPressableProps, 'children'> & {
  variant?: 'plain' | 'tinted' | 'filled';
  color?: string;
  children: string | string[];
};

type ButtonLinkProps<ParamList extends ReactNavigation.RootParamList> =
  LinkProps<ParamList> & Omit<ButtonBaseProps, 'onPress'>;

const BUTTON_RADIUS = 40;

export function Button<ParamList extends ReactNavigation.RootParamList>(
  props: ButtonLinkProps<ParamList>
): React.JSX.Element;

export function Button(props: ButtonBaseProps): React.JSX.Element;

export function Button<ParamList extends ReactNavigation.RootParamList>(
  props: ButtonBaseProps | ButtonLinkProps<ParamList>
) {
  if ('screen' in props || 'action' in props) {
    // @ts-expect-error: This is already type-checked by the prop types
    return <ButtonLink {...props} />;
  } else {
    return <ButtonBase {...props} />;
  }
}

function ButtonLink<ParamList extends ReactNavigation.RootParamList>({
  screen,
  params,
  action,
  href,
  ...rest
}: ButtonLinkProps<ParamList>) {
  // @ts-expect-error: This is already type-checked by the prop types
  const props = useLinkProps({ screen, params, action, href });

  return <ButtonBase {...rest} {...props} />;
}

function ButtonBase({
  variant = 'tinted',
  color: customColor,
  android_ripple,
  style,
  children,
  ...rest
}: ButtonBaseProps) {
  const { colors, fonts } = useTheme();

  const color = customColor ?? colors.primary;

  let backgroundColor;
  let textColor;

  switch (variant) {
    case 'plain':
      backgroundColor = 'transparent';
      textColor = color;
      break;
    case 'tinted':
      backgroundColor = Color(color).fade(0.85).string();
      textColor = color;
      break;
    case 'filled':
      backgroundColor = color;
      textColor = Color(color).isDark()
        ? 'white'
        : Color(color).darken(0.71).string();
      break;
  }

  return (
    <PlatformPressable
      {...rest}
      pressOpacity={Platform.OS === 'ios' ? undefined : 1}
      style={[{ backgroundColor }, styles.button, style]}
      android_ripple={{
        radius: BUTTON_RADIUS,
        color: Color(textColor).fade(0.85).string(),
        ...android_ripple,
      }}
    >
      {Platform.OS === 'web' ? <HoverEffect color={textColor} /> : null}
      <Text style={[{ color: textColor }, fonts.regular, styles.text]}>
        {children}
      </Text>
    </PlatformPressable>
  );
}

const CLASS_NAME = '__react-navigation_elements_Button_hover';

const css = String.raw;
const cssText = css`
  .${CLASS_NAME} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: ${BUTTON_RADIUS}px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }

  button:hover > .${CLASS_NAME} {
    opacity: 0.08;
  }

  button:active > .${CLASS_NAME} {
    opacity: 0.15;
  }
`;

const HoverEffect = ({ color }: { color: string }) => {
  return (
    <>
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: cssText }}
      />
      <div className={CLASS_NAME} style={{ backgroundColor: color }} />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BUTTON_RADIUS,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
});
