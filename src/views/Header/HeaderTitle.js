/* @flow */

import React from 'react';

import { Text, View, Platform, StyleSheet, Animated } from 'react-native';

type AnimatedTextStyleProp = $PropertyType<
  $PropertyType<Animated.Text, 'props'>,
  'style'
>;

type Props = {
  children: React$Element<*>,
  selectionColor?: string | number,
  style?: AnimatedTextStyleProp,
};

const AnimatedText = Animated.Text;

const HeaderTitle = ({ style, ...rest }: Props) => (
  <AnimatedText
    numberOfLines={1}
    {...rest}
    style={[styles.title, style]}
    accessibilityTraits="header"
  />
);

const styles = StyleSheet.create({
  title: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16,
  },
});

export default HeaderTitle;
