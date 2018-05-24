# React Navigation Tabs

[![Build Status][build-badge]][build]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]

Tab navigators for React Navigation.

## Installation

With react-navigation@^2.0.0, no installation is required.

## Usage

The package exports two different navigators:

- `createBottomTabNavigator`: iOS like bottom tabs.
- `createMaterialTopTabNavigator`: Material design themed top tabs with swipe gesture, from [react-native-tab-view](https://github.com/react-native-community/react-native-tab-view).

You can import individual navigators and use them:

```js
import { createBottomTabNavigator } from 'react-navigation';

export default createBottomTabNavigator({
  Album: { screen: Album },
  Library: { screen: Library },
  History: { screen: History },
  Cart: { screen: Cart },
});
```

You can install another package, `react-navigation-material-bottom-tabs`, to use a third type of tab navigator:

- `createMaterialBottomTabNavigator`: Material design themed animated bottom tabs, from [react-native-paper](https://callstack.github.io/react-native-paper/bottom-navigation.html).

```js
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

export default createMaterialBottomTabNavigator({
  Album: { screen: Album },
  Library: { screen: Library },
  History: { screen: History },
  Cart: { screen: Cart },
}, {
  initialRouteName: 'Album',
  activeTintColor: '#F44336',
});
```

<!-- badges -->
[build-badge]: https://img.shields.io/circleci/project/github/react-navigation/react-navigation-tabs/master.svg?style=flat-square
[build]: https://circleci.com/gh/react-navigation/react-navigation-tabs
[version-badge]: https://img.shields.io/npm/v/react-navigation-tabs.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-navigation-tabs
[license-badge]: https://img.shields.io/npm/l/react-navigation-tabs.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
