import * as React from 'react';
import { render } from 'react-dom';
import { NavigationContainer, Screen } from '../src';
import StackNavigator, { StackNavigationProp } from './StackNavigator';

const First = ({ navigation }: { navigation: StackNavigationProp }) => (
  <div>
    <h1>First route</h1>
    <button type="button" onClick={() => navigation.push('second')}>
      Push second
    </button>
    <button type="button" onClick={() => navigation.pop()}>
      Go back
    </button>
  </div>
);

const Second = ({ navigation }: { navigation: StackNavigationProp }) => (
  <div>
    <h1>Second route</h1>
    <button type="button" onClick={() => navigation.push('first')}>
      Push first
    </button>
    <button type="button" onClick={() => navigation.pop()}>
      Go back
    </button>
  </div>
);

function App() {
  return (
    <NavigationContainer>
      <StackNavigator>
        <Screen name="first" component={First} />
        <Screen name="second" component={Second} />
      </StackNavigator>
    </NavigationContainer>
  );
}

render(<App />, document.getElementById('root'));
