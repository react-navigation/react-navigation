# Contributors Guide

## Environment

React navigation was initially developed on macOS 10.12, with node 7+, and react-native v0.39+. Please open issues when uncovering problems in different environments.

## Development

### Fork the repo

- Fork [`react-navigation`](https://github.com/react-community/react-navigation) on GitHub

- Run these commands in the terminal to download locally and install it:

```
git clone https://github.com/<USERNAME>/react-navigation.git
cd react-navigation
git remote add upstream https://github.com/react-community/react-navigation.git
npm install
```

### Run the example app

```
npm install
cd examples/NavigationPlayground
npm install
cd ../..
npm start

# In a seperate terminal tab:
npm run run-playground-android
# OR:
npm run run-playground-ios
```

You can also simply run e.g. `react-native run-android` from within the example app directory (instead of `npm run run-playground-android` from the root `react-navigation` directory); both do the same thing.

### Run the website

For development mode and live-reloading:

```
cd website
npm install
npm start
```

To run the website in production mode with server rendering:

```
npm run prod
```

### Run tests and type-checking

```
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

- `git fetch upstream`
- `git rebase upstream/master`
