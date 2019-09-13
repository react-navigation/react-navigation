# `@react-navigation/compat`

Compatibility layer to write navigator definitions in static configuration format.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/core @react-navigation/compat
```

## Usage

```js
import { createCompatNavigatorFactory } from '@react-navigation/compat';
import { createStackNavigator } from '@react-navigation/stack';

const RootStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    Home: { screen: HomeScreen },
    Profile: { screen: ProfileScreen },
  },
  {
    initialRouteName: 'Profile',
  }
);
```
