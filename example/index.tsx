import * as React from 'react';
import { render } from 'react-dom';
import {
  NavigationContainer,
  CompositeNavigationProp,
  PartialState,
  NavigationProp,
  RouteProp,
} from '../src';
import StackNavigator, { StackNavigationProp } from './StackNavigator';
import TabNavigator, { TabNavigationProp } from './TabNavigator';

type StackParamList = {
  first: { author: string };
  second: undefined;
  third: undefined;
};

type TabParamList = {
  fourth: undefined;
  fifth: undefined;
};

const MyStack = StackNavigator<StackParamList>();

const MyTab = TabNavigator<TabParamList>();

const First = ({
  navigation,
  route,
}: {
  navigation: CompositeNavigationProp<
    StackNavigationProp<StackParamList>,
    NavigationProp<TabParamList>
  >;
  route: RouteProp<StackParamList, 'first'>;
}) => (
  <div>
    <h1>First, {route.params.author}</h1>
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
      Pop
    </button>
  </div>
);

const Second = ({
  navigation,
}: {
  navigation: CompositeNavigationProp<
    StackNavigationProp<StackParamList>,
    NavigationProp<TabParamList>
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
      Pop
    </button>
  </div>
);

const Fourth = ({
  navigation,
}: {
  navigation: CompositeNavigationProp<
    TabNavigationProp<TabParamList>,
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
    <button type="button" onClick={() => navigation.goBack()}>
      Go back
    </button>
  </div>
);

const Fifth = ({
  navigation,
}: {
  navigation: CompositeNavigationProp<
    TabNavigationProp<TabParamList>,
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
      Pop
    </button>
  </div>
);

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

let initialState: PartialState | undefined;

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
      <MyStack.Navigator>
        <MyStack.Screen
          name="first"
          component={First}
          options={{ title: 'Foo' }}
          initialParams={{ author: 'Jane' }}
        />
        <MyStack.Screen
          name="second"
          component={Second}
          options={{ title: 'Bar' }}
        />
        <MyStack.Screen name="third" options={{ title: 'Baz' }}>
          {() => (
            <MyTab.Navigator initialRouteName="fifth">
              <MyTab.Screen name="fourth" component={Fourth} />
              <MyTab.Screen name="fifth" component={Fifth} />
            </MyTab.Navigator>
          )}
        </MyStack.Screen>
      </MyStack.Navigator>
    </NavigationContainer>
  );
}

render(<App />, document.getElementById('root'));
