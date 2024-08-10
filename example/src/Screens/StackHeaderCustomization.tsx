import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  getHeaderTitle,
  Header as ElementsHeader,
  HeaderButton,
  useHeaderHeight,
} from '@react-navigation/elements';
import { type PathConfigMap } from '@react-navigation/native';
import {
  createStackNavigator,
  Header as StackHeader,
  type StackHeaderProps,
  type StackScreenProps,
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

export type HeaderCustomizationStackParams = {
  Article: { author: string };
  NewsFeed: { date: number };
  Albums: undefined;
};

const linking: PathConfigMap<HeaderCustomizationStackParams> = {
  Article: COMMON_LINKING_CONFIG.Article,
  NewsFeed: COMMON_LINKING_CONFIG.NewsFeed,
  Albums: 'albums',
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<HeaderCustomizationStackParams, 'Article'>) => {
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

const NewsFeedScreen = ({
  route,
  navigation,
}: StackScreenProps<HeaderCustomizationStackParams, 'NewsFeed'>) => {
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

const AlbumsScreen = ({
  navigation,
}: StackScreenProps<HeaderCustomizationStackParams>) => {
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

const Stack = createStackNavigator<HeaderCustomizationStackParams>();

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

export function StackHeaderCustomization() {
  const [headerTitleCentered, setHeaderTitleCentered] = React.useState(true);

  return (
    <Stack.Navigator screenOptions={{ headerMode: 'float' }}>
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params?.author}`,
          header: (props) => <CustomHeader {...props} />,
          headerTintColor: '#fff',
          headerStyle: { backgroundColor: '#ff005d' },
          headerBackButtonDisplayMode: 'minimal',
          headerTitleAlign: headerTitleCentered ? 'center' : 'left',
          headerBackImage: ({ tintColor }) => (
            <MaterialCommunityIcons
              name="arrow-left-circle-outline"
              color={tintColor}
              size={24}
              style={{ marginHorizontal: Platform.OS === 'ios' ? 8 : 0 }}
            />
          ),
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
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{
          title: 'Feed',
          headerMode: 'screen',
          header: ({ options, route, back }) => (
            <ElementsHeader
              {...options}
              back={back}
              title={getHeaderTitle(options, route.name)}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={({ theme }) => ({
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
        })}
      />
    </Stack.Navigator>
  );
}

StackHeaderCustomization.title = 'Header Customization in Stack';
StackHeaderCustomization.linking = linking;

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
