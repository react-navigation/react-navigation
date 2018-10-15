# React Navigation Drawer

[![CircleCI badge](https://circleci.com/gh/react-navigation/react-navigation-drawer/tree/master.svg?style=shield)](https://circleci.com/gh/react-navigation/react-navigation-drawer/tree/master)

Drawer navigator for use on iOS and Android.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add react-navigation-drawer
```

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

## Docs

Documentation can be found on the [React Navigation website](https://reactnavigation.org/docs/en/drawer-navigator.html).
