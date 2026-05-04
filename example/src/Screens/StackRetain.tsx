import { Button, Text } from '@react-navigation/elements';
import {
  useNavigation,
  useNavigationState,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const HomeScreen = () => {
  const navigation = useNavigation('RetainHome');
  const { colors } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <Button
        variant="filled"
        onPress={() => navigation.navigate('RetainCounter')}
      >
        Let's Go!
      </Button>
    </ScrollView>
  );
};

const CounterScreen = () => {
  const [count, setCount] = React.useState(0);
  const { colors } = useTheme();

  const navigation = useNavigation('RetainCounter');

  const route = useRoute('RetainCounter');
  const isRetained = useNavigationState('RetainCounter', (state) =>
    state.retainedRouteKeys.includes(route.key)
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={{ alignItems: 'center', gap: 16 }}>
        <Text
          style={{
            fontSize: 24,
            position: 'absolute',
            bottom: 24,
            right: 0,
          }}
        >
          {isRetained ? '📌' : ''}
        </Text>
        <Text style={{ fontSize: 48, fontVariant: ['tabular-nums'] }}>
          {count}
        </Text>
        <Button
          onPress={() => {
            setCount(3);
            navigation.retain(isRetained ? false : true);
          }}
        >
          {isRetained ? 'Unretain' : 'Retain'}
        </Button>
      </View>
    </ScrollView>
  );
};

const StackRetainNavigator = createStackNavigator({
  screens: {
    RetainHome: {
      screen: HomeScreen,
      options: {
        title: 'Home',
      },
    },
    RetainCounter: {
      screen: CounterScreen,
      options: {
        title: 'Counter',
        headerBackTestID: 'Go back',
      },
    },
  },
});

export const StackRetain = {
  screen: StackRetainNavigator,
  title: 'Stack - Retain',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
