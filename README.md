# React Navigation 5

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![MIT License][license-badge]][license]

Routing and navigation for your React Native apps with a component-first API.

Documentation can be found at [next.reactnavigation.org](https://next.reactnavigation.org/).

## Contributing

The project uses a monorepo structure for the packages managed by [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and [lerna](https://lerna.js.org). To get started with the project, run `yarn` in the root directory to install the required dependencies for each package:

```sh
yarn
```

While developing, you can run the [example app](/example/) with [Expo](https://expo.io/) to test your changes:

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

Remember to add tests for your change if possible. Run the unit tests by:

```sh
yarn test
```

Running the e2e tests with Detox (on iOS) requires the following:

- Mac with macOS (at least macOS High Sierra 10.13.6)
- Xcode 10.1+ with Xcode command line tools

First you need to install `applesimutils` and `detox-cli`:

```sh
brew tap wix/brew
brew install applesimutils
yarn global add detox-cli
```

Then you can build and run the tests:

```sh
detox build -c ios.sim.debug
detox test -c ios.sim.debug
```

## Publishing

To publish a new version, first we need to export a `GH_TOKEN` environment variable as mentioned [here](https://github.com/lerna/lerna/tree/master/commands/version#--create-release-type). Then run:

```sh
yarn lerna publish
```

This will automatically bump the version and publish the packages. It'll also publish the changelogs on GitHub for each package.

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

[build-badge]: https://img.shields.io/circleci/project/github/react-navigation/navigation-ex/master.svg?style=flat-square
[build]: https://circleci.com/gh/react-navigation/navigation-ex
[coverage-badge]: https://img.shields.io/codecov/c/github/react-navigation/navigation-ex.svg?style=flat-square
[coverage]: https://codecov.io/github/react-navigation/navigation-ex
[license-badge]: https://img.shields.io/npm/l/@react-navigation/core.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
