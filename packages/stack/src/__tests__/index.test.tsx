import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Button, Text, View } from 'react-native';

import { createStackNavigator, StackScreenProps } from '../index';

it('renders a stack navigator with screens', async () => {
  const Test = ({ route, navigation }: StackScreenProps<ParamListBase>) => (
    <View>
      <Text>Screen {route.name}</Text>
      <Button onPress={() => navigation.navigate('A')} title="Go to A" />
      <Button onPress={() => navigation.navigate('B')} title="Go to B" />
    </View>
  );

  const Stack = createStackNavigator();

  const { findByText, queryByText } = render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A" component={Test} />
        <Stack.Screen name="B" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen A')).not.toBeNull();
  expect(queryByText('Screen B')).toBeNull();

  fireEvent.press(await findByText('Go to B'));

  expect(queryByText('Screen B')).not.toBeNull();
});

it("renders header segment's left/right with either functions or jsx elements", async () => {
  const Stack = createStackNavigator();

  const TestScreen = () => (
    <View>
      <Text>Test Screen</Text>
    </View>
  );

  let resultWithElems = render(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ScreenWithElements">
        <Stack.Screen
          name="ScreenWithElements"
          component={TestScreen}
          options={{
            headerLeft: (
              <View>
                <Text>Left</Text>
              </View>
            ),
            headerRight: (
              <View>
                <Text>Right</Text>
              </View>
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

  let resultWithFuncs = render(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ScreenWithFunctions">
        <Stack.Screen
          name="ScreenWithFunctions"
          component={TestScreen}
          options={{
            headerLeft: () => (
              <View>
                <Text>Left</Text>
              </View>
            ),
            headerRight: () => (
              <View>
                <Text>Right</Text>
              </View>
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
  expect(resultWithElems.queryByText('Left')).not.toBeNull();
  expect(resultWithElems.queryByText('Right')).not.toBeNull();
  expect(resultWithFuncs.queryByText('Left')).not.toBeNull();
  expect(resultWithFuncs.queryByText('Right')).not.toBeNull();
});
