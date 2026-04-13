import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from '@react-navigation/elements';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  DynamicColorIOS,
  ScrollView,
  useColorScheme,
  View,
} from 'react-native';

const BlackWhiteScrollView = () => {
  return (
    <ScrollView contentInsetAdjustmentBehavior="always">
      <View style={{ padding: 10 }}>
        <Text>Current colorscheme: {useColorScheme()}</Text>
      </View>
      <View style={{ height: 100, backgroundColor: 'black' }} />
      <View style={{ height: 100, backgroundColor: 'white' }} />
      <View style={{ height: 100, backgroundColor: 'black' }} />
      <View style={{ height: 100, backgroundColor: 'white' }} />
      <View style={{ height: 100, backgroundColor: 'black' }} />
      <View style={{ height: 100, backgroundColor: 'white' }} />
    </ScrollView>
  );
};

const Stack = createNativeStackNavigator();

const StackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={BlackWhiteScrollView}
        options={{
          headerTransparent: true,
          headerTintColor: DynamicColorIOS({
            light: 'red',
            dark: 'green',
          }),
          unstable_headerRightItems: ({ tintColor }) => [
            {
              type: 'button',
              label: 'Button',
              onPress: () => {},
              tintColor,
            },
          ],
        }}
      />
    </Stack.Navigator>
  );
};
const Tabs = createBottomTabNavigator();

export const UserInterfaceBug = () => {
  return (
    <NavigationContainer>
      <Tabs.Navigator>
        <Tabs.Screen name="Stack" component={StackScreen} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
};
