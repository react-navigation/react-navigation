import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from 'react-native';

type Props = ViewProps & {
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  children?: React.ReactNode;
};

export default function HeaderBackground({ style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          shadowColor: colors.border,
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowOpacity: 0.85,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: StyleSheet.hairlineWidth,
        },
      },
      default: {
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    }),
  },
});
