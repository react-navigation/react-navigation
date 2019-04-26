import * as React from 'react';
import { Platform, StyleSheet, Animated } from 'react-native';

const HeaderTitle = ({
  style,
  ...rest
}: React.ComponentProps<typeof Animated.Text>) => (
  <Animated.Text
    numberOfLines={1}
    {...rest}
    style={[styles.title, style]}
    accessibilityTraits="header"
  />
);

const styles = StyleSheet.create({
  title: {
    ...Platform.select({
      ios: {
        fontSize: 17,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, .9)',
        marginHorizontal: 16,
      },
      android: {
        fontSize: 20,
        fontWeight: '500',
        color: 'rgba(0, 0, 0, .9)',
        marginHorizontal: 16,
      },
      default: {
        fontSize: 18,
        fontWeight: '400',
        color: '#3c4043',
      },
    }),
  },
});

export default HeaderTitle;
