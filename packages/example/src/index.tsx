import * as React from 'react';
import {
  View,
  Text,
  Platform,
  AsyncStorage,
  YellowBox,
  StyleSheet,
} from 'react-native';
import { Button } from 'react-native-paper';
import {
  NavigationContainer,
  CompositeNavigationProp,
  NavigationHelpers,
  RouteProp,
  InitialState,
  useFocusEffect,
} from '@navigation-ex/core';
import createStackNavigator, {
  StackNavigationProp,
} from '@navigation-ex/stack';
import createMaterialTopTabNavigator, {
  MaterialTopTabNavigationProp,
} from '@navigation-ex/material-top-tabs';

type StackParamList = {
  first: { author: string };
  second: undefined;
  third: undefined;
};

type TabParamList = {
  fourth: undefined;
  fifth: undefined;
};

YellowBox.ignoreWarnings(['Require cycle:', 'Warning: Async Storage']);

const Stack = createStackNavigator<StackParamList>();

const Tab = createMaterialTopTabNavigator<TabParamList>();

const First = ({
  navigation,
  route,
}: {
  navigation: CompositeNavigationProp<
    StackNavigationProp<StackParamList, 'first'>,
    NavigationHelpers<TabParamList>
  >;
  route: RouteProp<StackParamList, 'first'>;
}) => {
  const updateTitle = React.useCallback(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    document.title = `${route.name} (${route.params.author})`;

    return () => {
      document.title = '';
    };
  }, [route.name, route.params.author]);

  useFocusEffect(updateTitle);

  return (
    <View>
      <Text style={styles.title}>First, {route.params.author}</Text>
      <Button onPress={() => navigation.push('second')}>Push second</Button>
      <Button onPress={() => navigation.push('third')}>Push third</Button>
      <Button onPress={() => navigation.navigate('fourth')}>
        Navigate to fourth
      </Button>
      <Button onPress={() => navigation.navigate('first', { author: 'John' })}>
        Navigate with params
      </Button>
      <Button onPress={() => navigation.pop()}>Pop</Button>
    </View>
  );
};

const Second = ({
  navigation,
}: {
  navigation: CompositeNavigationProp<
    StackNavigationProp<StackParamList, 'second'>,
    NavigationHelpers<TabParamList>
  >;
}) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => setCount(c => c + 1), 1000);

    return () => clearInterval(timer);
  }, []);

  navigation.setOptions({
    title: `Count ${count}`,
  });

  return (
    <View>
      <Text style={styles.title}>Second</Text>
      <Button onPress={() => navigation.push('first', { author: 'Joel' })}>
        Push first
      </Button>
      <Button onPress={() => navigation.pop()}>Pop</Button>
    </View>
  );
};

const Fourth = ({
  navigation,
}: {
  navigation: CompositeNavigationProp<
    MaterialTopTabNavigationProp<TabParamList, 'fourth'>,
    StackNavigationProp<StackParamList>
  >;
}) => (
  <View>
    <Text style={styles.title}>Fourth</Text>
    <Button onPress={() => navigation.jumpTo('fifth')}>Jump to fifth</Button>
    <Button onPress={() => navigation.push('first', { author: 'Jake' })}>
      Push first
    </Button>
    <Button onPress={() => navigation.goBack()}>Go back</Button>
  </View>
);

const Fifth = ({
  navigation,
}: {
  navigation: CompositeNavigationProp<
    MaterialTopTabNavigationProp<TabParamList, 'fifth'>,
    StackNavigationProp<StackParamList>
  >;
}) => (
  <View>
    <Text style={styles.title}>Fifth</Text>
    <Button onPress={() => navigation.jumpTo('fourth')}>Jump to fourth</Button>
    <Button onPress={() => navigation.push('second')}>Push second</Button>
    <Button onPress={() => navigation.pop()}>Pop</Button>
  </View>
);

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  React.useEffect(() => {
    AsyncStorage.getItem(PERSISTENCE_KEY).then(
      data => {
        try {
          const result = JSON.parse(data || '');

          if (result) {
            setInitialState(result);
          }
        } finally {
          setIsReady(true);
        }
      },
      () => setIsReady(true)
    );
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={state =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <Stack.Navigator>
        <Stack.Screen
          name="first"
          component={First}
          options={({ route }) => ({
            title: `Foo (${route.params ? route.params.author : ''})`,
          })}
          initialParams={{ author: 'Jane' }}
        />
        <Stack.Screen name="second" options={{ title: 'Bar' }}>
          {props => <Second {...props} />}
        </Stack.Screen>
        <Stack.Screen name="third" options={{ title: 'Baz' }}>
          {() => (
            <Tab.Navigator initialRouteName="fifth">
              <Tab.Screen
                name="fourth"
                component={Fourth}
                options={{ title: 'This' }}
              />
              <Tab.Screen
                name="fifth"
                component={Fifth}
                options={{ title: 'That' }}
              />
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
