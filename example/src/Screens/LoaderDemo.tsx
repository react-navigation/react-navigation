import { Button, Text } from '@react-navigation/elements';
import type { StaticParamList } from '@react-navigation/native';
import {
  UNSTABLE_getLoaderForRoute,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

const cache = new Map<string, { data: string; promise?: Promise<void> }>();

function fetchData(key: string, delay: number): Promise<void> {
  const existing = cache.get(key);

  if (existing) {
    return existing.promise ?? Promise.resolve();
  }

  const entry: { data: string; promise?: Promise<void> } = {
    data: '',
  };

  entry.promise = new Promise<void>((resolve) => {
    setTimeout(() => {
      entry.data = `Loaded "${key}" (took ${delay}ms)`;
      entry.promise = undefined;
      resolve();
    }, delay);
  });

  cache.set(key, entry);

  return entry.promise;
}

function useData(key: string, delay: number): string | undefined {
  const entry = cache.get(key);

  if (!entry || entry.promise) {
    const promise = fetchData(key, delay);
    React.use(promise);
  }

  return entry?.data;
}

function HomeScreen() {
  return (
    <View style={styles.content}>
      <Text style={styles.heading}>Loader Demo</Text>
      <Text style={styles.description}>
        UNSTABLE_getLoaderForRoute can prefetch data for a route before
        navigating to it. This avoids showing Suspense fallbacks if not desired.
      </Text>
      <NavigateButtons />
    </View>
  );
}

function NavigateButtons() {
  const navigation = useNavigation<typeof LoaderStack>();

  const handleNavigateWithLoader = React.useCallback(() => {
    const loader = UNSTABLE_getLoaderForRoute(LoaderStack, {
      name: 'Detail',
    });

    React.startTransition(async () => {
      await loader?.();
      navigation.navigate('Detail');
    });
  }, [navigation]);

  const handleNavigateWithoutLoader = React.useCallback(() => {
    cache.delete('detail-data');
    navigation.navigate('Detail');
  }, [navigation]);

  const handleReset = React.useCallback(() => {
    cache.clear();
  }, []);

  return (
    <View style={styles.buttons}>
      <Button
        variant="filled"
        onPress={handleNavigateWithLoader}
        style={styles.button}
      >
        Navigate with loader
      </Button>
      <Button onPress={handleNavigateWithoutLoader} style={styles.button}>
        Navigate without loader
      </Button>
      <Button onPress={handleReset} style={styles.button}>
        Clear cache
      </Button>
    </View>
  );
}

function DetailContent() {
  const data = useData('detail-data', 1000);

  return (
    <View style={styles.content}>
      <Text style={styles.heading}>Detail</Text>
      <Text style={styles.description}>{data}</Text>
    </View>
  );
}

function DetailScreen() {
  return (
    <React.Suspense
      fallback={
        <View style={styles.content}>
          <Text style={styles.description}>Loading…</Text>
        </View>
      }
    >
      <DetailContent />
    </React.Suspense>
  );
}

const LoaderStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Detail: {
      screen: DetailScreen,
      linking: 'detail',
      UNSTABLE_loader: () => fetchData('detail-data', 1000),
    },
  },
});

export type LoaderDemoParamList = StaticParamList<typeof LoaderStack>;

export const LoaderDemo = {
  screen: LoaderStack,
  title: 'Misc - Loader Demo',
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  buttons: {
    gap: 12,
    alignItems: 'center',
  },
  button: {
    minWidth: 220,
  },
});
