/* @flow */

import * as React from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';

export default class Article extends React.Component<*> {
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.author}>
          <Image
            style={styles.avatar}
            source={require('../../assets/avatar-1.png')}
          />
          <View style={styles.meta}>
            <Text style={styles.name}>Knowledge Bot</Text>
            <Text style={styles.timestamp}>1st Jan 2025</Text>
          </View>
        </View>
        <Text style={styles.title}>Lorem Ipsum</Text>
        <Text style={styles.paragraph}>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature from 45 BC, making
          it over 2000 years old.
        </Text>
        <Image style={styles.image} source={require('../../assets/book.jpg')} />
        <Text style={styles.paragraph}>
          Richard McClintock, a Latin professor at Hampden-Sydney College in
          Virginia, looked up one of the more obscure Latin words, consectetur,
          from a Lorem Ipsum passage, and going through the cites of the word in
          classical literature, discovered the undoubtable source.
        </Text>
        <Text style={styles.paragraph}>
          Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
          Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written
          in 45 BC. This book is a treatise on the theory of ethics, very
          popular during the Renaissance. The first line of Lorem Ipsum, "Lorem
          ipsum dolor sit amet..", comes from a line in section 1.10.32.
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  content: {
    paddingVertical: 16,
  },
  author: {
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  meta: {
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  name: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24,
  },
  timestamp: {
    color: '#999',
    fontSize: 14,
    lineHeight: 21,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  title: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 36,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  paragraph: {
    color: '#000',
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical: 8,
  },
});
