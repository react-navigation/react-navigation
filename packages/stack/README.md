# React Navigation Stack

[![Build Status][build-badge]][build]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]

Stack navigator for use on iOS and Android.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add react-navigation-stack
```

or

```sh
npm install react-navigation-stack
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

## Development workflow

To setup the development environment, open a Terminal in the repo directory and run the following:

```sh
yarn bootstrap
```

While developing, you can run the example app with [Expo](https://expo.io/) to test your changes:

```sh
yarn example start
```

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
yarn typescript
yarn lint
```

To fix formatting errors, run the following:

```sh
yarn lint --fix
```

## Docs

Documentation can be found on the [React Navigation website](https://reactnavigation.org/docs/en/stack-navigator-2.0.html).

<!-- badges -->

[build-badge]: https://img.shields.io/circleci/project/github/react-navigation/stack/master.svg?style=flat-square
[build]: https://circleci.com/gh/react-navigation/stack
[version-badge]: https://img.shields.io/npm/v/react-navigation-stack.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-navigation-stack
[license-badge]: https://img.shields.io/npm/l/react-navigation-stack.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
