import { DefaultTheme } from '@react-navigation/native';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Pressable, StyleSheet, Text, View } from 'react-native';

export class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    onError?: (error: Error, info: React.ErrorInfo) => void;
  },
  { error: Error | null }
> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  state: { error: Error | null } = { error: null };

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>{error.message}</Text>
          <Pressable
            style={styles.button}
            onPress={() => {
              this.setState({ error: null });
            }}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    ...DefaultTheme.fonts.heavy,
    color: DefaultTheme.colors.notification,
    fontSize: 16,
  },
  button: {
    marginTop: 8,
    padding: 16,
  },
  buttonText: {
    ...DefaultTheme.fonts.medium,
    color: DefaultTheme.colors.primary,
  },
});
