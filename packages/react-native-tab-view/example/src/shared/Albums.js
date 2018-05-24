/* @flow */
/* eslint-disable import/no-commonjs */

import * as React from 'react';
import { ScrollView, Image, Dimensions, StyleSheet } from 'react-native';

const COVERS = [
  require('../../assets/album-art-1.jpg'),
  require('../../assets/album-art-2.jpg'),
  require('../../assets/album-art-3.jpg'),
  require('../../assets/album-art-4.jpg'),
  require('../../assets/album-art-5.jpg'),
  require('../../assets/album-art-6.jpg'),
  require('../../assets/album-art-7.jpg'),
  require('../../assets/album-art-8.jpg'),
];

export default class Albums extends React.Component<*> {
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {COVERS.map((source, i) => (
          <Image key={i} source={source} style={styles.cover} />
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#343C46',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cover: {
    width: '50%',
    height: Dimensions.get('window').width / 2,
  },
});
