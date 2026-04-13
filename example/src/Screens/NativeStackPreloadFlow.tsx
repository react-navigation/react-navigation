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

const usePreloadReadyTimer = () => {
  const navigation = useNavigation();

  const [isReady, setIsReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return navigation.addListener('blur', () => {
      clearTimeout(timerRef.current);
      setIsReady(false);
    });
  }, [navigation]);

  const startTimer = () => {
    timerRef.current = setTimeout(() => {
      setIsReady(true);
    }, 5000);
  };

  return [isReady, startTimer] as const;
};

const usePreloadCountdown = (
  screen:
    | 'NativeStackPreloadFlowNestedSettings'
    | 'NativeStackPreloadFlowDetails'
) => {
  const route = useRoute(screen);

  const [isPreloaded] = useState(
    useNavigationState(screen, (state) =>
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

  return [isPreloaded, loadingCountdown] as const;
};

const DetailsScreen = () => {
  const navigation = useNavigation('NativeStackPreloadFlowDetails');
  const [isPreloaded, loadingCountdown] = usePreloadCountdown(
    'NativeStackPreloadFlowDetails'
  );

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

const NestedSettingsScreen = () => {
  const navigation = useNavigation('NativeStackPreloadFlowNestedSettings');
  const [isPreloaded, loadingCountdown] = usePreloadCountdown(
    'NativeStackPreloadFlowNestedSettings'
  );

  return (
    <View style={styles.content}>
      <Text style={styles.text}>Nested Settings</Text>
      <Text style={[styles.text, styles.countdown]}>
        {loadingCountdown > 0 && loadingCountdown}
      </Text>
      <Text style={styles.text}>
        {loadingCountdown === 0 ? 'Loaded!' : 'Loading...'}
      </Text>
      <Text style={styles.text}>{isPreloaded ? 'Preloaded' : 'Fresh'}</Text>
      <Button
        onPress={() => navigation.popTo('NativeStackPreloadFlowHome')}
        style={styles.button}
      >
        Back to home
      </Button>
    </View>
  );
};

const NestedInfoScreen = () => {
  const navigation = useNavigation('NativeStackPreloadFlowNestedInfo');
  const [isSettingsReady, startSettingsTimer] = usePreloadReadyTimer();

  return (
    <View style={styles.content}>
      <Text style={styles.text}>
        {isSettingsReady
          ? 'Settings is preloaded!'
          : 'Settings is not preloaded yet.'}
      </Text>
      <Button
        onPress={() => {
          startSettingsTimer();
          navigation.navigate('NativeStackPreloadFlowNested', {
            screen: 'NativeStackPreloadFlowNestedSettings',
            preload: true,
          });
        }}
        style={styles.button}
      >
        Preload Settings
      </Button>
      <Button
        onPress={() =>
          navigation.navigate('NativeStackPreloadFlowNestedSettings')
        }
        style={styles.button}
      >
        Navigate to Settings
      </Button>
      <Button
        onPress={() => navigation.popTo('NativeStackPreloadFlowHome')}
        style={styles.button}
      >
        Back to home
      </Button>
    </View>
  );
};

const NativeStackPreloadNestedNavigator = createNativeStackNavigator({
  screens: {
    NativeStackPreloadFlowNestedInfo: createNativeStackScreen({
      screen: NestedInfoScreen,
      linking: '',
      options: {
        title: 'Nested Details',
      },
    }),
    NativeStackPreloadFlowNestedSettings: createNativeStackScreen({
      screen: NestedSettingsScreen,
      linking: 'settings',
      options: {
        title: 'Nested Settings',
      },
    }),
  },
});

const HomeScreen = () => {
  const navigation = useNavigation('NativeStackPreloadFlowHome');
  const [isDetailReady, startDetailTimer] = usePreloadReadyTimer();

  return (
    <View style={styles.content}>
      <Text style={styles.text}>
        {isDetailReady
          ? 'Details is preloaded!'
          : 'Details is not preloaded yet.'}
      </Text>
      <Button
        onPress={() => {
          startDetailTimer();
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
          navigation.preload('NativeStackPreloadFlowNested', {
            screen: 'NativeStackPreloadFlowNestedSettings',
            preload: true,
          })
        }
        style={styles.button}
      >
        Preload Nested Settings
      </Button>
      <Button
        onPress={() => navigation.navigate('NativeStackPreloadFlowNested')}
        style={styles.button}
      >
        Navigate to Nested
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
    NativeStackPreloadFlowNested: createNativeStackScreen({
      screen: NativeStackPreloadNestedNavigator,
      linking: 'nested',
      options: {
        headerShown: false,
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
