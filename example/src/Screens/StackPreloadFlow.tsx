import { Button, Text } from '@react-navigation/elements';
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {
  createStackNavigator,
  createStackScreen,
} from '@react-navigation/stack';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const DetailsScreen = () => {
  const navigation = useNavigation('StackPreloadFlowDetails');
  const route = useRoute('StackPreloadFlowDetails');

  const [isPreloaded] = useState(
    useNavigationState('StackPreloadFlowDetails', (state) => {
      const index = state.routes.findIndex((r) => r.key === route.key);

      return (
        index > state.index && !state.retainedRouteKeys.includes(route.key)
      );
    })
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
  const navigation = useNavigation('StackPreloadFlowHome');

  const [isReady, setIsReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return navigation.addListener('blur', () => {
      clearTimeout(timerRef.current);
      setIsReady(false);
    });
  }, [navigation]);

  return (
    <View style={styles.content}>
      <Text style={styles.text}>
        {isReady ? 'Details is preloaded!' : 'Details is not preloaded yet.'}
      </Text>
      <Button
        onPress={() => {
          timerRef.current = setTimeout(() => {
            setIsReady(true);
          }, 5000);

          navigation.preload('StackPreloadFlowDetails');
        }}
        style={styles.button}
      >
        Preload Details
      </Button>
      <Button
        onPress={() => navigation.navigate('StackPreloadFlowDetails')}
        style={styles.button}
      >
        Navigate to Details
      </Button>
    </View>
  );
};

const StackPreloadNavigator = createStackNavigator({
  screens: {
    StackPreloadFlowHome: createStackScreen({
      screen: HomeScreen,
      linking: '',
      options: {
        title: 'Stack Preload Flow',
      },
    }),
    StackPreloadFlowDetails: createStackScreen({
      screen: DetailsScreen,
      linking: 'details',
    }),
  },
});

export const StackPreloadFlow = {
  screen: StackPreloadNavigator,
  title: 'Stack - Preload Flow',
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
