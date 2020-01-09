# `@react-navigation/bottom-tabs`

Bottom tab navigator for React Navigation following iOS design guidelines.

Documentation can be found on the [React Navigation website](https://reactnavigation.org/docs/en/next/bottom-tab-navigator.html).

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/native @react-navigation/bottom-tabs
```

Now we need to install [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context).

If you are using Expo, to ensure that you get the compatible versions of the libraries, run:

```sh
expo install react-native-safe-area-context
```

If you are not using Expo, run the following:

```sh
yarn add react-native-safe-area-context
```

If you are using Expo, you are done. Otherwise, continue to the next steps.

To complete the linking on iOS, make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

```sh
cd ios
pod install
cd ..
```

## Usage

```js
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const getTabBarIcon = name => ({ color, size }) => (
  <MaterialCommunityIcons name={name} color={color} size={size} />
);

const BottomTabs = createBottomTabNavigator();

export default function App() {
  return (
    <BottomTabs.Navigator>
      <BottomTabs.Screen
        name="article"
        component={Article}
        options={{
          tabBarLabel: 'Article',
          tabBarIcon: getTabBarIcon('file-document-box'),
        }}
      />
      <BottomTabs.Screen
        name="chat"
        component={Chat}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: getTabBarIcon('message-reply'),
        }}
      />
      <BottomTabs.Screen
        name="contacts"
        component={Contacts}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: getTabBarIcon('contacts'),
        }}
      />
    </BottomTabs.Navigator>
  );
}
```
