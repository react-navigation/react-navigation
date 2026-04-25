import { Button, Text } from '@react-navigation/elements';
import type { StaticParamList } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSuspenseQuery } from '@tanstack/react-query';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { queryClient } from '../queryClient';
import { ErrorBoundary } from '../Shared/ErrorBoundary';

const config = { shouldFail: false };

const debug = { wasLoadingVisible: false };

const detailQuery = (delay: number) => ({
  queryKey: ['detail-data', delay] as const,
  queryFn: () =>
    new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (config.shouldFail) {
          reject(new Error('Loader failed (toggle on)'));
        } else {
          resolve(`Loaded detail (took ${delay}ms)`);
        }
      }, delay);
    }),
});

const getDelay = (params: unknown): number =>
  (params as { delay?: number } | undefined)?.delay ?? 1000;

function HomeScreen() {
  const navigation = useNavigation<typeof LoaderStack>();

  return (
    <View style={styles.content}>
      <Text style={styles.heading}>Loader Demo</Text>
      <Text style={styles.description}>
        UNSTABLE_loader runs before the screen mounts. The screen reads via
        useSuspenseQuery, so the same fetch is shared between the loader and the
        screen through TanStack Query's cache.
      </Text>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => {
            debug.wasLoadingVisible = false;
            navigation.navigate('Detail', { delay: 10 });
          }}
          style={styles.button}
        >
          Open detail (10ms)
        </Button>
        <Button
          variant="filled"
          onPress={() => {
            debug.wasLoadingVisible = false;
            navigation.navigate('Detail', { delay: 1000 });
          }}
          style={styles.button}
        >
          Open detail (1s)
        </Button>
        <Button
          onPress={() => {
            config.shouldFail = !config.shouldFail;
          }}
          style={styles.button}
        >
          Make next load fail: {config.shouldFail ? 'on' : 'off'}
        </Button>
        <Button
          onPress={() =>
            queryClient.removeQueries({ queryKey: ['detail-data'] })
          }
          style={styles.button}
        >
          Clear cache
        </Button>
      </View>
    </View>
  );
}

function DetailScreen({ route }: { route: { params?: unknown } }) {
  const delay = getDelay(route.params);
  const { data } = useSuspenseQuery(detailQuery(delay));
  const wasLoadingVisible = React.useRef(debug.wasLoadingVisible).current;

  return (
    <View style={styles.content}>
      <Text style={styles.heading}>Detail</Text>
      <Text style={styles.description}>{data}</Text>
      <Text style={styles.description}>
        Loading state was {wasLoadingVisible ? 'visible' : 'not visible'}
      </Text>
    </View>
  );
}

function LoadingFallback() {
  debug.wasLoadingVisible = true;

  return (
    <View style={styles.content}>
      <Text style={styles.description}>Loading…</Text>
    </View>
  );
}

const LoaderStack = createNativeStackNavigator({
  layout: ({ children }) => (
    <ErrorBoundary
      onReset={() => {
        config.shouldFail = false;
        queryClient.clear();
      }}
    >
      {children}
    </ErrorBoundary>
  ),
  screenLayout: ({ children }) => (
    <React.Suspense fallback={<LoadingFallback />}>{children}</React.Suspense>
  ),
  screens: {
    LoaderHome: {
      screen: HomeScreen,
    },
    Detail: {
      screen: DetailScreen,
      linking: 'detail',
      UNSTABLE_loader: ({ params, signal }) => {
        const delay = getDelay(params);
        signal.addEventListener('abort', () => {
          queryClient.cancelQueries({ queryKey: ['detail-data', delay] });
        });
        return queryClient
          .ensureQueryData(detailQuery(delay))
          .then(() => undefined);
      },
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
