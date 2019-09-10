# React Navigation Material Bottom Tabs

Bottom Navigation component following [Material design guidelines](https://material.io/design/components/bottom-navigation.html) to use with React Navigation. Uses the Bottom Navigation component from [React Native Paper](https://callstack.github.io/react-native-paper/bottom-navigation.html).

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add react-navigation-material-bottom-tabs react-native-paper
```

If you're on a vanilla React Native project, you also need to install and link [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons).

```sh
yarn add react-native-vector-icons
react-native link react-native-vector-icons
```

If you don't want to install vector icons, you can use [babel-plugin-optional-require](https://github.com/satya164/babel-plugin-optional-require) to opt-out.

If you use Expo, you don't need to install vector icons. But you will need to make sure that your `.babelrc` includes `babel-preset-expo`:

```json
{
  "presets": ["expo"]
}
```

If you don't use React Native Paper app, you should also add `react-native-paper/babel` to your `.babelrc` to avoid importing the whole library. See the [Getting Started guide](https://callstack.github.io/react-native-paper/getting-started.html) for more information.

## Usage

```js
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

export default createMaterialBottomTabNavigator({
  Album: { screen: Album },
  Library: { screen: Library },
  History: { screen: History },
  Cart: { screen: Cart },
}, {
  initialRouteName: 'Album',
  activeColor: '#F44336',
});
```

## Docs

Documentation can be found on the [React Navigation website](https://reactnavigation.org/docs/material-bottom-tab-navigator.html).
