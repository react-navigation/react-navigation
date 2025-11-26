import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, HeaderBackButton, Text } from '@react-navigation/elements';
import type {
  NavigatorScreenParams,
  PathConfigMap,
  StaticScreenProps,
} from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type PreloadBottomTabsParams = {
  Home: undefined;
  Details: undefined;
};

const linking: PathConfigMap<PreloadBottomTabsParams> = {
  Home: '',
  Details: 'details',
};

const DetailsScreen = ({
  navigation,
}: BottomTabScreenProps<PreloadBottomTabsParams, 'Details'>) => {
  const [loadingCountdown, setLoadingCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingCountdown((loadingCountdown) => {
        if (loadingCountdown === 1) {
          clearInterval(interval);
        }

        return loadingCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.content}>
      <Text style={[styles.text, styles.countdown]}>
        {loadingCountdown > 0 && loadingCountdown}
      </Text>
      <Text style={styles.text}>
        {loadingCountdown === 0 ? 'Loaded!' : 'Loading...'}
      </Text>
      <Button onPress={navigation.goBack} style={styles.button}>
        Back to home
      </Button>
    </View>
  );
};

const HomeScreen = ({
  navigation,
}: BottomTabScreenProps<PreloadBottomTabsParams, 'Home'>) => {
  const { navigate, preload } = navigation;

  const [isReady, setIsReady] = useState(false);

  return (
    <View style={styles.content}>
      <Text style={styles.text}>
        {isReady ? 'Details is preloaded!' : 'Details is not preloaded yet.'}
      </Text>
      <Button
        onPress={() => {
          setTimeout(() => {
            setIsReady(true);
          }, 3000);

          preload('Details');
        }}
        style={styles.button}
      >
        Preload Details
      </Button>
      <Button onPress={() => navigate('Details')} style={styles.button}>
        Navigate to Details
      </Button>
    </View>
  );
};

const BottomsTabs = createBottomTabNavigator<PreloadBottomTabsParams>();

export function TabPreloadFlow(
  _: StaticScreenProps<NavigatorScreenParams<PreloadBottomTabsParams>>
) {
  return (
    <BottomsTabs.Navigator
      screenOptions={({
        navigation,
      }: BottomTabScreenProps<PreloadBottomTabsParams>) => ({
        headerShown: true,
        headerLeft: (props) => (
          <HeaderBackButton {...props} onPress={navigation.goBack} />
        ),
      })}
    >
      <BottomsTabs.Screen name="Home" component={HomeScreen} />
      <BottomsTabs.Screen name="Details" component={DetailsScreen} />
    </BottomsTabs.Navigator>
  );
}

TabPreloadFlow.title = 'Preloading flow for Bottom Tabs';
TabPreloadFlow.linking = linking;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  button: {
    margin: 8,
  },
  text: {
    textAlign: 'center',
    margin: 8,
  },
  countdown: {
    fontSize: 24,
    minHeight: 32,
  },
});
