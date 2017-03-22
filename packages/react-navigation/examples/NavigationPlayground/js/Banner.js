/* @flow */

import React from 'react';

import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const Banner = () => (
  <View style={styles.banner}>
    <Image
      source={require('./assets/NavLogo.png')}
      style={styles.image}
    />
    <Text style={styles.title}>React Navigation Examples</Text>
  </View>
);

export default Banner;

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#673ab7',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  image: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    tintColor: '#fff',
    margin: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '200',
    color: '#fff',
    margin: 8,
  },
});
