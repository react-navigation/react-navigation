import React from 'react';
import { Button, Text, StatusBar, View, StyleSheet } from 'react-native';
import {
  SafeAreaView,
  createStackNavigator,
  createSwitchNavigator,
  NavigationActions,
} from 'react-navigation';

const runSubRoutes = navigation => {
  navigation.dispatch(NavigationActions.navigate({ routeName: 'First2' }));
  navigation.dispatch(NavigationActions.navigate({ routeName: 'Second2' }));
  navigation.dispatch(NavigationActions.navigate({ routeName: 'First2' }));
};

const runSubRoutesWithIntermediate = navigation => {
  navigation.dispatch(toFirst1);
  navigation.dispatch(toSecond2);
  navigation.dispatch(toFirst);
  navigation.dispatch(toFirst2);
};

const runSubAction = navigation => {
  navigation.dispatch(toFirst2);
  navigation.dispatch(toSecond2);
  navigation.dispatch(toFirstChild1);
};

const DummyScreen = ({ routeName, navigation, style }) => {
  return (
    <SafeAreaView
      style={[
        StyleSheet.absoluteFill,
        {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        },
        style,
      ]}
    >
      <Text style={{ fontWeight: '800' }}>
        {routeName}({navigation.state.key})
      </Text>
      <View>
        <Button title="back" onPress={() => navigation.goBack()} />
        <Button title="dismiss" onPress={() => navigation.dismiss()} />
        <Button
          title="between sub-routes"
          onPress={() => runSubRoutes(navigation)}
        />
        <Button
          title="between sub-routes (with intermediate)"
          onPress={() => runSubRoutesWithIntermediate(navigation)}
        />

        <Button
          title="with sub-action"
          onPress={() => runSubAction(navigation)}
        />
      </View>
      <StatusBar barStyle="default" />
    </SafeAreaView>
  );
};

const createDummyScreen = routeName => {
  const BoundDummyScreen = props => DummyScreen({ ...props, routeName });
  return BoundDummyScreen;
};

const toFirst = NavigationActions.navigate({ routeName: 'First' });
const toFirst1 = NavigationActions.navigate({ routeName: 'First1' });
const toFirst2 = NavigationActions.navigate({ routeName: 'First2' });
const toSecond2 = NavigationActions.navigate({ routeName: 'Second2' });
const toFirstChild1 = NavigationActions.navigate({
  routeName: 'First',
  action: NavigationActions.navigate({ routeName: 'First1' }),
});

export default createStackNavigator(
  {
    Other: createDummyScreen('Leaf'),
    First: createStackNavigator({
      First1: createDummyScreen('First1'),
      First2: createDummyScreen('First2'),
    }),
    Second: createStackNavigator({
      Second1: createDummyScreen('Second1'),
      Second2: createDummyScreen('Second2'),
    }),
  },
  {
    headerMode: 'none',
  }
);
