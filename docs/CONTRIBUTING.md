# Contributors Guide

## Environment

React Navigation was initially developed on macOS v10.12, with node v7+, and react-native v0.39+.
It's also been verified to work using Boron LTS (node v6.11.1 with npm v3.10.10), and using node v8.1.4 with npm v4.6.1.
Please open issues if you uncover problems in different environments.

In all of the below commands, you can use `npm` instead of `yarn` if you prefer.
[Yarn](https://yarnpkg.com/en/) is generally much faster, but some people still prefer `npm`.
They should work the same here.

## Development

### Fork the repo

- Fork [`react-navigation`](https://github.com/react-community/react-navigation) on GitHub
- Run these commands in the terminal to download locally and install it:

    ```bash
    git clone https://github.com/<USERNAME>/react-navigation.git
    cd react-navigation
    git remote add upstream https://github.com/react-community/react-navigation.git
    yarn install
    ```

### Run the example app

```bash
yarn install
cd examples/NavigationPlayground
yarn install
yarn start
```

You will be given a URL to open in your Expo app. You can get Expo [here](https://docs.expo.io/versions/v18.0.0/introduction/installation.html) if you don't have it yet.

If you run into any issues, please try the following to start fresh:

```bash
watchman watch-del-all
yarn start -- --reset-cache
```

### Run the website

For development mode and live-reloading:

```bash
cd website
yarn install
yarn start
```

To run the website in production mode with server rendering:

```bash
yarn run prod
```

### Run tests and type-checking

```bash
jest
flow
```

Tests must pass for your changes to be accepted and merged.

Flow is not yet passing, but your code should be flow checked and we expect that your changes do not introduce any flow errors.

### Developing Docs

The docs are indexed in [App.js](https://github.com/react-community/react-navigation/blob/master/website/src/App.js), where all the pages are declared alongside the titles. To test the docs, follow the above instructions for running the website. Changing existing markdown files should not require any testing.

The markdown from the `docs` folder gets generated and dumped into a json file as a part of the build step. To see updated docs appear in the website, re-run the build step by running `npm run build-docs` from the `react-navigation` root folder.

## Submitting Contributions

### New views or unique features

Often navigation needs are specific to certain apps. If your changes are unique to your app, you may want to fork the view or router that has changed. You can keep the source code in your app, or publish it on npm as a `react-navigation` compatible view or router.

This library is intended to include highly standard and generic navigation patterns.

### Major Changes

Before embarking on any major changes, please file an issue describing the suggested change and motivation. We may already have thought about it and we want to make sure we all are on the same page before starting on any big changes.

### Minor Bugfixes

Simple bug fixes are welcomed in pull requests! Please check for duplicate PRs before posting.

#### Make sure to sync up with the state of upstream before submitting a PR:

```bash
git fetch upstream
git rebase upstream/master
```
