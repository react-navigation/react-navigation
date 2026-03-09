import { Button, Text } from '@react-navigation/elements';
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const DetailsScreen = () => {
  const navigation = useNavigation('NativeStackPreloadFlowDetails');
  const route = useRoute('NativeStackPreloadFlowDetails');

  const [isPreloaded] = useState(
    useNavigationState('NativeStackPreloadFlowDetails', (state) =>
      state.preloadedRoutes.some((r) => r.key === route.key)
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

const NestedScreen = () => {
  const route = useRoute('NativeStackPreloadFlowNested');

  const [isPreloaded] = useState(
    useNavigationState('NativeStackPreloadFlowNested', (state) =>
      state.preloadedRoutes.some((r) => r.key === route.key)
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
        {loadingCountdown === 0 ? 'Nested Loaded!' : 'Nested Loading...'}
      </Text>
      <Text style={styles.text}>
        {isPreloaded ? 'Nested Preloaded' : 'Nested Fresh'}
      </Text>
    </View>
  );
};

const NestedDefaultScreen = () => {
  const navigation = useNavigation('NativeStackPreloadFlowNestedDefault');

  return (
    <View style={styles.content}>
      <Text style={styles.text}>Nested default screen</Text>
      <Button
        onPress={() =>
          navigation.navigate('NativeStackPreloadFlowNested')
        }
        style={styles.button}
      >
        Go to Nested
      </Button>
    </View>
  );
};

const DetailsWithNestedNavigator = createNativeStackNavigator({
  screens: {
    NativeStackPreloadFlowNestedDefault: createNativeStackScreen({
      screen: NestedDefaultScreen,
      options: { headerShown: false },
    }),
    NativeStackPreloadFlowNested: createNativeStackScreen({
      screen: NestedScreen,
      options: { headerShown: false },
    }),
  },
});

const HomeScreen = () => {
  const navigation = useNavigation('NativeStackPreloadFlowHome');

  const [isReady, setIsReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

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

          navigation.preload('NativeStackPreloadFlowDetails');
        }}
        style={styles.button}
      >
        Preload Details
      </Button>
      <Button
        onPress={() => navigation.navigate('NativeStackPreloadFlowDetails')}
        style={styles.button}
      >
        Navigate to Details
      </Button>
      <Button
        onPress={() =>
          navigation.navigate('NativeStackPreloadFlowDetailsNested', {
            screen: 'NativeStackPreloadFlowNested',
            preload: true,
          })
        }
        style={styles.button}
      >
        Navigate with Nested Preload
      </Button>
    </View>
  );
};

const NativeStackPreloadNavigator = createNativeStackNavigator({
  screens: {
    NativeStackPreloadFlowHome: createNativeStackScreen({
      screen: HomeScreen,
      linking: '',
      options: {
        title: 'Native Stack Preload Flow',
      },
    }),
    NativeStackPreloadFlowDetails: createNativeStackScreen({
      screen: DetailsScreen,
    }),
    NativeStackPreloadFlowDetailsNested: createNativeStackScreen({
      screen: DetailsWithNestedNavigator,
      options: {
        title: 'Details with Nested',
      },
    }),
  },
});

export const NativeStackPreloadFlow = {
  screen: NativeStackPreloadNavigator,
  title: 'Native Stack - Preload Flow',
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
