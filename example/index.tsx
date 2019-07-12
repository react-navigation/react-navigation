import * as React from 'react';
import { render } from 'react-dom';
import {
  NavigationContainer,
  Screen,
  CompositeNavigationProp,
  TypedNavigator,
  NavigationHelpers,
  InitialState,
} from '../src';
import StackNavigator, { StackNavigationProp } from './StackNavigator';
import TabNavigator, { TabNavigationProp } from './TabNavigator';

type StackParamList = {
  first: { author: string };
  second: void;
  third: void;
};

type TabParamList = {
  fourth: void;
  fifth: void;
};

const Stack: TypedNavigator<StackParamList, typeof StackNavigator> = {
  Navigator: StackNavigator,
  Screen,
};

const Tab: TypedNavigator<TabParamList, typeof TabNavigator> = {
  Navigator: TabNavigator,
  Screen,
};

const First = ({
  navigation,
}: {
  navigation: CompositeNavigationProp<
    StackNavigationProp<StackParamList, 'first'>,
    NavigationHelpers<TabParamList>
  >;
}) => (
  <div>
    <h1>First, {navigation.state.params.author}</h1>
    <button type="button" onClick={() => navigation.push('second')}>
      Push second
    </button>
    <button type="button" onClick={() => navigation.push('third')}>
      Push third
    </button>
    <button type="button" onClick={() => navigation.navigate('fourth')}>
      Navigate to fourth
    </button>
    <button
      type="button"
      onClick={() => navigation.navigate('first', { author: 'John' })}
    >
      Navigate with params
    </button>
    <button type="button" onClick={() => navigation.pop()}>
      Go back
    </button>
  </div>
);

const Second = ({
  navigation,
}: {
  navigation: CompositeNavigationProp<
    StackNavigationProp<StackParamList, 'second'>,
    NavigationHelpers<TabParamList>
  >;
}) => (
  <div>
    <h1>Second</h1>
    <button
      type="button"
      onClick={() => navigation.push('first', { author: 'Joel' })}
    >
      Push first
    </button>
    <button type="button" onClick={() => navigation.pop()}>
      Go back
    </button>
  </div>
);

const Fourth = ({
  navigation,
}: {
  navigation: CompositeNavigationProp<
    TabNavigationProp<TabParamList, 'fourth'>,
    StackNavigationProp<StackParamList>
  >;
}) => (
  <div>
    <h1>Fourth</h1>
    <button type="button" onClick={() => navigation.jumpTo('fifth')}>
      Jump to fifth
    </button>
    <button
      type="button"
      onClick={() => navigation.push('first', { author: 'Jake' })}
    >
      Push first
    </button>
    <button type="button" onClick={() => navigation.pop()}>
      Go back
    </button>
  </div>
);

const Fifth = ({
  navigation,
}: {
  navigation: CompositeNavigationProp<
    TabNavigationProp<TabParamList, 'fifth'>,
    StackNavigationProp<StackParamList>
  >;
}) => (
  <div>
    <h1>Fifth</h1>
    <button type="button" onClick={() => navigation.jumpTo('fourth')}>
      Jump to fourth
    </button>
    <button type="button" onClick={() => navigation.push('second')}>
      Push second
    </button>
    <button type="button" onClick={() => navigation.pop()}>
      Go back
    </button>
  </div>
);

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

let initialState: InitialState | undefined;

try {
  initialState = JSON.parse(localStorage.getItem(PERSISTENCE_KEY) || '');
} catch (e) {
  // Do nothing
}

function App() {
  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={state =>
        localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <Stack.Navigator>
        <Stack.Screen
          name="first"
          component={First}
          options={{ title: 'Foo' }}
          initialParams={{ author: 'Jane' }}
        />
        <Stack.Screen
          name="second"
          component={Second}
          options={{ title: 'Bar' }}
        />
        <Stack.Screen name="third" options={{ title: 'Baz' }}>
          {() => (
            <Tab.Navigator initialRouteName="fifth">
              <Tab.Screen name="fourth" component={Fourth} />
              <Tab.Screen name="fifth" component={Fifth} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

render(<App />, document.getElementById('root'));
