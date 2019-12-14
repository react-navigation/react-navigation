import * as React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useScrollToTop, useTheme } from '@react-navigation/native';

type Props = {
  date?: string;
  author?: {
    name: string;
  };
};

export default function Article({
  date = '1st Jan 2025',
  author = {
    name: 'Knowledge Bot',
  },
}: Props) {
  const ref = React.useRef<ScrollView>(null);

  useScrollToTop(ref);

  const { colors } = useTheme();

  return (
    <ScrollView
      ref={ref}
      style={{ backgroundColor: colors.card }}
      contentContainerStyle={styles.content}
    >
      <View style={styles.author}>
        <Image
          style={styles.avatar}
          source={require('../../assets/avatar-1.png')}
        />
        <View style={styles.meta}>
          <Text style={[styles.name, { color: colors.text }]}>
            {author.name}
          </Text>
          <Text style={[styles.timestamp, { color: colors.text }]}>{date}</Text>
        </View>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>Lorem Ipsum</Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        Contrary to popular belief, Lorem Ipsum is not simply random text. It
        has roots in a piece of classical Latin literature from 45 BC, making it
        over 2000 years old.
      </Text>
      <Image style={styles.image} source={require('../../assets/book.jpg')} />
      <Text style={[styles.paragraph, { color: colors.text }]}>
        Richard McClintock, a Latin professor at Hampden-Sydney College in
        Virginia, looked up one of the more obscure Latin words, consectetur,
        from a Lorem Ipsum passage, and going through the cites of the word in
        classical literature, discovered the undoubtable source.
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus
        Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero,
        written in 45 BC. This book is a treatise on the theory of ethics, very
        popular during the Renaissance. The first line of Lorem Ipsum,
        &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in section
        1.10.32.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24,
  },
  timestamp: {
    opacity: 0.5,
    fontSize: 14,
    lineHeight: 21,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 36,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  paragraph: {
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
