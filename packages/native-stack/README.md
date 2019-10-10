# `@react-navigation/native-stack`

Stack navigator for React Native using native primitives for navigation. Uses [`react-native-screens`](https://github.com/kmagiera/react-native-screens) under the hood.

Expo is currently not supported as it includes an older version of `react-native-screens`.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/core @react-navigation/native-stack
```

Now we need to install [`react-native-screens`](https://github.com/kmagiera/react-native-screens).

```sh
yarn add react-native-screens
```

To complete the linking on iOS, make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

```sh
cd ios
pod install
cd ..
```

To finalize installation of `react-native-screens` for Android, add the following two lines to dependencies section in `android/app/build.gradle`:

```gradle
implementation 'androidx.appcompat:appcompat:1.1.0-rc01'
implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0-alpha02'
```

Make sure to enable `react-native-screens`. This needs to be done before our app renders. To do it, add the following code in your entry file (e.g. `App.js`):

```js
import { useScreens } from 'react-native-screens';

useScreens();
```

## Usage

```js
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={Home} options={{ title: 'Home' }} />
      <Stack.Screen name="feed" component={Feed} options={{ title: 'Feed' }} />
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}
```
