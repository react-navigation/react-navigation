# `@react-navigation/bottom-tabs`

Bottom tab navigator for React Navigation following iOS design guidelines.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/core @react-navigation/bottom-tabs
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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const BottomTabs = createBottomTabNavigator();

export default function App() {
  return (
    <BottomTabs.Navigator>
      <BottomTabs.Screen
        name="article"
        component={Article}
        options={{
          tabBarLabel: 'Article',
          tabBarIcon: 'chrome-reader-mode',
        }}
      />
      <BottomTabs.Screen
        name="chat"
        component={Chat}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: 'chat-bubble',
        }}
      />
      <BottomTabs.Screen
        name="contacts"
        component={Contacts}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: 'contacts',
        }}
      />
    </BottomTabs.Navigator>
  );
}
```
