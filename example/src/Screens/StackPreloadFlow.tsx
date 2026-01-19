import { Button, Text } from '@react-navigation/elements';
import type {
  NavigatorScreenParams,
  PathConfig,
  StaticScreenProps,
} from '@react-navigation/native';
import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type PreloadStackParamList = {
  Home: undefined;
  Details: undefined;
};

const linking = {
  screens: {
    Home: '',
    Details: 'details',
  },
} satisfies PathConfig<NavigatorScreenParams<PreloadStackParamList>>;

const DetailsScreen = ({
  navigation,
}: StackScreenProps<PreloadStackParamList, 'Details'>) => {
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
}: StackScreenProps<PreloadStackParamList, 'Home'>) => {
  const { navigate, preload } = navigation;

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

const SimpleStack = createStackNavigator<PreloadStackParamList>();

export function StackPreloadFlow(
  _: StaticScreenProps<NavigatorScreenParams<PreloadStackParamList>>
) {
  return (
    <SimpleStack.Navigator>
      <SimpleStack.Screen name="Home" component={HomeScreen} />
      <SimpleStack.Screen name="Details" component={DetailsScreen} />
    </SimpleStack.Navigator>
  );
}

StackPreloadFlow.title = 'Preloading flow for Stack';
StackPreloadFlow.linking = linking;

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
