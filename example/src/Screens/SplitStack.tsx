import * as React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ScaledSize,
} from 'react-native';
import { Button, List } from 'react-native-paper';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';
import NewsFeed from '../Shared/NewsFeed';

type SplitStackParams = {
  Index: undefined;
  Article: { author: string };
  NewsFeed: undefined;
  Album: undefined;
};

type SplitStackNavigation = StackNavigationProp<SplitStackParams>;

const IndexScreen = () => {
  return null;
};

const ArticleScreen = ({
  navigation,
  route,
}: {
  navigation: SplitStackNavigation;
  route: RouteProp<SplitStackParams, 'Article'>;
}) => {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.buttons}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Close
        </Button>
      </View>
      <Article author={{ name: route.params.author }} scrollEnabled={false} />
    </ScrollView>
  );
};

const NewsFeedScreen = ({
  navigation,
}: {
  navigation: SplitStackNavigation;
}) => {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.buttons}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Close
        </Button>
      </View>
      <NewsFeed scrollEnabled={false} />
    </ScrollView>
  );
};

const AlbumsScreen = ({ navigation }: { navigation: SplitStackNavigation }) => {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.buttons}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Close
        </Button>
      </View>
      <Albums scrollEnabled={false} />
    </ScrollView>
  );
};

const SplitStack = createStackNavigator<SplitStackParams>();

type Props = Partial<React.ComponentProps<typeof SplitStack.Navigator>> & {
  navigation: StackNavigationProp<ParamListBase>;
};

export default function SplitStackScreen({ navigation, ...rest }: Props) {
  navigation.setOptions({
    headerShown: false,
  });

  const [width, setWidth] = React.useState(Dimensions.get('window').width);
  const isSmallScreen = React.useMemo(() => {
    return width <= 600;
  }, [width]);
  React.useEffect(() => {
    const handler = ({ window }: { window: ScaledSize }) => {
      setWidth(window.width);
    };
    Dimensions.addEventListener('change', handler);

    return () => {
      Dimensions.removeEventListener('change', handler);
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ width: isSmallScreen ? '100%' : '25%' }}>
          <List.Item
            title="Article"
            left={(props) => <List.Icon {...props} icon="newspaper" />}
            onPress={() => navigation.push('Article', { author: 'Babel fish' })}
          />

          <List.Item
            title="News Feed"
            left={(props) => <List.Icon {...props} icon="rss" />}
            onPress={() => navigation.push('NewsFeed')}
          />

          <List.Item
            title="Album"
            left={(props) => <List.Icon {...props} icon="image-album" />}
            onPress={() => navigation.push('Album')}
          />
        </View>

        <View
          style={{
            position: 'absolute',
            top: 0,
            left: isSmallScreen ? 0 : '25%',
            right: 0,
            bottom: 0,
          }}
          pointerEvents="box-none"
        >
          <SplitStack.Navigator
            mode="split"
            initialRouteName="Index"
            headerMode="none"
            {...rest}
          >
            <SplitStack.Screen name="Index" component={IndexScreen} />
            <SplitStack.Screen
              name="Article"
              component={ArticleScreen}
              initialParams={{ author: 'Gandalf' }}
            />
            <SplitStack.Screen name="NewsFeed" component={NewsFeedScreen} />
            <SplitStack.Screen name="Album" component={AlbumsScreen} />
          </SplitStack.Navigator>
        </View>
      </View>
    </View>
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
  screen: {
    backgroundColor: '#F5F5F5',
  },
});
