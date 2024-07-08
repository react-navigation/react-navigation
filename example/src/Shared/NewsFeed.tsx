import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { PlatformPressable, Text } from '@react-navigation/elements';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import {
  Image,
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Divider } from './Divider';

type Props = Partial<ScrollViewProps> & {
  date?: number;
};

const Card = ({ children }: { children: React.ReactNode }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {children}
    </View>
  );
};

const FooterIcon = ({
  icon,
  size = 16,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  size?: number;
}) => {
  const { colors } = useTheme();

  return (
    <PlatformPressable style={styles.icon}>
      <MaterialCommunityIcons name={icon} size={size} color={colors.text} />
    </PlatformPressable>
  );
};

const Author = () => {
  return (
    <View style={[styles.row, styles.attribution]}>
      <Image
        source={require('../../assets/avatar-1.png')}
        style={styles.avatar}
      />
      <Text style={styles.author}>Joke bot</Text>
    </View>
  );
};

const Footer = () => {
  return (
    <View style={styles.row}>
      <FooterIcon icon="heart-outline" />
      <FooterIcon icon="comment-outline" />
      <FooterIcon icon="share-outline" />
    </View>
  );
};

export function NewsFeed(props: Props) {
  const ref = React.useRef<ScrollView>(null);

  useScrollToTop(ref);

  const { colors } = useTheme();

  return (
    <ScrollView ref={ref} {...props}>
      <Card>
        <TextInput
          placeholder="What's on your mind?"
          placeholderTextColor={Color(colors.text).alpha(0.5).rgb().string()}
          style={styles.input}
        />
      </Card>
      <Card>
        <Author />
        <View style={styles.content}>
          <Text>
            If you aren&apos;t impressed with the picture of the first Black
            Hole, you clearly don&apos;t understand the gravity of the
            situation.
          </Text>
        </View>
        <Divider />
        <Footer />
      </Card>
      <Card>
        <Author />
        <View style={styles.content}>
          <Text>
            I went to the zoo and I saw a baguette in a cage. I asked the
            zookeeper about it and he said it was bread in captivity.
          </Text>
        </View>
        <Image source={require('../../assets/book.jpg')} style={styles.cover} />
        <Footer />
      </Card>
      <Card>
        <Author />
        <View style={styles.content}>
          <Text>Why didn&apos;t 4 ask 5 out? Because he was 2².</Text>
        </View>
        <Divider />
        <Footer />
      </Card>
      <Card>
        <Author />
        <View style={styles.content}>
          <Text>
            What did Master Yoda say when he first saw himself in 4k? HDMI.
          </Text>
        </View>
        <Divider />
        <Footer />
      </Card>
      <Card>
        <Author />
        <View style={styles.content}>
          <Text>
            Someone broke into my house and stole 20% of my couch. Ouch!
          </Text>
        </View>
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
    elevation: 1,
  },
  cover: {
    height: 160,
    borderRadius: 0,
  },
  content: {
    marginBottom: 12,
    marginHorizontal: 12,
  },
  attribution: {
    margin: 12,
  },
  avatar: {
    width: 32,
    height: 'auto',
    aspectRatio: 1,
    borderRadius: 16,
  },
  author: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
});
