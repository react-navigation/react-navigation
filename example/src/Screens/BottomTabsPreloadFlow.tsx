import {
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import { Button, HeaderBackButton, Text } from '@react-navigation/elements';
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const DetailsScreen = () => {
  const navigation = useNavigation('BottomTabsPreloadFlowDetails');
  const route = useRoute('BottomTabsPreloadFlowDetails');

  const [isPreloaded] = useState(
    useNavigationState('BottomTabsPreloadFlowDetails', (state) =>
      state.preloadedRouteKeys.includes(route.key)
    )
  );

  const [loadingCountdown, setLoadingCountdown] = useState(3);

  useEffect(() => {
    if (loadingCountdown === 0) {
      return;
    }

    const timer = setTimeout(
      () => setLoadingCountdown(loadingCountdown - 1),
      1000
    );

    return () => clearTimeout(timer);
  }, [loadingCountdown]);

  return (
    <View style={styles.content}>
      <Text style={[styles.text, styles.countdown]}>
        {loadingCountdown > 0 && loadingCountdown}
      </Text>
      <Text style={styles.text}>
        {loadingCountdown === 0 ? 'Loaded!' : 'Loading...'}
      </Text>
      <Text style={styles.text}>{isPreloaded ? 'Preloaded' : 'Fresh'}</Text>
      <Button onPress={navigation.goBack} style={styles.button}>
        Back to home
      </Button>
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation('BottomTabsPreloadFlowHome');

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
          }, 2000);

          navigation.preload('BottomTabsPreloadFlowDetails');
        }}
        style={styles.button}
      >
        Preload Details
      </Button>
      <Button
        onPress={() => navigation.navigate('BottomTabsPreloadFlowDetails')}
        style={styles.button}
      >
        Navigate to Details
      </Button>
    </View>
  );
};

const BottomTabsPreloadNavigator = createBottomTabNavigator({
  screenOptions: ({ navigation }) => ({
    headerShown: true,
    headerLeft: (props) => (
      <HeaderBackButton {...props} onPress={navigation.goBack} />
    ),
  }),
  screens: {
    BottomTabsPreloadFlowHome: createBottomTabScreen({
      screen: HomeScreen,
      linking: '',
      options: {
        title: 'Bottom Tabs Preload Flow',
      },
    }),
    BottomTabsPreloadFlowDetails: createBottomTabScreen({
      screen: DetailsScreen,
    }),
  },
});

export const BottomTabsPreloadFlow = {
  screen: BottomTabsPreloadNavigator,
  title: 'Bottom Tabs - Preload Flow',
};

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
