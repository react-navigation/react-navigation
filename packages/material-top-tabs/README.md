# `@react-navigation/material-top-tabs`

React Navigation integration for animated tab view component from [`react-native-tab-view`](https://github.com/react-native-community/react-native-tab-view).

Documentation can be found on the [React Navigation website](https://reactnavigation.org/docs/en/next/material-top-tab-navigator.html).

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/native @react-navigation/material-top-tabs react-native-tab-view
```

Now we need to install [`react-native-gesture-handler`](https://github.com/kmagiera/react-native-gesture-handler) and [`react-native-reanimated`](https://github.com/kmagiera/react-native-reanimated)..

If you are using Expo, to ensure that you get the compatible versions of the libraries, run:

```sh
expo install react-native-gesture-handler react-native-reanimated
```

If you are not using Expo, run the following:

```sh
yarn add react-native-reanimated react-native-gesture-handler
```

If you are using Expo, you are done. Otherwise, continue to the next steps.

To complete the linking on iOS, make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

```sh
cd ios
pod install
cd ..
```

**IMPORTANT:** There are additional steps required for `react-native-gesture-handler` on Android after linking (for all React Native versions). Check the [this guide](https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html) to complete the installation.

## Usage

```js
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const MaterialTopTabs = createMaterialTopTabNavigator();

export default function App() {
  return (
    <MaterialTopTabs.Navigator>
      <MaterialTopTabs.Screen
        name="article"
        component={Article}
        options={{ tabBarLabel: 'Article' }}
      />
      <MaterialTopTabs.Screen
        name="chat"
        component={Chat}
        options={{ tabBarLabel: 'Chat' }}
      />
      <MaterialTopTabs.Screen
        name="contacts"
        component={Contacts}
        options={{ tabBarLabel: 'Contacts' }}
      />
    </MaterialTopTabs.Navigator>
  );
}
```
