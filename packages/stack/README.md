# `@react-navigation/stack`

Stack navigator for React Navigation.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/native @react-navigation/stack @react-native-community/masked-view
```

Now we need to install [`react-native-gesture-handler`](https://github.com/kmagiera/react-native-gesture-handler), [`react-native-screens`](https://github.com/kmagiera/react-native-screens) and [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context).

If you are using Expo, to ensure that you get the compatible versions of the libraries, run:

```sh
expo install react-native-gesture-handler react-native-screens react-native-safe-area-context
```

If you are not using Expo, run the following:

```sh
yarn add react-native-gesture-handler react-native-screens react-native-safe-area-context
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

**IMPORTANT:** There are additional steps required for `react-native-gesture-handler` on Android after linking (for all React Native versions). Check the [this guide](https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html) to complete the installation.

## Usage

```js
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

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
