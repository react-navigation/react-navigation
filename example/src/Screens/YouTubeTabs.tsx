import {
  type BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Button, Text } from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type PathConfigMap,
  useNavigation,
} from '@react-navigation/native';
import {
  createStackNavigator,
  type StackNavigationProp,
} from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';

import { useDoubleBackToExit } from '../useDoubleBackToExit';

type HomeStackParamList = {
  HomeMain: undefined;
  VideoDetails: { id: string };
};

const HomeStack = createStackNavigator<HomeStackParamList>();

function HomeMainScreen() {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const tabNavigation = useNavigation<BottomTabNavigationProp<YouTubeTabsParamList>>();

  // Wire up double-back-to-exit for this screen tree
  useDoubleBackToExit(navigation);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Home Feed</Text>
      <Text style={styles.subheading}>
        Primary tab with limitedHistory and double-press back to exit.
      </Text>
      <View style={styles.buttons}>
        <Button
          onPress={() => {
            navigation.navigate('VideoDetails', { id: 'sample-video-1' });
          }}
        >
          Open Video Details (Nested Stack)
        </Button>
        <Button
          variant="tinted"
          onPress={() => {
            tabNavigation.navigate('Shorts');
          }}
        >
          Go to Shorts
        </Button>
        <Button
          variant="tinted"
          onPress={() => {
            tabNavigation.navigate('Profile');
          }}
        >
          Go to Profile
        </Button>
      </View>
    </View>
  );
}

function VideoDetailsScreen() {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Video Details (Nested Stack)</Text>
      <Text style={styles.subheading}>
        Pressing Android Back here pops this screen first before tab history.
      </Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeMainScreen}
        options={{ title: 'Home' }}
      />
      <HomeStack.Screen
        name="VideoDetails"
        component={VideoDetailsScreen}
        options={{ title: 'Video Details' }}
      />
    </HomeStack.Navigator>
  );
}

function ShortsScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<YouTubeTabsParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Shorts</Text>
      <View style={styles.buttons}>
        <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
        <Button onPress={() => navigation.navigate('Profile')}>Go to Profile</Button>
        <Button variant="plain" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<YouTubeTabsParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <View style={styles.buttons}>
        <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
        <Button onPress={() => navigation.navigate('Shorts')}>Go to Shorts</Button>
        <Button variant="plain" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
    </View>
  );
}

export type YouTubeTabsParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Shorts: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<YouTubeTabsParamList>();

const linking: PathConfigMap<YouTubeTabsParamList> = {
  Home: {
    path: 'home',
    screens: {
      HomeMain: '',
      VideoDetails: 'video/:id',
    },
  },
  Shorts: 'shorts',
  Profile: 'profile',
};

export function YouTubeTabs() {
  return (
    <Tab.Navigator
      backBehavior="limitedHistory"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen
        name="Shorts"
        component={ShortsScreen}
        options={{ headerShown: true }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: true }}
      />
    </Tab.Navigator>
  );
}

YouTubeTabs.title = 'YouTube Style Tabs (Home-prioritized)';
YouTubeTabs.linking = linking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
  },
  buttons: {
    gap: 12,
    width: '100%',
    maxWidth: 320,
  },
});
