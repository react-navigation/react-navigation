# React Navigation Stack

[![Build Status][build-badge]][build]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]

Stack navigator for use on iOS and Android.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add react-navigation-stack @react-native-community/masked-view react-native-safe-area-context
```

or

```sh
npm install react-navigation-stack @react-native-community/masked-view react-native-safe-area-context
```

## Usage

```js
import { createStackNavigator } from 'react-navigation-stack';

export default createStackNavigator({
  Inbox: InboxScreen,
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

The code in this repo uses the source from [`@react-navigation/stack`](https://github.com/react-navigation/navigation-ex/tree/master/packages/stack) and patches it to make it usable in React Navigation 4. If you need to make changes, please send a pull request there.

If the change is specifically related to React Navigation 4 integration, first run `yarn sync`, then change the files in `src/vendor` and then run `yarn patch` to update the patch file with the latest changes.

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

Documentation can be found on the [React Navigation website](https://reactnavigation.org/docs/en/stack-navigator.html).

<!-- badges -->

[build-badge]: https://img.shields.io/circleci/project/github/react-navigation/stack/master.svg?style=flat-square
[build]: https://circleci.com/gh/react-navigation/stack
[version-badge]: https://img.shields.io/npm/v/react-navigation-stack.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-navigation-stack
[license-badge]: https://img.shields.io/npm/l/react-navigation-stack.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
