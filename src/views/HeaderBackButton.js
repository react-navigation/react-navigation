/* @flow */

import React, { PropTypes } from 'react';
import {
  I18nManager,
  Image,
  Text,
  View,
  Platform,
  StyleSheet,
} from 'react-native';

import TouchableItem from './TouchableItem';

type Props = {
  onPress: Function,
  title?: string,
  tintColor?: string;
};

const defaultTintColor = Platform.select({
  ios: '#037aff',
});

const HeaderBackButton = ({ onPress, title, tintColor = defaultTintColor }: Props) => (
  <TouchableItem
    delayPressIn={0}
    onPress={onPress}
    style={styles.container}
    borderless
  >
    <View style={styles.container}>
      <Image
        style={styles.button}
        source={require('./assets/back-icon.png')}
        tintColor={tintColor}
      />
      {Platform.OS === 'ios' && title && (
        <Text style={[styles.backButton, { color: tintColor }]}>
          {title}
        </Text>
      )}
    </View>
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
    flexDirection: 'row',
  },
  backButton: {
    fontSize: 17,
  },
  button: Platform.select({
    ios: {
      height: 24,
      width: 24,
      margin: 10,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
    android: {
      height: 24,
      width: 24,
      margin: 16,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
  }),
});

export default HeaderBackButton;
