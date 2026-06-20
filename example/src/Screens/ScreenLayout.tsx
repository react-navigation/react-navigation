import { Button, Text } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import {
  createStackNavigator,
  createStackScreen,
} from '@react-navigation/stack';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const createPromise = () =>
  new Promise<number>((resolve) => {
    setTimeout(() => resolve(42), 3000);
  });

type SuspenseContextType = {
  promise: Promise<number>;
  refresh: () => void;
};

const SuspenseContext = React.createContext<SuspenseContextType | undefined>(
  undefined
);

const useSuspenseContext = () => {
  const context = React.useContext(SuspenseContext);

  if (context === undefined) {
    throw new Error('SuspenseContext is missing');
  }

  return context;
};

const SuspenseDemoScreen = () => {
  const navigation = useNavigation('SuspenseDemo');

  const { promise, refresh } = useSuspenseContext();

  const [error, setError] = React.useState<Error | null>(null);

  React.use(promise);

  if (error) {
    throw error;
  }

  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => {
            refresh();
          }}
        >
          Suspend
        </Button>
        <Button
          variant="tinted"
          onPress={() => {
            setError(new Error('Something went wrong'));
          }}
        >
          Crash
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
    </ScrollView>
  );
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override state = { hasError: false };

  override render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback}>
          <Text style={styles.text}>Something went wrong</Text>
          <Button onPress={() => this.setState({ hasError: false })}>
            Try again
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

const SuspenseDemoLayout = ({ children }: { children: React.ReactNode }) => {
  const [promise, setPromise] = React.useState(createPromise);

  const value = React.useMemo(
    () => ({
      promise,
      refresh: () => setPromise(createPromise()),
    }),
    [promise]
  );

  return (
    <SuspenseContext.Provider value={value}>
      <ErrorBoundary>
        <React.Suspense
          fallback={
            <View style={styles.fallback}>
              <Text style={styles.text}>Loading…</Text>
            </View>
          }
        >
          {children}
        </React.Suspense>
      </ErrorBoundary>
    </SuspenseContext.Provider>
  );
};

const ScreenLayoutNavigator = createStackNavigator({
  screens: {
    SuspenseDemo: createStackScreen({
      screen: SuspenseDemoScreen,
      options: { title: 'Suspense & ErrorBoundary' },
      linking: 'suspense',
      layout: ({ children }) => (
        <SuspenseDemoLayout>{children}</SuspenseDemoLayout>
      ),
    }),
  },
});

export const ScreenLayout = {
  screen: ScreenLayoutNavigator,
  title: 'Screen Layout',
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    margin: 12,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    textAlign: 'center',
    margin: 12,
  },
});
