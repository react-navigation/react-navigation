import shortid from 'shortid';
import * as React from 'react';
import { render } from 'react-dom';
import { NavigationContainer, Screen } from '../src';
import StackNavigator, { StackNavigationProp } from './StackNavigator';
import TabNavigator, { TabNavigationProp } from './TabNavigator';

const First = ({ navigation }: { navigation: StackNavigationProp }) => (
  <div>
    <h1>First route</h1>
    <button type="button" onClick={() => navigation.push('second')}>
      Push second
    </button>
    <button type="button" onClick={() => navigation.push('third')}>
      Push third
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

const Fourth = ({
  navigation,
}: {
  navigation: TabNavigationProp & StackNavigationProp;
}) => (
  <div>
    <h1>Fourth route</h1>
    <button type="button" onClick={() => navigation.jumpTo('fifth')}>
      Jump to fifth
    </button>
    <button type="button" onClick={() => navigation.push('first')}>
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
  navigation: TabNavigationProp & StackNavigationProp;
}) => (
  <div>
    <h1>Fifth route</h1>
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

const routes =
  location.pathname !== '/'
    ? location.pathname
        .slice(1)
        .split('/')
        .map(name => ({ name, key: `${name}-${shortid()}` }))
    : [];

const initialState = routes.length
  ? {
      index: routes.length - 1,
      routes,
    }
  : undefined;

function App() {
  return (
    <NavigationContainer initialState={initialState}>
      <StackNavigator>
        <Screen name="first" component={First} />
        <Screen name="second" component={Second} />
        <Screen name="third">
          {props => (
            <TabNavigator {...props} initialRouteName="fifth">
              <Screen name="fourth" component={Fourth} />
              <Screen name="fifth" component={Fifth} />
            </TabNavigator>
          )}
        </Screen>
      </StackNavigator>
    </NavigationContainer>
  );
}

render(<App />, document.getElementById('root'));
