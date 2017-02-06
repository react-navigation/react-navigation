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

const HeaderBackButton = ({ onPress, title, tintColor }: Props) => (
  <TouchableItem
    delayPressIn={0}
    onPress={onPress}
    style={styles.container}
    borderless
  >
    <View style={styles.container}>
      <Image
        style={[styles.button, { tintColor }]}
        source={require('./assets/back-icon.png')}
      />
      {Platform.OS === 'ios' && title && (
        <Text style={[styles.title, { color: tintColor }]}>
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

HeaderBackButton.defaultProps = {
  tintColor: Platform.select({
    ios: '#037aff',
  }),
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 17,
  },
  button: Platform.OS === 'ios'
    ? {
      height: 21,
      width: 13,
      margin: 10,
      marginRight: 5,
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    }
    : {
      height: 24,
      width: 24,
      margin: 16,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
});

export default HeaderBackButton;
