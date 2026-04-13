import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DynamicColorIOS, PlatformColor, ScrollView, View } from 'react-native';

const BlackWhiteScrollView = () => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="always"
      style={{ backgroundColor: PlatformColor('systemBackground') }}
    >
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
export const UserInterfaceBug = () => {
  return (
    <NavigationContainer>
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
            headerBlurEffect: 'regular',
            unstable_headerRightItems: () => [
              {
                type: 'button',
                label: 'Button',
                onPress: () => {},
              },
            ],
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
