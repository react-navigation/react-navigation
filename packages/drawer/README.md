# React Navigation Drawer

[![npm version](https://badge.fury.io/js/react-navigation-drawer.svg)](https://npmjs.org/react-navigation-drawer) [![CircleCI badge](https://circleci.com/gh/react-navigation/drawer/tree/master.svg?style=shield)](https://circleci.com/gh/react-navigation/drawer/tree/master) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactnavigation.org/docs/contributing.html)

Drawer navigator for use on iOS and Android.

## Installation

Open a Terminal in the project root and run:

```sh
yarn add react-navigation-drawer
```

If you are using Expo, you are done. Otherwise, continue to the next step.

Install and link [`react-native-gesture-handler`](https://github.com/kmagiera/react-native-gesture-handler) and [`react-native-reanimated`](https://github.com/kmagiera/react-native-reanimated). To install and link them, run:

```sh
yarn add react-native-reanimated react-native-gesture-handler
react-native link react-native-reanimated
react-native link react-native-gesture-handler
```

**IMPORTANT:** There are additional steps required for `react-native-gesture-handler` on Android after running `react-native link react-native-gesture-handler`. Check the [this guide](https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html) to complete the installation.

## Usage

```js
import { createDrawerNavigator } from 'react-navigation-drawer';

export default createDrawerNavigator({
  Inbox: InboxStack
  Drafts: DraftsStack,
}, {
  initialRouteName: 'Inbox',
  contentOptions: {
    activeTintColor: '#e91e63',
  },
});
```

## Development workflow

- Clone this repository
- Run `yarn` in the root directory and in the `example` directory
- Run `yarn dev` in the root directory
- Run `yarn start` in the `example` directory

## Docs

Documentation can be found on the [React Navigation website](https://reactnavigation.org/docs/en/drawer-navigator.html).
