import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  getHeaderTitle,
  Header as ElementsHeader,
  HeaderButton,
  useHeaderHeight,
} from '@react-navigation/elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  createStackNavigator,
  createStackScreen,
  Header as StackHeader,
  type StackHeaderProps,
} from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import * as React from 'react';
import {
  Alert,
  Animated,
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
  const navigation = useNavigation('Article');
  const route = useRoute('Article');

  return (
    <ScrollView>
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
    <ScrollView>
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
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView contentContainerStyle={{ paddingTop: headerHeight }}>
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

function CustomHeader(props: StackHeaderProps) {
  const { current, next } = props.progress;

  const progress = Animated.add(current, next || 0);
  const opacity = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return (
    <>
      <StackHeader {...props} />
      <Animated.Text style={[styles.banner, { opacity }]}>
        Why hello there, pardner!
      </Animated.Text>
    </>
  );
}

const StackHeaderCustomizationNavigator = createStackNavigator({
  screenOptions: { headerMode: 'float' },
  screens: {
    Article: createStackScreen({
      screen: ArticleScreen,
      options: ({ route }) => ({
        title: `Article by ${route.params?.author}`,
        header: (props) => <CustomHeader {...props} />,
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#ff005d' },
        headerBackButtonDisplayMode: 'minimal',
        headerBackIcon: ({ tintColor }) => (
          <MaterialCommunityIcons
            name="arrow-left-circle-outline"
            color={tintColor}
            size={24}
            style={{ marginHorizontal: Platform.OS === 'ios' ? 8 : 0 }}
          />
        ),
      }),
      initialParams: { author: 'Gandalf' },
      linking: COMMON_LINKING_CONFIG.Article,
    }),
    NewsFeed: createStackScreen({
      screen: NewsFeedScreen,
      options: {
        title: 'Feed',
        headerMode: 'screen',
        header: ({ options, route, back }) => (
          <ElementsHeader
            {...options}
            back={back}
            title={getHeaderTitle(options, route.name)}
          />
        ),
      },
      linking: COMMON_LINKING_CONFIG.NewsFeed,
    }),
    Albums: createStackScreen({
      screen: AlbumsScreen,
      options: ({ theme }) => ({
        title: 'Albums',
        headerBackTitle: 'Back',
        headerTransparent: true,
        headerBackground: () => (
          <BlurView
            tint={theme.dark ? 'dark' : 'light'}
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
        ),
      }),
      linking: 'albums',
    }),
  },
}).with(({ Navigator }) => {
  const [headerTitleCentered, setHeaderTitleCentered] = React.useState(true);

  return (
    <Navigator
      screenOptions={({ route }) => {
        switch (route.name) {
          case 'Article':
            return {
              headerTitleAlign: headerTitleCentered ? 'center' : 'left',
              headerRight: ({ tintColor }) => (
                <HeaderButton
                  onPress={() => {
                    setHeaderTitleCentered((centered) => !centered);
                    Alert.alert(
                      'Never gonna give you up!',
                      'Never gonna let you down! Never gonna run around and desert you!'
                    );
                  }}
                >
                  <MaterialCommunityIcons
                    name="dots-horizontal-circle-outline"
                    size={24}
                    color={tintColor}
                  />
                </HeaderButton>
              ),
            };
          default:
            return {};
        }
      }}
    />
  );
});

export const StackHeaderCustomization = {
  screen: StackHeaderCustomizationNavigator,
  title: 'Stack - Header Customization',
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
  banner: {
    textAlign: 'center',
    color: 'tomato',
    backgroundColor: 'papayawhip',
    padding: 4,
  },
});
