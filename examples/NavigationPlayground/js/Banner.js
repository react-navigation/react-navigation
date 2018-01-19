/* @flow */

import React from 'react';

import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

const Banner = () => (
  <SafeAreaView
    style={styles.bannerContainer}
    forceInset={{ top: 'always' }}
  >
    <View style={styles.banner}>
      <Image source={require('./assets/NavLogo.png')} style={styles.image} />
      <Text style={styles.title}>React Navigation Examples</Text>
    </View>
  </SafeAreaView>
);

export default Banner;

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#673ab7',
    paddingTop: 20,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
