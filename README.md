# React Navigation 5

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![MIT License][license-badge]][license]

Routing and navigation for your React Native apps.

Documentation can be found at [reactnavigation.org](https://reactnavigation.org/).

If you are looking for version 4, the code can be found in the [4.x branch](https://github.com/react-navigation/react-navigation/tree/4.x).

## Contributing

Please read through our [contribution guide](CONTRIBUTING.md) a to get started!

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

[build-badge]: https://img.shields.io/circleci/project/github/react-navigation/react-navigation/master.svg?style=flat-square
[build]: https://circleci.com/gh/react-navigation/react-navigation
[coverage-badge]: https://img.shields.io/codecov/c/github/react-navigation/react-navigation.svg?style=flat-square
[coverage]: https://codecov.io/github/react-navigation/react-navigation
[license-badge]: https://img.shields.io/npm/l/@react-navigation/core.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
