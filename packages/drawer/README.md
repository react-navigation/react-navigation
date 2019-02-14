# React Navigation Drawer

[![npm version](https://badge.fury.io/js/react-navigation-drawer.svg)](https://badge.fury.io/js/react-navigation-drawer) [![CircleCI badge](https://circleci.com/gh/react-navigation/react-navigation-drawer/tree/master.svg?style=shield)](https://circleci.com/gh/react-navigation/react-navigation-drawer/tree/master) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactnavigation.org/docs/contributing.html)

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

## Development workflow

- Clone this repository
- Run `yarn` in the root directory and in the `example` directory
- Run `yarn dev` in the root directory
- Run `yarn start` in the `example` directory

## Docs

Documentation can be found on the [React Navigation website](https://reactnavigation.org/docs/en/drawer-navigator.html).
