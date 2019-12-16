# `@react-navigation/native-stack`

Stack navigator for React Native using native primitives for navigation. Uses [`react-native-screens`](https://github.com/kmagiera/react-native-screens) under the hood.

Expo SDK 35 and lower is not supported as it includes an older version of `react-native-screens`.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/native @react-navigation/native-stack
```
Or with npm

```sh
npm install --save @react-navigation/native @react-navigation/native-stack
```

If you are using Expo, to ensure that you get the compatible versions of the libraries, run:

```sh
expo install react-native-screens
```

If you are not using Expo, run the following:

```sh
yarn add react-native-screens
```
Or with npm

```sh
npm install --save react-native-screens
```

If you are using Expo, you are done. Otherwise, continue to the next steps.

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
import { enableScreens } from 'react-native-screens';

enableScreens();
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
