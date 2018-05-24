/* @flow */

import * as React from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

const MESSAGES = [
  'okay',
  'sudo make me a sandwich',
  'what? make it yourself',
  'make me a sandwich',
];

export default class Albums extends React.Component<*> {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.inverted}
          contentContainerStyle={styles.content}
        >
          {MESSAGES.map((text, i) => {
            const odd = i % 2;

            return (
              <View
                key={i}
                style={[odd ? styles.odd : styles.even, styles.inverted]}
              >
                <Image
                  style={styles.avatar}
                  source={
                    odd
                      ? require('../../assets/avatar-2.png')
                      : require('../../assets/avatar-1.png')
                  }
                />
                <View
                  style={[styles.bubble, odd ? styles.received : styles.sent]}
                >
                  <Text style={odd ? styles.receivedText : styles.sentText}>
                    {text}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Write a message"
          underlineColorAndroid="transparent"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eceff1',
  },
  inverted: {
    transform: [{ scaleY: -1 }],
  },
  content: {
    padding: 16,
  },
  even: {
    flexDirection: 'row',
  },
  odd: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    marginVertical: 8,
    marginHorizontal: 6,
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, .16)',
    borderWidth: StyleSheet.hairlineWidth,
  },
  bubble: {
    marginVertical: 8,
    marginHorizontal: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sent: {
    backgroundColor: '#cfd8dc',
  },
  received: {
    backgroundColor: '#2196F3',
  },
  sentText: {
    color: 'black',
  },
  receivedText: {
    color: 'white',
  },
  input: {
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
});
