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
  onPress?: () => void,
  title?: string,
  tintColor?: ?string;
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
        style={[
          styles.icon,
          title && styles.iconWithTitle,
          { tintColor },
        ]}
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
    paddingRight: 10,
  },
  icon: Platform.OS === 'ios'
    ? {
      height: 20,
      width: 12,
      marginLeft: 10,
      marginRight: 22,
      marginVertical: 12,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    }
    : {
      height: 24,
      width: 24,
      margin: 16,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
  iconWithTitle: Platform.OS === 'ios'
    ? {
      marginRight: 5,
    }
    : {},
});

export default HeaderBackButton;
