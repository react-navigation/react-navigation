import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  getHeaderTitle,
  Header,
  HeaderButton,
} from '@react-navigation/elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = () => {
  const route = useRoute('Article');
  const navigation = useNavigation('Article');

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.push('NewsFeed', { date: Date.now() })}
        >
          Push feed
        </Button>
        <Button variant="tinted" onPress={() => navigation.pop()}>
          Pop screen
        </Button>
      </View>
      <Article
        author={{ name: route.params?.author ?? 'Unknown' }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

const NewsFeedScreen = () => {
  const route = useRoute('NewsFeed');
  const navigation = useNavigation('NewsFeed');

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Push albums
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} date={route.params.date} />
    </ScrollView>
  );
};

const AlbumsScreen = () => {
  const navigation = useNavigation('Albums');
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() =>
            navigation.navigate('Article', { author: 'Babel fish' })
          }
        >
          Navigate to article
        </Button>
        <Button variant="tinted" onPress={() => navigation.pop(2)}>
          Pop by 2
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const onPress = () => {
  Alert.alert(
    'Never gonna give you up!',
    'Never gonna let you down! Never gonna run around and desert you!'
  );
};

const NativeStackHeaderCustomizationNavigator = createNativeStackNavigator({
  screens: {
    Article: createNativeStackScreen({
      screen: ArticleScreen,
      options: ({ route, navigation }) => ({
        title: `Article byyyy ${route.params?.author ?? 'Unknown'}`,
        headerTintColor: 'white',
        headerTitle: ({ tintColor }) => (
          <HeaderButton onPress={onPress}>
            <MaterialCommunityIcons
              name="signal-5g"
              size={24}
              color={tintColor}
            />
          </HeaderButton>
        ),
        headerLeft: ({ tintColor, canGoBack }) =>
          canGoBack ? (
            <HeaderButton onPress={navigation.goBack}>
              <MaterialCommunityIcons
                name="arrow-left-thick"
                size={24}
                color={tintColor}
              />
            </HeaderButton>
          ) : null,
        headerRight: ({ tintColor }) => (
          <HeaderButton onPress={onPress}>
            <MaterialCommunityIcons name="music" size={24} color={tintColor} />
          </HeaderButton>
        ),
        headerBackground: () => (
          <Image
            source={require('../../assets/misc/cpu.jpg')}
            resizeMode="cover"
            style={styles.headerBackground}
          />
        ),
      }),
      initialParams: { author: 'Gandalf' },
      linking: COMMON_LINKING_CONFIG.Article,
    }),
    NewsFeed: createNativeStackScreen({
      screen: NewsFeedScreen,
      options: {
        title: 'Feed',
        header: ({ options, route, back }) => (
          <Header
            {...options}
            back={back}
            title={getHeaderTitle(options, route.name)}
          />
        ),
      },
      linking: COMMON_LINKING_CONFIG.NewsFeed,
    }),
    Albums: createNativeStackScreen({
      screen: AlbumsScreen,
      options: {
        title: 'Albums',
        headerTintColor: 'tomato',
        headerStyle: { backgroundColor: 'papayawhip' },
        headerBackVisible: true,
        headerLeft: ({ tintColor }) => (
          <HeaderButton onPress={onPress}>
            <MaterialCommunityIcons name="music" size={24} color={tintColor} />
          </HeaderButton>
        ),
      },
    }),
  },
});

export const NativeStackHeaderCustomization = {
  screen: NativeStackHeaderCustomizationNavigator,
  title: 'Native Stack - Header Customization',
  options: {
    gestureEnabled: false,
  },
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
  headerBackground: {
    height: 'auto',
    width: 'auto',
    flex: 1,
  },
});
