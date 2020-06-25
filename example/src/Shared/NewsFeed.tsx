import * as React from 'react';
import {
  View,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  ScrollViewProps,
} from 'react-native';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import {
  Card,
  Text,
  Avatar,
  Subheading,
  IconButton,
  Divider,
} from 'react-native-paper';
import Color from 'color';

type Props = Partial<ScrollViewProps> & {
  date?: number;
};

const Author = () => {
  return (
    <View style={[styles.row, styles.attribution]}>
      <Avatar.Image source={require('../../assets/avatar-1.png')} size={32} />
      <Subheading style={styles.author}>Joke bot</Subheading>
    </View>
  );
};

const Footer = () => {
  return (
    <View style={styles.row}>
      <IconButton style={styles.icon} size={16} icon="heart-outline" />
      <IconButton style={styles.icon} size={16} icon="comment-outline" />
      <IconButton style={styles.icon} size={16} icon="share-outline" />
    </View>
  );
};

export default function NewsFeed(props: Props) {
  const ref = React.useRef<ScrollView>(null);

  useScrollToTop(ref);

  const { colors } = useTheme();

  return (
    <ScrollView ref={ref} {...props}>
      <Card style={styles.card}>
        <TextInput
          placeholder="What's on your mind?"
          placeholderTextColor={Color(colors.text).alpha(0.5).rgb().string()}
          style={styles.input}
        />
      </Card>
      <Card style={styles.card}>
        <Author />
        <Card.Content style={styles.content}>
          <Text>
            If you aren&apos;t impressed with the picture of the first Black
            Hole, you clearly don&apos;t understand the gravity of the
            situation.
          </Text>
        </Card.Content>
        <Divider />
        <Footer />
      </Card>
      <Card style={styles.card}>
        <Author />
        <Card.Content style={styles.content}>
          <Text>
            I went to the zoo and I saw a baguette in a cage. I asked the
            zookeeper about it and he said it was bread in captivity.
          </Text>
        </Card.Content>
        <Image source={require('../../assets/book.jpg')} style={styles.cover} />
        <Footer />
      </Card>
      <Card style={styles.card}>
        <Author />
        <Card.Content style={styles.content}>
          <Text>Why didn&apos;t 4 ask 5 out? Because he was 2².</Text>
        </Card.Content>
        <Divider />
        <Footer />
      </Card>
      <Card style={styles.card}>
        <Author />
        <Card.Content style={styles.content}>
          <Text>
            What did Master Yoda say when he first saw himself in 4k? HDMI.
          </Text>
        </Card.Content>
        <Divider />
        <Footer />
      </Card>
      <Card style={styles.card}>
        <Author />
        <Card.Content style={styles.content}>
          <Text>
            Someone broke into my house and stole 20% of my couch. Ouch!
          </Text>
        </Card.Content>
        <Divider />
        <Footer />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 16,
    backgroundColor: 'transparent',
    margin: 0,
  },
  card: {
    marginVertical: 8,
    borderRadius: 0,
  },
  cover: {
    height: 160,
    borderRadius: 0,
  },
  content: {
    marginBottom: 12,
  },
  attribution: {
    margin: 12,
  },
  author: {
    marginHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    flex: 1,
  },
});
