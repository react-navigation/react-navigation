# React Navigation 6

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![MIT License][license-badge]][license]

Routing and navigation for your React Native apps.

Documentation can be found at [reactnavigation.org](https://reactnavigation.org/).

If you are looking for version 4, the code can be found in the [4.x branch](https://github.com/react-navigation/react-navigation/tree/4.x).

## Package Versions

| Name                                                                         |                                                                      Latest Version                                                                       |
| ---------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------: |
| [@react-navigation/bottom-tabs](/packages/bottom-tabs)                       |          [![badge](https://img.shields.io/npm/v/@react-navigation/bottom-tabs.svg)](https://www.npmjs.com/package/@react-navigation/bottom-tabs)          |
| [@react-navigation/core](/packages/core)                                     |                 [![badge](https://img.shields.io/npm/v/@react-navigation/core.svg)](https://www.npmjs.com/package/@react-navigation/core)                 |
| [@react-navigation/devtools](/packages/devtools)                             |             [![badge](https://img.shields.io/npm/v/@react-navigation/devtools.svg)](https://www.npmjs.com/package/@react-navigation/devtools)             |
| [@react-navigation/drawer](/packages/drawer)                                 |               [![badge](https://img.shields.io/npm/v/@react-navigation/drawer.svg)](https://www.npmjs.com/package/@react-navigation/drawer)               |
| [@react-navigation/elements](/packages/elements)                             |             [![badge](https://img.shields.io/npm/v/@react-navigation/elements.svg)](https://www.npmjs.com/package/@react-navigation/elements)             |
| [@react-navigation/material-bottom-tabs](/packages/material-bottom-tabs)     | [![badge](https://img.shields.io/npm/v/@react-navigation/material-bottom-tabs.svg)](https://www.npmjs.com/package/@react-navigation/material-bottom-tabs) |
| [@react-navigation/material-top-tabs](/packages/material-top-tabs)           |    [![badge](https://img.shields.io/npm/v/@react-navigation/material-top-tabs.svg)](https://www.npmjs.com/package/@react-navigation/material-top-tabs)    |
| [@react-navigation/native-stack](/packages/native-stack)                     |            [![badge](https://img.shields.io/npm/v/@react-navigation/stack.svg)](https://www.npmjs.com/package/@react-navigation/native-stack)             |
| [@react-navigation/native](/packages/native)                                 |               [![badge](https://img.shields.io/npm/v/@react-navigation/native.svg)](https://www.npmjs.com/package/@react-navigation/native)               |
| [@react-navigation/routers](/packages/routers)                               |              [![badge](https://img.shields.io/npm/v/@react-navigation/routers.svg)](https://www.npmjs.com/package/@react-navigation/routers)              |
| [@react-navigation/stack](/packages/stack)                                   |                [![badge](https://img.shields.io/npm/v/@react-navigation/stack.svg)](https://www.npmjs.com/package/@react-navigation/stack)                |
| [react-native-tab-view](/packages/react-native-tab-view) |        [![badge](https://img.shields.io/npm/v/react-native-tab-view.svg)](https://www.npmjs.com/package/react-native-tab-view)        |
| [flipper-plugin-react-navigation](/packages/flipper-plugin-react-navigation) |        [![badge](https://img.shields.io/npm/v/flipper-plugin-react-navigation.svg)](https://www.npmjs.com/package/flipper-plugin-react-navigation)        |

## Contributing

Please read through our [contribution guide](CONTRIBUTING.md) to get started!

## Installing from a fork on GitHub

Since we use a monorepo, it's not possible to install a package from the repository URL. If you need to install a forked version from Git, you can use [`gitpkg`](https://github.com/ramasilveyra/gitpkg).

First install `gitpkg`:

```sh
yarn global add gitpkg
```

Then follow these steps to publish and install a forked package:

1. Fork this repo to your account and clone the forked repo to your local machine
1. Open a Terminal and `cd` to the location of the cloned repo
1. Run `yarn` to install any dependencies
1. If you want to make any changes, make them and commit
1. Run `yarn lerna run prepack` to perform the build steps
1. Now `cd` to the package directory that you want to use (e.g. `cd packages/stack` for `@react-navigation/stack`)
1. Run `gitpkg publish` to publish the package to your repo

After publishing, you should see something like this:

```sh
Package uploaded to git@github.com:<user>/<repo>.git with the name <name>
```

You can now install the dependency in your project:

```sh
yarn add <user>/<repo>.git#<name>
```

Remember to replace `<user>`, `<repo>` and `<name>` with right values.

<!-- badges -->

[build-badge]: https://github.com/react-navigation/react-navigation/actions/workflows/ci.yml/badge.svg
[build]: https://github.com/react-navigation/react-navigation/actions/workflows/ci.yml
[coverage-badge]: https://img.shields.io/codecov/c/github/react-navigation/react-navigation.svg
[coverage]: https://codecov.io/github/react-navigation/react-navigation
[license-badge]: https://img.shields.io/npm/l/@react-navigation/core.svg
[license]: https://opensource.org/licenses/MIT
