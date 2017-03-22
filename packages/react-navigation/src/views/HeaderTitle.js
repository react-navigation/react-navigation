/* @flow */

import React from 'react';

import {
  Platform,
  StyleSheet,
  Text,
} from 'react-native';

import type {
  Style,
} from '../TypeDefinition';

type Props = {
  tintColor?: ?string;
  style?: Style,
};

const HeaderTitle = ({ style, ...rest }: Props) => (
  <Text numberOfLines={1} {...rest} style={[styles.title, style]} />
);

const styles = StyleSheet.create({
  title: {
    fontSize: Platform.OS === 'ios' ? 17 : 18,
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16,
  },
});

HeaderTitle.propTypes = {
  style: Text.propTypes.style,
};

export default HeaderTitle;
