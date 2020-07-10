import * as React from 'react';
import { Animated, StyleSheet, StyleProp, TextStyle } from 'react-native';
import color from 'color';
import { useTheme } from '@react-navigation/native';

type Props = {
  /**
   * Whether the badge is visible
   */
  visible: boolean;
  /**
   * Content of the `Badge`.
   */
  children?: string | number;
  /**
   * Size of the `Badge`.
   */
  size?: number;
  /**
   * Style object for the tab bar container.
   */
  style?: Animated.WithAnimatedValue<StyleProp<TextStyle>>;
};

export default function Badge({
  visible = true,
  size = 18,
  children,
  style,
  ...rest
}: Props) {
  const [opacity] = React.useState(() => new Animated.Value(visible ? 1 : 0));

  const theme = useTheme();

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [opacity, visible]);

  // @ts-expect-error: backgroundColor definitely exists
  const { backgroundColor = theme.colors.notification, ...restStyle } =
    StyleSheet.flatten(style) || {};
  const textColor = color(backgroundColor).isLight() ? 'black' : 'white';

  const borderRadius = size / 2;
  const fontSize = Math.floor((size * 3) / 4);

  return (
    <Animated.Text
      numberOfLines={1}
      style={[
        {
          opacity,
          backgroundColor,
          color: textColor,
          fontSize,
          lineHeight: size - 1,
          height: size,
          minWidth: size,
          borderRadius,
        },
        styles.container,
        restStyle,
      ]}
      {...rest}
    >
      {children}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
});
