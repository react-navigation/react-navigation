# `@react-navigation/material-bottom-tabs`

React Navigation integration for [bottom navigation](https://material.io/design/components/bottom-navigation.html) component from [`react-native-paper`](https://callstack.github.io/react-native-paper/bottom-navigation.html).

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/core @react-navigation/material-bottom-tabs
```

Setup `react-native-paper` following the [Getting Started guide](https://callstack.github.io/react-native-paper/getting-started.html).

## Usage

```js
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const MaterialBottomTabs = createMaterialBottomTabNavigator();

export default function App() {
  return (
    <MaterialBottomTabs.Navigator>
      <MaterialBottomTabs.Screen
        name="article"
        component={Article}
        options={{
          tabBarLabel: 'Article',
          tabBarIcon: 'chrome-reader-mode',
        }}
      />
      <MaterialBottomTabs.Screen
        name="chat"
        component={Chat}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: 'chat-bubble',
        }}
      />
      <MaterialBottomTabs.Screen
        name="contacts"
        component={Contacts}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: 'contacts',
        }}
      />
      <MaterialBottomTabs.Screen
        name="albums"
        component={Albums}
        options={{
          tabBarLabel: 'Albums',
          tabBarIcon: 'photo-album',
        }}
      />
    </MaterialBottomTabs.Navigator>
  );
}
```
