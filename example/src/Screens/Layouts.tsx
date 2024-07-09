import { Button, Text } from '@react-navigation/elements';
import type { PathConfigMap } from '@react-navigation/native';
import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export type LayoutsStackParams = {
  SuspenseDemo: undefined;
};

const linking: PathConfigMap<LayoutsStackParams> = {
  SuspenseDemo: 'suspense',
};

let cached: number | undefined;

const createPromise = () =>
  new Promise<number>((resolve) => {
    setTimeout(() => resolve(42), 1000);
  }).then((result) => {
    cached = result;
    return result;
  });

const SuspenseDemoScreen = ({
  navigation,
}: StackScreenProps<LayoutsStackParams, 'SuspenseDemo'>) => {
  const [promise, setPromise] = React.useState(createPromise);
  const [error, setError] = React.useState<Error | null>(null);

  // Naive implementation for suspense intended for demo purposes
  // We need to suspend when there's no cached value by throwing a promise
  if (cached == null) {
    throw promise;
  }

  if (error) {
    throw error;
  }

  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => {
            cached = undefined;
            setPromise(createPromise());
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

  state = { hasError: false };

  render() {
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

const Stack = createStackNavigator<LayoutsStackParams>();

export function ScreenLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SuspenseDemo"
        component={SuspenseDemoScreen}
        options={{ title: 'Suspense & ErrorBoundary' }}
        layout={({ children }) => (
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
        )}
      />
    </Stack.Navigator>
  );
}

ScreenLayout.title = 'Screen Layout';
ScreenLayout.linking = linking;

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
