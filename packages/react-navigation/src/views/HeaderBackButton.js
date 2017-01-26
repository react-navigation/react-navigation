/* @flow */

import React, { PropTypes } from 'react';
import {
  I18nManager,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';

import TouchableItem from './TouchableItem';

type Props = {
  onPress: Function,
  tintColor?: string;
};

const HeaderBackButton = ({ onPress, tintColor }: Props) => (
  <TouchableItem
    delayPressIn={0}
    onPress={onPress}
    style={styles.container}
    borderless
  >
    <Image
      style={styles.button}
      source={require('./assets/back-icon.png')}
      tintColor={tintColor}
    />
  </TouchableItem>
);

HeaderBackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  tintColor: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 24,
    width: 24,
    margin: Platform.OS === 'ios' ? 10 : 16,
    resizeMode: 'contain',
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});

export default HeaderBackButton;
