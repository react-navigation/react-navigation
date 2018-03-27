# React Navigation Tabs

[![Build Status][build-badge]][build]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]

Tab navigators for React Navigation.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add react-navigation-tabs react-navigation
```

## Usage

The package exports 3 different navigators:

- `createBottomTabNavigator`: iOS like bottom tabs.
- `createMaterialBottomTabNavigator`: Material design themed animated bottom tabs, from [react-native-paper](https://callstack.github.io/react-native-paper/bottom-navigation.html).
- `createMaterialTopTabNavigator`: Material design themed top tabs with swipe gesture, from [react-native-tab-view](https://github.com/react-native-community/react-native-tab-view).

You can import individual navigators and use them:

```js
import createMaterialBottomTabNavigator from 'react-navigation-tabs/createMaterialBottomTabNavigator';

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
