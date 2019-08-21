# `@react-navigation/bottom-tabs`

Bottom tab navigator for React Navigation following iOS design guidelines.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/bottom-tabs
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
