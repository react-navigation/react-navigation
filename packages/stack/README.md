# React Navigation Stack

[![CircleCI badge](https://circleci.com/gh/react-navigation/react-navigation-stack/tree/master.svg?style=shield)](https://circleci.com/gh/react-navigation/react-navigation-stack/tree/master)

Stack navigator for use on iOS and Android.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add react-navigation-stack
```

## Usage

```js
import { createStackNavigator } from 'react-navigation-stack';

export default createStackNavigator({
  Inbox: InboxScreen
  Drafts: DraftsScreen,
}, {
  initialRouteName: 'Inbox',
});
```

## Docs

Documentation can be found on the [React Navigation website](https://reactnavigation.org/docs/en/stack-navigator.html).
