import * as React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
// eslint-disable-next-line import/no-unresolved
import { enableScreens } from 'react-native-screens';
import {
  RouteProp,
  ParamListBase,
  useFocusEffect,
  useTheme,
} from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Albums from '../Shared/Albums';

type NativeStackParams = {
  Article: { author: string };
  Album: undefined;
};

type NativeStackNavigation = NativeStackNavigationProp<NativeStackParams>;

const Title = ({ children }: { children: React.ReactNode }) => {
  const { colors } = useTheme();

  return <Text style={[styles.title, { color: colors.text }]}>{children}</Text>;
};

const Paragraph = ({ children }: { children: React.ReactNode }) => {
  const { colors } = useTheme();

  return (
    <Text style={[styles.paragraph, { color: colors.text }]}>{children}</Text>
  );
};

const ArticleScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigation;
  route: RouteProp<NativeStackParams, 'Article'>;
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: colors.card }}
      contentContainerStyle={styles.content}
    >
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Album')}
          style={styles.button}
        >
          Push album
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <Title>What is Lorem Ipsum?</Title>
      <Paragraph>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </Paragraph>
      <Title>Where does it come from?</Title>
      <Paragraph>
        Contrary to popular belief, Lorem Ipsum is not simply random text. It
        has roots in a piece of classical Latin literature from 45 BC, making it
        over 2000 years old. Richard McClintock, a Latin professor at
        Hampden-Sydney College in Virginia, looked up one of the more obscure
        Latin words, consectetur, from a Lorem Ipsum passage, and going through
        the cites of the word in classical literature, discovered the
        undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33
        of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and
        Evil) by Cicero, written in 45 BC. This book is a treatise on the theory
        of ethics, very popular during the Renaissance. The first line of Lorem
        Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in
        section 1.10.32.
      </Paragraph>
      <Paragraph>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced
        below for those interested. Sections 1.10.32 and 1.10.33 from &quot;de
        Finibus Bonorum et Malorum&quot; by Cicero are also reproduced in their
        exact original form, accompanied by English versions from the 1914
        translation by H. Rackham.
      </Paragraph>
      <Title>Why do we use it?</Title>
      <Paragraph>
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters, as opposed to using &quot;Content here, content here&quot;,
        making it look like readable English. Many desktop publishing packages
        and web page editors now use Lorem Ipsum as their default model text,
        and a search for &quot;lorem ipsum&quot; will uncover many web sites
        still in their infancy. Various versions have evolved over the years,
        sometimes by accident, sometimes on purpose (injected humour and the
        like).
      </Paragraph>
      <Title>Where can I get some?</Title>
      <Paragraph>
        There are many variations of passages of Lorem Ipsum available, but the
        majority have suffered alteration in some form, by injected humour, or
        randomised words which don&apos;t look even slightly believable. If you
        are going to use a passage of Lorem Ipsum, you need to be sure there
        isn&apos;t anything embarrassing hidden in the middle of text. All the
        Lorem Ipsum generators on the Internet tend to repeat predefined chunks
        as necessary, making this the first true generator on the Internet. It
        uses a dictionary of over 200 Latin words, combined with a handful of
        model sentence structures, to generate Lorem Ipsum which looks
        reasonable. The generated Lorem Ipsum is therefore always free from
        repetition, injected humour, or non-characteristic words etc.
      </Paragraph>
    </ScrollView>
  );
};

const AlbumsScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigation;
}) => (
  <ScrollView>
    <View style={styles.buttons}>
      <Button
        mode="contained"
        onPress={() => navigation.push('Article', { author: 'Babel fish' })}
        style={styles.button}
      >
        Push article
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go back
      </Button>
    </View>
    <Albums scrollEnabled={false} />
  </ScrollView>
);

const NativeStack = createNativeStackNavigator<NativeStackParams>();

type Props = {
  navigation: StackNavigationProp<ParamListBase>;
};

export default function NativeStackScreen({ navigation }: Props) {
  navigation.setOptions({
    headerShown: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      const drawer = navigation.dangerouslyGetParent() as DrawerNavigationProp<
        ParamListBase
      >;

      navigation.setOptions({ gestureEnabled: false });
      drawer.setOptions({ gestureEnabled: false });

      return () => {
        navigation.setOptions({ gestureEnabled: true });
        drawer.setOptions({ gestureEnabled: true });
      };
    }, [navigation])
  );

  return (
    <NativeStack.Navigator>
      <NativeStack.Screen
        name="Article"
        component={ArticleScreen}
        options={{
          title: 'Lorem Ipsum',
          headerLargeTitle: true,
          headerHideShadow: true,
        }}
      />
      <NativeStack.Screen
        name="Album"
        component={AlbumsScreen}
        options={{ title: 'Album' }}
      />
    </NativeStack.Navigator>
  );
}

enableScreens(true);

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    padding: 8,
  },
  button: {
    margin: 8,
  },
  content: {
    paddingVertical: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
