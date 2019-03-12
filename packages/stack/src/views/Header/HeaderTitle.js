import React from 'react';
import { Platform, StyleSheet, Animated } from 'react-native';

const AnimatedText = Animated.Text;

const HeaderTitle = ({ style, ...rest }) => (
  <AnimatedText
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
      },
      default: {
        fontSize: 20,
        fontWeight: '500',
      },
    }),
    color: 'rgba(0, 0, 0, .9)',
    marginHorizontal: 16,
  },
});

export default HeaderTitle;
