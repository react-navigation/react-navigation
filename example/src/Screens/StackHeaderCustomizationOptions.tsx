import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import type { ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
  useHeaderHeight,
  StackHeaderProps,
} from '@react-navigation/stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';

type SimpleStackParams = {
  Article: { author: string };
  Albums: undefined;
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<SimpleStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Albums')}
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
      <Article
        author={{ name: route.params.author }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

const AlbumsScreen = ({ navigation }: StackScreenProps<SimpleStackParams>) => {
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView contentContainerStyle={{ paddingTop: headerHeight }}>
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
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

interface HeaderOptions {
  subtitle?: string;
}

const SimpleStack = createStackNavigator<SimpleStackParams, HeaderOptions>();

function CustomHeader(props: StackHeaderProps<HeaderOptions>) {
  const { title, subtitle } = props.scene.descriptor.options;

  return (
    <View>
      <Text>{title}</Text>
      <Text>{subtitle}</Text>
    </View>
  );
}

type Props = Partial<React.ComponentProps<typeof SimpleStack.Navigator>> &
  StackScreenProps<ParamListBase>;

export default function SimpleStackScreen({ navigation, ...rest }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SimpleStack.Navigator
      {...rest}
      screenOptions={{ header: (props) => <CustomHeader {...props} /> }}
    >
      <SimpleStack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: 'Article',
          subtitle: route.params.author,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <SimpleStack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          title: 'Albums',
        }}
      />
    </SimpleStack.Navigator>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
