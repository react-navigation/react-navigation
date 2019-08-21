# `@react-navigation/drawer`

Bottom tab navigator for React Navigation following iOS design guidelines.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/drawer
```

Now we need to install [`react-native-gesture-handler`](https://github.com/kmagiera/react-native-gesture-handler) and [`react-native-reanimated`](https://github.com/kmagiera/react-native-reanimated).

If you are using Expo, to ensure that you get the compatible versions of the libraries, run:

```sh
expo install react-native-gesture-handler react-native-reanimated
```

If you are not using Expo, run the following:

```sh
yarn add react-native-reanimated react-native-gesture-handler
```

If you are using Expo, you are done. Otherwise, continue to the next steps.

Next, we need to link these libraries. The steps depends on your React Native version:

- **React Native 0.60 and higher**

  On newer versions of React Native, [linking is automatic](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

  To complete the linking on iOS, make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

  ```sh
  cd ios
  pod install
  cd ..
  ```

- **React Native 0.59**

  If you're on an older React Native version, you need to manually link the dependencies. To do that, run:

  ```sh
  react-native link react-native-reanimated
  react-native link react-native-gesture-handler
  ```

**IMPORTANT:** There are additional steps required for `react-native-gesture-handler` on Android after linking (for all React Native versions). Check the [this guide](https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html) to complete the installation.

## Usage

```js
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="home" component={Home} options={{ title: 'Home' }} />
      <Drawer.Screen name="feed" component={Feed} options={{ title: 'Feed' }} />
      <Drawer.Screen
        name="profile"
        component={Profile}
        options={{ title: 'Profile' }}
      />
    </Drawer.Navigator>
  );
}
```
