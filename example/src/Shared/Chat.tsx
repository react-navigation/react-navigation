import * as React from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ScrollViewProps,
} from 'react-native';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import Color from 'color';

const MESSAGES = [
  'okay',
  'sudo make me a sandwich',
  'what? make it yourself',
  'make me a sandwich',
];

export default function Chat(props: Partial<ScrollViewProps>) {
  const ref = React.useRef<ScrollView>(null);

  useScrollToTop(ref);

  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.inverted}
        contentContainerStyle={styles.content}
        {...props}
      >
        {MESSAGES.map((text, i) => {
          const odd = i % 2;

          return (
            <View
              // eslint-disable-next-line react/no-array-index-key
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
                style={[
                  styles.bubble,
                  { backgroundColor: odd ? colors.primary : colors.card },
                ]}
              >
                <Text style={{ color: odd ? 'white' : colors.text }}>
                  {text}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
        placeholderTextColor={Color(colors.text).alpha(0.5).rgb().string()}
        placeholder="Write a message"
        underlineColorAndroid="transparent"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  input: {
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});
