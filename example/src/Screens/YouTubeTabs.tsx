import {
  type BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Button, Text } from '@react-navigation/elements';
import {
  type PathConfigMap,
  useNavigation,
} from '@react-navigation/native';
import * as React from 'react';
import { BackHandler, Platform, StyleSheet, ToastAndroid, View } from 'react-native';

export type YouTubeTabsParamList = {
  Home: undefined;
  Shorts: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<YouTubeTabsParamList>();

function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<YouTubeTabsParamList>>();
  const [exitNotice, setExitNotice] = React.useState<string | null>(null);
  const lastPressRef = React.useRef<number | null>(null);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      lastPressRef.current = null;
      setExitNotice(null);
      navigation.goBack();
      return;
    }

    const now = Date.now();
    if (lastPressRef.current != null && now - lastPressRef.current <= 2000) {
      lastPressRef.current = null;
      setExitNotice('Exited app!');
      if (Platform.OS === 'android') {
        BackHandler.exitApp();
      } else {
        alert('App exited!');
      }
      return;
    }

    lastPressRef.current = now;
    setExitNotice('Press back again to exit');
    if (Platform.OS === 'android') {
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
    }
    setTimeout(() => {
      setExitNotice((curr) => (curr === 'Press back again to exit' ? null : curr));
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Home Feed</Text>
      <Text style={styles.subheading}>
        Primary tab with limitedHistory (capped at 2 per tab)
      </Text>
      <View style={styles.buttons}>
        <Button
          variant="tinted"
          onPress={() => {
            navigation.navigate('Shorts');
          }}
        >
          Go to Shorts
        </Button>
        <Button
          variant="tinted"
          onPress={() => {
            navigation.navigate('Profile');
          }}
        >
          Go to Profile
        </Button>
        <Button variant="plain" onPress={handleGoBack}>
          Go back
        </Button>
      </View>
      {exitNotice ? (
        <Text style={styles.exitNotice}>{exitNotice}</Text>
      ) : null}
    </View>
  );
}

function ShortsScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<YouTubeTabsParamList>>();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Shorts</Text>
      <View style={styles.buttons}>
        <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
        <Button onPress={() => navigation.navigate('Profile')}>Go to Profile</Button>
        <Button variant="plain" onPress={handleGoBack}>
          Go back
        </Button>
      </View>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<YouTubeTabsParamList>>();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <View style={styles.buttons}>
        <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
        <Button onPress={() => navigation.navigate('Shorts')}>Go to Shorts</Button>
        <Button variant="plain" onPress={handleGoBack}>
          Go back
        </Button>
      </View>
    </View>
  );
}

const linking: PathConfigMap<YouTubeTabsParamList> = {
  Home: 'home',
  Shorts: 'shorts',
  Profile: 'profile',
};

export function YouTubeTabs() {
  return (
    <Tab.Navigator
      backBehavior="limitedHistory"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shorts" component={ShortsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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
    fontSize: 22,
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
  exitNotice: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});
