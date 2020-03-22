import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';
import { createAppContainer } from '@react-navigation/native';
import createSwitchNavigator from '../createSwitchNavigator';

const getActiveRouteName = (state) => state.routes[state.index].routeName;
const createScreen = (routeName, nextRouteName) => (props) => (
  <View>
    <Text testID="title">{routeName}</Text>
    <Text testID={routeName + '-isFirstRoute'}>
      {String(props.navigation.isFirstRouteInParent())}
    </Text>
    <TouchableOpacity
      testID={routeName + '-next'}
      onPress={() => props.navigation.navigate(nextRouteName)}
    >
      Go to {nextRouteName}
    </TouchableOpacity>
    <TouchableOpacity
      testID={routeName + '-back'}
      onPress={() => props.navigation.goBack()}
    >
      Go back
    </TouchableOpacity>
  </View>
);

it('renders switch navigator with initialRouteName', () => {
  const SwitchNavigator = createSwitchNavigator(
    {
      First: createScreen('First', 'Third'),
      Second: createScreen('Second', 'First'),
      Third: createScreen('Third', 'Second'),
    },
    {
      initialRouteName: 'Second',
    }
  );

  const App = createAppContainer(SwitchNavigator);

  const { queryByText, getByTestId } = render(<App />);

  expect(queryByText('First')).toBeNull();
  expect(queryByText('Third')).toBeNull();
  expect(queryByText('Second')).not.toBeNull();

  fireEvent.press(getByTestId('Second-next'));

  expect(queryByText('First')).not.toBeNull();
  expect(queryByText('Third')).toBeNull();
  expect(queryByText('Second')).toBeNull();
});

it('uses backBehavior=none by default', () => {
  const SwitchNavigator = createSwitchNavigator({
    First: createScreen('First', 'Third'),
    Second: createScreen('Second', 'First'),
    Third: createScreen('Third', 'Second'),
  });

  const App = createAppContainer(SwitchNavigator);

  const navigationRef = React.createRef();

  const { getByTestId } = render(<App ref={navigationRef} />);

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('First');

  fireEvent.press(getByTestId('First-next'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('Third');

  fireEvent.press(getByTestId('Third-next'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('Second');

  fireEvent.press(getByTestId('Second-back'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('Second');
});

it('uses backBehavior=initialRoute when specified', () => {
  const SwitchNavigator = createSwitchNavigator(
    {
      First: createScreen('First', 'Third'),
      Second: createScreen('Second', 'First'),
      Third: createScreen('Third', 'Second'),
    },
    {
      backBehavior: 'initialRoute',
    }
  );

  const App = createAppContainer(SwitchNavigator);

  const navigationRef = React.createRef();

  const { getByTestId } = render(<App ref={navigationRef} />);

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('First');

  fireEvent.press(getByTestId('First-next'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('Third');

  fireEvent.press(getByTestId('Third-next'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('Second');

  fireEvent.press(getByTestId('Second-back'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('First');
});

it('uses backBehavior=order when specified', () => {
  const SwitchNavigator = createSwitchNavigator(
    {
      First: createScreen('First', 'Third'),
      Second: createScreen('Second', 'First'),
      Third: createScreen('Third', 'Second'),
    },
    {
      backBehavior: 'order',
    }
  );

  const App = createAppContainer(SwitchNavigator);

  const navigationRef = React.createRef();

  const { getByTestId } = render(<App ref={navigationRef} />);

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('First');

  fireEvent.press(getByTestId('First-next'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('Third');

  fireEvent.press(getByTestId('Third-back'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('Second');

  fireEvent.press(getByTestId('Second-back'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('First');
});

it('uses backBehavior=history when specified', () => {
  const SwitchNavigator = createSwitchNavigator(
    {
      First: createScreen('First', 'Third'),
      Second: createScreen('Second', 'First'),
      Third: createScreen('Third', 'Second'),
    },
    {
      backBehavior: 'history',
    }
  );

  const App = createAppContainer(SwitchNavigator);

  const navigationRef = React.createRef();

  const { getByTestId } = render(<App ref={navigationRef} />);

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('First');

  fireEvent.press(getByTestId('First-next'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('Third');

  fireEvent.press(getByTestId('Third-next'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('Second');

  fireEvent.press(getByTestId('Second-next'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('First');

  fireEvent.press(getByTestId('First-next'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('Third');

  fireEvent.press(getByTestId('Third-back'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('First');

  fireEvent.press(getByTestId('First-back'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('Second');

  fireEvent.press(getByTestId('Second-back'));

  expect(getActiveRouteName(navigationRef.current.state.nav)).toBe('Second');
});

it('returns correct value for canGoBack in a simple navigator', () => {
  const SwitchNavigator = createSwitchNavigator(
    {
      First: createScreen('First', 'Third'),
      Second: createScreen('Second', 'First'),
      Third: createScreen('Third', 'Second'),
    },
    {
      backBehavior: 'history',
    }
  );

  const App = createAppContainer(SwitchNavigator);

  const navigationRef = React.createRef();

  const { getByTestId } = render(<App ref={navigationRef} />);

  expect(getByTestId('First-isFirstRoute').props.children).toBe('true');

  fireEvent.press(getByTestId('First-next'));

  expect(getByTestId('Third-isFirstRoute').props.children).toBe('false');

  fireEvent.press(getByTestId('Third-next'));

  expect(getByTestId('Second-isFirstRoute').props.children).toBe('false');

  fireEvent.press(getByTestId('Second-back'));

  expect(getByTestId('Third-isFirstRoute').props.children).toBe('false');
});
